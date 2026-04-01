# MAPLE-GLOBAL: The Ultimate Universal Edge-First Template

This template follows the MAPLE-GLOBAL docs architecture and tech stack:

- Frontend: React 19 + TanStack Start + Tailwind CSS + shadcn/ui
- Backend: Hono + Cloudflare Workers
- Database: Cloudflare D1 (SQLite) + Drizzle ORM
- API: oRPC (type-safe RPC)
- Auth: Better Auth (email + OAuth providers)
- Mobile: React Native + Expo
- i18n: use-intl (en/zh/jp)

## Project Structure

```txt
MAPLE-GLOBAL/
  apps/
    web/
    server/
    native/
    config-ui/
  packages/
    i18n/
    api-client/
    storage-config/
```

## Prerequisites

- Node.js 20+
- pnpm 10+

## Quick Start

```bash
pnpm install
pnpm dev
```

Default local ports:

- Web: http://localhost:3000
- Server: http://localhost:3001
- Config UI: http://localhost:3002

## Database

```bash
pnpm db:generate
pnpm db:push
```

Local and dev environment files:

- `apps/server/.dev.vars.local`: local worker secrets and localhost URLs
- `apps/server/.dev.vars`: deployed Cloudflare dev worker secrets and URLs
- `apps/web/.env.local`: local frontend hitting `http://localhost:3001`
- `apps/web/.env.dev`: local frontend hitting `https://maple-global-server.joejoey.workers.dev`

Useful commands:

```bash
pnpm --filter @maple-global/server dev:local
pnpm --filter @maple-global/server dev:dev
pnpm --filter @maple-global/web dev:local
pnpm --filter @maple-global/web dev:dev
pnpm db:push
pnpm db:push:dev
```

## Notes

- oRPC, Better Auth, and D1 are wired as starter scaffolding.
- `pnpm db:push` applies migrations to the local Wrangler/Miniflare D1 only.
- `pnpm db:push:dev` applies migrations to the Cloudflare dev D1 configured in `apps/server/wrangler.jsonc`.
- Add provider keys and secrets in `apps/server/.dev.vars.local`, `apps/server/.dev.vars`, `apps/web/.env.local`, and `apps/web/.env.dev`.
