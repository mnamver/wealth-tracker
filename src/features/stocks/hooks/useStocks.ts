import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { stocksService } from '../../../services/stocksService';
import { priceProvider } from '../../../services/priceProvider';
import { calculatePortfolioShares } from '../../../utils/calculations';
import type { StockFormValues, StockWithPrice, SortField, SortDirection } from '../../../types';

export function useStocks() {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>('currentValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const stocksQuery = useQuery({
    queryKey: ['stocks'],
    queryFn: stocksService.getAll,
  });

  const pricesQuery = useQuery({
    queryKey: ['prices', stocksQuery.data?.map((s) => s.symbol)],
    queryFn: async () => {
      const symbols = stocksQuery.data?.map((s) => s.symbol) ?? [];
      if (symbols.length === 0) return new Map();
      return priceProvider.getPrices(symbols);
    },
    enabled: !!stocksQuery.data && stocksQuery.data.length > 0,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: stocksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['prices'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: stocksService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['stocks'] });
      const prev = queryClient.getQueryData(['stocks']);
      queryClient.setQueryData(['stocks'], (old: typeof stocksQuery.data) =>
        old?.filter((s) => s.id !== id),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['stocks'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stocks'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<StockFormValues> }) =>
      stocksService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stocks'] }),
  });

  const refreshPrices = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['prices'] });
  }, [queryClient]);

  const enrichedStocks: StockWithPrice[] = useMemo(() => {
    if (!stocksQuery.data) return [];
    const raw = stocksQuery.data.map((stock) => {
      const priceData = pricesQuery.data?.get(stock.symbol);
      const currentPrice = priceData?.price ?? 0;
      const currentValue = stock.quantity * currentPrice;
      const costBasis = stock.avg_cost != null ? stock.avg_cost * stock.quantity : 0;
      const profitLoss = costBasis > 0 ? currentValue - costBasis : 0;
      const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
      return {
        ...stock,
        currentPrice,
        currentValue,
        costBasis,
        profitLoss,
        profitLossPercent,
        portfolioShare: 0,
        dailyChange: priceData?.dailyChange,
        dailyChangePercent: priceData?.dailyChangePercent,
      };
    });
    return calculatePortfolioShares(raw);
  }, [stocksQuery.data, pricesQuery.data]);

  const sortedStocks = useMemo(() => {
    return [...enrichedStocks].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [enrichedStocks, sortField, sortDirection]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    },
    [sortField],
  );

  const totalValue = enrichedStocks.reduce((s, x) => s + x.currentValue, 0);

  return {
    stocks: sortedStocks,
    totalValue,
    sortField,
    sortDirection,
    handleSort,
    addStock: addMutation.mutateAsync,
    deleteStock: deleteMutation.mutate,
    updateStock: updateMutation.mutateAsync,
    refreshPrices,
    isLoading: stocksQuery.isLoading,
    isRefreshing: pricesQuery.isFetching,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
