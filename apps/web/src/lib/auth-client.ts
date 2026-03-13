import { createAuthClient } from "better-auth/client";

const baseURL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL,
});
