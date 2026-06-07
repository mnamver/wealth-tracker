export interface Deposit {
  id: string;
  bank_name: string;
  principal: number;
  annual_rate: number;
  start_date: string;
  maturity_date: string;
  created_at: string;
  updated_at: string;
}

export interface DepositWithCalculations extends Deposit {
  daysElapsed: number;
  interestEarned: number;
  currentValue: number;
  daysRemaining: number;
  isMatured: boolean;
  totalDays: number;
  progressPercent: number;
}

export interface DepositFormValues {
  bank_name: string;
  principal: number;
  annual_rate: number;
  start_date: string;
  maturity_date: string;
}
