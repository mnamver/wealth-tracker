import { supabase } from '../lib/supabase';
import type { Fund, FundFormValues, UpdatePriceValues, UpdateCostPerUnitValues } from '../types';

export interface FundLivePrice {
  price: number;
  dailyChangePercent: number | null;
  updatedAt: string | null;
}

export const fundsService = {
  async getAll(): Promise<Fund[]> {
    const { data, error } = await supabase
      .from('funds')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getLivePrices(codes: string[]): Promise<Record<string, FundLivePrice>> {
    if (codes.length === 0) return {};
    const { data, error } = await supabase.functions.invoke('get-fund-prices', {
      body: { codes },
    });
    if (error) throw error;
    return (data as { prices: Record<string, FundLivePrice> }).prices ?? {};
  },

  async create(values: FundFormValues): Promise<Fund> {
    const { data, error } = await supabase
      .from('funds')
      .insert({
        fund_code: values.fund_code.toUpperCase().trim(),
        quantity: values.quantity,
        unit_price: values.unit_price,
        cost_per_unit: values.cost_per_unit,
        price_updated_at: values.unit_price > 0 ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePrice(id: string, values: UpdatePriceValues): Promise<Fund> {
    const { data, error } = await supabase
      .from('funds')
      .update({
        unit_price: values.unit_price,
        price_updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, values: { quantity: number; cost_per_unit: number }): Promise<Fund> {
    const { data, error } = await supabase
      .from('funds')
      .update({ quantity: values.quantity, cost_per_unit: values.cost_per_unit })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('funds').delete().eq('id', id);
    if (error) throw error;
  },
};
