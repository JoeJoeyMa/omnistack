/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { shopButtonClass } from "~/components/shop/button";
import { ShopRail } from "~/components/shop/rail";
import { ShopStateProvider } from "~/components/shop/shop-state";
import { createEmptyShopCatalog, loadShopCatalog } from "~/lib/shop-api";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  loader: () =>
    typeof window === "undefined"
      ? createEmptyShopCatalog()
      : loadShopCatalog(),
  errorComponent: RootErrorComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "A TanStack-based reconstruction of shop.app's key shopping flows.",
      },
      { title: "Shop" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: "/fonts/GTStandard-MRegular.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/GTStandard-MSemibold.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="shop-shell">
        <ShopStateProvider>
          <ShopRail />
          <div className="shop-content">
            <Outlet />
          </div>
          {import.meta.env.DEV ? (
            <TanStackRouterDevtools position="bottom-right" />
          ) : null}
          <Scripts />
        </ShopStateProvider>
      </body>
    </html>
  );
}

function RootErrorComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="shop-shell">
        <div className="grid min-h-screen place-items-center px-6">
          <div className="w-full max-w-[640px] rounded-[32px] border border-black/8 bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <p className="text-[13px] uppercase tracking-[0.18em] text-black/42">
              Shop
            </p>
            <h1 className="mt-3 text-[34px] font-medium tracking-[-0.05em] text-[#111]">
              Data is temporarily unavailable
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-black/58">
              The page shell is still available, but the current route failed to
              load its data. Refresh after the API is back, or continue browsing
              the routes that already have fallback UI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                className={shopButtonClass({ variant: "brand" })}
                onClick={() => window.location.reload()}
                type="button"
              >
                Retry
              </button>
              <Link className={shopButtonClass({ variant: "neutral" })} to="/">
                Go home
              </Link>
            </div>
          </div>
          <Scripts />
        </div>
      </body>
    </html>
  );
}
