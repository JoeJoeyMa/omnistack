import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const i18nEntry = fileURLToPath(
  new URL("../../packages/i18n/src/index.ts", import.meta.url),
);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const serverTarget = env.VITE_SERVER_URL ?? "http://127.0.0.1:3001";
  const apiProxy = {
    changeOrigin: true,
    secure: false,
    target: serverTarget,
  };

  return {
    resolve: {
      alias: {
        "@maple-global/i18n": path.resolve(i18nEntry),
      },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tanstackStart(),
      viteReact(),
    ],
    server: {
      proxy: {
        "/api": apiProxy,
        "/auth": apiProxy,
        "/health": apiProxy,
        "/rpc": apiProxy,
        "/verify-email": apiProxy,
      },
    },
  };
});
