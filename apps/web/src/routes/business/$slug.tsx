import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBody,
  AsideCard,
  DetailHero,
  RelatedEntries,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { getEntry, getRelatedEntries } from "~/lib/site-content";

export const Route = createFileRoute("/business/$slug")({
  component: BusinessDetailPage,
});

function BusinessDetailPage() {
  const copy = useCopyText();
  const { slug } = Route.useParams();
  const localizedEntry = useLocalizedValue(getEntry("business", slug));
  const localizedRelatedEntries = useLocalizedValue(
    getRelatedEntries("business", slug),
  );

  if (!localizedEntry) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-6 text-center dark:bg-[#0a0a0a]">
        <div>
          <h1 className="text-[42px] font-medium tracking-[-0.04em] text-black dark:text-white">
            {copy("Case study not found")}
          </h1>
          <Link
            className="mt-8 inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium dark:border-white/10"
            to="/business"
          >
            {copy("Return to business stories")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <DetailHero
        backHref="/business"
        collectionLabel={copy("Business")}
        entry={localizedEntry}
      />
      <ArticleBody
        aside={
          <>
            <AsideCard
              body={copy(
                "Case studies stay outcome-oriented: the operating problem, the workflow change, and the metrics teams cared about.",
              )}
              title={copy("How we frame case studies")}
            />
            <AsideCard
              body={copy(
                "Pricing, workspaces, and enterprise controls connect back to the same rollout story shown in these customer examples.",
              )}
              href="/pricing"
              title={copy("See plan details")}
            />
          </>
        }
        sections={localizedEntry.sections}
      />
      <RelatedEntries
        basePath="/business"
        items={localizedRelatedEntries}
        title={copy("More business stories")}
      />
    </div>
  );
}
