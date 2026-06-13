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
    totalCost,
    totalProfitLoss,
    totalProfitLossPercent,
    addFund,
    updateQuantity,
    updateCostPerUnit,
    deleteFund,
    refreshPrices,
    isLoading,
    isRefreshing,
    isAdding,
    isUpdatingQuantity,
    isUpdatingCostPerUnit,
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Fon</p>
            <p className="text-2xl font-bold mt-1">{funds.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Değer</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Toplam Maliyet</p>
            <p className="text-lg font-bold mt-1">
              {totalCost > 0 ? formatCurrency(totalCost) : (
                <span className="text-sm text-muted-foreground">Girilmedi</span>
              )}
            </p>
          </div>
          <div className={cn(
            'rounded-xl border bg-card p-4',
            totalProfitLoss === null && 'border-border',
            totalProfitLoss !== null && totalProfitLoss >= 0 && 'border-green-500/30 bg-green-500/5',
            totalProfitLoss !== null && totalProfitLoss < 0 && 'border-red-500/30 bg-red-500/5',
          )}>
            <p className="text-xs text-muted-foreground">Toplam Kar/Zarar</p>
            {totalProfitLoss !== null ? (
              <div className="mt-1">
                <p className={cn(
                  'text-lg font-bold',
                  totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-500',
                )}>
                  {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                </p>
                {totalProfitLossPercent !== null && (
                  <p className={cn(
                    'text-xs font-medium',
                    totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-500',
                  )}>
                    {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Maliyet girilmedi</p>
            )}
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
            totalCost={totalCost}
            totalProfitLoss={totalProfitLoss}
            totalProfitLossPercent={totalProfitLossPercent}
            onUpdateQuantity={updateQuantity}
            onUpdateCostPerUnit={updateCostPerUnit}
            onDelete={deleteFund}
            isUpdatingQuantity={isUpdatingQuantity}
            isUpdatingCostPerUnit={isUpdatingCostPerUnit}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
