import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { formatCurrency, formatPercent } from '../../../utils/formatters';

interface PortfolioDistributionChartProps {
  stocksTotal: number;
  depositsTotal: number;
}

const COLORS = ['#3b82f6', '#10b981'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  const item = payload[0];
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-xl">
      <p className="text-sm font-semibold text-foreground">{item.name}</p>
      <p className="text-sm text-muted-foreground">{formatCurrency(item.value)}</p>
      <p className="text-xs text-muted-foreground">
        {total > 0 ? formatPercent((item.value / total) * 100, 1) : ''}
      </p>
    </div>
  );
}

export function PortfolioDistributionChart({
  stocksTotal,
  depositsTotal,
}: PortfolioDistributionChartProps) {
  const data = useMemo(
    () => [
      { name: 'Hisse Senetleri', value: stocksTotal },
      { name: 'Faiz / Mevduat', value: depositsTotal },
    ],
    [stocksTotal, depositsTotal],
  );

  const hasData = stocksTotal > 0 || depositsTotal > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Portföy Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Henüz varlık eklenmedi
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
