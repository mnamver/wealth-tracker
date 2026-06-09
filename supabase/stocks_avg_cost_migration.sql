-- Add avg_cost (average purchase price) to stocks table for P&L calculation
alter table stocks add column if not exists avg_cost numeric(18, 4) null;
