import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  AudioLines,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { newsEntries, productHighlights } from "~/lib/site-content";

const productCards = [
  {
    title: "MAPLE Workspace",
    icon: Workflow,
    body: "A premium web surface for research, planning, writing, and shared review.",
  },
  {
    title: "MAPLE Search",
    icon: Sparkles,
    body: "Answer-oriented retrieval across public sources and internal knowledge bases.",
  },
  {
    title: "MAPLE Voice",
    icon: AudioLines,
    body: "Voice sessions for tutoring, collaboration, and hands-busy workflows.",
  },
  {
    title: "MAPLE Automations",
    icon: Wrench,
    body: "Reusable workflows that connect models, prompts, tools, and approval steps.",
  },
];

const guidedLabsFeature = newsEntries.find(
  (entry) => entry.slug === "guided-labs-for-math-and-science",
);

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "An overview of MAPLE-GLOBAL products for teams, operators, and developers.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const copy = useCopyText();
  const localizedProductHighlights = useLocalizedValue(productHighlights);
  const localizedGuidedLabsFeature = useLocalizedValue(guidedLabsFeature);
  const localizedProductCards = useLocalizedValue(productCards);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("View pricing"), href: "/pricing" },
          { label: copy("See developer resources"), href: "/developers" },
        ]}
        accent="from-[#eef5ff] via-[#fff4ec] to-[#f0f8f1]"
        description={copy(
          "MAPLE-GLOBAL is built as a family of surfaces rather than a single app: a consumer-grade workspace, a governed business layer, and a developer platform for shipping custom experiences.",
        )}
        eyebrow={copy("Products")}
        title={copy(
          "A connected product surface for everyday work and serious deployment",
        )}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Each product has a distinct role, but they share a single design language: quiet confidence, strong readability, and workflows that feel intentional.",
          )}
          eyebrow={copy("Product suite")}
          title={copy("The MAPLE-GLOBAL stack")}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localizedProductCards.map((card) => (
            <div
              className="rounded-[28px] border border-black/5 bg-[#fbfbfd] p-7 dark:border-white/10 dark:bg-white/4"
              key={card.title}
            >
              <card.icon className="h-6 w-6 text-black/75 dark:text-white/75" />
              <h3 className="mt-5 text-[22px] font-medium tracking-[-0.03em]">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {localizedGuidedLabsFeature ? (
        <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
          <div className="overflow-hidden rounded-[36px] border border-black/8 bg-[#05070a] text-white shadow-[0_40px_120px_rgba(3,7,18,0.14)] dark:border-white/10 dark:shadow-none">
            <div className="relative p-8 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(76,102,160,0.35),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(212,150,87,0.2),_transparent_28%),linear-gradient(180deg,rgba(5,7,10,0.92),rgba(5,7,10,0.74))]" />
              <div className="relative max-w-[760px]">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/72 backdrop-blur">
                  <img
                    alt="MAPLE-GLOBAL logo"
                    className="h-5 w-auto object-contain invert"
                    src="/logo.svg"
                  />
                  {copy("Product spotlight")}
                </div>
                <h2 className="mt-6 text-[34px] font-medium leading-[1.02] tracking-[-0.04em] md:text-[58px]">
                  {localizedGuidedLabsFeature.title}
                </h2>
                <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-white/72 md:text-[20px]">
                  {localizedGuidedLabsFeature.excerpt}
                </p>
                <Link
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/14 bg-white text-[15px] font-medium text-[#05070a] transition-colors hover:bg-white/90"
                  params={{ slug: localizedGuidedLabsFeature.slug }}
                  to="/news/$slug"
                >
                  {copy("Read product update")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] border-t border-white/10 md:min-h-[420px]">
              <img
                alt={localizedGuidedLabsFeature.title}
                className="absolute inset-0 h-full w-full object-cover"
                src="/images/one_platfrom-1.webp"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.02),rgba(5,7,10,0.16)_28%,rgba(5,7,10,0.75)_100%)]" />
              <div className="absolute left-6 right-6 bottom-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/12 bg-black/35 px-5 py-4 backdrop-blur md:left-8 md:right-8 md:bottom-8">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    {copy("Guided labs")}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-white/80">
                    {copy(
                      "Step-by-step coaching for math and science workflows across MAPLE.",
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-white">
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-auto object-contain invert"
                    src="/logo.svg"
                  />
                  MAPLE-GLOBAL
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          description={copy(
            "Move from exploration to deeper product, business, and developer surfaces from one shared product layer.",
          )}
          eyebrow={copy("Navigation coverage")}
          title={copy("What visitors can explore next")}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {localizedProductHighlights.map((item) => (
            <Link
              className="group rounded-[28px] border border-black/5 bg-white p-7 transition-colors hover:border-black/15 dark:border-white/10 dark:bg-white/4 dark:hover:border-white/20"
              key={item.title}
              to={item.href}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-medium tracking-[-0.03em] group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-black/65 dark:text-white/65">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-black/55 dark:text-white/55" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
