import { createFileRoute } from "@tanstack/react-router";
import {
  CollectionCard,
  PageHero,
  SectionIntro,
} from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { storyEntries } from "~/lib/site-content";

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title: "Stories | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Field stories from small teams and operators using MAPLE-GLOBAL in daily work.",
      },
    ],
  }),
  component: StoriesIndexPage,
});

function StoriesIndexPage() {
  const copy = useCopyText();
  const localizedStoryEntries = useLocalizedValue(storyEntries);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("See case studies"), href: "/business" },
          { label: copy("Read the newsroom"), href: "/news" },
        ]}
        accent="from-[#e4f3ff] via-[#fff3ea] to-[#f2f7e7]"
        description={copy(
          "Stories from the field show how real operators fit MAPLE into routines that already matter to their teams and customers.",
        )}
        eyebrow={copy("Stories")}
        title={copy(
          "What MAPLE-GLOBAL looks like in the hands of everyday teams",
        )}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "These profiles stay grounded in routines, people, and operating context rather than abstract transformation claims.",
          )}
          eyebrow={copy("Field notes")}
          title={copy("Three operating stories from the real world")}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {localizedStoryEntries.map((entry) => (
            <CollectionCard
              aspect="aspect-[1/1]"
              entry={entry}
              href={`/stories/${entry.slug}`}
              key={entry.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
