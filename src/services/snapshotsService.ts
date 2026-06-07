import { supabase } from '../lib/supabase';
import type { Snapshot, SnapshotInsert } from '../types';

export const snapshotsService = {
  async getAll(limit = 90): Promise<Snapshot[]> {
    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },

  async upsertToday(
    values: Omit<SnapshotInsert, 'date'> & { funds_value?: number },
  ): Promise<Snapshot> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('snapshots')
      .upsert(
        {
          date: today,
          total_net_worth: values.total_net_worth,
          stocks_value: values.stocks_value,
          deposits_value: values.deposits_value,
          funds_value: values.funds_value ?? 0,
        },
        { onConflict: 'date' },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
