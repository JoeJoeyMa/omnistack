import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = import.meta.dirname;
const envFilePath = path.join(root, "..", "apps", "server", ".dev.vars");

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

const env = {
  ...process.env,
  ...(parsed.CLOUDFLARE_ACCOUNT_ID
    ? { CLOUDFLARE_ACCOUNT_ID: parsed.CLOUDFLARE_ACCOUNT_ID }
    : {}),
  ...(parsed.CLOUDFLARE_API_TOKEN
    ? { CLOUDFLARE_API_TOKEN: parsed.CLOUDFLARE_API_TOKEN }
    : {}),
};

const steps = [
  ["pnpm", ["--filter", "@maple-global/server", "run", "secrets:sync"]],
  ["pnpm", ["--filter", "@maple-global/server", "run", "db:push:dev"]],
  ["pnpm", ["--filter", "@maple-global/server", "run", "deploy"]],
  ["pnpm", ["--filter", "@maple-global/web", "run", "deploy"]],
];

for (const [command, args] of steps) {
  execFileSync(command, args, {
    cwd: path.join(root, ".."),
    env,
    stdio: "inherit",
  });
}
