import { createFileRoute } from "@tanstack/react-router";
import { AppDownloadBanner } from "~/components/shop/banner";
import { ShopFooter } from "~/components/shop/footer";
import { Omnibox } from "~/components/shop/omnibox";
import { ProductCard } from "~/components/shop/product-card";
import { cn } from "~/components/shop/utils";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Shop | The most amazing way to shop online" }],
  }),
  component: HomePage,
});

function HomePage() {
  const catalog = useShopCatalog();
  const heroPanels = catalog.categoryLanding.featuredCollections.slice(0, 3);

  return (
    <div>
      <AppDownloadBanner />
      <section className="mx-auto max-w-[1480px] px-4 pb-10 pt-4 md:px-8 lg:px-10 lg:pt-6">
        <div className="overflow-hidden rounded-[40px] border border-black/6 bg-[#f7f7f8] shadow-[0_6px_28px_rgba(15,23,42,0.06)]">
          <div className="relative min-h-[760px] overflow-hidden px-4 pb-8 pt-8 md:min-h-[860px] md:px-8 lg:px-10 lg:pt-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_42%),linear-gradient(180deg,#f8f8f9_0%,#f2f2f4_100%)]" />

            <div className="relative hidden min-h-[700px] md:block">
              {heroPanels[0] ? (
                <img
                  alt={heroPanels[0].title}
                  className="pointer-events-none absolute left-1/2 top-[4%] w-[36%] max-w-[500px] -translate-x-1/2 rounded-[28px] border border-white/70 object-cover shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
                  src={heroPanels[0].image}
                />
              ) : null}
              {heroPanels[1] ? (
                <img
                  alt={heroPanels[1].title}
                  className="pointer-events-none absolute bottom-[8%] left-[10%] w-[24%] max-w-[320px] rounded-[28px] border border-white/70 object-cover shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
                  src={heroPanels[1].image}
                />
              ) : null}
              {heroPanels[2] ? (
                <img
                  alt={heroPanels[2].title}
                  className="pointer-events-none absolute bottom-[8%] right-[10%] w-[24%] max-w-[320px] rounded-[28px] border border-white/70 object-cover shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
                  src={heroPanels[2].image}
                />
              ) : null}

              {catalog.home.floatingBrands.map((brand, index) => (
                <div
                  className={cn(
                    "shop-float absolute grid h-[176px] w-[176px] place-items-center overflow-hidden rounded-[32px] border border-black/6 bg-white/90 shadow-[0_18px_44px_rgba(15,23,42,0.08)]",
                    brand.className,
                    index % 2 === 1 ? "[animation-delay:1.1s]" : "",
                  )}
                  key={brand.id}
                >
                  <img
                    alt={brand.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={brand.background}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.08))]" />
                  {brand.logo ? (
                    <img
                      alt={brand.name}
                      className="relative z-10 w-[70%]"
                      src={brand.logo}
                    />
                  ) : (
                    <span className="relative z-10 text-[22px] font-medium tracking-[-0.06em] text-white">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}

              {catalog.home.floatingProducts.map((item, index) => (
                <div
                  className={cn(
                    "shop-float absolute w-[246px]",
                    item.className,
                    index % 2 === 1 ? "[animation-delay:1.5s]" : "",
                  )}
                  key={item.id}
                >
                  <ProductCard item={item} layout="compact" />
                </div>
              ))}

              <div className="relative z-20 mx-auto flex min-h-[700px] max-w-[760px] flex-col items-center justify-center pb-14 text-center">
                <div className="shop-reveal">
                  <p className="text-[92px] font-semibold leading-none tracking-[-0.08em] text-[var(--shop-brand)] md:text-[120px]">
                    shop
                  </p>
                  <p className="mt-5 text-[18px] text-black/58">
                    Global company setup, banking, and annual compliance
                  </p>
                </div>
                <div className="mt-10 w-full max-w-[720px] shop-reveal shop-delay-1">
                  <Omnibox variant="home" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-1 flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    className={cn(
                      "h-2.5 rounded-full bg-black/18 transition-all",
                      index === 2 ? "w-12 bg-black/40" : "w-2.5",
                    )}
                    key={`step-${index}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 grid gap-4 md:hidden">
              <div className="mb-6 flex flex-col items-center text-center">
                <p className="text-[72px] font-semibold leading-none tracking-[-0.08em] text-[var(--shop-brand)]">
                  shop
                </p>
                <p className="mt-4 text-[16px] text-black/58">
                  Global company setup, banking, and annual compliance
                </p>
                <div className="mt-6 w-full max-w-[640px]">
                  <Omnibox variant="home" />
                </div>
              </div>
              {catalog.home.floatingProducts.map((item) => (
                <ProductCard item={item} key={item.id} layout="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
