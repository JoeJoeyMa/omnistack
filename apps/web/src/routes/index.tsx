import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowUpRightFromCircle } from "lucide-react";
import { CollectionCard, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import {
  businessEntries,
  homeSuggestions,
  newsEntries,
  productHighlights,
  researchEntries,
  storyEntries,
} from "~/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "MAPLE-GLOBAL" }],
  }),
  component: HomePage,
});

const secondaryActionLinkClass =
  "inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium !text-black [-webkit-text-fill-color:currentColor] transition-colors hover:border-black/20 hover:bg-white dark:border-white/20 dark:!text-white dark:hover:border-white/30 dark:hover:bg-white/5";

function HomePage() {
  const copy = useCopyText();
  const localizedBusinessEntries = useLocalizedValue(businessEntries);
  const localizedHomeSuggestions = useLocalizedValue(homeSuggestions);
  const localizedNewsEntries = useLocalizedValue(newsEntries);
  const localizedProductHighlights = useLocalizedValue(productHighlights);
  const localizedResearchEntries = useLocalizedValue(researchEntries);
  const localizedStoryEntries = useLocalizedValue(storyEntries);
  const leadNews = localizedNewsEntries[0];
  const featureRail = [
    localizedNewsEntries[1],
    localizedResearchEntries[0],
    localizedBusinessEntries[0],
  ];

  return (
    <div className="w-full bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,233,255,0.9),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(255,241,220,0.92),_transparent_34%),linear-gradient(180deg,#ffffff,rgba(255,255,255,0.92))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(72,93,138,0.35),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(96,79,51,0.18),_transparent_34%),linear-gradient(180deg,#0a0a0a,rgba(10,10,10,0.96))]" />
        <div className="maple-float absolute left-[10%] top-24 h-32 w-32 rounded-full bg-[#dce7ff]/60 blur-3xl dark:bg-[#5e78b8]/25" />
        <div
          className="maple-float absolute right-[8%] top-20 h-36 w-36 rounded-full bg-[#ffe8d0]/55 blur-3xl dark:bg-[#86684a]/20"
          style={{ animationDelay: "1.2s" }}
        />
        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-12 px-6 pb-16 pt-18 lg:px-8 md:pb-20 md:pt-22">
          <div className="flex flex-col items-center text-center">
            <p className="maple-reveal text-[12px] font-semibold uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
              {copy("AI for learning, research, and modern work")}
            </p>
            <h1 className="maple-reveal maple-delay-1 mt-5 max-w-[920px] text-[42px] font-medium leading-[0.96] tracking-[-0.05em] md:text-[76px]">
              {copy(
                "Intelligence that helps people learn deeply and teams move with confidence",
              )}
            </h1>
            <p className="maple-reveal maple-delay-2 mt-5 max-w-[760px] text-[18px] leading-8 text-black/65 dark:text-white/65">
              {copy(
                "MAPLE-GLOBAL brings guided learning, research synthesis, business workflows, and developer tooling into one platform for schools, operators, and product teams ready to put AI into production.",
              )}
            </p>
            <div className="maple-reveal maple-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link className={secondaryActionLinkClass} to="/products">
                {copy("Explore products")}
              </Link>
              <Link className={secondaryActionLinkClass} to="/developers">
                {copy("Developer platform")}
              </Link>
            </div>
          </div>

          <div className="maple-reveal maple-delay-4 mx-auto w-full max-w-[820px] rounded-[34px] border border-black/8 bg-white/90 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/12 dark:bg-white/6 dark:shadow-none">
            <div className="maple-sheen rounded-[28px] border border-black/6 bg-[#fbfbfd] px-5 py-5 dark:border-white/8 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <span className="maple-pulse inline-flex h-2.5 w-2.5 rounded-full bg-[#1f9d6d]" />
                <p className="text-[13px] font-medium text-black/45 dark:text-white/45">
                  {copy("Start with a real workflow")}
                </p>
              </div>
              <p className="mt-3 max-w-[620px] text-[17px] leading-8 text-black/65 dark:text-white/65">
                {copy(
                  "Build a guided lesson, review a research brief, or map an AI rollout for your team.",
                )}
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-[18px] text-black/80 dark:text-white/80">
                  {copy(
                    "Show me the tools for interactive learning, secure workflows, and developer deployment.",
                  )}
                </p>
                <div className="maple-float flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                  <ArrowUpRightFromCircle className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {localizedHomeSuggestions.map((suggestion) => (
                <Link
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-[14px] font-medium text-black/70 transition-colors hover:border-black/20 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:text-white"
                  key={suggestion.label}
                  to={suggestion.href}
                >
                  {suggestion.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="maple-reveal maple-delay-5 grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
            <Link
              className="group flex h-full flex-col overflow-hidden rounded-[34px] border border-black/5 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/4"
              params={{ slug: leadNews.slug }}
              to="/news/$slug"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-[26px] bg-[#f3f6fb]">
                <img
                  alt={leadNews.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  src={leadNews.image}
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-[13px] font-semibold text-black shadow-sm">
                  {leadNews.badge}
                </div>
              </div>
              <div className="flex items-end justify-between gap-6 px-2 pb-2 pt-6">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
                    {leadNews.category}
                  </p>
                  <h2 className="mt-3 text-[34px] font-medium leading-[1.02] tracking-[-0.04em] group-hover:underline md:text-[44px]">
                    {leadNews.title}
                  </h2>
                  <p className="mt-4 max-w-[720px] text-[16px] leading-7 text-black/65 dark:text-white/65">
                    {leadNews.excerpt}
                  </p>
                </div>
                <ArrowUpRight className="mb-1 hidden h-5 w-5 shrink-0 text-black/45 dark:text-white/45 md:block" />
              </div>
              <div className="relative mt-4 min-h-[280px] flex-1 overflow-hidden rounded-[28px] border border-black/6 bg-[#edf3ff] dark:border-white/10 dark:bg-white/6">
                <img
                  alt={`${leadNews.title} platform preview`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  src="/images/one_platfrom-1.webp"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.02),rgba(7,10,18,0.12)_100%,rgba(7,10,18,0.72)_100%)]" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-3 rounded-full border border-white/18 bg-black/35 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-auto object-contain invert"
                    src="/logo.svg"
                  />
                  MAPLE-GLOBAL
                </div>
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/16 bg-black/28 px-5 py-4 text-white backdrop-blur">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    {copy("Guided labs")}
                  </p>
                  <p className="mt-2 max-w-[520px] text-[15px] leading-7 text-white/82">
                    {copy(
                      "A second product visual fills the lower panel so the feature card carries the same energy all the way down.",
                    )}
                  </p>
                </div>
              </div>
            </Link>

            <div className="grid gap-6">
              {featureRail.map((entry, index) => {
                const basePath =
                  index === 0
                    ? "/news"
                    : index === 1
                      ? "/research"
                      : "/business";

                return (
                  <CollectionCard
                    aspect="aspect-[5/3]"
                    entry={entry}
                    href={`${basePath}/${entry.slug}`}
                    key={entry.slug}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          action={
            <Link
              className="text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/news"
            >
              {copy("View newsroom")}
            </Link>
          }
          description={copy(
            "Each card now lands on a real article page with original MAPLE-GLOBAL copy and a reusable long-form layout.",
          )}
          eyebrow={copy("Recent news")}
          title={copy("A newsroom for product, company, and ecosystem updates")}
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {localizedNewsEntries.map((entry) => (
            <CollectionCard
              aspect="aspect-[1/1]"
              entry={entry}
              href={`/news/${entry.slug}`}
              key={entry.slug}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          action={
            <Link
              className="text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/stories"
            >
              {copy("View all stories")}
            </Link>
          }
          description={copy(
            "Story cards now link to human-scale profiles that show how MAPLE fits into specific routines and environments.",
          )}
          eyebrow={copy("Stories")}
          title={copy("Field stories grounded in real teams")}
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

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          action={
            <Link
              className="text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/research"
            >
              {copy("Browse research")}
            </Link>
          }
          description={copy(
            "Research pages now have their own index and article layouts, with system cards and papers rewritten as MAPLE-GLOBAL narratives.",
          )}
          eyebrow={copy("Latest research")}
          title={copy("Research and systems writing for practical deployment")}
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

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          action={
            <Link
              className="text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/business"
            >
              {copy("See case studies")}
            </Link>
          }
          description={copy(
            "Business stories now sit inside their own overview page and connect back to pricing and product surfaces.",
          )}
          eyebrow={copy("MAPLE-GLOBAL for business")}
          title={copy("Customer narratives with real follow-through")}
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

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          action={
            <Link
              className="text-[14px] font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              to="/products"
            >
              {copy("Explore products")}
            </Link>
          }
          description={copy(
            "The site now has real destinations for products, developers, foundation, policies, and careers.",
          )}
          eyebrow={copy("Explore the platform")}
          title={copy("The broader MAPLE-GLOBAL ecosystem")}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {localizedProductHighlights.map((item) => (
            <Link
              className="group rounded-[28px] border border-black/5 bg-[#fbfbfd] p-7 transition-colors hover:border-black/15 dark:border-white/10 dark:bg-white/4 dark:hover:border-white/20"
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
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-black/50 dark:text-white/50" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8 md:pb-32">
        <div className="maple-reveal mx-auto max-w-[1400px] overflow-hidden rounded-[36px] border border-black/5 bg-[radial-gradient(circle_at_top_left,_#f0f6ff,_transparent_45%),linear-gradient(135deg,#ffffff,#f7f8fb_60%,#eef6ed)] px-8 py-16 text-center shadow-[0_30px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(75,93,145,0.28),_transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] dark:shadow-none md:px-12 md:py-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
            {copy("Ready to deploy")}
          </p>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[40px] font-medium leading-[1.02] tracking-[-0.05em] md:text-[64px]">
            {copy(
              "Choose a plan, launch a workflow, and scale with confidence",
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-[700px] text-[17px] leading-8 text-black/65 dark:text-white/65">
            {copy(
              "Start with self-serve access for exploration, then expand into team workspaces, foundation programs, and developer tooling as your use cases mature.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link className={secondaryActionLinkClass} to="/pricing">
              {copy("View pricing")}
            </Link>
            <Link className={secondaryActionLinkClass} to="/foundation">
              {copy("Explore foundation")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
