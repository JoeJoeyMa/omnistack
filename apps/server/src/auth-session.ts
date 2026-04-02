import { createAuth } from "./auth";
import { getRequestOrigin } from "./origin";
import type { Env } from "./index";

type AuthSessionPayload = {
  user?: {
    email?: string | null;
    emailVerified?: boolean | null;
    id?: string | null;
    name?: string | null;
  } | null;
} | null;

export type AuthSessionUser = {
  email: string;
  emailVerified: boolean;
  id: string;
  name: string | null;
};

export async function getRequestAuthUser(
  bindings: Env["Bindings"],
  request: Request,
) {
  const auth = createAuth(bindings, getRequestOrigin(request));
  const sessionUrl = new URL("/api/auth/get-session", request.url);
  const response = await auth.handler(
    new Request(sessionUrl.toString(), {
      headers: request.headers,
      method: "GET",
    }),
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json().catch(() => null)) as AuthSessionPayload;
  const id = payload?.user?.id?.trim();
  const email = payload?.user?.email?.trim().toLowerCase();

  if (!id || !email) {
    return null;
  }

  return {
    email,
    emailVerified: Boolean(payload?.user?.emailVerified),
    id,
    name: payload?.user?.name?.trim() || null,
  } satisfies AuthSessionUser;
}
