import type { PriceData, PriceProvider } from './types';

const MOCK_PRICES: Record<string, { price: number; change: number; changePercent: number }> = {
  THYAO: { price: 274.5, change: 3.2, changePercent: 1.18 },
  ASELS: { price: 198.8, change: -1.4, changePercent: -0.7 },
  TUPRS: { price: 562.0, change: 8.5, changePercent: 1.54 },
  EREGL: { price: 142.3, change: -2.1, changePercent: -1.46 },
  BIMAS: { price: 312.6, change: 4.8, changePercent: 1.56 },
  AKBNK: { price: 78.4, change: 0.9, changePercent: 1.16 },
  GARAN: { price: 92.1, change: 1.3, changePercent: 1.43 },
  ISCTR: { price: 45.6, change: -0.5, changePercent: -1.09 },
  KRDMD: { price: 38.9, change: 0.7, changePercent: 1.83 },
  KCHOL: { price: 210.4, change: -3.2, changePercent: -1.5 },
  SAHOL: { price: 145.8, change: 2.1, changePercent: 1.46 },
  SISE: { price: 89.2, change: 1.5, changePercent: 1.71 },
  PETKM: { price: 56.3, change: -0.8, changePercent: -1.4 },
  TCELL: { price: 134.7, change: 2.4, changePercent: 1.81 },
  TTKOM: { price: 38.1, change: 0.3, changePercent: 0.79 },
  FROTO: { price: 1245.0, change: 15.5, changePercent: 1.26 },
  TOASO: { price: 892.5, change: -8.0, changePercent: -0.89 },
  VESTL: { price: 67.4, change: 1.2, changePercent: 1.81 },
  KOZAL: { price: 1832.0, change: 22.5, changePercent: 1.24 },
  PGSUS: { price: 1120.0, change: -12.5, changePercent: -1.1 },
  'USDTRY=X': { price: 39.15, change: 0.08, changePercent: 0.2 },
  'EURTRY=X': { price: 42.45, change: -0.11, changePercent: -0.26 },
  'XAUTRY=X': { price: 4285.0, change: 18.3, changePercent: 0.43 },
};

const DEFAULT_PRICE = { price: 100.0, change: 0, changePercent: 0 };

function withJitter(value: number, maxPercent = 0.5): number {
  const factor = 1 + (Math.random() * maxPercent * 2 - maxPercent) / 100;
  return parseFloat((value * factor).toFixed(2));
}

async function simulateLatency(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 120));
}

export function createMockProvider(): PriceProvider {
  return {
    name: 'MockProvider',

    async getCurrentPrice(symbol: string): Promise<PriceData> {
      await simulateLatency();
      const base = MOCK_PRICES[symbol.toUpperCase()] ?? DEFAULT_PRICE;
      return {
        symbol: symbol.toUpperCase(),
        price: withJitter(base.price),
        dailyChange: withJitter(base.change, 10),
        dailyChangePercent: withJitter(base.changePercent, 10),
        updatedAt: new Date(),
      };
    },

    async getPrices(symbols: string[]): Promise<Map<string, PriceData>> {
      await simulateLatency();
      const result = new Map<string, PriceData>();
      for (const symbol of symbols) {
        const upper = symbol.toUpperCase();
        const base = MOCK_PRICES[upper] ?? DEFAULT_PRICE;
        result.set(upper, {
          symbol: upper,
          price: withJitter(base.price),
          dailyChange: withJitter(base.change, 10),
          dailyChangePercent: withJitter(base.changePercent, 10),
          updatedAt: new Date(),
        });
      }
      return result;
    },
  };
}
