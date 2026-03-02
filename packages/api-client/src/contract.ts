import { oc, inferRPCMethodFromContractRouter } from '@orpc/contract'
import { z } from 'zod'

export const appContract = oc.router({
  health: oc
    .route({ method: 'GET', path: '/health' })
    .output(
      z.object({
        status: z.literal('ok'),
        timestamp: z.string(),
      }),
    ),
  hello: oc
    .route({ method: 'POST', path: '/hello' })
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .output(
      z.object({
        message: z.string(),
      }),
    ),
})

export const rpcMethod = inferRPCMethodFromContractRouter(appContract)
