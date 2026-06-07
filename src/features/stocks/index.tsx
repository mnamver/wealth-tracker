import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AddStockForm } from './components/AddStockForm';
import { StocksTable } from './components/StocksTable';
import { useStocks } from './hooks/useStocks';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../utils/formatters';

function StocksSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}

export default function StocksPage() {
  const {
    stocks,
    totalValue,
    sortField,
    sortDirection,
    handleSort,
    addStock,
    updateStock,
    deleteStock,
    refreshPrices,
    isLoading,
    isRefreshing,
    isAdding,
    isUpdating,
    isDeleting,
  } = useStocks();

  if (isLoading) return <StocksSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hisse Senetleri</h1>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Toplam portföy değeri:{' '}
              <span className="font-semibold text-foreground">{formatCurrency(totalValue)}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshPrices} disabled={isRefreshing}>
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            Güncel Fiyatları Yenile
          </Button>
          <AddStockForm onSubmit={addStock} isLoading={isAdding} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Portföy</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <StocksTable
            stocks={stocks}
            totalValue={totalValue}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onUpdateQuantity={(id, qty) => updateStock({ id, values: { quantity: qty } })}
            onDelete={deleteStock}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
