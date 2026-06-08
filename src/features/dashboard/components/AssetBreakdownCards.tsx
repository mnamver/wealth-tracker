import { TrendingUp, Building2, BarChart3, Coins } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { formatCurrency } from '../../../utils/formatters';

interface AssetBreakdownCardsProps {
  stocksTotal: number;
  depositsTotal: number;
  fundsTotal: number;
  currencyTotal: number;
  totalNetWorth: number;
}

export function AssetBreakdownCards({
  stocksTotal,
  depositsTotal,
  fundsTotal,
  currencyTotal,
  totalNetWorth,
}: AssetBreakdownCardsProps) {
  const stocksShare = totalNetWorth > 0 ? (stocksTotal / totalNetWorth) * 100 : 0;
  const depositsShare = totalNetWorth > 0 ? (depositsTotal / totalNetWorth) * 100 : 0;
  const fundsShare = totalNetWorth > 0 ? (fundsTotal / totalNetWorth) * 100 : 0;
  const currencyShare = totalNetWorth > 0 ? (currencyTotal / totalNetWorth) * 100 : 0;

  const cards = [
    {
      label: 'Hisse Senetleri',
      value: stocksTotal,
      share: stocksShare,
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      bar: 'bg-blue-500',
    },
    {
      label: 'Faiz / Mevduat',
      value: depositsTotal,
      share: depositsShare,
      icon: Building2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      bar: 'bg-emerald-500',
    },
    {
      label: 'Yatırım Fonları',
      value: fundsTotal,
      share: fundsShare,
      icon: BarChart3,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      bar: 'bg-violet-500',
    },
    {
      label: 'Döviz / Altın',
      value: currencyTotal,
      share: currencyShare,
      icon: Coins,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      bar: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {cards.map(({ label, value, share, icon: Icon, color, bg, bar }) => (
        <Card key={label}>
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                %{share.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="text-base font-bold tracking-tight md:text-lg">
              {formatCurrency(value)}
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${bar}`}
                style={{ width: `${share}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
