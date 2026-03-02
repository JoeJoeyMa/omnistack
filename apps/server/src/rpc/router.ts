import { implement } from '@orpc/server'
import { appContract } from '@omnistack/api-client/contract'

const rpc = implement(appContract)

export const rpcRouter = rpc.router({
  health: rpc.health
    .handler(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),
  hello: rpc.hello
    .handler(({ input }) => ({
      message: `Hello, ${input.name}!`,
    })),
})
