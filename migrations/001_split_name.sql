-- Adds separate first/last name columns to an existing sword_shield_leads table.
-- Safe to run more than once. Run in the Neon SQL Editor BEFORE deploying the new form.

ALTER TABLE sword_shield_leads ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE sword_shield_leads ADD COLUMN IF NOT EXISTS last_name  TEXT;

-- Backfill existing rows: first word → first_name, the rest → last_name.
UPDATE sword_shield_leads
SET first_name = split_part(full_name, ' ', 1),
    last_name  = NULLIF(btrim(substr(full_name, length(split_part(full_name, ' ', 1)) + 1)), '')
WHERE first_name IS NULL;
