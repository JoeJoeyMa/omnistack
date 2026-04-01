import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

const docSections = [
  {
    title: "Quickstart",
    body: "Create a workspace, request a key, call a model, and add a reviewed automation in under an hour.",
  },
  {
    title: "Model selection",
    body: "Pick the right balance of speed, reasoning depth, and tool access for your product shape.",
  },
  {
    title: "Workflow design",
    body: "Structure prompts, approvals, and fallback paths so your AI features stay predictable in production.",
  },
  {
    title: "Deployment",
    body: "Ship with environment templates, observability, and retention controls from day one.",
  },
];

export const Route = createFileRoute("/developers/docs")({
  component: DeveloperDocsPage,
});

function DeveloperDocsPage() {
  const copy = useCopyText();
  const localizedDocSections = useLocalizedValue(docSections);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "Documentation for product and platform teams who care about implementation quality, deployment safety, and operational clarity.",
        )}
        eyebrow={copy("Developers / Docs")}
        title={copy("Documentation built for shipping teams")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "A compact docs overview covering setup, model choice, workflow design, and production deployment.",
          )}
          title={copy("Documentation map")}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {localizedDocSections.map((section) => (
            <div
              className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-7 dark:border-white/10 dark:bg-white/4"
              key={section.title}
            >
              <h3 className="text-[24px] font-medium tracking-[-0.03em]">
                {section.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
