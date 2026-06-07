import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { stocksService } from '../../../services/stocksService';
import { depositsService } from '../../../services/depositsService';
import { fundsService } from '../../../services/fundsService';
import { snapshotsService } from '../../../services/snapshotsService';
import { priceProvider } from '../../../services/priceProvider';
import { enrichDeposit, calculateTotalDepositsValue } from '../../../utils/depositCalculations';
import { calculatePortfolioShares } from '../../../utils/calculations';
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

  const pricesQuery = useQuery({
    queryKey: ['prices', stocksQuery.data?.map((s) => s.symbol)],
    queryFn: async () => {
      const symbols = stocksQuery.data?.map((s) => s.symbol) ?? [];
      if (symbols.length === 0) return new Map();
      return priceProvider.getPrices(symbols);
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

  const stocksTotal = enrichedStocks.reduce((s, x) => s + x.currentValue, 0);
  const depositsTotal = calculateTotalDepositsValue(depositsQuery.data ?? []);
  const fundsTotal = (fundsQuery.data ?? []).reduce(
    (s, f) => s + f.quantity * f.unit_price,
    0,
  );
  const totalNetWorth = stocksTotal + depositsTotal + fundsTotal;

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
    stocksQuery.isLoading || depositsQuery.isLoading || fundsQuery.isLoading;
  const isRefreshing = pricesQuery.isFetching;

  return {
    enrichedStocks,
    enrichedDeposits,
    stocksTotal,
    depositsTotal,
    fundsTotal,
    totalNetWorth,
    todayChange,
    todayChangePercent,
    snapshots,
    refreshPrices,
    isLoading,
    isRefreshing,
  };
}
