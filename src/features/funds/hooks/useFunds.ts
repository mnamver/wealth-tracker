import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fundsService } from '../../../services/fundsService';
import type { FundFormValues, FundWithValue, UpdatePriceValues } from '../../../types';

export function useFunds() {
  const queryClient = useQueryClient();

  const fundsQuery = useQuery({
    queryKey: ['funds'],
    queryFn: fundsService.getAll,
  });

  const addMutation = useMutation({
    mutationFn: (values: FundFormValues) => fundsService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['funds'] }),
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdatePriceValues }) =>
      fundsService.updatePrice(id, values),
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

  const fundsWithValue: FundWithValue[] = useMemo(() => {
    const raw = (fundsQuery.data ?? []).map((f) => ({
      ...f,
      currentValue: f.quantity * f.unit_price,
      portfolioShare: 0,
    }));
    const total = raw.reduce((s, f) => s + f.currentValue, 0);
    return raw.map((f) => ({
      ...f,
      portfolioShare: total > 0 ? (f.currentValue / total) * 100 : 0,
    }));
  }, [fundsQuery.data]);

  const totalValue = fundsWithValue.reduce((s, f) => s + f.currentValue, 0);

  return {
    funds: fundsWithValue,
    totalValue,
    addFund: addMutation.mutateAsync,
    updatePrice: (id: string, values: UpdatePriceValues) =>
      updatePriceMutation.mutateAsync({ id, values }),
    deleteFund: deleteMutation.mutate,
    isLoading: fundsQuery.isLoading,
    isAdding: addMutation.isPending,
    isUpdating: updatePriceMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
