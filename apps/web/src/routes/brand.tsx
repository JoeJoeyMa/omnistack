import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

const brandRules = [
  "Use the full MAPLE-GLOBAL name on first mention.",
  "Keep product names distinct from company language in headlines.",
  "Do not redraw, stretch, or condense the wordmark.",
  "Favor calm, editorial layouts over decorative AI tropes.",
];

export const Route = createFileRoute("/brand")({
  component: BrandPage,
});

function BrandPage() {
  const copy = useCopyText();
  const localizedBrandRules = useLocalizedValue(brandRules);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "Guidance for using the MAPLE-GLOBAL brand across product, editorial, partner, and event surfaces.",
        )}
        eyebrow={copy("Brand")}
        title={copy("MAPLE-GLOBAL brand guidance")}
      />
      <section className="mx-auto max-w-[1100px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Use these principles to keep the MAPLE-GLOBAL identity consistent across product, marketing, and partner materials.",
          )}
          title={copy("Core rules")}
        />
        <div className="rounded-[30px] border border-black/5 bg-[#fbfbfd] p-8 dark:border-white/10 dark:bg-white/4">
          <ul className="space-y-4 text-[17px] leading-8 text-black/70 dark:text-white/70">
            {localizedBrandRules.map((rule) => (
              <li className="flex gap-3" key={rule}>
                <span className="mt-2 h-2 w-2 rounded-full bg-black dark:bg-white" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
