import { RPCHandler } from "@orpc/server/fetch";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import { getDb } from "./db/client";
import * as schema from "./db/schema";
import { buildRecoveryCodeEmail, sendTransactionalEmail } from "./email";
import { getRequestOrigin, resolveWebOrigin } from "./origin";
import { rpcRouter } from "./rpc/router";

export type Env = {
  Bindings: {
    DB: D1Database;
    WEB_ORIGIN: string;
    SHOP_ORIGIN?: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    PAYPAL_CLIENT_ID?: string;
    PAYPAL_CLIENT_SECRET?: string;
    PAYPAL_ENV?: string;
    STRIPE_ENABLE_ALIPAY?: string;
    STRIPE_ENABLE_WECHAT_PAY?: string;
    STRIPE_SECRET_KEY?: string;
  };
};

const app = new Hono<Env>();
const rpcHandler = new RPCHandler(rpcRouter);
const recoveryCodeExpiresInSeconds = 600;

app.use(
  "*",
  cors({
    origin: (origin, c) =>
      resolveWebOrigin({
        configuredWebOrigin: c.env.WEB_ORIGIN,
        configuredShopOrigin: c.env.SHOP_ORIGIN,
        requestOrigin: origin,
        serverOrigin: c.env.BETTER_AUTH_URL,
      }),
    credentials: true,
  }),
);

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env, getRequestOrigin(c.req.raw));
  return auth.handler(c.req.raw);
});

app.get("/verify-email", (c) => {
  const auth = createAuth(c.env, getRequestOrigin(c.req.raw));
  const url = new URL(c.req.url);
  url.pathname = "/api/auth/verify-email";

  return auth.handler(new Request(url, c.req.raw));
});

app.get("/health", (c) => {
  const db = getDb(c.env.DB);

  return c.json({
    status: "ok",
    runtime: "cloudflare-workers",
    dbConnected: Boolean(db),
    at: new Date().toISOString(),
  });
});

app.post("/auth/recover", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const webOrigin = resolveWebOrigin({
    configuredWebOrigin: c.env.WEB_ORIGIN,
    configuredShopOrigin: c.env.SHOP_ORIGIN,
    requestOrigin: getRequestOrigin(c.req.raw),
    serverOrigin: c.env.BETTER_AUTH_URL,
  });

  if (!email) {
    return c.json({ message: "Enter the account email first." }, 400);
  }

  if (!c.env.RESEND_API_KEY || !c.env.RESEND_FROM_EMAIL) {
    return c.json({ message: "Email delivery is not configured." }, 503);
  }

  const db = drizzle(c.env.DB, { schema });
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  await db
    .delete(schema.verification)
    .where(eq(schema.verification.identifier, `forget-password-otp-${email}`));

  if (!user) {
    return c.json({
      status: true,
      message:
        "If this email exists in our system, check your email for the recovery code.",
    });
  }

  const now = new Date();
  const recoveryCode = Array.from(crypto.getRandomValues(new Uint32Array(6)))
    .map((value) => (value % 10).toString())
    .join("");

  await db.insert(schema.verification).values({
    id: crypto.randomUUID(),
    identifier: `forget-password-otp-${email}`,
    value: `${recoveryCode}:0`,
    expiresAt: new Date(Date.now() + recoveryCodeExpiresInSeconds * 1000),
    createdAt: now,
    updatedAt: now,
  });

  const message = buildRecoveryCodeEmail({
    appOrigin: webOrigin,
    email,
    recoveryCode,
    codeExpiresInMinutes: Math.floor(recoveryCodeExpiresInSeconds / 60),
  });

  await sendTransactionalEmail({
    apiKey: c.env.RESEND_API_KEY,
    from: c.env.RESEND_FROM_EMAIL,
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  return c.json({
    status: true,
    message:
      "If this email exists in our system, check your email for the recovery code.",
  });
});

app.all("/rpc/*", async (c) => {
  const result = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: { db: c.env.DB, env: c.env },
  });

  if (!result.matched) {
    return c.notFound();
  }

  return result.response;
});

app.get("/auth/providers", (c) => {
  const auth = createAuth(c.env, getRequestOrigin(c.req.raw));
  const emailDeliveryEnabled = Boolean(
    c.env.RESEND_API_KEY && c.env.RESEND_FROM_EMAIL,
  );
  const githubEnabled = Boolean(
    c.env.GITHUB_CLIENT_ID && c.env.GITHUB_CLIENT_SECRET,
  );
  const googleEnabled = Boolean(
    c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET,
  );

  return c.json({
    email: true,
    emailOtp: emailDeliveryEnabled,
    emailVerification: emailDeliveryEnabled,
    passwordReset: emailDeliveryEnabled,
    github: githubEnabled,
    google: googleEnabled,
    authApiAvailable: Boolean(auth.api),
  });
});

export default {
  fetch: app.fetch,
};
