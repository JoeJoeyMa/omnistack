import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame } from "~/components/shop/page-frame";
import { ProductCard } from "~/components/shop/product-card";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/categories/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [{ title: "Categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const catalog = useShopCatalog();
  const { q } = Route.useSearch();
  const query = q.trim().toLowerCase();
  const hasSearch = query.length > 0;
  const { browseCategories, featuredCollections, shelves, topCategoryLinks } =
    catalog.categoryLanding;
  const firstCategory = catalog.categories[0];

  const filteredShelves = hasSearch
    ? shelves
        .map((shelf) => ({
          ...shelf,
          items: shelf.items.filter((item) =>
            [item.title, item.brand, item.price]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(query),
          ),
        }))
        .filter((shelf) => shelf.items.length > 0)
    : shelves;

  const allResults = filteredShelves.flatMap((shelf) => shelf.items);

  return (
    <PageFrame>
      <div className="grid gap-10">
        <section className="grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] uppercase tracking-[0.18em] text-black/42">
                Explore
              </p>
              <h1 className="mt-2 text-[32px] font-medium tracking-[-0.05em]">
                {hasSearch
                  ? `Search results for "${q.trim()}"`
                  : "Browse business and technology services"}
              </h1>
              {hasSearch ? (
                <p className="mt-3 text-[15px] text-black/56">
                  {allResults.length === 0
                    ? "No captured products matched this search yet."
                    : `${allResults.length} product cards matched this search.`}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {topCategoryLinks.map((category) =>
              firstCategory ? (
                <Link
                  className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-[14px] text-black/72 transition hover:border-black/14 hover:bg-black/[0.02]"
                  key={category}
                  params={{
                    categoryId: firstCategory.categoryId,
                    slug: firstCategory.slug,
                  }}
                  search={{ q: "" }}
                  to="/categories/$categoryId/$slug"
                >
                  {category}
                </Link>
              ) : (
                <Link
                  className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-[14px] text-black/72 transition hover:border-black/14 hover:bg-black/[0.02]"
                  key={category}
                  search={{ q: "" }}
                  to="/categories"
                >
                  {category}
                </Link>
              ),
            )}
          </div>
        </section>

        {!hasSearch ? (
          <>
            <section className="grid gap-4">
              <div className="flex items-end justify-between">
                <h2 className="text-[32px] font-medium tracking-[-0.04em]">
                  Featured collections
                </h2>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {featuredCollections.map((collection) => (
                  <Link
                    className="group overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                    key={collection.title}
                    params={{
                      categoryId: firstCategory?.categoryId ?? "",
                      slug: firstCategory?.slug ?? "",
                    }}
                    search={{ q: "" }}
                    to="/categories/$categoryId/$slug"
                  >
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <img
                        alt={collection.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        src={collection.image}
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="text-[22px] font-medium">{collection.title}</h2>
                      <p className="mt-2 text-[14px] text-black/58">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-[32px] font-medium tracking-[-0.04em]">
                Browse categories
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {browseCategories.map((category) => (
                  <Link
                    className="group overflow-hidden rounded-[26px] border border-black/6 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                    key={category.title}
                    params={{
                      categoryId: firstCategory?.categoryId ?? "",
                      slug: firstCategory?.slug ?? "",
                    }}
                    search={{ q: "" }}
                    to="/categories/$categoryId/$slug"
                  >
                    <img
                      alt={category.title}
                      className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      src={category.image}
                    />
                    <div className="px-4 py-3 text-[15px] font-medium">
                      {category.title}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {filteredShelves.length > 0 ? (
          filteredShelves.map((shelf) => (
            <section className="grid gap-4" key={shelf.title}>
              <div className="flex items-center justify-between">
                <h2 className="text-[32px] font-medium tracking-[-0.04em]">
                  {shelf.title}
                </h2>
                <Link
                  className="text-[14px] text-black/52"
                  params={{
                    categoryId: firstCategory?.categoryId ?? "",
                    slug: firstCategory?.slug ?? "",
                  }}
                  search={{ q: "" }}
                  to="/categories/$categoryId/$slug"
                >
                  View all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {shelf.items.map((item) => (
                  <ProductCard item={item} key={item.id} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="rounded-[30px] border border-dashed border-black/10 bg-white px-6 py-12 text-center">
            <h2 className="text-[26px] font-medium tracking-[-0.04em] text-[#111]">
              Nothing matched this query yet
            </h2>
            <p className="mt-3 text-[15px] text-black/56">
              The search surface is wired for API results. Replace the mock
              shelves with live search data when your backend is ready.
            </p>
          </section>
        )}
      </div>
    </PageFrame>
  );
}
