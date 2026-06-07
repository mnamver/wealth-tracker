import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AddDepositForm } from './components/AddDepositForm';
import { DepositsTable } from './components/DepositsTable';
import { useDeposits } from './hooks/useDeposits';
import { formatCurrency } from '../../utils/formatters';

function DepositsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}

export default function DepositsPage() {
  const {
    deposits,
    totalValue,
    totalPrincipal,
    totalInterest,
    addDeposit,
    deleteDeposit,
    isLoading,
    isAdding,
    isDeleting,
  } = useDeposits();

  if (isLoading) return <DepositsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vadeli Mevduat</h1>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Güncel değer:{' '}
              <span className="font-semibold text-foreground">{formatCurrency(totalValue)}</span>
              {totalInterest > 0 && (
                <>
                  {' '}
                  · Kazanılan faiz:{' '}
                  <span className="font-semibold text-emerald-500">
                    +{formatCurrency(totalInterest)}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
        <AddDepositForm onSubmit={addDeposit} isLoading={isAdding} />
      </div>

      {deposits.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Hesap</p>
            <p className="text-2xl font-bold mt-1">{deposits.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Ana Para</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(totalPrincipal)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Kazanılan Faiz</p>
            <p className="text-lg font-bold mt-1 text-emerald-500">
              +{formatCurrency(totalInterest)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Güncel Toplam</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Mevduat Hesapları</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <DepositsTable
            deposits={deposits}
            totalValue={totalValue}
            totalPrincipal={totalPrincipal}
            totalInterest={totalInterest}
            onDelete={deleteDeposit}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
