import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { EditQuantityDialog } from './EditQuantityDialog';
import { formatCurrency, formatNumber, formatPercent } from '../../../utils/formatters';
import { cn } from '../../../lib/utils';
import type { StockWithPrice, SortField, SortDirection } from '../../../types';

interface StocksTableProps {
  stocks: StockWithPrice[];
  totalValue: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onUpdateQuantity: (id: string, quantity: number) => Promise<unknown>;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
  return direction === 'asc' ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  );
}

function SortableHeader({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (f: SortField) => void;
  className?: string;
}) {
  return (
    <th className={cn('px-4 py-3 text-left', className)}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <SortIcon active={sortField === field} direction={sortDirection} />
      </button>
    </th>
  );
}

export function StocksTable({
  stocks,
  totalValue,
  sortField,
  sortDirection,
  onSort,
  onUpdateQuantity,
  onDelete,
  isUpdating,
  isDeleting,
}: StocksTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Henüz hisse senedi eklenmedi.</p>
        <p className="text-xs text-muted-foreground mt-1">
          "Hisse Ekle" butonuna tıklayarak başlayın.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <SortableHeader
              field="symbol"
              label="Hisse"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              field="quantity"
              label="Adet"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="hidden sm:table-cell"
            />
            <SortableHeader
              field="currentPrice"
              label="Fiyat"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              field="currentValue"
              label="Toplam Değer"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              field="portfolioShare"
              label="Pay %"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="hidden md:table-cell"
            />
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
              Günlük
            </th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.id}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3.5">
                <span className="font-semibold text-sm">{stock.symbol}</span>
              </td>
              <td className="px-4 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">
                {formatNumber(stock.quantity, 0)}
              </td>
              <td className="px-4 py-3.5 text-sm font-mono">
                {stock.currentPrice > 0 ? formatCurrency(stock.currentPrice) : '—'}
              </td>
              <td className="px-4 py-3.5 text-sm font-medium">
                {stock.currentValue > 0 ? formatCurrency(stock.currentValue) : '—'}
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${Math.min(stock.portfolioShare, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stock.portfolioShare.toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 hidden sm:table-cell">
                {stock.dailyChangePercent !== undefined ? (
                  <Badge
                    variant={stock.dailyChangePercent >= 0 ? 'success' : 'danger'}
                    className="text-xs"
                  >
                    {formatPercent(stock.dailyChangePercent)}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1">
                  <EditQuantityDialog
                    symbol={stock.symbol}
                    currentQuantity={stock.quantity}
                    onSubmit={(qty) => onUpdateQuantity(stock.id, qty)}
                    isLoading={isUpdating}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(stock.id)}
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
              <td className="px-4 py-3 text-sm font-semibold" colSpan={2}>
                Toplam
              </td>
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
