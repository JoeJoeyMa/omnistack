import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown, Menu, Search, Star } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { PageFrame } from "~/components/shop/page-frame";
import { ProductCard } from "~/components/shop/product-card";
import { getStoreProfile, parsePrice } from "~/lib/shop-catalog";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/m/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} - Shop` }],
  }),
  component: StorePage,
});

function StorePage() {
  const catalog = useShopCatalog();
  const { slug } = Route.useParams();
  const profile = getStoreProfile(catalog, slug);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"most-sales" | "price-asc" | "price-desc">(
    "most-sales",
  );
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(true);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredProducts = useMemo(() => {
    let next = profile.products.filter((item) => {
      const matchesQuery = deferredQuery
        ? item.title.toLowerCase().includes(deferredQuery)
        : true;
      const matchesSale = onSaleOnly ? Boolean(item.compareAt) : true;
      const matchesStock = inStockOnly ? true : true;

      return matchesQuery && matchesSale && matchesStock;
    });

    if (sortBy === "price-asc") {
      next = [...next].sort((left, right) => parsePrice(left.price) - parsePrice(right.price));
    } else if (sortBy === "price-desc") {
      next = [...next].sort((left, right) => parsePrice(right.price) - parsePrice(left.price));
    }

    return next;
  }, [deferredQuery, inStockOnly, onSaleOnly, profile.products, sortBy]);
  const hasHeroImage = Boolean(profile.heroImage);
  const hasProducts = profile.products.length > 0;

  return (
    <PageFrame>
      <div className="grid gap-8">
        <section className="overflow-hidden rounded-[36px] border border-black/6 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <div className="relative h-[320px] md:h-[440px]">
            {hasHeroImage ? (
              <img
                alt={profile.name}
                className="absolute inset-0 h-full w-full object-cover"
                src={profile.heroImage}
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#f4f4f5,#e9eaec)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.48))]" />
            <div className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-sm">
              {profile.logoImage ? (
                <img
                  alt={profile.name}
                  className="h-9 w-9 rounded-full object-cover"
                  src={profile.logoImage}
                />
              ) : (
                <span className="text-[15px] font-semibold text-[#111]">
                  {profile.name.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="absolute inset-x-6 bottom-8 grid gap-5 text-white md:grid-cols-[1fr_auto] md:items-end">
              <div>
                {profile.logoImage ? (
                  <img
                    alt={profile.name}
                    className="max-h-[64px] w-auto max-w-[280px] object-contain md:max-h-[86px] md:max-w-[380px]"
                    src={profile.logoImage}
                  />
                ) : (
                  <p className="text-[42px] font-medium tracking-[-0.05em]">
                    {profile.name}
                  </p>
                )}
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[14px] text-white/92 backdrop-blur"
                  type="button"
                >
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {profile.rating} stars: {profile.reviews} Reviews
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-[14px] font-medium text-black"
                  type="button"
                >
                  Follow
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/24 bg-white/10 px-5 text-[14px] font-medium text-white backdrop-blur"
                  type="button"
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Store menu
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 md:p-6">
            <div className="flex flex-wrap gap-2.5">
              {[
                "All services",
                "Business setup",
                "Accounts",
                "IT consulting",
                "Web build",
                "Ecommerce",
                "Restaurant",
                "AI systems",
                "Email",
                "Deployment",
              ].map((item) => (
                <Link
                  className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-[#f7f7f8] px-4 py-2 text-[14px] font-medium"
                  key={item}
                  params={{ slug: profile.slug }}
                  to="/m/$slug"
                >
                  <span>{item}</span>
                </Link>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-4">
              {profile.collections.map((collection) => (
                <Link
                  className="group overflow-hidden rounded-[28px] border border-black/6 bg-[#fbfbfb]"
                  key={collection.title}
                  params={{ slug: profile.slug }}
                  to="/m/$slug"
                >
                  <img
                    alt={collection.title}
                    className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    src={collection.image}
                  />
                  <div className="p-4 text-[17px] font-medium">
                    {collection.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-[32px] font-medium tracking-[-0.04em]">
                Services
              </h1>
            </div>
            <div className="w-full max-w-[360px]">
              <label className="flex items-center gap-3 rounded-full border border-black/8 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                <Search className="h-4 w-4 text-black/42" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/42"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${profile.name} services`}
                  value={query}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-11 items-center rounded-full border border-black/8 bg-white px-4 text-[14px]"
              type="button"
            >
              Filter
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/8 bg-white px-4 text-[14px]"
              onClick={() =>
                setSortBy((current) =>
                  current === "most-sales"
                    ? "price-asc"
                    : current === "price-asc"
                      ? "price-desc"
                      : "most-sales",
                )
              }
              type="button"
            >
              {sortBy === "most-sales"
                ? "Most requested"
                : sortBy === "price-asc"
                  ? "Price: low to high"
                  : "Price: high to low"}
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              className={onSaleOnly
                ? "inline-flex h-11 items-center gap-2 rounded-full border border-[var(--shop-brand)] bg-[rgba(84,51,235,0.08)] px-4 text-[14px] text-[var(--shop-brand)]"
                : "inline-flex h-11 items-center gap-2 rounded-full border border-black/8 bg-white px-4 text-[14px]"
              }
              onClick={() => setOnSaleOnly((current) => !current)}
              type="button"
            >
              <Check className="h-4 w-4" />
              Bundle offer
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/8 bg-white px-4 text-[14px]"
              type="button"
            >
              Price
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              className={inStockOnly
                ? "inline-flex h-11 items-center gap-2 rounded-full border border-[var(--shop-brand)] bg-[rgba(84,51,235,0.08)] px-4 text-[14px] text-[var(--shop-brand)]"
                : "inline-flex h-11 items-center gap-2 rounded-full border border-black/8 bg-white px-4 text-[14px]"
              }
              onClick={() => setInStockOnly((current) => !current)}
              type="button"
            >
              <Check className="h-4 w-4" />
              Available now
            </button>
          </div>

          {hasProducts ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {filteredProducts.map((item) => (
                <ProductCard item={item} key={item.id} showBrand={false} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-black/10 bg-white px-6 py-12 text-center">
              <h2 className="text-[24px] font-medium tracking-[-0.04em] text-[#111]">
                This store has no published products yet
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-black/56">
                The store page remains usable, but product data has not been
                provided by the API for this merchant yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </PageFrame>
  );
}
