import { createFileRoute, Link } from "@tanstack/react-router";
import { shopButtonClass } from "~/components/shop/button";
import { PageFrame } from "~/components/shop/page-frame";
import { ProductCard } from "~/components/shop/product-card";
import { productToCard } from "~/lib/shop-catalog";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [{ title: "Shop - Your exclusive offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  const catalog = useShopCatalog();
  const offers = catalog.products
    .filter((product) => product.purchaseModes?.some((mode) => mode.compareAt))
    .map(productToCard);

  return (
    <PageFrame>
      <div className="grid gap-8">
        <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:p-7">
          <p className="text-[13px] uppercase tracking-[0.18em] text-black/42">
            Offers
          </p>
          <h1 className="mt-2 text-[38px] font-medium tracking-[-0.05em] text-[#111]">
            Launch bundles and technical delivery offers
          </h1>
          <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-black/56">
            These packages include introductory pricing or bundled delivery
            scope across company setup, web builds, deployment, AI systems, and
            operating workflows so the storefront can sell full service modules
            instead of loose tasks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className={shopButtonClass({ variant: "brand" })}
              search={{ q: "" }}
              to="/categories"
            >
              Browse all services
            </Link>
            <Link
              className={shopButtonClass({ variant: "neutral" })}
              params={{ slug: "mapleglobal" }}
              to="/m/$slug"
            >
              Visit Maple Global
            </Link>
          </div>
        </section>

        {offers.length > 0 ? (
          <section className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[32px] font-medium tracking-[-0.04em] text-[#111]">
                Discounted service packages
              </h2>
              <span className="text-[14px] text-black/48">
                {offers.length} active offers
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {offers.map((item) => (
                <ProductCard item={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </PageFrame>
  );
}
