-- ============================================================
-- Funds Table Migration
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists funds (
  id uuid primary key default uuid_generate_v4(),
  fund_code text not null unique,
  quantity numeric(18, 4) not null check (quantity > 0),
  unit_price numeric(18, 6) not null default 0 check (unit_price >= 0),
  price_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger funds_updated_at
  before update on funds
  for each row execute function update_updated_at();

create index if not exists idx_funds_code on funds (fund_code);

alter table funds disable row level security;

-- Add funds_value column to snapshots (with default 0 for existing rows)
alter table snapshots
  add column if not exists funds_value numeric(18, 2) not null default 0;
