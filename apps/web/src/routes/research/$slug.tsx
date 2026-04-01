import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBody,
  AsideCard,
  DetailHero,
  RelatedEntries,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { getEntry, getRelatedEntries } from "~/lib/site-content";

export const Route = createFileRoute("/research/$slug")({
  component: ResearchDetailPage,
});

function ResearchDetailPage() {
  const copy = useCopyText();
  const { slug } = Route.useParams();
  const localizedEntry = useLocalizedValue(getEntry("research", slug));
  const localizedRelatedEntries = useLocalizedValue(
    getRelatedEntries("research", slug),
  );

  if (!localizedEntry) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-6 text-center dark:bg-[#0a0a0a]">
        <div>
          <h1 className="text-[42px] font-medium tracking-[-0.04em] text-black dark:text-white">
            {copy("Research page not found")}
          </h1>
          <Link
            className="mt-8 inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium dark:border-white/10"
            to="/research"
          >
            {copy("Return to research")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <DetailHero
        backHref="/research"
        collectionLabel={copy("Research")}
        entry={localizedEntry}
      />
      <ArticleBody
        aside={
          <>
            <AsideCard
              body={copy(
                "MAPLE research is written for product leaders, engineers, and operators who need technical clarity without unnecessary abstraction.",
              )}
              title={copy("How we write research")}
            />
            <AsideCard
              body={copy(
                "See how the same product and systems work is translated into broader public updates in the newsroom.",
              )}
              href="/news"
              title={copy("Pair with the newsroom")}
            />
          </>
        }
        sections={localizedEntry.sections}
      />
      <RelatedEntries
        basePath="/research"
        items={localizedRelatedEntries}
        title={copy("Related research")}
      />
    </div>
  );
}
