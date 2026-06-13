export interface Fund {
  id: string;
  fund_code: string;
  quantity: number;
  unit_price: number;
  cost_per_unit: number;
  price_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FundWithValue extends Fund {
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  portfolioShare: number;
  dailyChangePercent: number | null;
  priceUpdatedAt: string | null;
  isLive: boolean;
  profitLoss: number | null;
  profitLossPercent: number | null;
}

export interface FundFormValues {
  fund_code: string;
  quantity: number;
  unit_price: number;
  cost_per_unit: number;
}

export interface UpdatePriceValues {
  unit_price: number;
}

export interface UpdateCostPerUnitValues {
  cost_per_unit: number;
}
