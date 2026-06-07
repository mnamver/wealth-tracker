import { Suspense } from 'react';
import { NetWorthCard } from './components/NetWorthCard';
import { AssetBreakdownCards } from './components/AssetBreakdownCards';
import { PortfolioDistributionChart } from './components/PortfolioDistributionChart';
import { WealthHistoryChart } from './components/WealthHistoryChart';
import { useDashboard } from './hooks/useDashboard';

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-36 rounded-xl bg-muted" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
      </div>
      <div className="h-72 rounded-xl bg-muted" />
      <div className="h-72 rounded-xl bg-muted" />
    </div>
  );
}

function DashboardContent() {
  const {
    stocksTotal,
    depositsTotal,
    fundsTotal,
    totalNetWorth,
    todayChange,
    todayChangePercent,
    snapshots,
    refreshPrices,
    isLoading,
    isRefreshing,
  } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 md:space-y-5">
      <NetWorthCard
        totalNetWorth={totalNetWorth}
        todayChange={todayChange}
        todayChangePercent={todayChangePercent}
        onRefresh={refreshPrices}
        isRefreshing={isRefreshing}
      />

      <AssetBreakdownCards
        stocksTotal={stocksTotal}
        depositsTotal={depositsTotal}
        fundsTotal={fundsTotal}
        totalNetWorth={totalNetWorth}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PortfolioDistributionChart
          stocksTotal={stocksTotal}
          depositsTotal={depositsTotal}
          fundsTotal={fundsTotal}
        />
        <WealthHistoryChart snapshots={snapshots} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
