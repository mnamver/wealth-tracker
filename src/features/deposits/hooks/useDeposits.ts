import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { depositsService } from '../../../services/depositsService';
import { enrichDeposit } from '../../../utils/depositCalculations';
import type { DepositFormValues } from '../../../types';

export function useDeposits() {
  const queryClient = useQueryClient();

  const depositsQuery = useQuery({
    queryKey: ['deposits'],
    queryFn: depositsService.getAll,
  });

  const addMutation = useMutation({
    mutationFn: (values: DepositFormValues) => depositsService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deposits'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: depositsService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['deposits'] });
      const prev = queryClient.getQueryData(['deposits']);
      queryClient.setQueryData(['deposits'], (old: typeof depositsQuery.data) =>
        old?.filter((d) => d.id !== id),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['deposits'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['deposits'] }),
  });

  const enrichedDeposits = useMemo(
    () => (depositsQuery.data ?? []).map(enrichDeposit),
    [depositsQuery.data],
  );

  const totalValue = enrichedDeposits.reduce((s, d) => s + d.currentValue, 0);
  const totalPrincipal = enrichedDeposits.reduce((s, d) => s + d.principal, 0);
  const totalInterest = enrichedDeposits.reduce((s, d) => s + d.interestEarned, 0);

  return {
    deposits: enrichedDeposits,
    totalValue,
    totalPrincipal,
    totalInterest,
    addDeposit: addMutation.mutateAsync,
    deleteDeposit: deleteMutation.mutate,
    isLoading: depositsQuery.isLoading,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
