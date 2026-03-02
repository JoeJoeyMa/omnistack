import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { RPCHandler } from '@orpc/server/fetch'
import { rpcRouter } from './rpc/router'
import { getDb } from './db/client'
import { createAuth } from './auth'

export type Env = {
  Bindings: {
    DB: D1Database
    WEB_ORIGIN: string
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
  }
}

const app = new Hono<Env>()
const rpcHandler = new RPCHandler(rpcRouter)

app.use(
  '*',
  cors({
    origin: (origin, c) => origin ?? c.env.WEB_ORIGIN,
    credentials: true,
  }),
)

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

app.get('/health', (c) => {
  const db = getDb(c.env.DB)

  return c.json({
    status: 'ok',
    runtime: 'cloudflare-workers',
    dbConnected: Boolean(db),
    at: new Date().toISOString(),
  })
})

app.all('/rpc/*', async (c) => {
  const result = await rpcHandler.handle(c.req.raw, {
    prefix: '/rpc',
    context: {},
  })

  if (!result.matched) {
    return c.notFound()
  }

  return result.response
})

app.get('/auth/providers', (c) => {
  const auth = createAuth(c.env)
  return c.json({
    email: true,
    github: Boolean(c.env.GITHUB_CLIENT_ID),
    google: Boolean(c.env.GOOGLE_CLIENT_ID),
    authApiAvailable: Boolean(auth.api),
  })
})

export default {
  fetch: app.fetch,
}
