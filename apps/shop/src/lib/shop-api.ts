import {
  type AppApiClient,
  createApiClient,
  type ShopCatalogPayload,
} from "@maple-global/api-client";

const DEFAULT_SERVER_URL = "http://127.0.0.1:3001";
const LOCAL_ONLY_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

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

export function getServerUrl() {
  const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim();

  if (typeof window !== "undefined") {
    if (!configuredServerUrl) {
      return window.location.origin;
    }

    try {
      const targetUrl = new URL(configuredServerUrl);
      const pageHost = window.location.hostname;

      if (
        LOCAL_ONLY_HOSTS.has(targetUrl.hostname) &&
        !LOCAL_ONLY_HOSTS.has(pageHost)
      ) {
        return window.location.origin;
      }
    } catch {
      // Keep explicit non-URL values untouched instead of breaking startup.
    }

    return configuredServerUrl;
  }

  return configuredServerUrl || DEFAULT_SERVER_URL;
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
        console.error(
          "Failed to load shop catalog API, using empty fallback.",
          error,
        );
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
