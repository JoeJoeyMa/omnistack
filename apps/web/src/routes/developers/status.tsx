import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

const incidents = [
  {
    title: "API platform",
    status: "Operational",
    note: "No active incidents. Median latency is within target range.",
  },
  {
    title: "Workspace sync",
    status: "Operational",
    note: "Background sync is stable across active regions.",
  },
  {
    title: "Automation runner",
    status: "Monitoring",
    note: "Watching an elevated retry rate on long-running jobs.",
  },
];

export const Route = createFileRoute("/developers/status")({
  component: DeveloperStatusPage,
});

function DeveloperStatusPage() {
  const copy = useCopyText();
  const localizedIncidents = useLocalizedValue(incidents);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "Operational visibility for teams depending on MAPLE APIs, workspaces, and automations.",
        )}
        eyebrow={copy("Developers / Status")}
        title={copy("Platform health at a glance")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy("Current service posture and watch items.")}
          title={copy("Live service summary")}
        />
        <div className="space-y-4">
          {localizedIncidents.map((incident) => (
            <div
              className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-6 dark:border-white/10 dark:bg-white/4"
              key={incident.title}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[22px] font-medium tracking-[-0.03em]">
                  {incident.title}
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {incident.status}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {incident.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
