-- ─────────────────────────────────────────────────────────────
--  ProfileApp — PostgreSQL Schema (AWS RDS)
--  Run once after your RDS instance is available:
--
--  psql -h <RDS_ENDPOINT> -U profileadmin -d profileapp -f src/models/schema.sql
--
--  Or using AWS CLI to get the endpoint first:
--  aws rds describe-db-instances \
--    --db-instance-identifier profileapp-db \
--    --query "DBInstances[0].Endpoint.Address" \
--    --profile profileapp
-- ─────────────────────────────────────────────────────────────

-- Enable the pg_trgm extension (optional, for future full-text search)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─── users table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL        PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  name          VARCHAR(100)  NOT NULL,
  google_id     VARCHAR(255)  UNIQUE,
  picture       TEXT,
  phone         VARCHAR(30),
  gender        VARCHAR(10)   CHECK (gender IN ('male', 'female', 'other')),
  age           SMALLINT      CHECK (age BETWEEN 1 AND 120),
  profile_pic_key TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by google_id (used on every authenticated request)
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);

-- ─── auto-update updated_at on every row change ───────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── Production Restricted Application DB User ───────────────────
-- Run as master admin (profileadmin) to create restricted runtime user:
--
-- CREATE USER profileapp_app WITH PASSWORD 'YourSecureAppPasswordHere!';
-- GRANT CONNECT ON DATABASE profileapp TO profileapp_app;
-- GRANT USAGE ON SCHEMA public TO profileapp_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO profileapp_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO profileapp_app;

