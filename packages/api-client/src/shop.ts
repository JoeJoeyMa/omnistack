import { z } from "zod";

export const shopCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  brand: z.string().optional(),
  price: z.string(),
  compareAt: z.string().optional(),
  reviews: z.string().optional(),
  rating: z.number().optional(),
  image: z.string(),
  href: z.string(),
  badge: z.string().optional(),
});

export const shopShelfSchema = z.object({
  title: z.string(),
  items: z.array(shopCardSchema),
});

export const homeFloatingBrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  background: z.string(),
  logo: z.string(),
  className: z.string(),
});

export const homeFloatingProductSchema = shopCardSchema.extend({
  className: z.string(),
});

export const shopCollectionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string(),
});

export const browseCategorySchema = z.object({
  title: z.string(),
  image: z.string(),
});

export const productReviewSchema = z.object({
  author: z.string(),
  body: z.string(),
  rating: z.number(),
  title: z.string(),
});

export const productMerchantSchema = z.object({
  badge: z.string().optional(),
  image: z.string(),
  name: z.string(),
  rating: z.string(),
  reviews: z.string(),
  slug: z.string(),
});

export const productPurchaseModeSchema = z.object({
  compareAt: z.string().optional(),
  id: z.string(),
  label: z.string(),
  note: z.string().optional(),
  price: z.string(),
});

export const shopFulfillmentTypeSchema = z.enum(["service", "shipping"]);
export const shopCheckoutDeliveryModeSchema = z.enum([
  "service",
  "shipping_standard",
  "shipping_priority",
]);
export const shopCheckoutProviderSchema = z.enum([
  "stripe",
  "paypal",
  "alipay",
  "wechat_pay",
]);
export const shopCheckoutProviderStatusSchema = z.enum([
  "enabled",
  "requires_keys",
  "coming_soon",
]);
export const shopCheckoutStatusSchema = z.enum([
  "draft",
  "pending",
  "requires_action",
  "paid",
  "cancelled",
  "failed",
]);

export const productColorSchema = z.object({
  image: z.string().optional(),
  label: z.string(),
  swatch: z.string(),
});

export const productBundleSchema = z.object({
  compareAt: z.string().optional(),
  href: z.string(),
  image: z.string(),
  price: z.string(),
  title: z.string(),
});

export const productDetailSchema = z.object({
  brand: z.string(),
  bundle: productBundleSchema.optional(),
  boughtText: z.string().optional(),
  colors: z.array(productColorSchema).optional(),
  description: z.string(),
  fulfillmentType: shopFulfillmentTypeSchema.optional(),
  gallery: z.array(z.string()),
  image: z.string(),
  lowStockText: z.string().optional(),
  merchant: productMerchantSchema,
  policies: z.array(z.string()),
  price: z.string(),
  productId: z.string(),
  purchaseModes: z.array(productPurchaseModeSchema).optional(),
  rating: z.number().optional(),
  recommendations: z.array(shopCardSchema),
  relatedMerchants: z.array(productMerchantSchema).optional(),
  reviews: z.array(productReviewSchema).optional(),
  reviewsCount: z.string().optional(),
  shippingNote: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  slug: z.string(),
  title: z.string(),
});

export const categoryStoreShowcaseSchema = z.object({
  href: z.string(),
  image: z.string(),
  itemCount: z.number(),
  productTitle: z.string(),
  rating: z.string(),
  storeHref: z.string(),
  storeLabel: z.string(),
  storeName: z.string(),
});

export const categoryDetailSchema = z.object({
  categoryId: z.string(),
  parentLabel: z.string(),
  sections: z.array(
    z.object({
      items: z.array(categoryStoreShowcaseSchema),
      title: z.string(),
    }),
  ),
  slug: z.string(),
  subcategories: z.array(
    z.object({
      href: z.string(),
      image: z.string().optional(),
      label: z.string(),
    }),
  ),
  title: z.string(),
});

export const storeCollectionSchema = z.object({
  title: z.string(),
  image: z.string(),
});

export const storeProfileSchema = z.object({
  collections: z.array(storeCollectionSchema),
  heroImage: z.string(),
  logoImage: z.string().optional(),
  name: z.string(),
  products: z.array(shopCardSchema),
  rating: z.string(),
  reviews: z.string(),
  slug: z.string(),
});

export const shopCatalogSchema = z.object({
  updatedAt: z.string(),
  searchSuggestions: z.array(z.string()),
  home: z.object({
    floatingBrands: z.array(homeFloatingBrandSchema),
    floatingProducts: z.array(homeFloatingProductSchema),
  }),
  categoryLanding: z.object({
    topCategoryLinks: z.array(z.string()),
    featuredCollections: z.array(shopCollectionSchema),
    browseCategories: z.array(browseCategorySchema),
    shelves: z.array(shopShelfSchema),
  }),
  categories: z.array(categoryDetailSchema),
  products: z.array(productDetailSchema),
  stores: z.array(storeProfileSchema),
  cartRecommendations: z.array(shopCardSchema),
  policyCopy: z.record(z.string(), z.string()),
});

export const shopStorePatchSchema = z.object({
  slug: z.string(),
  name: z.string().optional(),
  heroImage: z.string().optional(),
  logoImage: z.string().optional(),
  rating: z.string().optional(),
  reviews: z.string().optional(),
  collections: z.array(storeCollectionSchema).optional(),
});

export const shopProductPlacementSchema = z.object({
  cartRecommendation: z.boolean().optional(),
  homeFloatingClassName: z.string().optional(),
  shelfTitles: z.array(z.string()).optional(),
  storeSlug: z.string().optional(),
});

export const shopUpsertProductInputSchema = z.object({
  product: productDetailSchema,
  placement: shopProductPlacementSchema.optional(),
  store: shopStorePatchSchema.optional(),
});

export const shopCheckoutLineItemSchema = z.object({
  brand: z.string(),
  compareAt: z.string().optional(),
  fulfillmentType: shopFulfillmentTypeSchema,
  image: z.string(),
  merchantName: z.string(),
  merchantSlug: z.string(),
  price: z.string(),
  productId: z.string(),
  purchaseModeLabel: z.string().optional(),
  quantity: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  variantLabel: z.string().optional(),
});

export const shopCheckoutCustomerSchema = z.object({
  companyName: z.string().optional(),
  country: z.string().min(2),
  email: z.email(),
  fullName: z.string().min(1),
  phone: z.string().min(3),
});

export const shopCheckoutShippingAddressSchema = z.object({
  city: z.string().min(1),
  country: z.string().min(2),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postalCode: z.string().min(1),
  recipient: z.string().min(1),
  stateProvince: z.string().optional(),
});

export const shopCheckoutServiceDetailsSchema = z.object({
  businessType: z.string().optional(),
  fulfillmentNotes: z.string().optional(),
  projectName: z.string().optional(),
});

export const shopCheckoutAmountSummarySchema = z.object({
  currencyCode: z.string().length(3),
  shippingMinor: z.number().int().nonnegative(),
  subtotalMinor: z.number().int().nonnegative(),
  totalMinor: z.number().int().nonnegative(),
});

export const shopCheckoutProviderConfigSchema = z.object({
  checkoutMode: z.enum(["hosted", "redirect"]),
  description: z.string(),
  label: z.string(),
  provider: shopCheckoutProviderSchema,
  reason: z.string().optional(),
  status: shopCheckoutProviderStatusSchema,
});

export const shopCheckoutConfigSchema = z.object({
  providers: z.array(shopCheckoutProviderConfigSchema),
  supportsMixedCurrencies: z.boolean(),
});

export const shopCheckoutCreateInputSchema = z.object({
  customer: shopCheckoutCustomerSchema,
  deliveryMode: shopCheckoutDeliveryModeSchema,
  lineItems: z.array(shopCheckoutLineItemSchema).min(1),
  provider: shopCheckoutProviderSchema,
  returnOrigin: z.url(),
  serviceDetails: shopCheckoutServiceDetailsSchema.optional(),
  shippingAddress: shopCheckoutShippingAddressSchema.optional(),
});

export const shopCheckoutSessionSchema = z.object({
  checkoutId: z.string(),
  externalId: z.string().optional(),
  provider: shopCheckoutProviderSchema,
  redirectUrl: z.url(),
  status: z.enum(["pending", "requires_action"]),
  summary: shopCheckoutAmountSummarySchema,
});

export const shopCheckoutFinalizeInputSchema = z.object({
  checkoutId: z.string(),
  externalId: z.string().optional(),
  provider: shopCheckoutProviderSchema,
});

export const shopCheckoutFinalizeSchema = z.object({
  checkoutId: z.string(),
  externalId: z.string().optional(),
  lineItems: z.array(shopCheckoutLineItemSchema),
  message: z.string(),
  provider: shopCheckoutProviderSchema,
  reference: z.string(),
  receiptUrl: z.url().optional(),
  status: shopCheckoutStatusSchema,
  summary: shopCheckoutAmountSummarySchema,
});

export const shopAccountProfileSchema = z.object({
  companyName: z.string().optional(),
  country: z.string().min(2).optional(),
  email: z.email(),
  emailVerified: z.boolean(),
  fullName: z.string().min(1),
  phone: z.string().min(3).optional(),
});

export const shopAccountProfileInputSchema = z.object({
  companyName: z.string().optional(),
  country: z.string().min(2).optional(),
  fullName: z.string().min(1),
  phone: z.string().min(3).optional(),
});

export const shopAccountAddressSchema = z.object({
  city: z.string().min(1),
  country: z.string().min(2),
  createdAt: z.string(),
  id: z.string(),
  isDefault: z.boolean(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postalCode: z.string().min(1),
  recipient: z.string().min(1),
  stateProvince: z.string().optional(),
  updatedAt: z.string(),
});

export const shopAccountAddressInputSchema = z.object({
  city: z.string().min(1),
  country: z.string().min(2),
  id: z.string().optional(),
  isDefault: z.boolean().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postalCode: z.string().min(1),
  recipient: z.string().min(1),
  stateProvince: z.string().optional(),
});

export const shopAccountAddressDeleteInputSchema = z.object({
  id: z.string().min(1),
});

export const shopAccountOrderSchema = z.object({
  checkoutId: z.string(),
  createdAt: z.string(),
  customer: shopCheckoutCustomerSchema,
  lineItems: z.array(shopCheckoutLineItemSchema),
  provider: shopCheckoutProviderSchema,
  receiptUrl: z.url().optional(),
  reference: z.string(),
  shippingAddress: shopCheckoutShippingAddressSchema.optional(),
  status: shopCheckoutStatusSchema,
  summary: shopCheckoutAmountSummarySchema,
});

export const shopAccountSchema = z.object({
  addresses: z.array(shopAccountAddressSchema),
  profile: shopAccountProfileSchema,
  recentOrders: z.array(shopAccountOrderSchema),
});

export type BrowseCategory = z.infer<typeof browseCategorySchema>;
export type CategoryDetailRecord = z.infer<typeof categoryDetailSchema>;
export type CategoryStoreShowcase = z.infer<typeof categoryStoreShowcaseSchema>;
export type HomeFloatingBrand = z.infer<typeof homeFloatingBrandSchema>;
export type HomeFloatingProduct = z.infer<typeof homeFloatingProductSchema>;
export type ProductBundle = z.infer<typeof productBundleSchema>;
export type ProductColor = z.infer<typeof productColorSchema>;
export type ProductDetailRecord = z.infer<typeof productDetailSchema>;
export type ProductMerchant = z.infer<typeof productMerchantSchema>;
export type ProductPurchaseMode = z.infer<typeof productPurchaseModeSchema>;
export type ProductReview = z.infer<typeof productReviewSchema>;
export type ShopCard = z.infer<typeof shopCardSchema>;
export type ShopCatalogPayload = z.infer<typeof shopCatalogSchema>;
export type ShopCheckoutAmountSummary = z.infer<
  typeof shopCheckoutAmountSummarySchema
>;
export type ShopAccount = z.infer<typeof shopAccountSchema>;
export type ShopAccountAddress = z.infer<typeof shopAccountAddressSchema>;
export type ShopAccountAddressDeleteInput = z.infer<
  typeof shopAccountAddressDeleteInputSchema
>;
export type ShopAccountAddressInput = z.infer<
  typeof shopAccountAddressInputSchema
>;
export type ShopAccountOrder = z.infer<typeof shopAccountOrderSchema>;
export type ShopAccountProfile = z.infer<typeof shopAccountProfileSchema>;
export type ShopAccountProfileInput = z.infer<
  typeof shopAccountProfileInputSchema
>;
export type ShopCheckoutConfig = z.infer<typeof shopCheckoutConfigSchema>;
export type ShopCheckoutCreateInput = z.infer<
  typeof shopCheckoutCreateInputSchema
>;
export type ShopCheckoutCustomer = z.infer<typeof shopCheckoutCustomerSchema>;
export type ShopCheckoutDeliveryMode = z.infer<
  typeof shopCheckoutDeliveryModeSchema
>;
export type ShopCheckoutFinalizeInput = z.infer<
  typeof shopCheckoutFinalizeInputSchema
>;
export type ShopCheckoutFinalizeResult = z.infer<
  typeof shopCheckoutFinalizeSchema
>;
export type ShopCheckoutLineItem = z.infer<typeof shopCheckoutLineItemSchema>;
export type ShopCheckoutProvider = z.infer<typeof shopCheckoutProviderSchema>;
export type ShopCheckoutProviderConfig = z.infer<
  typeof shopCheckoutProviderConfigSchema
>;
export type ShopCheckoutProviderStatus = z.infer<
  typeof shopCheckoutProviderStatusSchema
>;
export type ShopCheckoutServiceDetails = z.infer<
  typeof shopCheckoutServiceDetailsSchema
>;
export type ShopCheckoutSession = z.infer<typeof shopCheckoutSessionSchema>;
export type ShopCheckoutShippingAddress = z.infer<
  typeof shopCheckoutShippingAddressSchema
>;
export type ShopCheckoutStatus = z.infer<typeof shopCheckoutStatusSchema>;
export type ShopCollection = z.infer<typeof shopCollectionSchema>;
export type ShopFulfillmentType = z.infer<typeof shopFulfillmentTypeSchema>;
export type ShopProductPlacement = z.infer<typeof shopProductPlacementSchema>;
export type ShopShelf = z.infer<typeof shopShelfSchema>;
export type ShopStorePatch = z.infer<typeof shopStorePatchSchema>;
export type ShopUpsertProductInput = z.infer<typeof shopUpsertProductInputSchema>;
export type StoreCollection = z.infer<typeof storeCollectionSchema>;
export type StoreProfile = z.infer<typeof storeProfileSchema>;
