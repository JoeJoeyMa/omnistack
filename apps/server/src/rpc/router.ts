import { appContract } from "@maple-global/api-client/contract";
import { implement } from "@orpc/server";
import { getShopCatalog, upsertShopProduct } from "../shop/service";

export type RpcContext = {
  db: D1Database;
};

const rpc = implement(appContract).$context<RpcContext>();

export const rpcRouter = rpc.router({
  health: rpc.health.handler(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),
  hello: rpc.hello.handler(({ input }) => ({
    message: `Hello, ${input.name}!`,
  })),
  shopCatalog: rpc.shopCatalog.handler(({ context }) => getShopCatalog(context.db)),
  shopUpsertProduct: rpc.shopUpsertProduct.handler(({ context, input }) =>
    upsertShopProduct(context.db, input),
  ),
});
