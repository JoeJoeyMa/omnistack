import { spawn } from "node:child_process";
import path from "node:path";

const mode = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (mode !== "local" && mode !== "dev") {
  console.error("Usage: node ./scripts/run-dev-all.mjs <local|dev> [--dry-run]");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const scriptName = mode === "local" ? "dev:local" : "dev:dev";
const targets = [
  { name: "server", cwd: path.join(root, "apps", "server") },
  { name: "web", cwd: path.join(root, "apps", "web") },
  { name: "shop", cwd: path.join(root, "apps", "shop") },
];

if (dryRun) {
  for (const target of targets) {
    console.log(`[${target.name}] ${pnpmCommand} run ${scriptName} (cwd=${target.cwd})`);
  }
  process.exit(0);
}

const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 200);
}

for (const target of targets) {
  const child = spawn(pnpmCommand, ["run", scriptName], {
    cwd: target.cwd,
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (signal) {
      console.error(`[${target.name}] stopped with signal ${signal}`);
      shutdown(1);
      return;
    }

    if (code && code !== 0) {
      console.error(`[${target.name}] exited with code ${code}`);
      shutdown(code);
    }
  });

  child.on("error", (error) => {
    console.error(`[${target.name}] failed to start`, error);
    shutdown(1);
  });

  children.push(child);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
