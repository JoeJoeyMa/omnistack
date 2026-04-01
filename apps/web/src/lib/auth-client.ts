import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const serverURL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: `${serverURL}/api/auth`,
  plugins: [emailOTPClient()],
});
