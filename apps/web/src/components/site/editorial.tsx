import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText } from "~/lib/locale";
import type { EditorialEntry, NarrativeSection } from "~/lib/site-content";

type HeroAction = {
  label: string;
  href: string;
};

function ActionLink({ href, label }: HeroAction) {
  const className = siteButtonClass({ variant: "outline" });

  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        className={className}
        href={href}
        rel="noreferrer"
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {label}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions = [],
  accent = "from-[#dfe9ff] via-[#fff7ef] to-[#eef9f1]",
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
  accent?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80 dark:opacity-25`}
      />
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-8 px-6 pb-18 pt-28 lg:px-8 md:pb-22 md:pt-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
          {eyebrow}
        </p>
        <div className="max-w-[880px]">
          <h1 className="max-w-[960px] text-[44px] font-medium leading-[0.96] tracking-[-0.04em] text-black dark:text-white md:text-[72px]">
            {title}
          </h1>
          <p className="mt-5 max-w-[720px] text-[17px] leading-8 text-black/65 dark:text-white/68 md:text-[20px]">
            {description}
          </p>
        </div>
        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <ActionLink key={action.label} {...action} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-[760px]">
        {eyebrow ? (
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[30px] font-medium tracking-[-0.03em] text-black dark:text-white md:text-[42px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[16px] leading-7 text-black/65 dark:text-white/65">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function CollectionCard({
  href,
  entry,
  aspect = "aspect-[1/1]",
}: {
  href: string;
  entry: EditorialEntry;
  aspect?: string;
}) {
  return (
    <Link
      className="group flex h-full flex-col gap-5 text-black transition-colors dark:text-white"
      to={href}
    >
      <div
        className={`relative overflow-hidden rounded-[26px] border border-black/5 bg-gradient-to-br from-[#f3f6fb] to-[#ebf1ff] dark:border-white/10 dark:from-white/6 dark:to-white/3 ${aspect}`}
      >
        <img
          alt={entry.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          src={entry.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent dark:from-black/30" />
        {entry.badge ? (
          <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-semibold text-black shadow-sm backdrop-blur">
            {entry.badge}
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
          {entry.category}
        </p>
        <h3 className="text-[22px] font-medium leading-[1.18] tracking-[-0.03em] group-hover:underline">
          {entry.title}
        </h3>
        <p className="text-[15px] leading-7 text-black/65 dark:text-white/65">
          {entry.excerpt}
        </p>
        <div className="flex items-center gap-2 text-[13px] text-black/45 dark:text-white/45">
          <span>{entry.date}</span>
          <span>·</span>
          <span>{entry.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export function DetailHero({
  collectionLabel,
  entry,
  backHref,
}: {
  collectionLabel: string;
  entry: EditorialEntry;
  backHref: string;
}) {
  const copy = useCopyText();

  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(207,227,255,0.9),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(255,238,210,0.8),_transparent_36%),linear-gradient(180deg,#ffffff,rgba(255,255,255,0.6))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(68,85,135,0.35),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(90,77,48,0.22),_transparent_36%),linear-gradient(180deg,rgba(10,10,10,1),rgba(10,10,10,0.88))]" />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 pb-18 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-30">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-[14px] text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
            to={backHref}
          >
            <ArrowLeft className="h-4 w-4" />
            {copy("Back to")} {collectionLabel.toLowerCase()}
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
            {entry.category}
          </p>
          <h1 className="mt-4 max-w-[760px] text-[40px] font-medium leading-[0.98] tracking-[-0.04em] text-black dark:text-white md:text-[68px]">
            {entry.title}
          </h1>
          <p className="mt-6 max-w-[680px] text-[18px] leading-8 text-black/65 dark:text-white/68">
            {entry.summary}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-[14px] text-black/45 dark:text-white/45">
            <span>{entry.date}</span>
            <span>·</span>
            <span>{entry.readTime}</span>
          </div>
          {entry.stats?.length ? (
            <div className="mt-10 grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3">
              {entry.stats.map((stat) => (
                <div
                  className="rounded-[20px] border border-black/6 bg-white/85 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5"
                  key={stat.label}
                >
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-[24px] font-medium tracking-[-0.03em] text-black dark:text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="relative overflow-hidden rounded-[30px] border border-black/5 bg-[#ecf1f8] shadow-[0_40px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <img
            alt={entry.title}
            className="h-full min-h-[340px] w-full object-cover"
            src={entry.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
          {entry.badge ? (
            <div className="absolute left-6 top-6 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-semibold text-black backdrop-blur">
              {entry.badge}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ArticleBody({
  sections,
  aside,
}: PropsWithChildren<{
  sections: NarrativeSection[];
  aside?: ReactNode;
}>) {
  return (
    <section className="bg-[#fbfbfd] py-18 dark:bg-[#080808] md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[minmax(0,780px)_320px] lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <article
              className="rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/4 dark:shadow-none md:p-10"
              key={section.heading}
            >
              <h2 className="text-[28px] font-medium tracking-[-0.03em] text-black dark:text-white">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5 text-[17px] leading-8 text-black/72 dark:text-white/72">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-6 space-y-3 text-[16px] leading-7 text-black/72 dark:text-white/72">
                  {section.bullets.map((bullet) => (
                    <li className="flex gap-3" key={bullet}>
                      <span className="mt-2 h-2 w-2 rounded-full bg-black dark:bg-white" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.callout ? (
                <div className="mt-8 rounded-[22px] bg-[#f3f5f8] px-6 py-5 text-[18px] font-medium leading-8 tracking-[-0.02em] text-black dark:bg-white/6 dark:text-white">
                  {section.callout}
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <aside className="space-y-5 lg:pt-2">{aside}</aside>
      </div>
    </section>
  );
}

export function AsideCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href?: string;
}) {
  const copy = useCopyText();
  const content = (
    <div className="rounded-[24px] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
        {copy("Brief")}
      </p>
      <h3 className="mt-3 text-[22px] font-medium tracking-[-0.03em] text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-4 text-[15px] leading-7 text-black/65 dark:text-white/65">
        {body}
      </p>
      {href ? (
        <div className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-black dark:text-white">
          {copy("Explore")}
          <ArrowUpRight className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className="block" to={href}>
      {content}
    </Link>
  );
}

export function RelatedEntries({
  title,
  items,
  basePath,
}: {
  title: string;
  items: EditorialEntry[];
  basePath: string;
}) {
  const copy = useCopyText();

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
      <SectionIntro
        title={title}
        description={copy(
          "A few related reads to continue exploring the MAPLE-GLOBAL ecosystem.",
        )}
      />
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item) => (
          <CollectionCard
            aspect="aspect-[4/3]"
            entry={item}
            href={`${basePath}/${item.slug}`}
            key={item.slug}
          />
        ))}
      </div>
    </section>
  );
}
