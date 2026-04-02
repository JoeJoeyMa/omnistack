import type {
  ProductDetailRecord,
  ShopCard,
  ShopCatalogPayload,
  StoreCollection,
  StoreProfile,
} from "@maple-global/api-client";

function uniqueCards(cards: ShopCard[]) {
  return Array.from(new Map(cards.map((card) => [card.href, card])).values());
}

function parseProductRoute(href: string) {
  const match = href.match(/^\/products\/([^/]+)\/([^/?#]+)/);

  if (!match) {
    return null;
  }

  return {
    productId: match[1],
    slug: match[2],
  };
}

function titleFromSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function toMerchantSlug(name?: string) {
  return (name ?? "brand").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function parsePrice(value: string) {
  return Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

export function getAllCatalogCards(catalog: ShopCatalogPayload) {
  return uniqueCards([
    ...catalog.home.floatingProducts,
    ...catalog.categoryLanding.shelves.flatMap((shelf) => shelf.items),
    ...catalog.stores.flatMap((store) => store.products),
    ...catalog.products.flatMap((product) => product.recommendations),
    ...catalog.cartRecommendations,
  ]);
}

export function productToCard(product: ProductDetailRecord): ShopCard {
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

export function getProductDetail(
  catalog: ShopCatalogPayload,
  productId: string,
  slug: string,
) {
  const explicit = catalog.products.find((product) => product.productId === productId);

  if (explicit) {
    return explicit;
  }

  const matchedCard = getAllCatalogCards(catalog).find((item) => {
    const route = parseProductRoute(item.href);
    return route?.productId === productId;
  });

  if (!matchedCard) {
    return null;
  }

  return {
    productId,
    slug,
    brand: matchedCard.brand ?? "Featured brand",
    title: matchedCard.title,
    price: matchedCard.price,
    image: matchedCard.image,
    fulfillmentType: "shipping",
    gallery: [matchedCard.image, matchedCard.image, matchedCard.image],
    rating: matchedCard.rating,
    reviewsCount: matchedCard.reviews ?? "0",
    shippingNote: "Shipping calculated at checkout",
    description:
      "This product page is wired for frontend integration and uses captured visual styling from shop.app. Replace this fallback detail payload with your product API when backend data is ready.",
    purchaseModes: [
      { id: "one-time", label: "One time purchase", price: matchedCard.price },
    ],
    policies: ["Shipping Policy", "Refund Policy"],
    merchant: {
      slug: toMerchantSlug(matchedCard.brand),
      name: matchedCard.brand ?? "Featured brand",
      rating: matchedCard.rating?.toFixed(1) ?? "4.5",
      reviews: matchedCard.reviews ?? "1K",
      image: matchedCard.image,
    },
    recommendations: getAllCatalogCards(catalog)
      .filter((item) => item.href !== matchedCard.href)
      .slice(0, 4),
    relatedMerchants: [],
    reviews: [
      {
        author: "Shop user",
        rating: matchedCard.rating ?? 4.5,
        title: "Solid everyday pick",
        body: "Fallback review content for products that have not been mapped into the backend catalog yet.",
      },
    ],
  } satisfies ProductDetailRecord;
}

export function getCategoryDetail(
  catalog: ShopCatalogPayload,
  categoryId: string,
  slug: string,
) {
  return (
    catalog.categories.find(
      (category) => category.categoryId === categoryId && category.slug === slug,
    ) ?? null
  );
}

function fallbackCollections(cards: ShopCard[]): StoreCollection[] {
  return cards.slice(0, 4).map((card, index) => ({
    title:
      index === 0
        ? "Shop all"
        : index === 1
          ? "Featured"
          : index === 2
            ? "Best sellers"
            : "New arrivals",
    image: card.image,
  }));
}

export function getStoreProfile(catalog: ShopCatalogPayload, slug: string): StoreProfile {
  const explicit = catalog.stores.find((store) => store.slug === slug);

  if (explicit) {
    return explicit;
  }

  const merchantProducts = catalog.products
    .filter((product) => product.merchant.slug === slug)
    .map(productToCard);
  const brandProducts = getAllCatalogCards(catalog).filter(
    (card) => toMerchantSlug(card.brand) === slug,
  );
  const productCards = uniqueCards([...merchantProducts, ...brandProducts]);
  const seededStore = catalog.stores[0];

  return {
    slug,
    name:
      catalog.products.find((product) => product.merchant.slug === slug)?.merchant.name ??
      titleFromSlug(slug),
    heroImage: productCards[0]?.image ?? seededStore?.heroImage ?? "",
    rating:
      catalog.products.find((product) => product.merchant.slug === slug)?.merchant.rating ??
      "4.6",
    reviews:
      catalog.products.find((product) => product.merchant.slug === slug)?.merchant.reviews ??
      "12.4K",
    products: productCards.length > 0 ? productCards : seededStore?.products ?? [],
    collections:
      productCards.length > 0
        ? fallbackCollections(productCards)
        : seededStore?.collections ?? [],
  };
}

export function getPolicyCopy(catalog: ShopCatalogPayload, policy: string) {
  return (
    catalog.policyCopy[policy] ??
    `Replace the "${policy}" copy with API-backed merchant policy content.`
  );
}
