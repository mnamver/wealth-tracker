import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { formatCurrency, formatPercent } from '../../../utils/formatters';
import { cn } from '../../../lib/utils';

interface NetWorthCardProps {
  totalNetWorth: number;
  todayChange: number;
  todayChangePercent: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function NetWorthCard({
  totalNetWorth,
  todayChange,
  todayChangePercent,
  onRefresh,
  isRefreshing,
}: NetWorthCardProps) {
  const isPositive = todayChange >= 0;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent ring-1 ring-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <CardContent className="relative p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Toplam Net Servet</p>
            <p className="text-4xl font-bold tracking-tight md:text-5xl">
              {formatCurrency(totalNetWorth)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="shrink-0"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            <span className="hidden sm:inline">Yenile</span>
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              'text-sm font-semibold',
              isPositive ? 'text-emerald-500' : 'text-red-500',
            )}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(todayChange)}
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              isPositive ? 'text-emerald-500/80' : 'text-red-500/80',
            )}
          >
            ({formatPercent(todayChangePercent)})
          </span>
          <span className="text-xs text-muted-foreground">bugün</span>
        </div>
      </CardContent>
    </Card>
  );
}
