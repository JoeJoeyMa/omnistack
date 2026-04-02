import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { siteButtonClass } from "~/components/ui/button";
import { getWebShopUrl } from "~/lib/runtime-urls";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [{ title: "Shop | MAPLE-GLOBAL" }],
  }),
  component: ShopRedirectPage,
});

function ShopRedirectPage() {
  const [shopUrl, setShopUrl] = useState<string | null>(null);

  useEffect(() => {
    const nextShopUrl = getWebShopUrl();
    setShopUrl(nextShopUrl);
    window.location.replace(nextShopUrl);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f3ec_0%,#f3f5f7_48%,#eef1f6_100%)] px-6 py-16 text-black dark:bg-[linear-gradient(180deg,#0d0f12_0%,#101318_48%,#121723_100%)] dark:text-white">
      <div className="max-w-xl rounded-[28px] border border-black/5 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8f7f66] dark:text-[#c0b39d]">
          MAPLE-GLOBAL
        </p>
        <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px]">
          Redirecting to Shop
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-gray-600 dark:text-gray-300">
          {shopUrl
            ? "Your storefront is opening now."
            : "Preparing the storefront destination."}
        </p>
        {shopUrl ? (
          <a
            className={siteButtonClass({
              className: "mt-6",
              variant: "primary",
            })}
            href={shopUrl}
          >
            Open Shop
          </a>
        ) : null}
      </div>
    </div>
  );
}
