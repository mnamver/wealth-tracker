export type { PriceData, PriceProvider } from './types';
export { createMockProvider } from './mockProvider';
export { createYahooFinanceProvider } from './yahooFinanceProvider';

import { createYahooFinanceProvider } from './yahooFinanceProvider';
import type { PriceProvider } from './types';

export function createPriceProvider(): PriceProvider {
  return createYahooFinanceProvider();
}

export const priceProvider = createPriceProvider();
