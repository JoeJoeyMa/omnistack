CREATE TABLE IF NOT EXISTS shop_checkout (
  id TEXT PRIMARY KEY NOT NULL,
  reference TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  external_id TEXT,
  payload TEXT NOT NULL,
  receipt_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS shop_checkout_external_id_idx
  ON shop_checkout (external_id);
