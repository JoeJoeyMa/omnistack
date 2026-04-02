import type {
  ShopAccount,
  ShopAccountAddress,
  ShopAccountAddressInput,
  ShopAccountProfile,
  ShopAccountProfileInput,
  ShopCheckoutAmountSummary,
  ShopCheckoutCustomer,
  ShopCheckoutLineItem,
  ShopCheckoutProvider,
  ShopCheckoutShippingAddress,
  ShopCheckoutStatus,
} from "@maple-global/api-client";
import type { AuthSessionUser } from "../auth-session";

type ProfileRow = {
  company_name: string | null;
  country: string | null;
  email: string;
  email_verified: number | boolean;
  full_name: string | null;
  phone: string | null;
};

type AddressRow = {
  city: string;
  country: string;
  created_at: number;
  id: string;
  is_default: number | boolean;
  line1: string;
  line2: string | null;
  postal_code: string;
  recipient: string;
  state_province: string | null;
  updated_at: number;
};

type AddressOwnershipRow = {
  id: string;
  is_default: number | boolean;
};

type CountRow = {
  count: number;
};

type CheckoutRow = {
  created_at: number;
  id: string;
  payload: string;
  provider: ShopCheckoutProvider;
  receipt_url: string | null;
  reference: string;
  status: ShopCheckoutStatus;
};

type CheckoutPayload = {
  customer: ShopCheckoutCustomer;
  lineItems: ShopCheckoutLineItem[];
  shippingAddress?: ShopCheckoutShippingAddress;
  summary: ShopCheckoutAmountSummary;
};

function requireAuth(authUser: AuthSessionUser | null) {
  if (!authUser) {
    throw new Error("Sign in to access your shop account.");
  }

  return authUser;
}

function normalizeOptionalString(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeCountry(value?: string | null) {
  const trimmed = value?.trim().toUpperCase();
  return trimmed ? trimmed : undefined;
}

function toIsoString(timestamp: number) {
  return new Date(timestamp).toISOString();
}

async function readProfile(db: D1Database, userId: string) {
  return db
    .prepare(
      `SELECT
         user.name AS full_name,
         user.email AS email,
         user.email_verified AS email_verified,
         shop_customer_profile.phone AS phone,
         shop_customer_profile.company_name AS company_name,
         shop_customer_profile.country AS country
       FROM user
       LEFT JOIN shop_customer_profile
         ON shop_customer_profile.user_id = user.id
       WHERE user.id = ?1`,
    )
    .bind(userId)
    .first<ProfileRow>();
}

async function listAddresses(db: D1Database, userId: string) {
  const result = await db
    .prepare(
      `SELECT
         id,
         recipient,
         line1,
         line2,
         city,
         state_province,
         postal_code,
         country,
         is_default,
         created_at,
         updated_at
       FROM shop_shipping_address
       WHERE user_id = ?1
       ORDER BY is_default DESC, updated_at DESC`,
    )
    .bind(userId)
    .all<AddressRow>();

  return (result.results ?? []).map(
    (row) =>
      ({
        city: row.city,
        country: row.country,
        createdAt: toIsoString(row.created_at),
        id: row.id,
        isDefault: Boolean(row.is_default),
        line1: row.line1,
        line2: normalizeOptionalString(row.line2),
        postalCode: row.postal_code,
        recipient: row.recipient,
        stateProvince: normalizeOptionalString(row.state_province),
        updatedAt: toIsoString(row.updated_at),
      }) satisfies ShopAccountAddress,
  );
}

async function listRecentOrders(db: D1Database, userId: string) {
  const result = await db
    .prepare(
      `SELECT
         id,
         reference,
         provider,
         status,
         receipt_url,
         payload,
         created_at
       FROM shop_checkout
       WHERE user_id = ?1
         AND status IN ('paid', 'pending')
       ORDER BY created_at DESC
       LIMIT 12`,
    )
    .bind(userId)
    .all<CheckoutRow>();

  return (result.results ?? []).flatMap((row) => {
    const payload = JSON.parse(row.payload) as CheckoutPayload;

    return [
      {
        checkoutId: row.id,
        createdAt: toIsoString(row.created_at),
        customer: payload.customer,
        lineItems: payload.lineItems,
        provider: row.provider,
        receiptUrl: normalizeOptionalString(row.receipt_url),
        reference: row.reference,
        shippingAddress: payload.shippingAddress,
        status: row.status,
        summary: payload.summary,
      },
    ];
  });
}

function normalizeProfileInput(input: ShopAccountProfileInput) {
  return {
    companyName: normalizeOptionalString(input.companyName),
    country: normalizeCountry(input.country),
    fullName: input.fullName.trim(),
    phone: normalizeOptionalString(input.phone),
  };
}

function normalizeAddressInput(input: ShopAccountAddressInput) {
  return {
    city: input.city.trim(),
    country: input.country.trim().toUpperCase(),
    id: normalizeOptionalString(input.id),
    isDefault: Boolean(input.isDefault),
    line1: input.line1.trim(),
    line2: normalizeOptionalString(input.line2),
    postalCode: input.postalCode.trim(),
    recipient: input.recipient.trim(),
    stateProvince: normalizeOptionalString(input.stateProvince),
  };
}

async function readAddressOwnership(
  db: D1Database,
  userId: string,
  addressId: string,
) {
  return db
    .prepare(
      `SELECT id, is_default
       FROM shop_shipping_address
       WHERE user_id = ?1 AND id = ?2`,
    )
    .bind(userId, addressId)
    .first<AddressOwnershipRow>();
}

async function ensureDefaultAddress(
  db: D1Database,
  userId: string,
  keepId?: string,
) {
  if (keepId) {
    await db
      .prepare(
        `UPDATE shop_shipping_address
         SET is_default = CASE WHEN id = ?2 THEN 1 ELSE 0 END,
             updated_at = ?3
         WHERE user_id = ?1`,
      )
      .bind(userId, keepId, Date.now())
      .run();
    return;
  }

  const fallback = await db
    .prepare(
      `SELECT id
       FROM shop_shipping_address
       WHERE user_id = ?1
       ORDER BY updated_at DESC
       LIMIT 1`,
    )
    .bind(userId)
    .first<{ id: string }>();

  if (!fallback?.id) {
    return;
  }

  await db
    .prepare(
      `UPDATE shop_shipping_address
       SET is_default = CASE WHEN id = ?2 THEN 1 ELSE 0 END,
           updated_at = ?3
       WHERE user_id = ?1`,
    )
    .bind(userId, fallback.id, Date.now())
    .run();
}

async function readAddress(db: D1Database, userId: string, addressId: string) {
  const row = await db
    .prepare(
      `SELECT
         id,
         recipient,
         line1,
         line2,
         city,
         state_province,
         postal_code,
         country,
         is_default,
         created_at,
         updated_at
       FROM shop_shipping_address
       WHERE user_id = ?1 AND id = ?2`,
    )
    .bind(userId, addressId)
    .first<AddressRow>();

  if (!row) {
    throw new Error("Shipping address was not found.");
  }

  return {
    city: row.city,
    country: row.country,
    createdAt: toIsoString(row.created_at),
    id: row.id,
    isDefault: Boolean(row.is_default),
    line1: row.line1,
    line2: normalizeOptionalString(row.line2),
    postalCode: row.postal_code,
    recipient: row.recipient,
    stateProvince: normalizeOptionalString(row.state_province),
    updatedAt: toIsoString(row.updated_at),
  } satisfies ShopAccountAddress;
}

export function resolveCheckoutCustomer(
  authUser: AuthSessionUser | null,
  input: ShopCheckoutCustomer,
) {
  const fullName = input.fullName.trim() || authUser?.name || input.email;

  return {
    companyName: normalizeOptionalString(input.companyName),
    country: input.country.trim().toUpperCase(),
    email: authUser?.email ?? input.email.trim().toLowerCase(),
    fullName,
    phone: input.phone.trim(),
  } satisfies ShopCheckoutCustomer;
}

export function resolveCheckoutShippingAddress(
  input?: ShopCheckoutShippingAddress,
) {
  if (!input) {
    return undefined;
  }

  return {
    city: input.city.trim(),
    country: input.country.trim().toUpperCase(),
    line1: input.line1.trim(),
    line2: normalizeOptionalString(input.line2),
    postalCode: input.postalCode.trim(),
    recipient: input.recipient.trim(),
    stateProvince: normalizeOptionalString(input.stateProvince),
  } satisfies ShopCheckoutShippingAddress;
}

export async function persistCheckoutAccountData(
  db: D1Database,
  authUser: AuthSessionUser | null,
  customer: ShopCheckoutCustomer,
  shippingAddress?: ShopCheckoutShippingAddress,
) {
  const user = requireAuth(authUser);
  const now = Date.now();

  await db
    .prepare(
      `UPDATE user
       SET name = ?2, updated_at = ?3
       WHERE id = ?1`,
    )
    .bind(user.id, customer.fullName, now)
    .run();

  await db
    .prepare(
      `INSERT INTO shop_customer_profile (
         user_id,
         company_name,
         country,
         phone,
         created_at,
         updated_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(user_id) DO UPDATE SET
         company_name = excluded.company_name,
         country = excluded.country,
         phone = excluded.phone,
         updated_at = excluded.updated_at`,
    )
    .bind(
      user.id,
      customer.companyName ?? null,
      customer.country,
      customer.phone,
      now,
      now,
    )
    .run();

  if (!shippingAddress) {
    return;
  }

  const existing = await db
    .prepare(
      `SELECT id
       FROM shop_shipping_address
       WHERE user_id = ?1
         AND recipient = ?2
         AND line1 = ?3
         AND COALESCE(line2, '') = ?4
         AND city = ?5
         AND COALESCE(state_province, '') = ?6
         AND postal_code = ?7
         AND country = ?8
       LIMIT 1`,
    )
    .bind(
      user.id,
      shippingAddress.recipient,
      shippingAddress.line1,
      shippingAddress.line2 ?? "",
      shippingAddress.city,
      shippingAddress.stateProvince ?? "",
      shippingAddress.postalCode,
      shippingAddress.country,
    )
    .first<{ id: string }>();

  const addressId = existing?.id ?? crypto.randomUUID();

  await db
    .prepare(
      `UPDATE shop_shipping_address
       SET is_default = 0, updated_at = ?2
       WHERE user_id = ?1`,
    )
    .bind(user.id, now)
    .run();

  await db
    .prepare(
      `INSERT INTO shop_shipping_address (
         id,
         user_id,
         recipient,
         line1,
         line2,
         city,
         state_province,
         postal_code,
         country,
         is_default,
         created_at,
         updated_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 1, ?10, ?11)
       ON CONFLICT(id) DO UPDATE SET
         recipient = excluded.recipient,
         line1 = excluded.line1,
         line2 = excluded.line2,
         city = excluded.city,
         state_province = excluded.state_province,
         postal_code = excluded.postal_code,
         country = excluded.country,
         is_default = 1,
         updated_at = excluded.updated_at`,
    )
    .bind(
      addressId,
      user.id,
      shippingAddress.recipient,
      shippingAddress.line1,
      shippingAddress.line2 ?? null,
      shippingAddress.city,
      shippingAddress.stateProvince ?? null,
      shippingAddress.postalCode,
      shippingAddress.country,
      now,
      now,
    )
    .run();
}

export async function getShopAccount(
  db: D1Database,
  authUser: AuthSessionUser | null,
) {
  const user = requireAuth(authUser);
  const profileRow = await readProfile(db, user.id);

  if (!profileRow) {
    throw new Error("Account record was not found.");
  }

  const profile = {
    companyName: normalizeOptionalString(profileRow.company_name),
    country: normalizeCountry(profileRow.country),
    email: profileRow.email,
    emailVerified: Boolean(profileRow.email_verified),
    fullName: profileRow.full_name?.trim() || user.name || user.email,
    phone: normalizeOptionalString(profileRow.phone),
  } satisfies ShopAccountProfile;

  return {
    addresses: await listAddresses(db, user.id),
    profile,
    recentOrders: await listRecentOrders(db, user.id),
  } satisfies ShopAccount;
}

export async function updateShopAccountProfile(
  db: D1Database,
  authUser: AuthSessionUser | null,
  input: ShopAccountProfileInput,
) {
  const user = requireAuth(authUser);
  const profile = normalizeProfileInput(input);
  const now = Date.now();

  await db
    .prepare(
      `UPDATE user
       SET name = ?2, updated_at = ?3
       WHERE id = ?1`,
    )
    .bind(user.id, profile.fullName, now)
    .run();

  await db
    .prepare(
      `INSERT INTO shop_customer_profile (
         user_id,
         company_name,
         country,
         phone,
         created_at,
         updated_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(user_id) DO UPDATE SET
         company_name = excluded.company_name,
         country = excluded.country,
         phone = excluded.phone,
         updated_at = excluded.updated_at`,
    )
    .bind(
      user.id,
      profile.companyName ?? null,
      profile.country ?? null,
      profile.phone ?? null,
      now,
      now,
    )
    .run();

  const refreshed = await readProfile(db, user.id);

  if (!refreshed) {
    throw new Error("Unable to refresh the updated profile.");
  }

  return {
    companyName: normalizeOptionalString(refreshed.company_name),
    country: normalizeCountry(refreshed.country),
    email: refreshed.email,
    emailVerified: Boolean(refreshed.email_verified),
    fullName: refreshed.full_name?.trim() || profile.fullName,
    phone: normalizeOptionalString(refreshed.phone),
  } satisfies ShopAccountProfile;
}

export async function upsertShopAccountAddress(
  db: D1Database,
  authUser: AuthSessionUser | null,
  input: ShopAccountAddressInput,
) {
  const user = requireAuth(authUser);
  const address = normalizeAddressInput(input);
  const now = Date.now();

  const countRow = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM shop_shipping_address
       WHERE user_id = ?1`,
    )
    .bind(user.id)
    .first<CountRow>();

  const totalAddresses = Number(countRow?.count ?? 0);
  const existing = address.id
    ? await readAddressOwnership(db, user.id, address.id)
    : null;

  if (address.id && !existing) {
    throw new Error("Shipping address was not found.");
  }

  const shouldSetDefault =
    Boolean(address.isDefault) ||
    totalAddresses === 0 ||
    Boolean(existing?.is_default);

  const addressId = address.id ?? crypto.randomUUID();

  if (shouldSetDefault) {
    await db
      .prepare(
        `UPDATE shop_shipping_address
         SET is_default = 0, updated_at = ?2
         WHERE user_id = ?1`,
      )
      .bind(user.id, now)
      .run();
  }

  await db
    .prepare(
      `INSERT INTO shop_shipping_address (
         id,
         user_id,
         recipient,
         line1,
         line2,
         city,
         state_province,
         postal_code,
         country,
         is_default,
         created_at,
         updated_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
       ON CONFLICT(id) DO UPDATE SET
         recipient = excluded.recipient,
         line1 = excluded.line1,
         line2 = excluded.line2,
         city = excluded.city,
         state_province = excluded.state_province,
         postal_code = excluded.postal_code,
         country = excluded.country,
         is_default = excluded.is_default,
         updated_at = excluded.updated_at`,
    )
    .bind(
      addressId,
      user.id,
      address.recipient,
      address.line1,
      address.line2 ?? null,
      address.city,
      address.stateProvince ?? null,
      address.postalCode,
      address.country,
      shouldSetDefault ? 1 : 0,
      now,
      now,
    )
    .run();

  if (shouldSetDefault) {
    await ensureDefaultAddress(db, user.id, addressId);
  }

  return readAddress(db, user.id, addressId);
}

export async function deleteShopAccountAddress(
  db: D1Database,
  authUser: AuthSessionUser | null,
  addressId: string,
) {
  const user = requireAuth(authUser);
  const existing = await readAddressOwnership(db, user.id, addressId.trim());

  if (!existing) {
    return { success: true as const };
  }

  await db
    .prepare(
      `DELETE FROM shop_shipping_address
       WHERE user_id = ?1 AND id = ?2`,
    )
    .bind(user.id, addressId.trim())
    .run();

  if (Boolean(existing.is_default)) {
    await ensureDefaultAddress(db, user.id);
  }

  return { success: true as const };
}
