import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { getWebAuthBaseUrl } from "./runtime-urls";

export const authClient = createAuthClient({
  baseURL: getWebAuthBaseUrl(),
  plugins: [emailOTPClient()],
});
