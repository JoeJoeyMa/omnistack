import { useEffect, useState } from "react";
import { Route as RootRoute } from "~/routes/__root";
import { isEmptyShopCatalog, loadShopCatalog } from "./shop-api";

let latestResolvedCatalog: ReturnType<typeof RootRoute.useLoaderData> | null = null;

export function useShopCatalog() {
  const loaderCatalog = RootRoute.useLoaderData();
  const [catalog, setCatalog] = useState(
    latestResolvedCatalog && !isEmptyShopCatalog(latestResolvedCatalog)
      ? latestResolvedCatalog
      : loaderCatalog,
  );

  useEffect(() => {
    if (!isEmptyShopCatalog(loaderCatalog)) {
      latestResolvedCatalog = loaderCatalog;
      setCatalog(loaderCatalog);
      return;
    }

    if (!latestResolvedCatalog) {
      setCatalog(loaderCatalog);
    }
  }, [loaderCatalog]);

  useEffect(() => {
    let cancelled = false;

    loadShopCatalog({
      force: isEmptyShopCatalog(loaderCatalog) && !latestResolvedCatalog,
    })
      .then((nextCatalog) => {
        if (!cancelled && !isEmptyShopCatalog(nextCatalog)) {
          latestResolvedCatalog = nextCatalog;
          setCatalog(nextCatalog);
        }
      })
      .catch(() => {
        // The API helper already falls back to an empty catalog.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return catalog;
}
