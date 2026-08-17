-- ==============================================================================
-- MIGRATION 001: Create Users Table, Indexes, and Auto-Updated Trigger
-- ==============================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL        PRIMARY KEY,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  name            VARCHAR(100)  NOT NULL,
  google_id       VARCHAR(255)  UNIQUE,
  picture         TEXT,
  phone           VARCHAR(30),
  gender          VARCHAR(10)   CHECK (gender IN ('male', 'female', 'other')),
  age             SMALLINT      CHECK (age BETWEEN 1 AND 120),
  profile_pic_key TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2. Create Index on google_id for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);

-- 3. Create Function and Trigger for automatic updated_at timestamps
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
