-- Run this in your Neon SQL Editor (dashboard.neon.tech) to create the leads table.

CREATE TABLE IF NOT EXISTS sword_shield_leads (
  id         BIGSERIAL PRIMARY KEY,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: index for listing by date
CREATE INDEX IF NOT EXISTS idx_sword_shield_leads_created_at ON sword_shield_leads (created_at DESC);
