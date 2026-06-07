import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AddFundForm } from './components/AddFundForm';
import { FundsTable } from './components/FundsTable';
import { useFunds } from './hooks/useFunds';
import { cn } from '../../lib/utils';
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
    updateQuantity,
    deleteFund,
    refreshPrices,
    isLoading,
    isRefreshing,
    isAdding,
    isUpdatingPrice,
    isUpdatingQuantity,
    isDeleting,
  } = useFunds();

  if (isLoading) return <FundsSkeleton />;

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshPrices} disabled={isRefreshing}>
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            Güncel Fiyatları Yenile
          </Button>
          <AddFundForm onSubmit={addFund} isLoading={isAdding} />
        </div>
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
            <p className="text-xs text-muted-foreground">Fiyat Kaynağı</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Fiyatlar Fonoloji API'den otomatik çekilir. Kalem ikonu ile manuel de güncelleyebilirsin.
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
            onUpdateQuantity={updateQuantity}
            onDelete={deleteFund}
            isUpdatingPrice={isUpdatingPrice}
            isUpdatingQuantity={isUpdatingQuantity}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
