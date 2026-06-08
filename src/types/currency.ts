export type CurrencyAssetType = 'USD' | 'EUR' | 'GOLD';

export interface CurrencyAsset {
  id: string;
  asset_type: CurrencyAssetType;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CurrencyAssetWithPrice extends CurrencyAsset {
  currentPrice: number;
  currentValue: number;
  dailyChange?: number;
  dailyChangePercent?: number;
}

export interface CurrencyAssetFormValues {
  asset_type: CurrencyAssetType;
  quantity: number;
}

export type CurrencySortField = 'asset_type' | 'quantity' | 'currentPrice' | 'currentValue';
