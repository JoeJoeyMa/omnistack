import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CollectionCard,
  PageHero,
  SectionIntro,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { newsEntries } from "~/lib/site-content";

const categories = ["All", "Product", "Company"] as const;

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Recent product, company, and ecosystem updates from MAPLE-GLOBAL.",
      },
    ],
  }),
  component: NewsIndexPage,
});

function NewsIndexPage() {
  const copy = useCopyText();
  const localizedNewsEntries = useLocalizedValue(newsEntries);
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");

  const localizedCategories = categories.map((category) => copy(category));
  const filteredEntries =
    activeCategory === "All"
      ? localizedNewsEntries
      : localizedNewsEntries.filter(
          (entry) => entry.category === activeCategory,
        );

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("Read latest research"), href: "/research" },
          { label: copy("See business stories"), href: "/business" },
        ]}
        description={copy(
          "A newsroom for product launches, company updates, partnerships, and public-interest programs across MAPLE-GLOBAL.",
        )}
        eyebrow={copy("Newsroom")}
        title={copy("Recent news from MAPLE-GLOBAL")}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          action={
            <Link
              className="inline-flex items-center gap-2 text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/foundation"
            >
              {copy("Explore the foundation")}
            </Link>
          }
          description={copy(
            "Browse product, company, and ecosystem updates in one place, with filters that keep the page easy to scan.",
          )}
          eyebrow={copy("Browse by category")}
          title={copy("Updates you can scan quickly")}
        />

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                activeCategory === category
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/10 bg-white text-black/65 hover:border-black/20 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:text-white"
              }`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {localizedCategories[index]}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <CollectionCard
              aspect="aspect-[4/3]"
              entry={entry}
              href={`/news/${entry.slug}`}
              key={entry.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
