import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envFilePath = path.join(root, ".dev.vars");

const secretKeys = [
  "BETTER_AUTH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_ENABLE_ALIPAY",
  "STRIPE_ENABLE_WECHAT_PAY",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_ENV",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
];

function parseEnvFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const values = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");
    values[key] = value;
  }

  return values;
}

const parsed = parseEnvFile(envFilePath);
const secrets = Object.fromEntries(
  secretKeys
    .map((key) => [key, parsed[key] ?? ""])
    .filter(([, value]) => value !== ""),
);

if (Object.keys(secrets).length === 0) {
  throw new Error("No deployable secrets were found in apps/server/.dev.vars");
}

const tempDir = mkdtempSync(path.join(os.tmpdir(), "maple-server-secrets-"));
const jsonPath = path.join(tempDir, "secrets.json");

writeFileSync(jsonPath, `${JSON.stringify(secrets, null, 2)}\n`, "utf8");

try {
  execFileSync("pnpm", ["exec", "wrangler", "secret", "bulk", jsonPath, "--env="], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      ...(parsed.CLOUDFLARE_ACCOUNT_ID
        ? { CLOUDFLARE_ACCOUNT_ID: parsed.CLOUDFLARE_ACCOUNT_ID }
        : {}),
      ...(parsed.CLOUDFLARE_API_TOKEN
        ? { CLOUDFLARE_API_TOKEN: parsed.CLOUDFLARE_API_TOKEN }
        : {}),
    },
  });
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
