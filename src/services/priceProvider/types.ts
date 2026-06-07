export interface PriceData {
  symbol: string;
  price: number;
  dailyChange: number;
  dailyChangePercent: number;
  updatedAt: Date;
}

export interface PriceProvider {
  name: string;
  getCurrentPrice(symbol: string): Promise<PriceData>;
  getPrices(symbols: string[]): Promise<Map<string, PriceData>>;
}
