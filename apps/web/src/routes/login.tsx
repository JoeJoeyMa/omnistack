import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent, InputHTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { useCopyText } from "~/lib/locale";
import {
  getWebAuthBaseUrl,
  getWebServerUrl,
  getWebShopUrl,
} from "~/lib/runtime-urls";

type AuthView = "signin" | "signup" | "recover";
type SocialProvider = "google" | "github";
type FeedbackTone = "error" | "success";
type ProviderState = {
  email: boolean;
  emailOtp: boolean;
  emailVerification: boolean;
  passwordReset: boolean;
  google: boolean;
  github: boolean;
};
type AccountRecord = { providerId: string };
type CooldownKind = "verification" | "recovery-link" | "recovery-code";

const serverUrl = getWebServerUrl();
const authBaseUrl = new URL(getWebAuthBaseUrl());
const cooldownStorageKey = "maple-auth-cooldowns";
const cooldownDurationMs = 60_000;
const initialProviders: ProviderState = {
  email: true,
  emailOtp: false,
  emailVerification: false,
  passwordReset: false,
  google: false,
  github: false,
};

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login | MAPLE-GLOBAL" }],
  }),
  component: LoginPage,
});

function resolveReturnTo() {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  const requested = new URLSearchParams(window.location.search).get("returnTo");

  if (!requested) {
    return window.location.origin;
  }

  try {
    const resolved = new URL(requested, window.location.origin);
    const shopOrigin = new URL(getWebShopUrl(), window.location.origin).origin;
    const allowedOrigins = new Set([window.location.origin, shopOrigin]);

    if (!allowedOrigins.has(resolved.origin)) {
      return window.location.origin;
    }

    return resolved.toString();
  } catch {
    return window.location.origin;
  }
}

function LoginPage() {
  const copy = useCopyText();
  const sessionState = authClient.useSession();
  const user = sessionState.data?.user ?? null;
  const redirectTarget = useMemo(() => resolveReturnTo(), []);

  const [view, setView] = useState<AuthView>("signin");
  const [providers, setProviders] = useState<ProviderState>(initialProviders);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    message: string;
  } | null>(null);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [setPasswordValue, setSetPasswordValue] = useState("");

  const [submitPending, setSubmitPending] = useState(false);
  const [socialPending, setSocialPending] = useState<SocialProvider | null>(
    null,
  );
  const [verificationPending, setVerificationPending] = useState(false);
  const [recoveryPending, setRecoveryPending] = useState(false);
  const [accountPending, setAccountPending] = useState(false);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [cooldownNow, setCooldownNow] = useState(Date.now());

  const hasCredentialAccount = accounts.some(
    (account) => account.providerId === "credential",
  );
  const hasSocialProvider = providers.google || providers.github;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(cooldownStorageKey);
      if (stored) {
        setCooldowns(JSON.parse(stored) as Record<string, number>);
      }
    } catch {
      setCooldowns({});
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(cooldownStorageKey, JSON.stringify(cooldowns));
  }, [cooldowns]);

  useEffect(() => {
    const hasActiveCooldown = Object.values(cooldowns).some(
      (expiresAt) => expiresAt > Date.now(),
    );
    if (!hasActiveCooldown) return;

    const timer = window.setInterval(() => {
      setCooldownNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldowns]);

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      try {
        const response = await fetch(new URL("/auth/providers", serverUrl), {
          credentials: "include",
        });
        if (!response.ok) return;

        const data = (await response.json()) as Partial<ProviderState>;
        if (cancelled) return;

        setProviders({
          email: data.email ?? true,
          emailOtp: data.emailOtp ?? false,
          emailVerification: data.emailVerification ?? false,
          passwordReset: data.passwordReset ?? false,
          google: data.google ?? false,
          github: data.github ?? false,
        });
      } catch {
        if (!cancelled) setProviders(initialProviders);
      }
    }

    loadProviders();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const nextView = params.get("view");
    const email = params.get("email");

    if (email) {
      setRecoveryEmail(email);
      setSignInEmail((value) => value || email);
    }

    if (nextView === "signup") setView("signup");
    if (nextView === "recover") setView("recover");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAccounts() {
      if (!user) {
        setAccounts([]);
        return;
      }

      try {
        const response = await fetch(new URL("list-accounts", authBaseUrl), {
          credentials: "include",
        });
        if (!response.ok) return;

        const data = (await response.json()) as AccountRecord[];
        if (!cancelled) setAccounts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setAccounts([]);
      }
    }

    loadAccounts();
    return () => {
      cancelled = true;
    };
  }, [user]);

  function setError(message: string) {
    setFeedback({ tone: "error", message });
  }

  function setSuccess(message: string) {
    setFeedback({ tone: "success", message });
  }

  function clearFeedback() {
    setFeedback(null);
  }

  function cooldownKey(kind: CooldownKind, email: string) {
    return `${kind}:${email.trim().toLowerCase()}`;
  }

  function startCooldown(kind: CooldownKind, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setCooldowns((current) => ({
      ...current,
      [cooldownKey(kind, normalizedEmail)]: Date.now() + cooldownDurationMs,
    }));
    setCooldownNow(Date.now());
  }

  function getCooldownSeconds(kind: CooldownKind, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return 0;

    const expiresAt = cooldowns[cooldownKey(kind, normalizedEmail)] ?? 0;
    return Math.max(0, Math.ceil((expiresAt - cooldownNow) / 1000));
  }

  async function postAuth(path: string, body?: Record<string, unknown>) {
    const url = new URL(path.replace(/^\//, ""), authBaseUrl);
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    const data = text ? (JSON.parse(text) as Record<string, unknown>) : null;

    if (!response.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : copy("Unable to complete authentication.");
      throw new Error(message);
    }

    return data;
  }

  async function refreshSessionAndGo(message: string) {
    setSuccess(message);
    await sessionState.refetch();
    window.setTimeout(() => {
      window.location.href = redirectTarget;
    }, 650);
  }

  async function handleSocial(provider: SocialProvider) {
    setSocialPending(provider);
    clearFeedback();

    try {
      const data = await postAuth("sign-in/social", {
        provider,
        callbackURL: redirectTarget,
      });

      if (typeof data?.url === "string") {
        window.location.href = data.url;
        return;
      }

      window.location.href = redirectTarget;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to start social sign in."),
      );
    } finally {
      setSocialPending(null);
    }
  }

  async function handlePasswordSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitPending(true);
    clearFeedback();

    try {
      await postAuth("sign-in/email", {
        email: signInEmail,
        password: signInPassword,
        callbackURL: redirectTarget,
        rememberMe: true,
      });
      await refreshSessionAndGo(copy("Signed in successfully."));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : copy("Unable to sign in with email and password.");

      if (message.toLowerCase().includes("verify")) {
        setSignUpEmail(signInEmail);
        setView("signup");
        setError(
          copy(
            "This account still needs email verification. Use the verification link or the six-digit code below.",
          ),
        );
      } else {
        setError(message);
      }
    } finally {
      setSubmitPending(false);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitPending(true);
    clearFeedback();

    try {
      await postAuth("sign-up/email", {
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        callbackURL: redirectTarget,
        rememberMe: true,
      });

      if (providers.emailVerification) {
        startCooldown("verification", signUpEmail);
        setSuccess(
          copy(
            "Account created. We sent a verification link and six-digit code to your email.",
          ),
        );
      } else {
        await refreshSessionAndGo(copy("Account created successfully."));
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to create your account."),
      );
    } finally {
      setSubmitPending(false);
    }
  }

  async function handleResendVerification() {
    if (!signUpEmail) {
      setError(copy("Enter the account email first."));
      return;
    }

    const remaining = getCooldownSeconds("verification", signUpEmail);
    if (remaining > 0) {
      setError(
        copy(`Verification already sent. Please wait ${remaining}s before resending.`),
      );
      return;
    }

    setVerificationPending(true);
    clearFeedback();

    try {
      await postAuth("send-verification-email", {
        email: signUpEmail,
        callbackURL: redirectTarget,
      });
      startCooldown("verification", signUpEmail);
      setSuccess(
        copy("Verification email sent. You can request another one in 60 seconds."),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to send another verification email."),
      );
    } finally {
      setVerificationPending(false);
    }
  }

  async function handleVerifyCode() {
    if (!signUpEmail) {
      setError(copy("Enter the account email first."));
      return;
    }

    if (verificationCode.trim().length !== 6) {
      setError(copy("Enter the 6-digit verification code from your email."));
      return;
    }

    setVerificationPending(true);
    clearFeedback();

    try {
      await postAuth("email-otp/verify-email", {
        email: signUpEmail,
        otp: verificationCode.trim(),
      });
      await refreshSessionAndGo(copy("Email verified successfully."));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to verify this email code."),
      );
    } finally {
      setVerificationPending(false);
    }
  }

  async function handleStartRecovery() {
    if (!recoveryEmail) {
      setError(copy("Enter the account email first."));
      return;
    }

    const remaining = Math.max(
      getCooldownSeconds("recovery-link", recoveryEmail),
      getCooldownSeconds("recovery-code", recoveryEmail),
    );
    if (remaining > 0) {
      setError(
        copy(`Recovery email already sent. Please wait ${remaining}s before resending.`),
      );
      return;
    }

    setRecoveryPending(true);
    clearFeedback();

    try {
      const response = await fetch(new URL("/auth/recover", serverUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const text = await response.text();
      const data = text ? (JSON.parse(text) as Record<string, unknown>) : null;

      if (!response.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : copy("Unable to send the recovery email.");
        throw new Error(message);
      }

      startCooldown("recovery-link", recoveryEmail);
      startCooldown("recovery-code", recoveryEmail);
      setRecoveryReady(true);
      setSuccess(
        copy(
          "We sent one recovery email with a six-digit recovery code. You can use it below and send another recovery email in 60 seconds.",
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to send the recovery email."),
      );
    } finally {
      setRecoveryPending(false);
    }
  }

  async function handleRecoverWithCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!recoveryEmail) {
      setError(copy("Enter the account email first."));
      return;
    }

    if (recoveryCode.trim().length !== 6) {
      setError(copy("Enter the 6-digit recovery code from your email."));
      return;
    }

    setSubmitPending(true);
    clearFeedback();

    try {
      await postAuth("email-otp/reset-password", {
        email: recoveryEmail,
        otp: recoveryCode.trim(),
        password: recoveryPassword,
      });
      await postAuth("sign-in/email", {
        email: recoveryEmail,
        password: recoveryPassword,
        callbackURL: redirectTarget,
        rememberMe: true,
      });
      await refreshSessionAndGo(
        copy("Password updated and you are now signed in."),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to reset the password with this code."),
      );
    } finally {
      setSubmitPending(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountPending(true);
    clearFeedback();

    try {
      await postAuth("change-password", {
        currentPassword,
        newPassword: nextPassword,
        revokeOtherSessions: true,
      });
      setCurrentPassword("");
      setNextPassword("");
      setSuccess(copy("Password changed successfully."));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to change your password."),
      );
    } finally {
      setAccountPending(false);
    }
  }

  async function handleSetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountPending(true);
    clearFeedback();

    try {
      await postAuth("set-password", { newPassword: setPasswordValue });
      setSetPasswordValue("");
      await sessionState.refetch();
      setAccounts((current) =>
        current.some((account) => account.providerId === "credential")
          ? current
          : [...current, { providerId: "credential" }],
      );
      setSuccess(copy("Password added successfully."));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy("Unable to set a password for this account."),
      );
    } finally {
      setAccountPending(false);
    }
  }

  async function handleSignOut() {
    setAccountPending(true);
    clearFeedback();

    try {
      await authClient.signOut();
      window.location.href = "/";
    } finally {
      setAccountPending(false);
    }
  }

  const feedbackClasses =
    feedback?.tone === "error"
      ? "border-red-100 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
      : "border-green-100 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300";

  const verificationCooldown = getCooldownSeconds("verification", signUpEmail);
  const recoveryLinkCooldown = getCooldownSeconds(
    "recovery-link",
    recoveryEmail,
  );
  const recoveryCodeCooldown = getCooldownSeconds(
    "recovery-code",
    recoveryEmail,
  );
  const recoverySendCooldown = Math.max(
    recoveryLinkCooldown,
    recoveryCodeCooldown,
  );

  const providerLabels = useMemo(
    () =>
      accounts
        .map((account) => account.providerId)
        .filter((value, index, array) => array.indexOf(value) === index)
        .map((providerId) =>
          providerId === "credential"
            ? copy("Password")
            : providerId === "google"
              ? "Google"
              : providerId === "github"
                ? "GitHub"
                : providerId,
        ),
    [accounts, copy],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f3ec_0%,#f3f5f7_48%,#eef1f6_100%)] px-6 py-10 text-black dark:bg-[linear-gradient(180deg,#0d0f12_0%,#101318_48%,#121723_100%)] dark:text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10 lg:flex-row lg:items-stretch">
        <section className="flex-1 rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-10">
          <div className="max-w-xl">
            <Link
              className="inline-flex items-center gap-3 text-[18px] font-semibold tracking-tight"
              to="/"
            >
              <img
                alt=""
                aria-hidden="true"
                className="h-7 w-auto object-contain dark:invert"
                src="/logo.svg"
              />
              MAPLE-GLOBAL
            </Link>
            <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#8f7f66] dark:text-[#c0b39d]">
              {copy("Authentication")}
            </p>
            <h1 className="mt-3 text-[44px] font-semibold tracking-[-0.05em] sm:text-[56px]">
              {user
                ? copy("Your account is active.")
                : copy("Standard account access.")}
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-8 text-gray-600 dark:text-gray-300">
              {user
                ? copy(
                    "You are signed in. Your header, session state, and account details now reflect the current user.",
                  )
                : copy(
                    "Use password login for daily access, verify new accounts by email, and recover lost passwords with a reset link or six-digit recovery code.",
                  )}
            </p>
          </div>
        </section>

        <section className="w-full max-w-[560px] rounded-[36px] border border-black/5 bg-[#fffdfa] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#11151d] dark:shadow-none sm:p-8">
          {feedback ? (
            <div
              className={cn(
                "mb-6 rounded-[20px] border px-4 py-3 text-sm",
                feedbackClasses,
              )}
            >
              {feedback.message}
            </div>
          ) : null}

          {user ? (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                  {copy("Signed in")}
                </p>
                <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.04em]">
                  {user.name}
                </h2>
                <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-300">
                  {user.email}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-black px-3 py-1 text-[12px] font-semibold text-white dark:bg-white dark:text-black">
                    {user.emailVerified
                      ? copy("Email verified")
                      : copy("Email not verified")}
                  </span>
                  {providerLabels.map((label) => (
                    <span
                      className="rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold text-gray-600 dark:border-white/10 dark:text-gray-300"
                      key={label}
                    >
                      {label}
                    </span>
                  ))}
                  <button
                    className="rounded-full border border-gray-200 px-4 py-2 text-[14px] font-medium transition-colors hover:border-black hover:text-black dark:border-white/10 dark:hover:border-white dark:hover:text-white"
                    disabled={accountPending}
                    onClick={handleSignOut}
                    type="button"
                  >
                    {accountPending ? copy("Please wait...") : copy("Sign out")}
                  </button>
                </div>
              </div>

              {hasCredentialAccount ? (
                <form
                  className="space-y-4 rounded-[24px] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                  onSubmit={handleChangePassword}
                >
                  <SectionTitle
                    body={copy(
                      "Use this when you already know your current password and want to replace it.",
                    )}
                    title={copy("Change password")}
                  />
                  <Input
                    minLength={8}
                    onChange={setCurrentPassword}
                    placeholder={copy("Current password")}
                    type="password"
                    value={currentPassword}
                  />
                  <Input
                    minLength={8}
                    onChange={setNextPassword}
                    placeholder={copy("New password")}
                    type="password"
                    value={nextPassword}
                  />
                  <button
                    className="w-full rounded-[14px] bg-[#111318] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#232833]"
                    disabled={accountPending}
                    type="submit"
                  >
                    {accountPending
                      ? copy("Saving...")
                      : copy("Change password")}
                  </button>
                </form>
              ) : (
                <form
                  className="space-y-4 rounded-[24px] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                  onSubmit={handleSetPassword}
                >
                  <SectionTitle
                    body={copy(
                      "This account does not have a local password yet. Set one now for future password login.",
                    )}
                    title={copy("Add a password")}
                  />
                  <Input
                    minLength={8}
                    onChange={setSetPasswordValue}
                    placeholder={copy("New password")}
                    type="password"
                    value={setPasswordValue}
                  />
                  <button
                    className="w-full rounded-[14px] bg-[#111318] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#232833]"
                    disabled={accountPending}
                    type="submit"
                  >
                    {accountPending ? copy("Saving...") : copy("Set password")}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-2 rounded-[18px] bg-black/[0.04] p-2 dark:bg-white/5">
                <TabButton
                  active={view === "signin"}
                  label={copy("Log in")}
                  onClick={() => setView("signin")}
                />
                <TabButton
                  active={view === "signup"}
                  label={copy("Sign up")}
                  onClick={() => setView("signup")}
                />
                <TabButton
                  active={view === "recover"}
                  label={copy("Recover")}
                  onClick={() => setView("recover")}
                />
              </div>

              {view === "signin" ? (
                <form className="mt-6 space-y-4" onSubmit={handlePasswordSignIn}>
                  <SectionTitle
                    body={copy(
                      "Use your account email and password. If the password is unavailable, switch to Recover.",
                    )}
                    title={copy("Account password login")}
                  />
                  <Input
                    onChange={setSignInEmail}
                    placeholder={copy("Email address")}
                    type="email"
                    value={signInEmail}
                  />
                  <Input
                    minLength={8}
                    onChange={setSignInPassword}
                    placeholder={copy("Password")}
                    type="password"
                    value={signInPassword}
                  />
                  <button
                    className="w-full rounded-[14px] bg-[#111318] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#232833]"
                    disabled={submitPending || !providers.email}
                    type="submit"
                  >
                    {submitPending ? copy("Signing in...") : copy("Log in")}
                  </button>
                </form>
              ) : null}

              {view === "signup" ? (
                <div className="mt-6 space-y-5">
                  <form className="space-y-4" onSubmit={handleSignUp}>
                    <SectionTitle
                      body={copy(
                        "Create your account with a password first. We will immediately send an email verification link and a six-digit verification code.",
                      )}
                      title={copy("Create your account")}
                    />
                    <Input
                      onChange={setSignUpName}
                      placeholder={copy("Full name")}
                      type="text"
                      value={signUpName}
                    />
                    <Input
                      onChange={setSignUpEmail}
                      placeholder={copy("Email address")}
                      type="email"
                      value={signUpEmail}
                    />
                    <Input
                      minLength={8}
                      onChange={setSignUpPassword}
                      placeholder={copy("Password")}
                      type="password"
                      value={signUpPassword}
                    />
                    <button
                      className="w-full rounded-[14px] bg-[#111318] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#232833]"
                      disabled={submitPending}
                      type="submit"
                    >
                      {submitPending
                        ? copy("Creating...")
                        : copy("Create account")}
                    </button>
                  </form>

                  {providers.emailVerification ? (
                    <div className="rounded-[24px] border border-black/5 bg-[#faf6ef] p-5 dark:border-white/10 dark:bg-[#171c26]">
                      <SectionTitle
                        body={copy(
                          "If opening the email link is inconvenient, enter the six-digit verification code here. Verification emails can be resent once every 60 seconds.",
                        )}
                        title={copy("Verify with code")}
                      />
                      <div className="mt-4 space-y-3">
                        <Input
                          inputMode="numeric"
                          maxLength={6}
                          onChange={(value) =>
                            setVerificationCode(
                              value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          placeholder={copy("6-digit verification code")}
                          type="text"
                          value={verificationCode}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            className="rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white"
                            disabled={
                              verificationPending ||
                              !providers.emailVerification ||
                              verificationCooldown > 0
                            }
                            onClick={handleResendVerification}
                            type="button"
                          >
                            {verificationPending
                              ? copy("Sending...")
                              : verificationCooldown > 0
                                ? copy(
                                    `Resend available in ${verificationCooldown}s`,
                                  )
                                : copy("Resend verification email")}
                          </button>
                          <button
                            className="rounded-[14px] bg-black px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#222] dark:bg-white dark:text-black dark:hover:bg-[#f1f1f1]"
                            disabled={verificationPending}
                            onClick={handleVerifyCode}
                            type="button"
                          >
                            {verificationPending
                              ? copy("Verifying...")
                              : copy("Confirm verification code")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {view === "recover" ? (
                <div className="mt-6 space-y-5">
                  <SectionTitle
                    body={copy(
                      "Enter your account email once. We will send one recovery email with a six-digit recovery code, then you can set a new password below.",
                    )}
                    title={copy("Recover access")}
                  />

                  <div className="space-y-4 rounded-[24px] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                    <Input
                      onChange={setRecoveryEmail}
                      placeholder={copy("Account email")}
                      type="email"
                      value={recoveryEmail}
                    />
                    <button
                      className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white"
                      disabled={
                        recoveryPending ||
                        !providers.emailOtp ||
                        recoverySendCooldown > 0
                      }
                      onClick={handleStartRecovery}
                      type="button"
                    >
                      {recoveryPending
                        ? copy("Sending...")
                        : recoverySendCooldown > 0
                          ? copy(
                              `Recovery email available in ${recoverySendCooldown}s`,
                            )
                          : copy("Send recovery email")}
                    </button>
                  </div>

                  {recoveryReady ? (
                    <div className="space-y-4 rounded-[24px] border border-black/5 bg-[#faf6ef] p-5 dark:border-white/10 dark:bg-[#171c26]">
                      <form className="space-y-4" onSubmit={handleRecoverWithCode}>
                        <SectionTitle
                          body={copy(
                            "Use the six-digit recovery code from your email to set a new password immediately.",
                          )}
                          title={copy("Reset with recovery code")}
                        />
                        <Input
                          inputMode="numeric"
                          maxLength={6}
                          onChange={(value) =>
                            setRecoveryCode(
                              value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          placeholder={copy("6-digit recovery code")}
                          type="text"
                          value={recoveryCode}
                        />
                        <Input
                          minLength={8}
                          onChange={setRecoveryPassword}
                          placeholder={copy("New password")}
                          type="password"
                          value={recoveryPassword}
                        />
                        <button
                          className="w-full rounded-[14px] bg-black px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#222] dark:bg-white dark:text-black dark:hover:bg-[#f1f1f1]"
                          disabled={submitPending || !providers.emailOtp}
                          type="submit"
                        >
                          {submitPending
                            ? copy("Updating...")
                            : copy("Reset password with code")}
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {hasSocialProvider ? (
                <>
                  <div className="my-8 flex items-center">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <div className="px-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                      {copy("OR")}
                    </div>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                  </div>

                  <div className="grid gap-3">
                    {providers.google ? (
                      <button
                        className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-black transition-colors hover:border-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white"
                        disabled={socialPending !== null}
                        onClick={() => handleSocial("google")}
                        type="button"
                      >
                        <GoogleIcon />
                        {socialPending === "google"
                          ? copy("Connecting...")
                          : copy("Continue with Google")}
                      </button>
                    ) : null}

                    {providers.github ? (
                      <button
                        className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-black transition-colors hover:border-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white"
                        disabled={socialPending !== null}
                        onClick={() => handleSocial("github")}
                        type="button"
                      >
                        <GitHubIcon />
                        {socialPending === "github"
                          ? copy("Connecting...")
                          : copy("Continue with GitHub")}
                      </button>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          )}

          <p className="mt-8 text-center text-[12px] leading-6 text-gray-500 dark:text-gray-400">
            {copy("By continuing, you agree to our ")}
            <Link className="underline" to="/policies/privacy">
              {copy("Privacy Policy")}
            </Link>
            {copy(" and ")}
            <Link className="underline" to="/policies">
              {copy("Terms")}
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-black dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-7 text-gray-600 dark:text-gray-300">
        {body}
      </p>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-[14px] px-4 py-3 text-[14px] font-semibold transition-colors",
        active
          ? "bg-white text-black shadow-sm dark:bg-white dark:text-black"
          : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function Input({
  onChange,
  value,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
}) {
  return (
    <input
      className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition-colors placeholder:text-gray-400 focus:border-black dark:border-white/10 dark:bg-[#0f141d] dark:text-white dark:focus:border-white"
      onChange={(event) => onChange(event.target.value)}
      value={value}
      {...props}
    />
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <title>Google</title>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
