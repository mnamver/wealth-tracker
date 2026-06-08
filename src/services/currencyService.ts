import { supabase } from '../lib/supabase';
import type { CurrencyAsset, CurrencyAssetFormValues } from '../types';

export const currencyService = {
  async getAll(): Promise<CurrencyAsset[]> {
    const { data, error } = await supabase
      .from('currency_assets')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(values: CurrencyAssetFormValues): Promise<CurrencyAsset> {
    const { data, error } = await supabase
      .from('currency_assets')
      .insert({
        asset_type: values.asset_type,
        quantity: values.quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateQuantity(id: string, quantity: number): Promise<CurrencyAsset> {
    const { data, error } = await supabase
      .from('currency_assets')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('currency_assets').delete().eq('id', id);
    if (error) throw error;
  },
};
