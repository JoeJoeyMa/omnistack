import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBody,
  AsideCard,
  DetailHero,
  RelatedEntries,
} from "~/components/site/editorial";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { getEntry, getRelatedEntries } from "~/lib/site-content";

export const Route = createFileRoute("/stories/$slug")({
  component: StoryDetailPage,
});

function StoryDetailPage() {
  const copy = useCopyText();
  const { slug } = Route.useParams();
  const localizedEntry = useLocalizedValue(getEntry("stories", slug));
  const localizedRelatedEntries = useLocalizedValue(
    getRelatedEntries("stories", slug),
  );

  if (!localizedEntry) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-6 text-center dark:bg-[#0a0a0a]">
        <div>
          <h1 className="text-[42px] font-medium tracking-[-0.04em] text-black dark:text-white">
            {copy("Story not found")}
          </h1>
          <Link
            className={siteButtonClass({
              className: "mt-8",
              variant: "outline",
            })}
            to="/stories"
          >
            {copy("Return to stories")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <DetailHero
        backHref="/stories"
        collectionLabel={copy("Stories")}
        entry={localizedEntry}
      />
      <ArticleBody
        aside={
          <>
            <AsideCard
              body={copy(
                "We keep operator stories concrete: the routine, the pain point, the workflow change, and the result.",
              )}
              title={copy("Editorial note")}
            />
            <AsideCard
              body={copy(
                "See how similar patterns scale when a company turns them into a broader deployment program.",
              )}
              href="/business"
              title={copy("From story to case study")}
            />
          </>
        }
        sections={localizedEntry.sections}
      />
      <RelatedEntries
        basePath="/stories"
        items={localizedRelatedEntries}
        title={copy("More operator stories")}
      />
    </div>
  );
}
