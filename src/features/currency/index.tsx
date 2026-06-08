import { RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../utils/formatters';
import { AddCurrencyForm } from './components/AddCurrencyForm';
import { CurrencyAssetsTable } from './components/CurrencyAssetsTable';
import { useCurrencyAssets } from './hooks/useCurrencyAssets';

function CurrencySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}

export default function CurrencyPage() {
  const {
    assets,
    totalValue,
    sortField,
    sortDirection,
    handleSort,
    addAsset,
    updateAssetQuantity,
    deleteAsset,
    refreshPrices,
    isLoading,
    isRefreshing,
    isAdding,
    isUpdating,
    isDeleting,
  } = useCurrencyAssets();

  if (isLoading) return <CurrencySkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Döviz ve Altın</h1>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Toplam değer: <span className="font-semibold text-foreground">{formatCurrency(totalValue)}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshPrices} disabled={isRefreshing}>
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            Güncel Fiyatları Yenile
          </Button>
          <AddCurrencyForm onSubmit={addAsset} isLoading={isAdding} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Varlık Listesi</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <CurrencyAssetsTable
            assets={assets}
            totalValue={totalValue}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onUpdateQuantity={(id, quantity) => updateAssetQuantity({ id, quantity })}
            onDelete={deleteAsset}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
