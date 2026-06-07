export type { PriceData, PriceProvider } from './types';
export { createMockProvider } from './mockProvider';

import { createMockProvider } from './mockProvider';
import type { PriceProvider } from './types';

// Swap this factory to switch providers (e.g. createYahooProvider, createBistProvider)
export function createPriceProvider(): PriceProvider {
  return createMockProvider();
}

export const priceProvider = createPriceProvider();
