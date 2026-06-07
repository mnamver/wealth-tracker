import { TrendingUp, Building2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { formatCurrency } from '../../../utils/formatters';

interface AssetBreakdownCardsProps {
  stocksTotal: number;
  depositsTotal: number;
  totalNetWorth: number;
}

export function AssetBreakdownCards({
  stocksTotal,
  depositsTotal,
  totalNetWorth,
}: AssetBreakdownCardsProps) {
  const stocksShare = totalNetWorth > 0 ? (stocksTotal / totalNetWorth) * 100 : 0;
  const depositsShare = totalNetWorth > 0 ? (depositsTotal / totalNetWorth) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              %{stocksShare.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Hisse Senetleri</p>
          <p className="text-xl font-bold tracking-tight">{formatCurrency(stocksTotal)}</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${stocksShare}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              %{depositsShare.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Faiz / Mevduat</p>
          <p className="text-xl font-bold tracking-tight">{formatCurrency(depositsTotal)}</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${depositsShare}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
