import type {
  ShopCheckoutConfig,
  ShopCheckoutCreateInput,
  ShopCheckoutFinalizeInput,
  ShopCheckoutFinalizeResult,
  ShopCheckoutLineItem,
  ShopCheckoutProvider,
  ShopCheckoutProviderConfig,
  ShopCheckoutSession,
  ShopCheckoutStatus,
} from "@maple-global/api-client";
import type { AuthSessionUser } from "../auth-session";
import {
  persistCheckoutAccountData,
  resolveCheckoutCustomer,
  resolveCheckoutShippingAddress,
} from "./account";

type CheckoutBindings = {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_ENV?: string;
  SHOP_ORIGIN?: string;
  STRIPE_ENABLE_ALIPAY?: string;
  STRIPE_ENABLE_WECHAT_PAY?: string;
  STRIPE_SECRET_KEY?: string;
  WEB_ORIGIN: string;
};

type CurrencyCode = "CNY" | "GBP" | "USD";

type CheckoutDraftPayload = {
  customer: ShopCheckoutCreateInput["customer"];
  deliveryMode: ShopCheckoutCreateInput["deliveryMode"];
  lineItems: ShopCheckoutLineItem[];
  serviceDetails?: ShopCheckoutCreateInput["serviceDetails"];
  shippingAddress?: ShopCheckoutCreateInput["shippingAddress"];
  summary: {
    currencyCode: CurrencyCode;
    shippingMinor: number;
    subtotalMinor: number;
    totalMinor: number;
  };
};

type StoredCheckoutDraft = {
  checkoutId: string;
  createdAt: number;
  externalId?: string;
  payload: CheckoutDraftPayload;
  provider: ShopCheckoutProvider;
  receiptUrl?: string;
  reference: string;
  status: ShopCheckoutStatus;
  updatedAt: number;
};

type StoredCheckoutRow = {
  created_at: number;
  external_id: string | null;
  id: string;
  payload: string;
  provider: ShopCheckoutProvider;
  receipt_url: string | null;
  reference: string;
  status: ShopCheckoutStatus;
  updated_at: number;
};

const allowedStripeCountries = ["AU", "CA", "CN", "GB", "HK", "NZ", "SG", "US"];

const currencySymbols: Record<CurrencyCode, string> = {
  CNY: "¥",
  GBP: "£",
  USD: "$",
};

const shippingFees: Record<
  CurrencyCode,
  { shipping_priority: number; shipping_standard: number }
> = {
  CNY: {
    shipping_priority: 2800,
    shipping_standard: 0,
  },
  GBP: {
    shipping_priority: 1400,
    shipping_standard: 0,
  },
  USD: {
    shipping_priority: 1800,
    shipping_standard: 0,
  },
};

function isTrue(value?: string) {
  return value?.trim().toLowerCase() === "true";
}

function getCheckoutProviders(env: CheckoutBindings): ShopCheckoutProviderConfig[] {
  const stripeEnabled = Boolean(env.STRIPE_SECRET_KEY);
  const paypalEnabled = Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET);

  return [
    {
      checkoutMode: "hosted",
      description:
        "Card checkout with Stripe Checkout. You can later enable Link, wallets, and other Stripe methods from your account.",
      label: "Stripe",
      provider: "stripe",
      reason: stripeEnabled ? undefined : "Add STRIPE_SECRET_KEY in apps/server environment vars.",
      status: stripeEnabled ? "enabled" : "requires_keys",
    },
    {
      checkoutMode: "redirect",
      description:
        "Redirect to PayPal approval and return here for capture. This flow is ready once PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are configured.",
      label: "PayPal",
      provider: "paypal",
      reason: paypalEnabled
        ? undefined
        : "Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in apps/server environment vars.",
      status: paypalEnabled ? "enabled" : "requires_keys",
    },
    {
      checkoutMode: "hosted",
      description:
        "Prepared as a Stripe-hosted alternative payment method. Turn on STRIPE_ENABLE_ALIPAY=true after your Stripe account supports it.",
      label: "Alipay",
      provider: "alipay",
      reason:
        stripeEnabled && isTrue(env.STRIPE_ENABLE_ALIPAY)
          ? undefined
          : "Requires STRIPE_SECRET_KEY plus STRIPE_ENABLE_ALIPAY=true after Stripe account approval.",
      status:
        stripeEnabled && isTrue(env.STRIPE_ENABLE_ALIPAY)
          ? "enabled"
          : "coming_soon",
    },
    {
      checkoutMode: "hosted",
      description:
        "Prepared as a Stripe-hosted wallet flow. Turn on STRIPE_ENABLE_WECHAT_PAY=true after your Stripe account supports it.",
      label: "WeChat Pay",
      provider: "wechat_pay",
      reason:
        stripeEnabled && isTrue(env.STRIPE_ENABLE_WECHAT_PAY)
          ? undefined
          : "Requires STRIPE_SECRET_KEY plus STRIPE_ENABLE_WECHAT_PAY=true after Stripe account approval.",
      status:
        stripeEnabled && isTrue(env.STRIPE_ENABLE_WECHAT_PAY)
          ? "enabled"
          : "coming_soon",
    },
  ];
}

export function getShopCheckoutConfig(env: CheckoutBindings): ShopCheckoutConfig {
  return {
    providers: getCheckoutProviders(env),
    supportsMixedCurrencies: false,
  };
}

function parseMoney(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("£")) {
    return {
      currencyCode: "GBP" as const,
      amountMinor: Math.round((Number.parseFloat(trimmed.replace(/[^\d.]/g, "")) || 0) * 100),
    };
  }

  if (trimmed.startsWith("¥")) {
    return {
      currencyCode: "CNY" as const,
      amountMinor: Math.round((Number.parseFloat(trimmed.replace(/[^\d.]/g, "")) || 0) * 100),
    };
  }

  return {
    currencyCode: "USD" as const,
    amountMinor: Math.round((Number.parseFloat(trimmed.replace(/[^\d.]/g, "")) || 0) * 100),
  };
}

function inferBasketCurrency(lineItems: ShopCheckoutLineItem[]) {
  const currencies = new Set<CurrencyCode>();

  for (const item of lineItems) {
    currencies.add(parseMoney(item.price).currencyCode);
  }

  if (currencies.size !== 1) {
    throw new Error(
      "This checkout currently supports one currency per payment. Split mixed-currency items into separate orders first.",
    );
  }

  const [currencyCode] = [...currencies];

  if (!currencyCode) {
    throw new Error("Add at least one valid item to checkout.");
  }

  return currencyCode;
}

function assertProviderEnabled(
  provider: ShopCheckoutProvider,
  env: CheckoutBindings,
) {
  const config = getCheckoutProviders(env).find((item) => item.provider === provider);

  if (!config || config.status !== "enabled") {
    throw new Error(config?.reason ?? "This payment provider is not enabled yet.");
  }
}

function getOrigin(inputOrigin: string, fallbackOrigin: string) {
  try {
    return new URL(inputOrigin).origin;
  } catch {
    return fallbackOrigin;
  }
}

function buildReturnUrl(
  returnOrigin: string,
  provider: ShopCheckoutProvider,
  checkoutId: string,
  status: "cancelled" | "return",
) {
  const url = new URL("/checkout", returnOrigin);
  url.searchParams.set("provider", provider);
  url.searchParams.set("checkoutId", checkoutId);
  url.searchParams.set("status", status);
  return url.toString();
}

function validateCheckoutInput(input: ShopCheckoutCreateInput) {
  const hasShippingItem = input.lineItems.some(
    (item) => item.fulfillmentType === "shipping",
  );
  const hasServiceItem = input.lineItems.some(
    (item) => item.fulfillmentType === "service",
  );

  if (hasShippingItem && input.deliveryMode === "service") {
    return;
  }

  if (!hasShippingItem && input.deliveryMode !== "service") {
    throw new Error("This order only contains service items, so shipping is not required.");
  }

  if (input.deliveryMode !== "service" && !input.shippingAddress) {
    throw new Error("Enter a shipping address before continuing.");
  }

  if (hasServiceItem && !input.serviceDetails?.fulfillmentNotes) {
    return;
  }
}

function buildAmountSummary(input: ShopCheckoutCreateInput) {
  validateCheckoutInput(input);
  const currencyCode = inferBasketCurrency(input.lineItems);
  const subtotalMinor = input.lineItems.reduce((sum, item) => {
    const parsed = parseMoney(item.price);
    return sum + parsed.amountMinor * item.quantity;
  }, 0);

  const shippingMinor =
    input.deliveryMode === "service"
      ? 0
      : shippingFees[currencyCode][input.deliveryMode];

  return {
    currencyCode,
    shippingMinor,
    subtotalMinor,
    totalMinor: subtotalMinor + shippingMinor,
  };
}

function formatMinorAmount(amountMinor: number, currencyCode: CurrencyCode) {
  return (amountMinor / 100).toFixed(2).replace(/^/, "");
}

function formatDisplayAmount(amountMinor: number, currencyCode: CurrencyCode) {
  return `${currencySymbols[currencyCode]}${formatMinorAmount(amountMinor, currencyCode)}`;
}

function checkoutReference() {
  return `MGL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function insertCheckoutDraft(
  db: D1Database,
  userId: string | null,
  provider: ShopCheckoutProvider,
  payload: CheckoutDraftPayload,
) {
  const checkoutId = crypto.randomUUID();
  const reference = checkoutReference();
  const now = Date.now();

  await db
    .prepare(
      `INSERT INTO shop_checkout (
        id,
        user_id,
        reference,
        provider,
        status,
        external_id,
        payload,
        receipt_url,
        created_at,
        updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
    )
    .bind(
      checkoutId,
      userId,
      reference,
      provider,
      "draft",
      null,
      JSON.stringify(payload),
      null,
      now,
      now,
    )
    .run();

  return {
    checkoutId,
    createdAt: now,
    payload,
    provider,
    reference,
    status: "draft" as const,
    updatedAt: now,
  } satisfies StoredCheckoutDraft;
}

async function readCheckoutDraft(db: D1Database, checkoutId: string) {
  const row = await db
    .prepare(
      `SELECT id, reference, provider, status, external_id, payload, receipt_url, created_at, updated_at
       FROM shop_checkout WHERE id = ?1`,
    )
    .bind(checkoutId)
    .first<StoredCheckoutRow>();

  if (!row) {
    return null;
  }

  return {
    checkoutId: row.id,
    createdAt: row.created_at,
    externalId: row.external_id ?? undefined,
    payload: JSON.parse(row.payload) as CheckoutDraftPayload,
    provider: row.provider,
    receiptUrl: row.receipt_url ?? undefined,
    reference: row.reference,
    status: row.status,
    updatedAt: row.updated_at,
  } satisfies StoredCheckoutDraft;
}

async function updateCheckoutDraft(
  db: D1Database,
  checkoutId: string,
  patch: Partial<Pick<StoredCheckoutDraft, "externalId" | "receiptUrl" | "status">>,
) {
  const current = await readCheckoutDraft(db, checkoutId);

  if (!current) {
    throw new Error("Checkout session was not found.");
  }

  const next = {
    externalId: patch.externalId ?? current.externalId ?? null,
    receiptUrl: patch.receiptUrl ?? current.receiptUrl ?? null,
    status: patch.status ?? current.status,
  };

  await db
    .prepare(
      `UPDATE shop_checkout
       SET status = ?2, external_id = ?3, receipt_url = ?4, updated_at = ?5
       WHERE id = ?1`,
    )
    .bind(checkoutId, next.status, next.externalId, next.receiptUrl, Date.now())
    .run();

  return readCheckoutDraft(db, checkoutId);
}

function buildStripeReturnUrls(
  returnOrigin: string,
  provider: ShopCheckoutProvider,
  checkoutId: string,
) {
  return {
    cancelUrl: buildReturnUrl(returnOrigin, provider, checkoutId, "cancelled"),
    // Stripe replaces this template token server-side; if URLSearchParams encodes
    // the braces into %7B...%7D, Stripe treats it as a literal string instead.
    successUrl: `${buildReturnUrl(returnOrigin, provider, checkoutId, "return")}&externalId={CHECKOUT_SESSION_ID}`,
  };
}

function stripePaymentMethodTypes(provider: ShopCheckoutProvider) {
  switch (provider) {
    case "alipay":
      return ["alipay"];
    case "wechat_pay":
      return ["wechat_pay"];
    default:
      return ["card"];
  }
}

async function createStripeCheckoutSession(
  db: D1Database,
  draft: StoredCheckoutDraft,
  env: CheckoutBindings,
  returnOrigin: string,
) {
  const secretKey = env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }

  const urls = buildStripeReturnUrls(returnOrigin, draft.provider, draft.checkoutId);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", urls.successUrl);
  params.set("cancel_url", urls.cancelUrl);
  params.set("customer_email", draft.payload.customer.email);
  params.set("metadata[checkoutId]", draft.checkoutId);
  params.set("metadata[reference]", draft.reference);
  params.set("submit_type", "pay");

  for (const [index, paymentMethod] of stripePaymentMethodTypes(draft.provider).entries()) {
    params.append(`payment_method_types[${index}]`, paymentMethod);
  }

  draft.payload.lineItems.forEach((item, index) => {
    const parsed = parseMoney(item.price);
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
    params.set(
      `line_items[${index}][price_data][currency]`,
      parsed.currencyCode.toLowerCase(),
    );
    params.set(`line_items[${index}][price_data][unit_amount]`, String(parsed.amountMinor));
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      item.title,
    );
    params.set(
      `line_items[${index}][price_data][product_data][description]`,
      [item.brand, item.variantLabel, item.purchaseModeLabel]
        .filter(Boolean)
        .join(" • "),
    );
  });

  // Inject the dynamically calculated shipping fee as a standard line item
  if (draft.payload.summary.shippingMinor > 0) {
    const sIdx = draft.payload.lineItems.length;
    params.set(`line_items[${sIdx}][quantity]`, "1");
    params.set(
      `line_items[${sIdx}][price_data][currency]`,
      draft.payload.summary.currencyCode.toLowerCase(),
    );
    params.set(`line_items[${sIdx}][price_data][unit_amount]`, String(draft.payload.summary.shippingMinor));
    params.set(`line_items[${sIdx}][price_data][product_data][name]`, "Shipping");
    params.set(
      `line_items[${sIdx}][price_data][product_data][description]`,
      draft.payload.deliveryMode === 'shipping_priority' ? "Priority shipping" : "Standard shipping",
    );
  }

  // Pre-fill the shipping address onto the payment intent so Stripe records it natively
  // without asking the user to re-type it.
  if (draft.payload.shippingAddress) {
    params.set("payment_intent_data[shipping][name]", draft.payload.shippingAddress.recipient || draft.payload.customer.fullName);
    params.set("payment_intent_data[shipping][address][line1]", draft.payload.shippingAddress.line1);
    if (draft.payload.shippingAddress.line2) {
      params.set("payment_intent_data[shipping][address][line2]", draft.payload.shippingAddress.line2);
    }
    params.set("payment_intent_data[shipping][address][city]", draft.payload.shippingAddress.city);
    if (draft.payload.shippingAddress.stateProvince) {
      params.set("payment_intent_data[shipping][address][state]", draft.payload.shippingAddress.stateProvince);
    }
    params.set("payment_intent_data[shipping][address][postal_code]", draft.payload.shippingAddress.postalCode);
    params.set("payment_intent_data[shipping][address][country]", draft.payload.shippingAddress.country);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    body: params.toString(),
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        id?: string;
        url?: string;
      }
    | null;

  if (!response.ok || !payload?.id || !payload.url) {
    throw new Error(payload?.error?.message ?? "Stripe checkout session creation failed.");
  }

  await updateCheckoutDraft(db, draft.checkoutId, {
    externalId: payload.id,
    status: "requires_action",
  });

  return {
    checkoutId: draft.checkoutId,
    externalId: payload.id,
    provider: draft.provider,
    redirectUrl: payload.url,
    status: "requires_action",
    summary: draft.payload.summary,
  } satisfies ShopCheckoutSession;
}

async function fetchPayPalAccessToken(env: CheckoutBindings) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal is not configured.");
  }

  const auth = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
    "utf8",
  ).toString("base64");

  const baseUrl =
    env.PAYPAL_ENV?.trim().toLowerCase() === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const payload = (await response.json().catch(() => null)) as
    | { access_token?: string; error_description?: string }
    | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description ?? "PayPal authentication failed.");
  }

  return {
    accessToken: payload.access_token,
    baseUrl,
  };
}

async function createPayPalOrder(
  db: D1Database,
  draft: StoredCheckoutDraft,
  env: CheckoutBindings,
  returnOrigin: string,
) {
  const { accessToken, baseUrl } = await fetchPayPalAccessToken(env);
  const hasShipping = draft.payload.deliveryMode !== "service";
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    body: JSON.stringify({
      intent: "CAPTURE",
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Maple Global",
            cancel_url: buildReturnUrl(
              returnOrigin,
              draft.provider,
              draft.checkoutId,
              "cancelled",
            ),
            return_url: new URL(
              buildReturnUrl(returnOrigin, draft.provider, draft.checkoutId, "return"),
            ).toString(),
            shipping_preference:
              draft.payload.deliveryMode === "service"
                ? "NO_SHIPPING"
                : draft.payload.shippingAddress
                  ? "SET_PROVIDED_ADDRESS"
                  : "GET_FROM_FILE",
            user_action: "PAY_NOW",
          },
        },
      },
      purchase_units: [
        {
          amount: {
            breakdown: {
              item_total: {
                currency_code: draft.payload.summary.currencyCode,
                value: formatMinorAmount(
                  draft.payload.summary.subtotalMinor,
                  draft.payload.summary.currencyCode,
                ),
              },
              shipping: {
                currency_code: draft.payload.summary.currencyCode,
                value: formatMinorAmount(
                  draft.payload.summary.shippingMinor,
                  draft.payload.summary.currencyCode,
                ),
              },
            },
            currency_code: draft.payload.summary.currencyCode,
            value: formatMinorAmount(
              draft.payload.summary.totalMinor,
              draft.payload.summary.currencyCode,
            ),
          },
          custom_id: draft.checkoutId,
          description: `${draft.reference} from Maple Global`,
          items: draft.payload.lineItems.map((item) => {
            const parsed = parseMoney(item.price);
            return {
              category:
                item.fulfillmentType === "shipping"
                  ? "PHYSICAL_GOODS"
                  : "DIGITAL_GOODS",
              name: item.title,
              quantity: String(item.quantity),
              unit_amount: {
                currency_code: parsed.currencyCode,
                value: formatMinorAmount(parsed.amountMinor, parsed.currencyCode),
              },
            };
          }),
          reference_id: draft.reference,
          shipping: hasShipping && draft.payload.shippingAddress
            ? {
                address: {
                  address_line_1: draft.payload.shippingAddress.line1,
                  address_line_2: draft.payload.shippingAddress.line2,
                  admin_area_1: draft.payload.shippingAddress.stateProvince,
                  admin_area_2: draft.payload.shippingAddress.city,
                  country_code: draft.payload.shippingAddress.country,
                  postal_code: draft.payload.shippingAddress.postalCode,
                },
                name: {
                  full_name: draft.payload.shippingAddress.recipient,
                },
              }
            : undefined,
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        id?: string;
        links?: Array<{ href?: string; rel?: string }>;
        message?: string;
      }
    | null;

  const redirectUrl =
    payload?.links?.find((link) => link.rel === "payer-action" || link.rel === "approve")
      ?.href ?? null;

  if (!response.ok || !payload?.id || !redirectUrl) {
    throw new Error(payload?.message ?? "PayPal order creation failed.");
  }

  await updateCheckoutDraft(db, draft.checkoutId, {
    externalId: payload.id,
    status: "requires_action",
  });

  return {
    checkoutId: draft.checkoutId,
    externalId: payload.id,
    provider: draft.provider,
    redirectUrl,
    status: "requires_action",
    summary: draft.payload.summary,
  } satisfies ShopCheckoutSession;
}

export async function createShopCheckoutSession(
  db: D1Database,
  env: CheckoutBindings,
  input: ShopCheckoutCreateInput,
  authUser: AuthSessionUser | null,
) {
  assertProviderEnabled(input.provider, env);

  const customer = resolveCheckoutCustomer(authUser, input.customer);
  const shippingAddress = resolveCheckoutShippingAddress(input.shippingAddress);

  if (authUser) {
    await persistCheckoutAccountData(db, authUser, customer, shippingAddress);
  }

  const payload: CheckoutDraftPayload = {
    customer,
    deliveryMode: input.deliveryMode,
    lineItems: input.lineItems,
    serviceDetails: input.serviceDetails,
    shippingAddress,
    summary: buildAmountSummary(input),
  };
  const draft = await insertCheckoutDraft(db, authUser?.id ?? null, input.provider, payload);
  const returnOrigin = getOrigin(
    input.returnOrigin,
    env.SHOP_ORIGIN ?? env.WEB_ORIGIN,
  );

  switch (input.provider) {
    case "paypal":
      return createPayPalOrder(db, draft, env, returnOrigin);
    case "stripe":
    case "alipay":
    case "wechat_pay":
      return createStripeCheckoutSession(db, draft, env, returnOrigin);
    default:
      throw new Error("Unsupported payment provider.");
  }
}

async function retrieveStripeSession(
  externalId: string,
  env: CheckoutBindings,
) {
  const secretKey = env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${externalId}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      method: "GET",
    },
  );
  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        id?: string;
        payment_intent?: string;
        payment_status?: string;
        status?: string;
      }
    | null;

  if (!response.ok || !payload?.id) {
    throw new Error(payload?.error?.message ?? "Failed to verify Stripe checkout session.");
  }

  return payload;
}

async function capturePayPalOrder(
  externalId: string,
  env: CheckoutBindings,
) {
  const { accessToken, baseUrl } = await fetchPayPalAccessToken(env);
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${externalId}/capture`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await response.json().catch(() => null)) as
    | {
        id?: string;
        links?: Array<{ href?: string; rel?: string }>;
        message?: string;
        status?: string;
      }
    | null;

  if (!response.ok || !payload?.id) {
    throw new Error(payload?.message ?? "PayPal capture failed.");
  }

  return payload;
}

export async function finalizeShopCheckout(
  db: D1Database,
  env: CheckoutBindings,
  input: ShopCheckoutFinalizeInput,
) {
  const draft = await readCheckoutDraft(db, input.checkoutId);

  if (!draft) {
    throw new Error("Checkout session was not found.");
  }

  if (draft.provider !== input.provider) {
    throw new Error("Payment provider does not match this checkout session.");
  }

  const externalId = input.externalId ?? draft.externalId;

  if (!externalId) {
    throw new Error("Payment reference is missing for verification.");
  }

  if (draft.status === "paid") {
    return {
      checkoutId: draft.checkoutId,
      externalId,
      lineItems: draft.payload.lineItems,
      message: "Payment already confirmed.",
      provider: draft.provider,
      reference: draft.reference,
      receiptUrl: draft.receiptUrl,
      status: draft.status,
      summary: draft.payload.summary,
    } satisfies ShopCheckoutFinalizeResult;
  }

  if (draft.provider === "paypal") {
    const order = await capturePayPalOrder(externalId, env);
    const receiptUrl = order.links?.find((link) => link.rel === "self")?.href;
    await updateCheckoutDraft(db, draft.checkoutId, {
      externalId,
      receiptUrl,
      status: order.status === "COMPLETED" ? "paid" : "pending",
    });
    return {
      checkoutId: draft.checkoutId,
      externalId,
      lineItems: draft.payload.lineItems,
      message:
        order.status === "COMPLETED"
          ? "PayPal payment captured successfully."
          : "PayPal approval returned, but capture is still pending.",
      provider: draft.provider,
      receiptUrl,
      reference: draft.reference,
      status: order.status === "COMPLETED" ? "paid" : "pending",
      summary: draft.payload.summary,
    } satisfies ShopCheckoutFinalizeResult;
  }

  const session = await retrieveStripeSession(externalId, env);
  const paid =
    session.payment_status === "paid" &&
    (session.status === "complete" || session.status === "open");

  await updateCheckoutDraft(db, draft.checkoutId, {
    externalId,
    receiptUrl: session.payment_intent
      ? `https://dashboard.stripe.com/payments/${session.payment_intent}`
      : undefined,
    status: paid ? "paid" : "pending",
  });

  return {
    checkoutId: draft.checkoutId,
    externalId,
    lineItems: draft.payload.lineItems,
    message: paid
      ? "Stripe payment confirmed successfully."
      : "Stripe checkout returned, but payment is still pending.",
    provider: draft.provider,
    receiptUrl: session.payment_intent
      ? `https://dashboard.stripe.com/payments/${session.payment_intent}`
      : undefined,
    reference: draft.reference,
    status: paid ? "paid" : "pending",
    summary: draft.payload.summary,
  } satisfies ShopCheckoutFinalizeResult;
}

export function formatCheckoutAmount(
  amountMinor: number,
  currencyCode: CurrencyCode,
) {
  return formatDisplayAmount(amountMinor, currencyCode);
}
