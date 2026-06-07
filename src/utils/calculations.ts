import type { StockWithPrice } from '../types';

export function calculatePortfolioShares(stocks: StockWithPrice[]): StockWithPrice[] {
  const totalValue = stocks.reduce((sum, s) => sum + s.currentValue, 0);
  if (totalValue === 0) return stocks;
  return stocks.map((s) => ({
    ...s,
    portfolioShare: (s.currentValue / totalValue) * 100,
  }));
}

export function calculateTotalStocksValue(stocks: StockWithPrice[]): number {
  return stocks.reduce((sum, s) => sum + s.currentValue, 0);
}
