import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { fundsService } from '../../../services/fundsService';
import type { FundFormValues, FundWithValue } from '../../../types';

export function useFunds() {
  const queryClient = useQueryClient();

  const fundsQuery = useQuery({
    queryKey: ['funds'],
    queryFn: fundsService.getAll,
  });

  const codes = fundsQuery.data?.map((f) => f.fund_code) ?? [];

  const pricesQuery = useQuery({
    queryKey: ['fund-prices', codes],
    queryFn: () => fundsService.getLivePrices(codes),
    enabled: codes.length > 0,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: (values: FundFormValues) => fundsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      queryClient.invalidateQueries({ queryKey: ['fund-prices'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: { quantity: number; cost_per_unit: number } }) =>
      fundsService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['funds'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: fundsService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['funds'] });
      const prev = queryClient.getQueryData(['funds']);
      queryClient.setQueryData(['funds'], (old: typeof fundsQuery.data) =>
        old?.filter((f) => f.id !== id),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['funds'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['funds'] }),
  });

  const refreshPrices = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['fund-prices'] });
  }, [queryClient]);

  const fundsWithValue: FundWithValue[] = useMemo(() => {
    const raw = (fundsQuery.data ?? []).map((f) => {
      const live = pricesQuery.data?.[f.fund_code];
      const currentPrice = live?.price ?? f.unit_price;
      const currentValue = f.quantity * currentPrice;
      const totalCost = f.cost_per_unit > 0 ? f.quantity * f.cost_per_unit : 0;
      const hasCost = totalCost > 0;
      return {
        ...f,
        currentPrice,
        currentValue,
        totalCost,
        portfolioShare: 0,
        dailyChangePercent: live?.dailyChangePercent ?? null,
        priceUpdatedAt: live?.updatedAt ?? f.price_updated_at,
        isLive: !!live,
        profitLoss: hasCost ? currentValue - totalCost : null,
        profitLossPercent: hasCost ? ((currentValue - totalCost) / totalCost) * 100 : null,
      };
    });
    const total = raw.reduce((s, f) => s + f.currentValue, 0);
    return raw.map((f) => ({
      ...f,
      portfolioShare: total > 0 ? (f.currentValue / total) * 100 : 0,
    }));
  }, [fundsQuery.data, pricesQuery.data]);

  const totalValue = fundsWithValue.reduce((s, f) => s + f.currentValue, 0);
  const totalCost = fundsWithValue.reduce((s, f) => s + f.totalCost, 0);
  const totalProfitLoss = totalCost > 0 ? totalValue - totalCost : null;
  const totalProfitLossPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : null;

  return {
    funds: fundsWithValue,
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPercent,
    addFund: addMutation.mutateAsync,
    updateFund: (id: string, values: { quantity: number; cost_per_unit: number }) =>
      updateMutation.mutateAsync({ id, values }),
    deleteFund: deleteMutation.mutate,
    refreshPrices,
    isLoading: fundsQuery.isLoading,
    isRefreshing: pricesQuery.isFetching,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
