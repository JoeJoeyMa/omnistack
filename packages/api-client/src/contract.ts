import { inferRPCMethodFromContractRouter, oc } from "@orpc/contract";
import { z } from "zod";
import {
  shopCheckoutConfigSchema,
  shopCheckoutCreateInputSchema,
  shopCheckoutFinalizeInputSchema,
  shopCheckoutFinalizeSchema,
  shopCheckoutSessionSchema,
  shopCatalogSchema,
  shopUpsertProductInputSchema,
} from "./shop";

export const appContract = oc.router({
  health: oc.route({ method: "GET", path: "/health" }).output(
    z.object({
      status: z.literal("ok"),
      timestamp: z.string(),
    }),
  ),
  hello: oc
    .route({ method: "POST", path: "/hello" })
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
  shopCatalog: oc
    .route({ method: "GET", path: "/shop/catalog" })
    .output(shopCatalogSchema),
  shopUpsertProduct: oc
    .route({ method: "POST", path: "/shop/products" })
    .input(shopUpsertProductInputSchema)
    .output(shopCatalogSchema),
  shopCheckoutConfig: oc
    .route({ method: "GET", path: "/shop/checkout/config" })
    .output(shopCheckoutConfigSchema),
  shopCheckoutCreate: oc
    .route({ method: "POST", path: "/shop/checkout/create" })
    .input(shopCheckoutCreateInputSchema)
    .output(shopCheckoutSessionSchema),
  shopCheckoutFinalize: oc
    .route({ method: "POST", path: "/shop/checkout/finalize" })
    .input(shopCheckoutFinalizeInputSchema)
    .output(shopCheckoutFinalizeSchema),
});

export const rpcMethod = inferRPCMethodFromContractRouter(appContract);
