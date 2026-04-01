import { shopCatalogSchema, type ShopCatalogPayload } from "@maple-global/api-client/shop";
import { createShopSeedCatalog } from "./payload";

const SHOP_CATALOG_KEY = "catalog";

type ShopDocumentRow = {
  value: string;
};

export async function readShopCatalog(db: D1Database) {
  const row = await db
    .prepare("SELECT value FROM shop_document WHERE key = ?1")
    .bind(SHOP_CATALOG_KEY)
    .first<ShopDocumentRow>();

  if (!row?.value) {
    return null;
  }

  return shopCatalogSchema.parse(JSON.parse(row.value)) as ShopCatalogPayload;
}

export async function writeShopCatalog(
  db: D1Database,
  catalog: ShopCatalogPayload,
) {
  await db
    .prepare(
      "INSERT INTO shop_document (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
    )
    .bind(SHOP_CATALOG_KEY, JSON.stringify(catalog), Date.now())
    .run();

  return catalog;
}

export async function ensureShopCatalog(db: D1Database) {
  const existing = await readShopCatalog(db);

  if (existing) {
    return existing;
  }

  const seed = createShopSeedCatalog();
  await writeShopCatalog(db, seed);
  return seed;
}
