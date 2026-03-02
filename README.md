# OmniStack: The Ultimate Universal Edge-First Template

This template follows the OmniStack docs architecture and tech stack:

- Frontend: React 19 + TanStack Start + Tailwind CSS + shadcn/ui
- Backend: Hono + Cloudflare Workers
- Database: Cloudflare D1 (SQLite) + Drizzle ORM
- API: oRPC (type-safe RPC)
- Auth: Better Auth (email + OAuth providers)
- Mobile: React Native + Expo
- i18n: use-intl (en/zh/jp)

## Project Structure

```txt
omnistack/
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

## Notes

- oRPC, Better Auth, and D1 are wired as starter scaffolding.
- Add your provider keys and secrets in `apps/server/.dev.vars` and `apps/web/.env.local`.