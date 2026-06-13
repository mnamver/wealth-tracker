import { Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { EditFundDialog } from './EditFundDialog';
import { formatCurrency, formatNumber, formatPercent } from '../../../utils/formatters';
import { cn } from '../../../lib/utils';
import type { FundWithValue } from '../../../types';

interface FundsTableProps {
  funds: FundWithValue[];
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number | null;
  totalProfitLossPercent: number | null;
  onUpdate: (id: string, values: { quantity: number; cost_per_unit: number }) => Promise<unknown>;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function FundsTable({
  funds,
  totalValue,
  totalCost,
  totalProfitLoss,
  totalProfitLossPercent,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: FundsTableProps) {
  if (funds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Henüz yatırım fonu eklenmedi.</p>
        <p className="text-xs text-muted-foreground mt-1">
          "Fon Ekle" butonuna tıklayarak başlayın.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fon Kodu</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Adet</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Günlük K/Z (%)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Toplam K/Z</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Pay %</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Güncel Değer</th>
            <th className="w-28" />
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => (
            <tr
              key={fund.id}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3.5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">{fund.fund_code}</span>
                    {fund.isLive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" title="Canlı fiyat" />
                    )}
                  </div>
                  {!fund.isLive && fund.currentPrice === 0 && (
                    <Badge variant="warning" className="text-[10px] py-0 w-fit">Fiyat girilmedi</Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">
                {formatNumber(fund.quantity, 0)}
              </td>
              <td className="px-4 py-3.5 hidden sm:table-cell">
                {fund.dailyChangePercent !== null ? (
                  <Badge
                    variant={fund.dailyChangePercent >= 0 ? 'success' : 'danger'}
                    className="text-xs"
                  >
                    {formatPercent(fund.dailyChangePercent)}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                {fund.profitLoss !== null ? (
                  <div className="flex flex-col gap-0.5">
                    <span className={cn('text-sm font-medium', fund.profitLoss >= 0 ? 'text-green-600' : 'text-red-500')}>
                      {fund.profitLoss >= 0 ? '+' : ''}{formatCurrency(fund.profitLoss)}
                    </span>
                    {fund.profitLossPercent !== null && (
                      <span className={cn('text-xs', fund.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-500')}>
                        {fund.profitLossPercent >= 0 ? '+' : ''}{fund.profitLossPercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${Math.min(fund.portfolioShare, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {fund.portfolioShare.toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-sm font-medium">
                {fund.currentValue > 0 ? formatCurrency(fund.currentValue) : '—'}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1">
                  <EditFundDialog
                    fundCode={fund.fund_code}
                    currentQuantity={fund.quantity}
                    currentCostPerUnit={fund.cost_per_unit}
                    onSubmit={(values) => onUpdate(fund.id, values)}
                    isLoading={isUpdating}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(fund.id)}
                    disabled={isDeleting}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        {totalValue > 0 && (
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/20">
              <td className="px-4 py-3 text-sm font-semibold">Toplam</td>
              <td className="hidden sm:table-cell" />
              <td className="hidden sm:table-cell" />
              <td className="px-4 py-3 hidden md:table-cell">
                {totalProfitLoss !== null ? (
                  <div className="flex flex-col gap-0.5">
                    <span className={cn('text-sm font-bold', totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-500')}>
                      {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                    </span>
                    {totalProfitLossPercent !== null && (
                      <span className={cn('text-xs font-medium', totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-500')}>
                        {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                ) : '—'}
              </td>
              <td className="hidden md:table-cell" />
              <td className="px-4 py-3 text-sm font-bold">{formatCurrency(totalValue)}</td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
