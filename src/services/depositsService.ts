import { supabase } from '../lib/supabase';
import type { Deposit, DepositFormValues } from '../types';

export const depositsService = {
  async getAll(): Promise<Deposit[]> {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(values: DepositFormValues): Promise<Deposit> {
    const { data, error } = await supabase
      .from('deposits')
      .insert({
        bank_name: values.bank_name.trim(),
        principal: values.principal,
        annual_rate: values.annual_rate,
        start_date: values.start_date,
        maturity_date: values.maturity_date,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, values: Partial<DepositFormValues>): Promise<Deposit> {
    const { data, error } = await supabase
      .from('deposits')
      .update(values)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('deposits').delete().eq('id', id);
    if (error) throw error;
  },
};
