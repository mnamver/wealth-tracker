import { Trash2, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { UpdatePriceDialog } from './UpdatePriceDialog';
import { formatCurrency, formatNumber, formatDate } from '../../../utils/formatters';
import { cn } from '../../../lib/utils';
import type { FundWithValue, UpdatePriceValues } from '../../../types';

interface FundsTableProps {
  funds: FundWithValue[];
  totalValue: number;
  onUpdatePrice: (id: string, values: UpdatePriceValues) => Promise<unknown>;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function FundsTable({
  funds,
  totalValue,
  onUpdatePrice,
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
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Birim Pay</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Güncel Değer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Pay %</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Son Güncelleme</th>
            <th className="w-20" />
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
                  <span className="font-semibold text-sm">{fund.fund_code}</span>
                  {fund.unit_price === 0 && (
                    <Badge variant="warning" className="text-[10px] py-0 w-fit">Fiyat girilmedi</Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">
                {formatNumber(fund.quantity, 4)}
              </td>
              <td className="px-4 py-3.5">
                <span className={cn('text-sm font-mono', fund.unit_price === 0 && 'text-muted-foreground')}>
                  {fund.unit_price > 0 ? `₺${fund.unit_price.toFixed(6)}` : '—'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm font-medium">
                {fund.currentValue > 0 ? formatCurrency(fund.currentValue) : '—'}
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
              <td className="px-4 py-3.5 hidden lg:table-cell">
                {fund.price_updated_at ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(fund.price_updated_at)}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1">
                  <UpdatePriceDialog
                    fundCode={fund.fund_code}
                    currentPrice={fund.unit_price}
                    onSubmit={(values) => onUpdatePrice(fund.id, values)}
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
              <td className="px-4 py-3 text-sm font-semibold" colSpan={2}>Toplam</td>
              <td className="px-4 py-3 hidden sm:table-cell" />
              <td className="px-4 py-3 text-sm font-bold">{formatCurrency(totalValue)}</td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
