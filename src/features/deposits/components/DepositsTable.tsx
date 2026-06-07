import { Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import type { DepositWithCalculations } from '../../../types';

interface DepositsTableProps {
  deposits: DepositWithCalculations[];
  totalValue: number;
  totalPrincipal: number;
  totalInterest: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function DepositsTable({
  deposits,
  totalValue,
  totalPrincipal,
  totalInterest,
  onDelete,
  isDeleting,
}: DepositsTableProps) {
  if (deposits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Henüz mevduat hesabı eklenmedi.</p>
        <p className="text-xs text-muted-foreground mt-1">
          "Mevduat Ekle" butonuna tıklayarak başlayın.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Banka
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
              Ana Para
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Faiz %
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">
              Başlangıç
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">
              Vade
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">
              Geçen Gün
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
              Kazanılan Faiz
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Güncel Değer
            </th>
            <th className="w-12" />
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr
              key={deposit.id}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold text-sm">{deposit.bank_name}</p>
                    <div className="mt-1">
                      {deposit.isMatured ? (
                        <Badge variant="success" className="text-[10px] py-0">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Vadesi Doldu
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] py-0">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          {deposit.daysRemaining} gün kaldı
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                {formatCurrency(deposit.principal)}
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-emerald-500">
                  %{deposit.annual_rate.toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground hidden md:table-cell">
                {formatDate(deposit.start_date)}
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground hidden md:table-cell">
                {formatDate(deposit.maturity_date)}
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <div className="space-y-1.5">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${Math.min(deposit.progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {deposit.daysElapsed} / {deposit.totalDays} gün
                  </p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-medium text-emerald-500 hidden sm:table-cell">
                +{formatCurrency(deposit.interestEarned)}
              </td>
              <td className="px-4 py-4 text-sm font-bold">
                {formatCurrency(deposit.currentValue)}
              </td>
              <td className="px-4 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(deposit.id)}
                  disabled={isDeleting}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
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
              <td className="px-4 py-3 hidden sm:table-cell text-sm text-muted-foreground">
                Ana Para: {formatCurrency(totalPrincipal)}
              </td>
              <td colSpan={3} className="hidden md:table-cell" />
              <td className="px-4 py-3 text-sm font-medium text-emerald-500 hidden sm:table-cell">
                +{formatCurrency(totalInterest)}
              </td>
              <td className="px-4 py-3 text-sm font-bold">{formatCurrency(totalValue)}</td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
