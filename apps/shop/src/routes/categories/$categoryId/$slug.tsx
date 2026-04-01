import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { PageFrame } from "~/components/shop/page-frame";
import { getCategoryDetail } from "~/lib/shop-catalog";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/categories/$categoryId/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} - Shop` }],
  }),
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const catalog = useShopCatalog();
  const { categoryId, slug } = Route.useParams();
  const detail = getCategoryDetail(catalog, categoryId, slug);

  if (!detail) {
    return (
      <PageFrame>
        <section className="grid min-h-[50vh] place-items-center">
          <div className="max-w-[560px] text-center">
            <h1 className="text-[40px] font-medium tracking-[-0.05em]">
              This category hasn&apos;t been reconstructed yet.
            </h1>
            <p className="mt-4 text-[17px] leading-7 text-black/58">
              The category shell is ready for API data, but this captured page
              has not been mapped yet.
            </p>
            <Link
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--shop-brand)] px-6 text-[15px] font-medium text-white"
              search={{ q: "" }}
              to="/categories"
            >
              Back to categories
            </Link>
          </div>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <div className="grid gap-10">
        <section className="grid gap-5">
          <div>
            <h1 className="text-[38px] font-medium tracking-[-0.05em] text-[#111]">
              {detail.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-black/48">
              <Link className="transition hover:text-black" search={{ q: "" }} to="/categories">
                {detail.parentLabel}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>{detail.title}</span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {detail.subcategories.map((subcategory) => (
              <a
                className="min-w-[132px] overflow-hidden rounded-[26px] border border-black/6 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                href={subcategory.href}
                key={subcategory.label}
              >
                <div className="grid gap-3">
                  <div className="overflow-hidden rounded-[20px] bg-[#f4f4f5]">
                    {subcategory.image ? (
                      <img
                        alt={subcategory.label}
                        className="aspect-square w-full object-cover"
                        src={subcategory.image}
                      />
                    ) : (
                      <div className="aspect-square w-full bg-[#f4f4f5]" />
                    )}
                  </div>
                  <p className="text-[15px] font-medium text-[#111]">
                    {subcategory.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {detail.sections.map((section) => (
          <section className="grid gap-4" key={section.title}>
            <a
              className="inline-flex w-fit items-center gap-2 text-[28px] font-medium tracking-[-0.04em] text-[#111]"
              href={detail.subcategories.find((item) => item.label === section.title)?.href ?? "#"}
            >
              <span>{section.title}</span>
              <ChevronRight className="h-5 w-5" />
            </a>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <article
                  className="overflow-hidden rounded-[30px] border border-black/6 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                  key={`${section.title}-${item.storeName}`}
                >
                  <Link className="block" to={item.href}>
                    <div className="relative overflow-hidden rounded-[24px] bg-[#f5f5f6]">
                      <img
                        alt={item.productTitle}
                        className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.02]"
                        src={item.image}
                      />
                      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between">
                        <span className="rounded-full bg-white/92 px-2.5 py-1 text-[12px] font-medium text-black/66 shadow-sm">
                          1 of {item.itemCount}
                        </span>
                        <span className="rounded-full bg-black/72 px-2.5 py-1 text-[12px] font-medium text-white">
                          View product
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-3 grid gap-2">
                    <Link
                      className="line-clamp-2 text-[16px] font-medium leading-6 text-[#111]"
                      to={item.href}
                    >
                      {item.productTitle}
                    </Link>
                    <a
                      className="flex items-center gap-3 rounded-[20px] bg-[#fafafb] px-3 py-3"
                      href={item.storeHref}
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#111] text-[13px] font-semibold text-white">
                        {item.storeLabel.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium text-[#111]">
                          {item.storeName}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-black/48">
                          <Star className="h-3.5 w-3.5 fill-current text-[#111]" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageFrame>
  );
}
