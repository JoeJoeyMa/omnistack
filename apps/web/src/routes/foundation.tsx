import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  CollectionCard,
  PageHero,
  SectionIntro,
} from "~/components/site/editorial";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import {
  foundationPillars,
  foundationResources,
  newsEntries,
} from "~/lib/site-content";

export const Route = createFileRoute("/foundation")({
  head: () => ({
    meta: [
      { title: "Foundation | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "The MAPLE-GLOBAL Foundation supports learning access and resilient AI adoption.",
      },
    ],
  }),
  component: FoundationPage,
});

function FoundationPage() {
  const copy = useCopyText();
  const localizedPillars = useLocalizedValue(foundationPillars);
  const localizedResources = useLocalizedValue(foundationResources);
  const localizedNewsEntries = useLocalizedValue(newsEntries);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("Read newsroom updates"), href: "/news" },
          { label: copy("See research"), href: "/research" },
        ]}
        accent="from-[#ecf5ff] via-[#fff5eb] to-[#eef8f0]"
        description={copy(
          "The MAPLE-GLOBAL Foundation supports public-interest work in learning access, institutional resilience, and trustworthy adoption of AI.",
        )}
        eyebrow={copy("Foundation")}
        title={copy("Supporting learning access and resilient AI adoption")}
      />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 py-18 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 md:py-24">
        <div>
          <h2 className="text-[36px] font-medium leading-[1.05] tracking-[-0.04em] md:text-[52px]">
            {copy(
              "MAPLE-GLOBAL was built to make advanced AI more useful, more legible, and more broadly beneficial.",
            )}
          </h2>
          <p className="mt-5 text-[17px] leading-8 text-black/65 dark:text-white/65">
            {copy(
              "The foundation work extends that mission beyond product features. We invest in learning access, public-interest workflows, and practical approaches to AI resilience for institutions that need both capability and trust.",
            )}
          </p>
          <Link
            className={siteButtonClass({
              className: "mt-8",
              variant: "outline",
            })}
            to="/about"
          >
            {copy("Learn about MAPLE-GLOBAL")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-[linear-gradient(135deg,#f5f8ff,white_45%,#eef7ef)] p-8 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
            {copy("Focus areas")}
          </p>
          <div className="mt-6 space-y-6">
            {localizedPillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="text-[24px] font-medium tracking-[-0.03em]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-black/65 dark:text-white/65">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          description={copy(
            "Resources grounded in product, company, and research work across the broader MAPLE-GLOBAL site.",
          )}
          eyebrow={copy("Resources")}
          title={copy("Selected foundation reads")}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {localizedResources.map((resource) => {
            const entry = localizedNewsEntries.find(
              (item) => item.title === resource.title,
            );
            if (entry) {
              return (
                <CollectionCard
                  aspect="aspect-[4/3]"
                  entry={entry}
                  href={resource.href}
                  key={resource.href}
                />
              );
            }

            return (
              <Link
                className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-6 dark:border-white/10 dark:bg-white/4"
                key={resource.href}
                to={resource.href}
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
                  {resource.category}
                </p>
                <h3 className="mt-3 text-[22px] font-medium tracking-[-0.03em]">
                  {resource.title}
                </h3>
                <p className="mt-3 text-[14px] text-black/55 dark:text-white/55">
                  {resource.date}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
