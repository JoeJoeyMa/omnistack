ALTER TABLE shop_checkout
  ADD COLUMN user_id TEXT;

CREATE INDEX IF NOT EXISTS shop_checkout_user_id_idx
  ON shop_checkout (user_id);

CREATE TABLE IF NOT EXISTS shop_customer_profile (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  company_name TEXT,
  country TEXT,
  phone TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS shop_shipping_address (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS shop_shipping_address_user_id_idx
  ON shop_shipping_address (user_id);

CREATE INDEX IF NOT EXISTS shop_shipping_address_user_default_idx
  ON shop_shipping_address (user_id, is_default);
