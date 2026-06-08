import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { stocksService } from '../../../services/stocksService';
import { depositsService } from '../../../services/depositsService';
import { fundsService } from '../../../services/fundsService';
import { currencyService } from '../../../services/currencyService';
import { snapshotsService } from '../../../services/snapshotsService';
import { priceProvider } from '../../../services/priceProvider';
import { enrichDeposit, calculateTotalDepositsValue } from '../../../utils/depositCalculations';
import { calculatePortfolioShares } from '../../../utils/calculations';
import { getPriceSymbolByType } from '../../currency/constants';
import type { StockWithPrice } from '../../../types';

export function useDashboard() {
  const queryClient = useQueryClient();

  const stocksQuery = useQuery({
    queryKey: ['stocks'],
    queryFn: stocksService.getAll,
  });

  const depositsQuery = useQuery({
    queryKey: ['deposits'],
    queryFn: depositsService.getAll,
  });

  const fundsQuery = useQuery({
    queryKey: ['funds'],
    queryFn: fundsService.getAll,
  });

  const currencyQuery = useQuery({
    queryKey: ['currency-assets'],
    queryFn: currencyService.getAll,
  });

  const pricesQuery = useQuery({
    queryKey: ['prices', stocksQuery.data?.map((s) => s.symbol), currencyQuery.data?.map((c) => getPriceSymbolByType(c.asset_type))],
    queryFn: async () => {
      const stockSymbols = stocksQuery.data?.map((s) => s.symbol) ?? [];
      const currencySymbols = (currencyQuery.data ?? []).map((c) => getPriceSymbolByType(c.asset_type));
      const allSymbols = [...stockSymbols, ...currencySymbols];
      if (allSymbols.length === 0) return new Map();
      return priceProvider.getPrices(allSymbols);
    },
    enabled: !!stocksQuery.data,
    staleTime: 30_000,
  });

  const snapshotsQuery = useQuery({
    queryKey: ['snapshots'],
    queryFn: () => snapshotsService.getAll(90),
  });

  const saveSnapshotMutation = useMutation({
    mutationFn: snapshotsService.upsertToday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snapshots'] }),
  });

  const enrichedStocks: StockWithPrice[] = (() => {
    if (!stocksQuery.data || !pricesQuery.data) return [];
    const raw = stocksQuery.data.map((stock) => {
      const priceData = pricesQuery.data.get(stock.symbol);
      const currentPrice = priceData?.price ?? 0;
      return {
        ...stock,
        currentPrice,
        currentValue: stock.quantity * currentPrice,
        portfolioShare: 0,
        dailyChange: priceData?.dailyChange,
        dailyChangePercent: priceData?.dailyChangePercent,
      };
    });
    return calculatePortfolioShares(raw);
  })();

  const enrichedDeposits = (depositsQuery.data ?? []).map(enrichDeposit);

  const currencyTotal = (() => {
    const usdTry = pricesQuery.data?.get('USDTRY=X')?.price ?? 0;
    return (currencyQuery.data ?? []).reduce((sum, asset) => {
      const priceSymbol = getPriceSymbolByType(asset.asset_type);
      const priceData = pricesQuery.data?.get(priceSymbol);
      let price = priceData?.price ?? 0;

      if (asset.asset_type === 'GOLD' && price > 0 && usdTry > 0) {
        const troyOunceToGram = 31.1034768;
        price = (price * usdTry) / troyOunceToGram;
      }

      return sum + asset.quantity * price;
    }, 0);
  })();

  const stocksTotal = enrichedStocks.reduce((s, x) => s + x.currentValue, 0);
  const depositsTotal = calculateTotalDepositsValue(depositsQuery.data ?? []);
  const fundsTotal = (fundsQuery.data ?? []).reduce(
    (s, f) => s + f.quantity * f.unit_price,
    0,
  );
  const totalNetWorth = stocksTotal + depositsTotal + fundsTotal + currencyTotal;

  const snapshots = snapshotsQuery.data ?? [];
  const previousTotal =
    snapshots.length >= 2 ? snapshots[snapshots.length - 2].total_net_worth : 0;
  const todayChange = totalNetWorth - previousTotal;
  const todayChangePercent = previousTotal > 0 ? (todayChange / previousTotal) * 100 : 0;

  const refreshPrices = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['prices'] });
    if (totalNetWorth > 0) {
      saveSnapshotMutation.mutate({
        total_net_worth: totalNetWorth,
        stocks_value: stocksTotal,
        deposits_value: depositsTotal,
        funds_value: fundsTotal,
      });
    }
  }, [queryClient, totalNetWorth, stocksTotal, depositsTotal, fundsTotal, saveSnapshotMutation]);

  const isLoading =
    stocksQuery.isLoading || depositsQuery.isLoading || fundsQuery.isLoading || currencyQuery.isLoading;
  const isRefreshing = pricesQuery.isFetching;

  return {
    enrichedStocks,
    enrichedDeposits,
    stocksTotal,
    depositsTotal,
    fundsTotal,
    currencyTotal,
    totalNetWorth,
    todayChange,
    todayChangePercent,
    snapshots,
    refreshPrices,
    isLoading,
    isRefreshing,
  };
}
