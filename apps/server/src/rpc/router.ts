import { appContract } from "@maple-global/api-client/contract";
import { implement } from "@orpc/server";
import {
  createShopCheckoutSession,
  finalizeShopCheckout,
  getShopCheckoutConfig,
} from "../shop/checkout";
import { getShopCatalog, upsertShopProduct } from "../shop/service";

export type RpcContext = {
  db: D1Database;
  env: {
    PAYPAL_CLIENT_ID?: string;
    PAYPAL_CLIENT_SECRET?: string;
    PAYPAL_ENV?: string;
    SHOP_ORIGIN?: string;
    STRIPE_ENABLE_ALIPAY?: string;
    STRIPE_ENABLE_WECHAT_PAY?: string;
    STRIPE_SECRET_KEY?: string;
    WEB_ORIGIN: string;
  };
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
  shopCheckoutConfig: rpc.shopCheckoutConfig.handler(({ context }) =>
    getShopCheckoutConfig(context.env),
  ),
  shopCheckoutCreate: rpc.shopCheckoutCreate.handler(({ context, input }) =>
    createShopCheckoutSession(context.db, context.env, input),
  ),
  shopCheckoutFinalize: rpc.shopCheckoutFinalize.handler(({ context, input }) =>
    finalizeShopCheckout(context.db, context.env, input),
  ),
  shopUpsertProduct: rpc.shopUpsertProduct.handler(({ context, input }) =>
    upsertShopProduct(context.db, input),
  ),
});
