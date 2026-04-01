import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionIntro } from "~/components/site/editorial";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { policyCards } from "~/lib/site-content";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Policies | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Terms, privacy, and brand guidance for MAPLE-GLOBAL products and services.",
      },
    ],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  const copy = useCopyText();
  const localizedPolicyCards = useLocalizedValue(policyCards);

  return (
    <div className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
      <PageHero
        description={copy(
          "Policies for MAPLE-GLOBAL products, accounts, data handling, and brand use.",
        )}
        eyebrow={copy("Policies")}
        title={copy("Terms, privacy, and brand guidance")}
      />
      <section className="mx-auto max-w-[1200px] px-6 py-18 lg:px-8 md:py-24">
        <SectionIntro
          description={copy(
            "Core policy resources for customers, partners, and public-facing communications.",
          )}
          title={copy("Policy library")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {localizedPolicyCards.map((card) => (
            <Link
              className="rounded-[24px] border border-black/5 bg-[#fbfbfd] p-6 dark:border-white/10 dark:bg-white/4"
              key={card.title}
              to={card.href}
            >
              <h3 className="text-[22px] font-medium tracking-[-0.03em]">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-black/65 dark:text-white/65">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
