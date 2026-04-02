import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = import.meta.dirname;
const envFilePath = path.join(root, "..", "apps", "server", ".dev.vars");
const webEnvFilePath = path.join(root, "..", "apps", "web", ".env.dev");
const shopEnvFilePath = path.join(root, "..", "apps", "shop", ".env.dev");

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

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
const webEnv = parseEnvFile(webEnvFilePath);
const shopEnv = parseEnvFile(shopEnvFilePath);

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
  {
    command: "pnpm",
    args: ["--filter", "@maple-global/server", "run", "secrets:sync"],
    env,
  },
  {
    command: "pnpm",
    args: ["--filter", "@maple-global/server", "run", "db:push:dev"],
    env,
  },
  {
    command: "pnpm",
    args: ["--filter", "@maple-global/server", "run", "deploy"],
    env,
  },
  {
    command: "pnpm",
    args: ["--filter", "@maple-global/web", "run", "deploy"],
    env: { ...env, ...webEnv },
  },
  {
    command: "pnpm",
    args: ["--filter", "@maple-global/shop", "run", "deploy"],
    env: { ...env, ...shopEnv },
  },
];

for (const step of steps) {
  execFileSync(step.command, step.args, {
    cwd: path.join(root, ".."),
    env: step.env,
    stdio: "inherit",
  });
}
