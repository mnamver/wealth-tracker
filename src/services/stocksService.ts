import { supabase } from '../lib/supabase';
import type { Stock, StockFormValues } from '../types';

export const stocksService = {
  async getAll(): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(values: StockFormValues): Promise<Stock> {
    const { data, error } = await supabase
      .from('stocks')
      .insert({
        symbol: values.symbol.toUpperCase().trim(),
        quantity: values.quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, values: Partial<StockFormValues>): Promise<Stock> {
    const { data, error } = await supabase
      .from('stocks')
      .update({
        ...(values.symbol && { symbol: values.symbol.toUpperCase().trim() }),
        ...(values.quantity !== undefined && { quantity: values.quantity }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('stocks').delete().eq('id', id);
    if (error) throw error;
  },
};
