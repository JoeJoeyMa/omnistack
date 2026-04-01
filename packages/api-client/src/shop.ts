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
export type ShopCollection = z.infer<typeof shopCollectionSchema>;
export type ShopProductPlacement = z.infer<typeof shopProductPlacementSchema>;
export type ShopShelf = z.infer<typeof shopShelfSchema>;
export type ShopStorePatch = z.infer<typeof shopStorePatchSchema>;
export type ShopUpsertProductInput = z.infer<typeof shopUpsertProductInputSchema>;
export type StoreCollection = z.infer<typeof storeCollectionSchema>;
export type StoreProfile = z.infer<typeof storeProfileSchema>;
