-- Currency/Gold assets migration

create table if not exists currency_assets (
  id uuid primary key default uuid_generate_v4(),
  asset_type text not null check (asset_type in ('USD', 'EUR', 'GOLD')),
  quantity numeric(18, 4) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'currency_assets_updated_at'
  ) then
    create trigger currency_assets_updated_at
      before update on currency_assets
      for each row execute function update_updated_at();
  end if;
end
$$;

create index if not exists idx_currency_assets_type on currency_assets (asset_type);

alter table currency_assets disable row level security;
