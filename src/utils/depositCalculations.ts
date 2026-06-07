import { differenceInDays } from 'date-fns';
import type { Deposit, DepositWithCalculations } from '../types';

export function calculateDepositInterest(
  principal: number,
  annualRate: number,
  days: number,
): number {
  return principal * (annualRate / 100) * (days / 365);
}

export function enrichDeposit(deposit: Deposit): DepositWithCalculations {
  const today = new Date();
  const startDate = new Date(deposit.start_date);
  const maturityDate = new Date(deposit.maturity_date);

  const totalDays = differenceInDays(maturityDate, startDate);
  const daysElapsed = Math.min(differenceInDays(today, startDate), totalDays);
  const daysRemaining = Math.max(differenceInDays(maturityDate, today), 0);
  const isMatured = today >= maturityDate;

  const interestEarned = calculateDepositInterest(
    deposit.principal,
    deposit.annual_rate,
    daysElapsed,
  );

  const currentValue = deposit.principal + interestEarned;
  const progressPercent = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 100;

  return {
    ...deposit,
    daysElapsed,
    interestEarned,
    currentValue,
    daysRemaining,
    isMatured,
    totalDays,
    progressPercent,
  };
}

export function calculateTotalDepositsValue(deposits: Deposit[]): number {
  return deposits.reduce((sum, d) => sum + enrichDeposit(d).currentValue, 0);
}
