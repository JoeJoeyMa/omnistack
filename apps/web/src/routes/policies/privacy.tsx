import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

const privacyBlocks = [
  {
    title: "What we collect",
    body: "Account details, usage data, support activity, and content required to deliver the service and keep it secure.",
  },
  {
    title: "How it is used",
    body: "To operate the platform, improve reliability, prevent abuse, and support customer workflows according to their plan and settings.",
  },
  {
    title: "Controls",
    body: "Workspace admins can manage retention windows, reviewer access, and export or deletion requests for eligible records.",
  },
];

export const Route = createFileRoute("/policies/privacy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const copy = useCopyText();
  const localizedPrivacyBlocks = useLocalizedValue(privacyBlocks);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "A concise overview of how MAPLE-GLOBAL collects, uses, stores, and governs data across the platform.",
        )}
        eyebrow={copy("Policies / Privacy")}
        title={copy("How MAPLE-GLOBAL handles data")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "This page summarizes the operating model behind privacy and data controls across MAPLE-GLOBAL.",
          )}
          title={copy("Privacy overview")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {localizedPrivacyBlocks.map((block) => (
            <div
              className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-6 dark:border-white/10 dark:bg-white/4"
              key={block.title}
            >
              <h3 className="text-[22px] font-medium tracking-[-0.03em]">
                {block.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
