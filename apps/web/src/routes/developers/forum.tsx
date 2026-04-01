import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

const topics = [
  "Prompt architecture and evaluation",
  "Shipping reviewed automations",
  "Model selection for support and operations",
  "Patterns for enterprise rollout",
];

export const Route = createFileRoute("/developers/forum")({
  component: DeveloperForumPage,
});

function DeveloperForumPage() {
  const copy = useCopyText();
  const localizedTopics = useLocalizedValue(topics);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "A place for builders to compare implementation notes, launch questions, and operating patterns around MAPLE.",
        )}
        eyebrow={copy("Developers / Forum")}
        title={copy("A place for builders to compare notes")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "The forum focuses on practical implementation questions and launch-time tradeoffs.",
          )}
          title={copy("Popular discussion tracks")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {localizedTopics.map((topic) => (
            <div
              className="rounded-[20px] border border-black/5 bg-[#fbfbfd] px-6 py-5 text-[16px] font-medium dark:border-white/10 dark:bg-white/4"
              key={topic}
            >
              {topic}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
