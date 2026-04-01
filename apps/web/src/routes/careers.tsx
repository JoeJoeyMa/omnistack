import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { careerOpenings } from "~/lib/site-content";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | MAPLE-GLOBAL" },
      {
        name: "description",
        content: "Join MAPLE-GLOBAL across design, engineering, and research.",
      },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const copy = useCopyText();
  const localizedCareerOpenings = useLocalizedValue(careerOpenings);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          {
            label: copy("Email recruiting"),
            href: "mailto:careers@maple-global.ai",
          },
        ]}
        description={copy(
          "We are building AI products, infrastructure, and workflows that teams can trust in everyday use.",
        )}
        eyebrow={copy("Careers")}
        title={copy("Join the team building MAPLE-GLOBAL")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Open roles across design, engineering, and applied research.",
          )}
          title={copy("Open roles")}
        />
        <div className="space-y-5">
          {localizedCareerOpenings.map((opening) => (
            <div
              className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-7 dark:border-white/10 dark:bg-white/4"
              key={opening.title}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[24px] font-medium tracking-[-0.03em]">
                  {opening.title}
                </h3>
                <span className="rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-black/55 dark:border-white/10 dark:text-white/55">
                  {opening.team}
                </span>
              </div>
              <p className="mt-2 text-[14px] text-black/50 dark:text-white/50">
                {opening.location}
              </p>
              <p className="mt-4 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {opening.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
