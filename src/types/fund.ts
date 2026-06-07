export interface Fund {
  id: string;
  fund_code: string;
  quantity: number;
  unit_price: number;
  price_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FundWithValue extends Fund {
  currentValue: number;
  portfolioShare: number;
}

export interface FundFormValues {
  fund_code: string;
  quantity: number;
  unit_price: number;
}

export interface UpdatePriceValues {
  unit_price: number;
}
