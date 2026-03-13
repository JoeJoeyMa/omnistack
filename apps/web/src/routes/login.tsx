import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { cn } from "~/components/ui/button";

type AuthMode = "signin" | "signup";
type SocialProvider = "google" | "github";
type ProviderState = {
  email: boolean;
  google: boolean;
  github: boolean;
};

const serverUrl = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3001";

const initialProviders: ProviderState = {
  email: true,
  google: false,
  github: false,
};

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login | MAPLE-GLOBAL" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [providers, setProviders] = useState<ProviderState>(initialProviders);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<SocialProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      try {
        const response = await fetch(new URL("/auth/providers", serverUrl), {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Partial<ProviderState>;

        if (!cancelled) {
          setProviders({
            email: data.email ?? true,
            google: data.google ?? false,
            github: data.github ?? false,
          });
        }
      } catch {
        if (!cancelled) {
          setProviders(initialProviders);
        }
      }
    }

    loadProviders();

    return () => {
      cancelled = true;
    };
  }, []);

  async function postAuth(path: string, body: Record<string, unknown>) {
    const response = await fetch(new URL(path, serverUrl), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as Record<string, unknown>) : null;

    if (!response.ok) {
      throw new Error(
        typeof data?.message === "string"
          ? data.message
          : "Unable to complete authentication.",
      );
    }

    return data;
  }

  async function handleSocial(provider: SocialProvider) {
    setSocialPending(provider);
    setError(null);
    setSuccess(null);

    try {
      const data = await postAuth("/api/auth/sign-in/social", {
        provider,
        callbackURL: window.location.origin,
      });

      if (typeof data?.url === "string") {
        window.location.href = data.url;
        return;
      }

      window.location.href = window.location.origin;
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to start social sign in.",
      );
    } finally {
      setSocialPending(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const data =
        mode === "signin"
          ? await postAuth("/api/auth/sign-in/email", {
              email,
              password,
              callbackURL: window.location.origin,
              rememberMe: true,
            })
          : await postAuth("/api/auth/sign-up/email", {
              name,
              email,
              password,
              callbackURL: window.location.origin,
              rememberMe: true,
            });

      setSuccess(
        mode === "signin"
          ? "Signed in successfully. Redirecting..."
          : "Account created successfully. Redirecting...",
      );

      window.setTimeout(() => {
        if (typeof data?.url === "string") {
          window.location.href = data.url;
          return;
        }

        window.location.href = window.location.origin;
      }, 650);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to complete authentication.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[400px] px-6 sm:px-0 bg-white">
        <h1 className="mt-8 text-[32px] font-medium text-black text-center mb-6">
          {mode === "signin" ? "Welcome back" : "Create an account"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="block">
              <input
                className="w-full border border-gray-300 rounded-[8px] bg-white text-black px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                onChange={(event) => setName(event.target.value)}
                placeholder="Full Name"
                type="text"
                value={name}
              />
            </label>
          ) : null}

          <label className="block">
            <input
              className="w-full border border-gray-300 rounded-[8px] bg-white text-black px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <input
              className="w-full border border-gray-300 rounded-[8px] bg-white text-black px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <div className="rounded-[8px] bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-[8px] bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <button
            className={cn(
              "w-full bg-[#10a37f] text-white rounded-[8px] px-4 py-3 text-[16px] font-medium hover:bg-[#1a7f64] transition-colors mt-2"
            )}
            disabled={pending || !providers.email}
            type="submit"
          >
            {pending
              ? "Please wait..."
              : "Continue"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center text-[14px]">
          <span className="text-gray-600">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            className="text-[#10a37f] hover:underline mt-1"
            onClick={() =>
              setMode((current) =>
                current === "signin" ? "signup" : "signin",
              )
            }
            type="button"
          >
            {mode === "signin" ? "Sign up" : "Log in"}
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="px-3 text-sm text-gray-500 bg-white">OR</div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="grid gap-3">
          <button
            className="w-full border border-gray-300 rounded-[8px] bg-white text-black px-4 py-3 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            disabled={!providers.google || socialPending !== null}
            onClick={() => handleSocial("google")}
            type="button"
          >
            {socialPending === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </button>
          
          <button
            className="w-full border border-gray-300 rounded-[8px] bg-white text-black px-4 py-3 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            disabled={!providers.github || socialPending !== null}
            onClick={() => handleSocial("github")}
            type="button"
          >
            {socialPending === "github"
              ? "Connecting..."
              : "Continue with GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}
