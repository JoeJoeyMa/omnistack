import {
  createApiClient,
  type AppApiClient,
  type ShopCatalogPayload,
} from "@maple-global/api-client";

const DEFAULT_SERVER_URL = "http://127.0.0.1:3001";

let client: AppApiClient | null = null;
let catalogPromise: Promise<ShopCatalogPayload> | null = null;

export function createEmptyShopCatalog(): ShopCatalogPayload {
  return {
    updatedAt: new Date(0).toISOString(),
    searchSuggestions: [],
    home: {
      floatingBrands: [],
      floatingProducts: [],
    },
    categoryLanding: {
      topCategoryLinks: [],
      featuredCollections: [],
      browseCategories: [],
      shelves: [],
    },
    categories: [],
    products: [],
    stores: [],
    cartRecommendations: [],
    policyCopy: {},
  };
}

export function isEmptyShopCatalog(catalog: ShopCatalogPayload) {
  return catalog.updatedAt === new Date(0).toISOString();
}

function getServerUrl() {
  return import.meta.env.VITE_SERVER_URL ?? DEFAULT_SERVER_URL;
}

export function getShopApiClient() {
  client ??= createApiClient(getServerUrl());
  return client;
}

export function loadShopCatalog({ force = false }: { force?: boolean } = {}) {
  const fetchCatalog = () =>
    getShopApiClient()
      .shopCatalog()
      .catch((error) => {
        console.error("Failed to load shop catalog API, using empty fallback.", error);
        return createEmptyShopCatalog();
      });

  if (typeof window === "undefined") {
    return fetchCatalog();
  }

  if (force || !catalogPromise) {
    catalogPromise = fetchCatalog().then((catalog) => {
      if (isEmptyShopCatalog(catalog)) {
        catalogPromise = null;
      }

      return catalog;
    });
  }

  return catalogPromise;
}
