import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import type { Env } from "./index";

export function createAuth(bindings: Env["Bindings"]) {
  const db = drizzle(bindings.DB, { schema });

  const socialProviders: Record<
    string,
    { clientId: string; clientSecret: string }
  > = {};

  if (bindings.GITHUB_CLIENT_ID && bindings.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: bindings.GITHUB_CLIENT_ID,
      clientSecret: bindings.GITHUB_CLIENT_SECRET,
    };
  }

  if (bindings.GOOGLE_CLIENT_ID && bindings.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: bindings.GOOGLE_CLIENT_ID,
      clientSecret: bindings.GOOGLE_CLIENT_SECRET,
    };
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    secret: bindings.BETTER_AUTH_SECRET,
    baseURL: bindings.BETTER_AUTH_URL,
    trustedOrigins: [bindings.WEB_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders,
  });
}
