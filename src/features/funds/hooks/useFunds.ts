import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { fundsService } from '../../../services/fundsService';
import { supabase } from '../../../lib/supabase';
import type { FundFormValues, FundWithValue } from '../../../types';

interface LivePrice {
  price: number;
  dailyChangePercent: number | null;
  updatedAt: string | null;
}

async function fetchLivePrices(codes: string[]): Promise<Record<string, LivePrice>> {
  const { data, error } = await supabase.functions.invoke('get-fund-prices', {
    body: { codes },
  });
  if (error) throw error;
  return (data as { prices: Record<string, LivePrice> }).prices ?? {};
}

export function useFunds() {
  const queryClient = useQueryClient();

  const fundsQuery = useQuery({
    queryKey: ['funds'],
    queryFn: fundsService.getAll,
  });

  const codes = fundsQuery.data?.map((f) => f.fund_code) ?? [];

  const pricesQuery = useQuery({
    queryKey: ['fund-prices', codes],
    queryFn: () => fetchLivePrices(codes),
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

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      fundsService.updateQuantity(id, quantity),
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
      return {
        ...f,
        currentPrice,
        currentValue: f.quantity * currentPrice,
        portfolioShare: 0,
        dailyChangePercent: live?.dailyChangePercent ?? null,
        priceUpdatedAt: live?.updatedAt ?? f.price_updated_at,
        isLive: !!live,
      };
    });
    const total = raw.reduce((s, f) => s + f.currentValue, 0);
    return raw.map((f) => ({
      ...f,
      portfolioShare: total > 0 ? (f.currentValue / total) * 100 : 0,
    }));
  }, [fundsQuery.data, pricesQuery.data]);

  const totalValue = fundsWithValue.reduce((s, f) => s + f.currentValue, 0);

  return {
    funds: fundsWithValue,
    totalValue,
    addFund: addMutation.mutateAsync,
    updateQuantity: (id: string, quantity: number) =>
      updateQuantityMutation.mutateAsync({ id, quantity }),
    deleteFund: deleteMutation.mutate,
    refreshPrices,
    isLoading: fundsQuery.isLoading,
    isRefreshing: pricesQuery.isFetching,
    isAdding: addMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
