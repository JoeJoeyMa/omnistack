import { inferRPCMethodFromContractRouter, oc } from "@orpc/contract";
import { z } from "zod";
import {
  shopAccountAddressDeleteInputSchema,
  shopAccountAddressSchema,
  shopAccountAddressInputSchema,
  shopAccountProfileInputSchema,
  shopAccountProfileSchema,
  shopAccountSchema,
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
  shopAccountGet: oc
    .route({ method: "GET", path: "/shop/account" })
    .output(shopAccountSchema),
  shopAccountUpdateProfile: oc
    .route({ method: "POST", path: "/shop/account/profile" })
    .input(shopAccountProfileInputSchema)
    .output(shopAccountProfileSchema),
  shopAccountUpsertAddress: oc
    .route({ method: "POST", path: "/shop/account/address" })
    .input(shopAccountAddressInputSchema)
    .output(shopAccountAddressSchema),
  shopAccountDeleteAddress: oc
    .route({ method: "POST", path: "/shop/account/address/delete" })
    .input(shopAccountAddressDeleteInputSchema)
    .output(
      z.object({
        success: z.literal(true),
      }),
    ),
  shopCheckoutFinalize: oc
    .route({ method: "POST", path: "/shop/checkout/finalize" })
    .input(shopCheckoutFinalizeInputSchema)
    .output(shopCheckoutFinalizeSchema),
});

export const rpcMethod = inferRPCMethodFromContractRouter(appContract);
