export interface Stock {
  id: string;
  symbol: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface StockWithPrice extends Stock {
  currentPrice: number;
  currentValue: number;
  portfolioShare: number;
  dailyChange?: number;
  dailyChangePercent?: number;
}

export interface StockFormValues {
  symbol: string;
  quantity: number;
}

export type SortField = 'symbol' | 'quantity' | 'currentPrice' | 'currentValue' | 'portfolioShare';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
