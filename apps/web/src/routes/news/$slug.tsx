import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBody,
  AsideCard,
  DetailHero,
  RelatedEntries,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { getEntry, getRelatedEntries } from "~/lib/site-content";

export const Route = createFileRoute("/news/$slug")({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const copy = useCopyText();
  const { slug } = Route.useParams();
  const localizedEntry = useLocalizedValue(getEntry("news", slug));
  const localizedRelatedEntries = useLocalizedValue(
    getRelatedEntries("news", slug),
  );

  if (!localizedEntry) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-6 text-center dark:bg-[#0a0a0a]">
        <div>
          <h1 className="text-[42px] font-medium tracking-[-0.04em] text-black dark:text-white">
            {copy("News article not found")}
          </h1>
          <p className="mt-4 text-[16px] text-black/65 dark:text-white/65">
            {copy(
              "The article may have moved, been archived, or is not available in this environment.",
            )}
          </p>
          <Link
            className="mt-8 inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium dark:border-white/10"
            to="/news"
          >
            {copy("Return to the newsroom")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <DetailHero
        backHref="/news"
        collectionLabel={copy("News")}
        entry={localizedEntry}
      />
      <ArticleBody
        aside={
          <>
            <AsideCard
              body={copy(
                "Product, company, and program updates follow a simple structure: the announcement, the operational context, and what changes next.",
              )}
              title={copy("How we structure announcements")}
            />
            <AsideCard
              body={copy(
                "See how MAPLE research turns system design and evaluation into materials broader teams can actually use.",
              )}
              href="/research"
              title={copy("Continue with research")}
            />
          </>
        }
        sections={localizedEntry.sections}
      />
      <RelatedEntries
        basePath="/news"
        items={localizedRelatedEntries}
        title={copy("More from the newsroom")}
      />
    </div>
  );
}
