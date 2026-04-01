import { createFileRoute } from "@tanstack/react-router";
import {
  CollectionCard,
  PageHero,
  SectionIntro,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { researchEntries } from "~/lib/site-content";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Research | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Research notes, system cards, and applied technical writing from MAPLE-GLOBAL.",
      },
    ],
  }),
  component: ResearchIndexPage,
});

function ResearchIndexPage() {
  const copy = useCopyText();
  const localizedResearchEntries = useLocalizedValue(researchEntries);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("Read the foundation brief"), href: "/foundation" },
          { label: copy("Browse newsroom"), href: "/news" },
        ]}
        accent="from-[#edf3ff] via-[#f6f0ff] to-[#f3f8eb]"
        description={copy(
          "Research at MAPLE-GLOBAL spans system design, evaluation, and deployment guidance for teams operating AI in the real world.",
        )}
        eyebrow={copy("Research")}
        title={copy("Technical work translated into deployable ideas")}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Browse system notes, technical papers, and applied writing with enough context to understand where each piece fits.",
          )}
          eyebrow={copy("Latest research")}
          title={copy("Recent papers and system notes")}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {localizedResearchEntries.map((entry) => (
            <CollectionCard
              aspect="aspect-[4/3]"
              entry={entry}
              href={`/research/${entry.slug}`}
              key={entry.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
