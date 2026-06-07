import { supabase } from '../../lib/supabase';
import type { PriceData, PriceProvider } from './types';

export function createYahooFinanceProvider(): PriceProvider {
  return {
    name: 'YahooFinance',

    async getCurrentPrice(symbol: string): Promise<PriceData> {
      const prices = await this.getPrices([symbol]);
      const result = prices.get(symbol.toUpperCase());
      if (!result) throw new Error(`Fiyat alınamadı: ${symbol}`);
      return result;
    },

    async getPrices(symbols: string[]): Promise<Map<string, PriceData>> {
      const { data, error } = await supabase.functions.invoke('get-prices', {
        body: { symbols },
      });

      if (error) throw error;

      const map = new Map<string, PriceData>();
      for (const [symbol, raw] of Object.entries(
        data as Record<string, { price: number; dailyChange: number; dailyChangePercent: number; updatedAt: string }>,
      )) {
        map.set(symbol, {
          symbol,
          price: raw.price,
          dailyChange: raw.dailyChange,
          dailyChangePercent: raw.dailyChangePercent,
          updatedAt: new Date(raw.updatedAt),
        });
      }
      return map;
    },
  };
}
