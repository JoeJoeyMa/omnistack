import type {
  ProductDetailRecord,
  ShopCard,
  ShopCatalogPayload,
  ShopUpsertProductInput,
  StoreCollection,
  StoreProfile,
} from "@maple-global/api-client/shop";
import { ensureShopCatalog, writeShopCatalog } from "./repository";

function cloneCatalog(catalog: ShopCatalogPayload) {
  return JSON.parse(JSON.stringify(catalog)) as ShopCatalogPayload;
}

function productToCard(product: ProductDetailRecord): ShopCard {
  return {
    id: product.productId,
    title: product.title,
    brand: product.brand,
    price: product.price,
    compareAt: product.purchaseModes?.[0]?.compareAt,
    reviews: product.reviewsCount,
    rating: product.rating,
    image: product.image,
    href: `/products/${product.productId}/${product.slug}`,
  };
}

function upsertCard(cards: ShopCard[], nextCard: ShopCard) {
  return [
    nextCard,
    ...cards.filter(
      (card) => card.id !== nextCard.id && card.href !== nextCard.href,
    ),
  ];
}

function fallbackCollections(product: ProductDetailRecord): StoreCollection[] {
  return [
    { title: "Featured", image: product.image },
    { title: "Best sellers", image: product.gallery[0] ?? product.image },
    { title: "New arrivals", image: product.gallery[1] ?? product.image },
    { title: "Daily picks", image: product.gallery[2] ?? product.image },
  ];
}

function upsertStore(
  stores: StoreProfile[],
  input: ShopUpsertProductInput,
  nextCard: ShopCard,
) {
  const slug =
    input.placement?.storeSlug ?? input.store?.slug ?? input.product.merchant.slug;

  if (!slug) {
    return stores;
  }

  const current = stores.find((store) => store.slug === slug);
  const nextStore: StoreProfile = {
    slug,
    name: input.store?.name ?? current?.name ?? input.product.merchant.name,
    heroImage:
      input.store?.heroImage ?? current?.heroImage ?? input.product.merchant.image,
    logoImage: input.store?.logoImage ?? current?.logoImage,
    rating: input.store?.rating ?? current?.rating ?? input.product.merchant.rating,
    reviews:
      input.store?.reviews ?? current?.reviews ?? input.product.merchant.reviews,
    collections:
      input.store?.collections ??
      current?.collections ??
      fallbackCollections(input.product),
    products: upsertCard(current?.products ?? [], nextCard),
  };

  return [
    nextStore,
    ...stores.filter((store) => store.slug !== slug),
  ];
}

export async function getShopCatalog(db: D1Database) {
  return ensureShopCatalog(db);
}

export async function upsertShopProduct(
  db: D1Database,
  input: ShopUpsertProductInput,
) {
  const catalog = await ensureShopCatalog(db);
  const next = cloneCatalog(catalog);
  const nextCard = productToCard(input.product);

  next.updatedAt = new Date().toISOString();
  next.products = [
    input.product,
    ...next.products.filter(
      (product) => product.productId !== input.product.productId,
    ),
  ];
  next.stores = upsertStore(next.stores, input, nextCard);

  for (const shelfTitle of input.placement?.shelfTitles ?? []) {
    const existingShelf = next.categoryLanding.shelves.find(
      (shelf) => shelf.title === shelfTitle,
    );

    if (existingShelf) {
      existingShelf.items = upsertCard(existingShelf.items, nextCard);
      continue;
    }

    next.categoryLanding.shelves.push({
      title: shelfTitle,
      items: [nextCard],
    });
  }

  if (input.placement?.cartRecommendation) {
    next.cartRecommendations = upsertCard(next.cartRecommendations, nextCard);
  }

  if (input.placement?.homeFloatingClassName) {
    next.home.floatingProducts = [
      {
        ...nextCard,
        className: input.placement.homeFloatingClassName,
      },
      ...next.home.floatingProducts.filter(
        (product) => product.id !== nextCard.id && product.href !== nextCard.href,
      ),
    ];
  }

  await writeShopCatalog(db, next);
  return next;
}
