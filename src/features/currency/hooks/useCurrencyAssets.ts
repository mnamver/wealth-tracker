import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { currencyService } from '../../../services/currencyService';
import { priceProvider } from '../../../services/priceProvider';
import { getPriceSymbolByType } from '../constants';
import type {
  CurrencyAssetWithPrice,
  CurrencySortField,
  SortDirection,
} from '../../../types';

export function useCurrencyAssets() {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<CurrencySortField>('currentValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const assetsQuery = useQuery({
    queryKey: ['currency-assets'],
    queryFn: currencyService.getAll,
  });

  const pricesQuery = useQuery({
    queryKey: ['currency-prices', assetsQuery.data?.map((a) => a.asset_type)],
    queryFn: async () => {
      const symbols = (assetsQuery.data ?? []).map((asset) => getPriceSymbolByType(asset.asset_type));
      if (symbols.length === 0) return new Map();
      return priceProvider.getPrices(symbols);
    },
    enabled: !!assetsQuery.data && assetsQuery.data.length > 0,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: currencyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currency-assets'] });
      queryClient.invalidateQueries({ queryKey: ['currency-prices'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: currencyService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currency-assets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      currencyService.updateQuantity(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currency-assets'] }),
  });

  const refreshPrices = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['currency-prices'] });
  }, [queryClient]);

  const enrichedAssets: CurrencyAssetWithPrice[] = useMemo(() => {
    const usdTry = pricesQuery.data?.get('USDTRY=X')?.price ?? 0;

    return (assetsQuery.data ?? []).map((asset) => {
      const priceSymbol = getPriceSymbolByType(asset.asset_type);
      const priceData = pricesQuery.data?.get(priceSymbol);

      let currentPrice = priceData?.price ?? 0;
      if (asset.asset_type === 'GOLD' && currentPrice > 0 && usdTry > 0) {
        const troyOunceToGram = 31.1034768;
        currentPrice = (currentPrice * usdTry) / troyOunceToGram;
      }

      return {
        ...asset,
        currentPrice,
        currentValue: asset.quantity * currentPrice,
        dailyChange: priceData?.dailyChange,
        dailyChangePercent: priceData?.dailyChangePercent,
      };
    });
  }, [assetsQuery.data, pricesQuery.data]);

  const sortedAssets = useMemo(() => {
    return [...enrichedAssets].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [enrichedAssets, sortDirection, sortField]);

  const handleSort = useCallback(
    (field: CurrencySortField) => {
      if (field === sortField) {
        setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    },
    [sortField],
  );

  const totalValue = enrichedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return {
    assets: sortedAssets,
    totalValue,
    sortField,
    sortDirection,
    handleSort,
    addAsset: addMutation.mutateAsync,
    deleteAsset: deleteMutation.mutate,
    updateAssetQuantity: updateMutation.mutateAsync,
    refreshPrices,
    isLoading: assetsQuery.isLoading,
    isRefreshing: pricesQuery.isFetching,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
