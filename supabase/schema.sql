-- ============================================================
-- Wealth Tracker - Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- STOCKS TABLE
-- ============================================================
create table if not exists stocks (
  id uuid primary key default uuid_generate_v4(),
  symbol text not null unique,
  quantity numeric(18, 4) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- DEPOSITS TABLE
-- ============================================================
create table if not exists deposits (
  id uuid primary key default uuid_generate_v4(),
  bank_name text not null,
  principal numeric(18, 2) not null check (principal > 0),
  annual_rate numeric(6, 2) not null check (annual_rate > 0),
  start_date date not null,
  maturity_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_dates check (maturity_date > start_date)
);

-- ============================================================
-- SNAPSHOTS TABLE
-- ============================================================
create table if not exists snapshots (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  total_net_worth numeric(18, 2) not null,
  stocks_value numeric(18, 2) not null default 0,
  deposits_value numeric(18, 2) not null default 0,
  created_at timestamptz not null default now(),
  constraint unique_date unique (date)
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stocks_updated_at
  before update on stocks
  for each row execute function update_updated_at();

create trigger deposits_updated_at
  before update on deposits
  for each row execute function update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_snapshots_date on snapshots (date desc);
create index if not exists idx_stocks_symbol on stocks (symbol);

-- ============================================================
-- ROW LEVEL SECURITY (disable for single-user, no-auth setup)
-- ============================================================
alter table stocks disable row level security;
alter table deposits disable row level security;
alter table snapshots disable row level security;
