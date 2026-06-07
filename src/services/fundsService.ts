import { supabase } from '../lib/supabase';
import type { Fund, FundFormValues, UpdatePriceValues } from '../types';

export const fundsService = {
  async getAll(): Promise<Fund[]> {
    const { data, error } = await supabase
      .from('funds')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(values: FundFormValues): Promise<Fund> {
    const { data, error } = await supabase
      .from('funds')
      .insert({
        fund_code: values.fund_code.toUpperCase().trim(),
        quantity: values.quantity,
        unit_price: values.unit_price,
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

  async updateQuantity(id: string, quantity: number): Promise<Fund> {
    const { data, error } = await supabase
      .from('funds')
      .update({ quantity })
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
