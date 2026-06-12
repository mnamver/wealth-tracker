export interface Snapshot {
  id: string;
  date: string;
  total_net_worth: number;
  stocks_value: number;
  deposits_value: number;
  funds_value: number;
  currency_value: number;
  created_at: string;
}

export interface SnapshotInsert {
  date: string;
  total_net_worth: number;
  stocks_value: number;
  deposits_value: number;
  funds_value: number;
  currency_value: number;
}
