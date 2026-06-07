import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AddFundForm } from './components/AddFundForm';
import { FundsTable } from './components/FundsTable';
import { useFunds } from './hooks/useFunds';
import { formatCurrency } from '../../utils/formatters';

function FundsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}

export default function FundsPage() {
  const {
    funds,
    totalValue,
    addFund,
    updatePrice,
    deleteFund,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
  } = useFunds();

  if (isLoading) return <FundsSkeleton />;

  const totalPrincipal = funds.reduce((s, f) => s + f.quantity * 1, 0);
  void totalPrincipal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yatırım Fonları</h1>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Toplam değer:{' '}
              <span className="font-semibold text-foreground">{formatCurrency(totalValue)}</span>
            </p>
          )}
        </div>
        <AddFundForm onSubmit={addFund} isLoading={isAdding} />
      </div>

      {funds.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Fon</p>
            <p className="text-2xl font-bold mt-1">{funds.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Değer</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Fiyat Güncelleme</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              TEFAS fiyatları günde 1 kez güncellenir. Kalem ikonuna tıklayarak birim pay değerini güncelleyebilirsin.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Fon Portföyü</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <FundsTable
            funds={funds}
            totalValue={totalValue}
            onUpdatePrice={updatePrice}
            onDelete={deleteFund}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
