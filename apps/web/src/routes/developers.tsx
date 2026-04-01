import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Blocks,
  BookOpen,
  Gauge,
  MessagesSquare,
} from "lucide-react";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { developerResources } from "~/lib/site-content";

const platformCards = [
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/developers/docs",
    body: "Reference architecture, quickstarts, SDK setup, and deployment patterns.",
  },
  {
    title: "Forum",
    icon: MessagesSquare,
    href: "/developers/forum",
    body: "A lightweight community space for patterns, launch notes, and implementation questions.",
  },
  {
    title: "Status",
    icon: Gauge,
    href: "/developers/status",
    body: "Operational visibility for API uptime, incident response, and change windows.",
  },
  {
    title: "Workflow blocks",
    icon: Blocks,
    href: "/products",
    body: "The building blocks behind MAPLE automation, structured review, and tool use.",
  },
];

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Developer resources for building on top of MAPLE-GLOBAL models, workflows, and interfaces.",
      },
    ],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  const copy = useCopyText();
  const localizedDeveloperResources = useLocalizedValue(developerResources);
  const localizedPlatformCards = useLocalizedValue(platformCards);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        actions={[
          { label: copy("Read docs"), href: "/developers/docs" },
          { label: copy("Get API pricing"), href: "/pricing" },
        ]}
        accent="from-[#e9f1ff] via-[#f5f2ff] to-[#eef8ef]"
        description={copy(
          "The developer platform brings together docs, pricing, workflow building blocks, and operational visibility in one production-ready surface.",
        )}
        eyebrow={copy("Developers")}
        title={copy("Developer resources for production teams")}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Everything a product or platform team needs to evaluate, implement, and operate MAPLE in production.",
          )}
          eyebrow={copy("Developer hub")}
          title={copy("Everything builders need in one place")}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localizedPlatformCards.map((card) => (
            <Link
              className="group rounded-[28px] border border-black/5 bg-[#fbfbfd] p-7 transition-colors hover:border-black/15 dark:border-white/10 dark:bg-white/4 dark:hover:border-white/20"
              key={card.title}
              to={card.href}
            >
              <card.icon className="h-6 w-6 text-black/75 dark:text-white/75" />
              <h3 className="mt-5 text-[22px] font-medium tracking-[-0.03em] group-hover:underline">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {card.body}
              </p>
              <ArrowUpRight className="mt-5 h-5 w-5 text-black/55 dark:text-white/55" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-18 lg:px-8 md:pb-24">
        <SectionIntro
          description={copy(
            "A compact resource list for teams who need to go from evaluation to implementation quickly.",
          )}
          eyebrow={copy("Core resources")}
          title={copy("Start here")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {localizedDeveloperResources.map((resource) => (
            <Link
              className="rounded-[24px] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/4"
              key={resource.title}
              to={resource.href}
            >
              <h3 className="text-[21px] font-medium tracking-[-0.03em]">
                {resource.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {resource.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
