import type { CurrencyAssetType } from '../../types';

export interface CurrencyOption {
  type: CurrencyAssetType;
  label: string;
  priceSymbol: string;
  unit: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    type: 'USD',
    label: 'Dolar (USD/TRY)',
    priceSymbol: 'USDTRY=X',
    unit: 'USD',
  },
  {
    type: 'EUR',
    label: 'Euro (EUR/TRY)',
    priceSymbol: 'EURTRY=X',
    unit: 'EUR',
  },
  {
    type: 'GOLD',
    label: 'Altın (TL/Gram)',
    priceSymbol: 'GC=F',
    unit: 'Gram',
  },
];

export const currencyOptionMap = new Map(
  CURRENCY_OPTIONS.map((option) => [option.type, option]),
);

export function getPriceSymbolByType(type: CurrencyAssetType): string {
  return currencyOptionMap.get(type)?.priceSymbol ?? 'USDTRY=X';
}

export function getLabelByType(type: CurrencyAssetType): string {
  return currencyOptionMap.get(type)?.label ?? type;
}

export function getUnitByType(type: CurrencyAssetType): string {
  return currencyOptionMap.get(type)?.unit ?? '';
}
