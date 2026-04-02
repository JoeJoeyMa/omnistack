import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createEmailVerificationToken } from "better-auth/api";
import { emailOTP } from "better-auth/plugins/email-otp";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import {
  buildOneTimeCodeEmail,
  buildPasswordResetEmail,
  buildVerificationEmail,
  sendTransactionalEmail,
} from "./email";
import type { Env } from "./index";
import { getTrustedOrigins, resolveWebOrigin } from "./origin";
import {
  hashUserPassword,
  isLocalPasswordRuntime,
  verifyUserPassword,
} from "./password";

export function createAuth(
  bindings: Env["Bindings"],
  requestOrigin?: string | null,
) {
  const db = drizzle(bindings.DB, { schema });
  const emailVerificationEnabled = Boolean(
    bindings.RESEND_API_KEY && bindings.RESEND_FROM_EMAIL,
  );
  const verificationExpiresInSeconds = 600;
  const passwordResetExpiresInSeconds = 3600;
  const webOrigin = resolveWebOrigin({
    configuredWebOrigin: bindings.WEB_ORIGIN,
    configuredShopOrigin: bindings.SHOP_ORIGIN,
    requestOrigin,
    serverOrigin: bindings.BETTER_AUTH_URL,
  });
  const allowLegacyScrypt = isLocalPasswordRuntime(bindings.BETTER_AUTH_URL);

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
    trustedOrigins: getTrustedOrigins({
      configuredWebOrigin: bindings.WEB_ORIGIN,
      configuredShopOrigin: bindings.SHOP_ORIGIN,
      requestOrigin,
      serverOrigin: bindings.BETTER_AUTH_URL,
    }),
    emailAndPassword: {
      enabled: true,
      password: {
        hash: hashUserPassword,
        verify: ({ hash, password }) =>
          verifyUserPassword({
            allowLegacyScrypt,
            hash,
            password,
          }),
      },
      requireEmailVerification: emailVerificationEnabled,
      resetPasswordTokenExpiresIn: passwordResetExpiresInSeconds,
      revokeSessionsOnPasswordReset: true,
      async sendResetPassword({ user, url }) {
        if (!bindings.RESEND_API_KEY || !bindings.RESEND_FROM_EMAIL) {
          return;
        }

        const { html, subject, text } = buildPasswordResetEmail({
          appOrigin: webOrigin,
          email: user.email,
          resetUrl: url,
          expiresInMinutes: Math.floor(passwordResetExpiresInSeconds / 60),
        });

        await sendTransactionalEmail({
          apiKey: bindings.RESEND_API_KEY,
          from: bindings.RESEND_FROM_EMAIL,
          to: user.email,
          subject,
          html,
          text,
        });
      },
    },
    emailVerification: emailVerificationEnabled
      ? {
          autoSignInAfterVerification: true,
          expiresIn: verificationExpiresInSeconds,
          sendOnSignIn: true,
          sendOnSignUp: true,
        }
      : undefined,
    plugins: emailVerificationEnabled
      ? [
          emailOTP({
            allowedAttempts: 3,
            disableSignUp: true,
            expiresIn: verificationExpiresInSeconds,
            otpLength: 6,
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
              if (!bindings.RESEND_API_KEY || !bindings.RESEND_FROM_EMAIL) {
                return;
              }

              const expiresInMinutes = Math.floor(
                verificationExpiresInSeconds / 60,
              );
              let subject = "";
              let text = "";
              let html = "";

              if (type === "email-verification") {
                const verificationToken = await createEmailVerificationToken(
                  bindings.BETTER_AUTH_SECRET,
                  email,
                  undefined,
                  verificationExpiresInSeconds,
                );
                const verificationUrl = `${bindings.BETTER_AUTH_URL}/verify-email?token=${verificationToken}&callbackURL=${encodeURIComponent(webOrigin)}`;
                const message = buildVerificationEmail({
                  appOrigin: webOrigin,
                  email,
                  verificationCode: otp,
                  verificationUrl,
                  expiresInMinutes,
                });

                subject = message.subject;
                text = message.text;
                html = message.html;
              } else if (type === "sign-in") {
                const message = buildOneTimeCodeEmail({
                  appOrigin: webOrigin,
                  email,
                  code: otp,
                  expiresInMinutes,
                  subject: "Your MAPLE-GLOBAL sign-in code",
                  eyebrow: "Email sign-in",
                  title: "Use this code to sign in",
                  intro:
                    "Enter this six-digit code on the MAPLE-GLOBAL login screen to continue without your password.",
                  panelLabel: "Sign-in code",
                  panelHelp:
                    "Use this code on the sign-in screen if you want to continue on this device.",
                });

                subject = message.subject;
                text = message.text;
                html = message.html;
              } else if (type === "forget-password") {
                const message = buildOneTimeCodeEmail({
                  appOrigin: webOrigin,
                  email,
                  code: otp,
                  expiresInMinutes,
                  subject: "Your MAPLE-GLOBAL password reset code",
                  eyebrow: "Password recovery",
                  title: "Reset your password with this code",
                  intro:
                    "Use this six-digit code on the MAPLE-GLOBAL recovery screen to choose a new password if opening a reset link is inconvenient.",
                  panelLabel: "Recovery code",
                  panelHelp:
                    "After verification, you can set a new password and sign back in immediately.",
                });

                subject = message.subject;
                text = message.text;
                html = message.html;
              } else {
                const message = buildOneTimeCodeEmail({
                  appOrigin: webOrigin,
                  email,
                  code: otp,
                  expiresInMinutes,
                  subject: "Your MAPLE-GLOBAL verification code",
                  eyebrow: "Secure confirmation",
                  title: "Use this code to continue",
                  intro:
                    "Enter this six-digit code on the MAPLE-GLOBAL screen that asked for verification.",
                  panelLabel: "Verification code",
                  panelHelp:
                    "Use this code to complete the action you just started.",
                });

                subject = message.subject;
                text = message.text;
                html = message.html;
              }

              await sendTransactionalEmail({
                apiKey: bindings.RESEND_API_KEY,
                from: bindings.RESEND_FROM_EMAIL,
                to: email,
                subject,
                html,
                text,
              });
            },
          }),
        ]
      : [],
    socialProviders,
  });
}
