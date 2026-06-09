export interface Stock {
  id: string;
  symbol: string;
  quantity: number;
  avg_cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface StockWithPrice extends Stock {
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  profitLoss: number;
  profitLossPercent: number;
  portfolioShare: number;
  dailyChange?: number;
  dailyChangePercent?: number;
}

export interface StockFormValues {
  symbol: string;
  quantity: number;
  avg_cost?: number | null;
}

export type SortField = 'symbol' | 'quantity' | 'currentPrice' | 'currentValue' | 'portfolioShare' | 'profitLoss' | 'profitLossPercent';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
