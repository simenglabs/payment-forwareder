-- Migration: create webhook_targets and donations tables

CREATE TABLE IF NOT EXISTS webhook_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(100) NOT NULL UNIQUE,
  webhook_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY,
  version VARCHAR(20),
  created_at TIMESTAMPTZ,
  type VARCHAR(50),
  amount_raw INTEGER,
  cut INTEGER,
  donator_name VARCHAR(255),
  donator_email VARCHAR(255),
  donator_is_user BOOLEAN,
  message TEXT,
  platform VARCHAR(100),
  qr_string TEXT,
  amount_to_display INTEGER,
  transaction_fee_policy VARCHAR(50),
  forwarded_to TEXT,
  forwarded_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on webhook_targets
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhook_targets_updated_at
  BEFORE UPDATE ON webhook_targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
