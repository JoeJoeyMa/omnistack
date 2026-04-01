import { createFileRoute } from "@tanstack/react-router";
import {
  CollectionCard,
  PageHero,
  SectionIntro,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { businessEntries } from "~/lib/site-content";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { title: "Business | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Case studies and solution narratives for teams deploying MAPLE-GLOBAL at scale.",
      },
    ],
  }),
  component: BusinessIndexPage,
});

function BusinessIndexPage() {
  const copy = useCopyText();
  const localizedBusinessEntries = useLocalizedValue(businessEntries);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("See pricing"), href: "/pricing" },
          {
            label: copy("Talk to the team"),
            href: "mailto:hello@maple-global.ai",
          },
        ]}
        accent="from-[#eef5ff] via-[#fff6ee] to-[#f3f7f1]"
        description={copy(
          "MAPLE-GLOBAL for business focuses on systems teams can actually roll out: shared workspaces, governed automation, and better operational clarity.",
        )}
        eyebrow={copy("Business")}
        title={copy(
          "Case studies for teams moving from experimentation to rollout",
        )}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Customer stories focused on rollout context, workflow design, and the operational outcomes teams were measured against.",
          )}
          eyebrow={copy("Customer stories")}
          title={copy("Three examples of MAPLE-GLOBAL at work")}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {localizedBusinessEntries.map((entry) => (
            <CollectionCard
              aspect="aspect-[1/1]"
              entry={entry}
              href={`/business/${entry.slug}`}
              key={entry.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
