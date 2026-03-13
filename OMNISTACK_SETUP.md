# MAPLE-GLOBAL ģ��ʹ���ĵ�������� 1/2/3��

> Ŀ¼��`D:\project\personal\MAPLE-GLOBAL`
> ���� MAPLE-GLOBAL �ĵ��ṹ��`apps/*` + `packages/*`����ɡ�

## 1. ������װ������������ɣ�

��ִ�У�

- `pnpm install`
- `pnpm check-types`
- `pnpm build`
- `pnpm db:push`������ D1��

�ճ��������

```bash
pnpm dev
```

��Ӧ��������

```bash
pnpm dev:web
pnpm dev:server
pnpm dev:config
pnpm dev:native
```

Ĭ�϶˿ڣ�

- Web: `http://localhost:3000`
- Server: `http://localhost:3001`
- Config UI: `http://localhost:3002`

## 2. Better Auth + D1/Drizzle���ѽ��룩

### ���������

- ����ѽ��� Better Auth��`apps/server/src/auth.ts`
- Hono �ѹ�����֤·�ɣ�`/api/auth/*`
- Drizzle + D1 ���ݱ��Ѿ�����`user` / `session` / `account` / `verification`
- ��ʼǨ�ƣ�`apps/server/migrations/0000_initial_auth.sql`
- OAuth��GitHub/Google���������¼������Ԥ��

### �ؼ��ļ�

- `apps/server/src/auth.ts`
- `apps/server/src/index.ts`
- `apps/server/src/db/schema.ts`
- `apps/server/migrations/0000_initial_auth.sql`
- `apps/server/.dev.vars.example`
- `apps/server/wrangler.jsonc`

### ���ػ�������

���Ʋ���д��

```bash
cp apps/server/.dev.vars.example apps/server/.dev.vars
```

��Ҫ�ֶΣ�

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL=http://localhost:3001`
- `WEB_ORIGIN=http://localhost:3000`

��ѡ OAuth �ֶΣ�

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 3. oRPC �˵������Ͱ�ȫ������ɣ�

### ���������

- ���� contract �ѷ��ڰ��ڣ�`packages/api-client/src/contract.ts`
- Web ͨ�� contract �Ƶ��ͻ������ͣ�`createApiClient`
- Server ʹ��ͬһ contract ʵ��·�ɣ�`implement(contract)`��

### �ؼ��ļ�

- `packages/api-client/src/contract.ts`
- `packages/api-client/src/index.ts`
- `apps/server/src/rpc/router.ts`
- `apps/web/src/routes/index.tsx`

## ��ǰ�ṹ�����ĵ��ܹ�һ�£�

```txt
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

## �������ĺ��İ汾������ģ�壩

- React `19.2.4`
- TanStack Start `1.164.0`
- TanStack Router `1.163.3`
- TailwindCSS `4.2.1`
- Hono `4.12.3`
- Wrangler `4.69.0`
- Drizzle ORM `0.45.1`
- Drizzle Kit `0.31.9`
- Better Auth `1.5.0`
- oRPC (`@orpc/*`) `1.13.5`
- Expo `55.0.4`
- Expo Router `55.0.3`
- React Native `0.84.1`

## ��������

```bash
pnpm check-types
pnpm build
pnpm db:push
```

�����ͨ����˵��ģ�����ɿ����С�