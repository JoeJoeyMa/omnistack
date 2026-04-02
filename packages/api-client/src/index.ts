import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import { type appContract, rpcMethod } from "./contract";

export { appContract } from "./contract";
export * from "./shop";
export type AppApiClient = ContractRouterClient<typeof appContract>;

export function createApiClient(baseUrl: string) {
  return createORPCClient<AppApiClient>(
    new RPCLink({
      fetch(request, init) {
        return fetch(request, {
          ...init,
          credentials: "include",
        });
      },
      url: `${baseUrl}/rpc`,
      method: rpcMethod,
    }),
  );
}
