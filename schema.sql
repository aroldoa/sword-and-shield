-- Run this in your Neon SQL Editor (dashboard.neon.tech) to create the leads table.
-- Existing databases: run migrations/001_split_name.sql instead.

CREATE TABLE IF NOT EXISTS sword_shield_leads (
  id         BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  full_name  TEXT NOT NULL,          -- "first last", kept for older reports
  email      TEXT NOT NULL,
  phone      TEXT,                   -- E.164, e.g. +12105551234
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: index for listing by date
CREATE INDEX IF NOT EXISTS idx_sword_shield_leads_created_at ON sword_shield_leads (created_at DESC);
