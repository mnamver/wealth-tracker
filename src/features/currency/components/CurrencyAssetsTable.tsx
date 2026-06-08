import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { formatCurrency, formatNumber, formatPercent } from '../../../utils/formatters';
import { getLabelByType, getUnitByType } from '../constants';
import { EditCurrencyAmountDialog } from './EditCurrencyAmountDialog';
import type { CurrencyAssetWithPrice, CurrencySortField, SortDirection } from '../../../types';

interface CurrencyAssetsTableProps {
  assets: CurrencyAssetWithPrice[];
  totalValue: number;
  sortField: CurrencySortField;
  sortDirection: SortDirection;
  onSort: (field: CurrencySortField) => void;
  onUpdateQuantity: (id: string, quantity: number) => Promise<unknown>;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
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
  field: CurrencySortField;
  label: string;
  sortField: CurrencySortField;
  sortDirection: SortDirection;
  onSort: (f: CurrencySortField) => void;
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

export function CurrencyAssetsTable({
  assets,
  totalValue,
  sortField,
  sortDirection,
  onSort,
  onUpdateQuantity,
  onDelete,
  isUpdating,
  isDeleting,
}: CurrencyAssetsTableProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Henüz döviz veya altın eklenmedi.</p>
        <p className="text-xs text-muted-foreground mt-1">
          "Döviz Ekle" butonuna tıklayarak başlayın.
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
              field="asset_type"
              label="Varlık"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              field="quantity"
              label="Miktar"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              field="currentPrice"
              label="Anlık Fiyat"
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
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
              Günlük
            </th>
            <th className="w-20" />
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => {
            const label = getLabelByType(asset.asset_type);
            const unit = getUnitByType(asset.asset_type);
            return (
              <tr
                key={asset.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-sm">{label}</span>
                </td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                  {formatNumber(asset.quantity, 4)} {unit}
                </td>
                <td className="px-4 py-3.5 text-sm font-mono">
                  {asset.currentPrice > 0 ? formatCurrency(asset.currentPrice) : '—'}
                </td>
                <td className="px-4 py-3.5 text-sm font-medium">
                  {asset.currentValue > 0 ? formatCurrency(asset.currentValue) : '—'}
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {asset.dailyChangePercent !== undefined ? (
                    <Badge variant={asset.dailyChangePercent >= 0 ? 'success' : 'danger'}>
                      {formatPercent(asset.dailyChangePercent)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <EditCurrencyAmountDialog
                      label={label}
                      currentQuantity={asset.quantity}
                      onSubmit={(quantity) => onUpdateQuantity(asset.id, quantity)}
                      isLoading={isUpdating}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(asset.id)}
                      disabled={isDeleting}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

        {totalValue > 0 && (
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/20">
              <td className="px-4 py-3 text-sm font-semibold" colSpan={3}>
                Toplam
              </td>
              <td className="px-4 py-3 text-sm font-bold">{formatCurrency(totalValue)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
