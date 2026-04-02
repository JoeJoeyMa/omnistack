import { useEffect, useState } from "react";
import { getServerUrl } from "./shop-api";

type SessionPayload = {
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
} | null;

export type ShopSessionUser = {
  email: string;
  name: string | null;
};

export function useShopSessionUser() {
  const [user, setUser] = useState<ShopSessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch(
          new URL("/api/auth/get-session", getServerUrl()).toString(),
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (!cancelled) {
            setUser(null);
          }
          return;
        }

        const payload = (await response.json()) as SessionPayload;
        const email = payload?.user?.email?.trim();

        if (!cancelled) {
          setUser(
            email
              ? {
                  email,
                  name: payload?.user?.name?.trim() || null,
                }
              : null,
          );
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user };
}
