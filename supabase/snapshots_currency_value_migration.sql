-- ============================================================
-- Snapshots currency_value Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add currency_value column to snapshots (with default 0 for existing rows)
alter table snapshots
  add column if not exists currency_value numeric(18, 2) not null default 0;
