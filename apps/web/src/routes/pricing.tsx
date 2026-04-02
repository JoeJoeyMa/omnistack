import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLink } from "~/components/site/site-link";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "Simple, transparent pricing for MAPLE-GLOBAL AI models and APIs. Pay only for what you use.",
      },
    ],
  }),
  component: PricingPage,
});

const flagshipModels = [
  {
    name: "MAPLE-Core Pro",
    tagline:
      "Our most capable model for complex reasoning and reviewed workflows",
    context: "200k context window",
    price: {
      input: "$2.50 / 1M tokens",
      cachedInput: "$1.25 / 1M tokens",
      output: "$10.00 / 1M tokens",
    },
  },
  {
    name: "MAPLE-Core Mini",
    tagline:
      "A faster, lower-cost model for well-defined tasks and operational support",
    context: "128k context window",
    price: {
      input: "$0.30 / 1M tokens",
      cachedInput: "$0.15 / 1M tokens",
      output: "$1.20 / 1M tokens",
    },
  },
];

const fineTuningModels = [
  {
    name: "maple-core-4.1",
    inputTrain: "$25.00 / 1M tokens",
    inputInfer: "$3.00 / 1M tokens",
    outputInfer: "$12.00 / 1M tokens",
  },
  {
    name: "maple-core-4.1-mini",
    inputTrain: "$4.00 / 1M tokens",
    inputInfer: "$0.40 / 1M tokens",
    outputInfer: "$1.60 / 1M tokens",
  },
  {
    name: "maple-core-4.1-nano",
    inputTrain: "$0.80 / 1M tokens",
    inputInfer: "$0.10 / 1M tokens",
    outputInfer: "$0.40 / 1M tokens",
  },
  {
    name: "maple-4o-mini",
    inputTrain: "$3.00 / 1M tokens",
    inputInfer: "$0.30 / 1M tokens",
    outputInfer: "$1.20 / 1M tokens",
  },
];

const apiRows: {
  category?: string;
  model: string;
  input: string;
  cachedInput: string;
  output: string;
}[] = [
  {
    category: "Text & Reasoning",
    model: "maple-core-pro",
    input: "$2.50 / 1M",
    cachedInput: "$1.25 / 1M",
    output: "$10.00 / 1M",
  },
  {
    model: "maple-core-pro-mini",
    input: "$0.30 / 1M",
    cachedInput: "$0.15 / 1M",
    output: "$1.20 / 1M",
  },
  {
    model: "maple-4o",
    input: "$2.00 / 1M",
    cachedInput: "$1.00 / 1M",
    output: "$8.00 / 1M",
  },
  {
    model: "maple-4o-mini",
    input: "$0.15 / 1M",
    cachedInput: "$0.075 / 1M",
    output: "$0.60 / 1M",
  },
  {
    category: "Audio",
    model: "maple-audio-1.5",
    input: "$32.00 / 1M",
    cachedInput: "$0.40 / 1M",
    output: "$64.00 / 1M",
  },
  {
    model: "maple-audio-1",
    input: "$10.00 / 1M",
    cachedInput: "$0.30 / 1M",
    output: "$20.00 / 1M",
  },
  {
    category: "Image",
    model: "maple-image-pro",
    input: "$5.00 / 1M",
    cachedInput: "$0.50 / 1M",
    output: "—",
  },
  {
    model: "maple-image-mini",
    input: "$0.80 / 1M",
    cachedInput: "$0.08 / 1M",
    output: "—",
  },
  {
    category: "Embeddings",
    model: "maple-embed-3-large",
    input: "$0.13 / 1M",
    cachedInput: "—",
    output: "—",
  },
  {
    model: "maple-embed-3-small",
    input: "$0.02 / 1M",
    cachedInput: "—",
    output: "—",
  },
];

const planCards = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    desc: "Start with personal exploration and lightweight evaluation.",
    highlight: false,
    cta: "Get started",
    ctaHref: "/login",
    features: [
      "Access to MAPLE-Core Mini",
      "50 messages / day",
      "Standard response speed",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$20",
    period: "/ month",
    desc: "For individual professionals who need more capability and throughput.",
    highlight: true,
    cta: "Start free trial",
    ctaHref: "/login",
    features: [
      "Access to all MAPLE models",
      "Unlimited messages",
      "Priority response speed",
      "Advanced data analysis",
      "Image generation",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "$30",
    period: "/ user / month",
    desc: "Shared workspaces and governance for collaborative teams.",
    highlight: false,
    cta: "Start free trial",
    ctaHref: "/login",
    features: [
      "Everything in Pro",
      "Shared team workspace",
      "Admin console",
      "SSO & SAML support",
      "Priority support",
      "Usage analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Advanced controls, compliance support, and a dedicated delivery model.",
    highlight: false,
    cta: "Contact sales",
    ctaHref: "mailto:sales@maple-global.ai",
    features: [
      "Unlimited usage tiers",
      "Enterprise SSO & SCIM",
      "Custom data retention",
      "Dedicated account manager",
      "99.9% SLA uptime",
      "Custom model fine-tuning",
    ],
  },
];

const faqItems = [
  {
    question: "Can MAPLE-GLOBAL work with our existing cloud and auth stack?",
    answer:
      "Yes. The business and developer plans are designed to sit on top of your current identity, storage, and observability setup rather than replace it outright.",
  },
  {
    question: "Do enterprise plans include rollout support?",
    answer:
      "Yes. Enterprise customers get onboarding guidance, implementation planning, and support for security and procurement reviews.",
  },
  {
    question: "Can we start on the API and add workspace seats later?",
    answer:
      "Absolutely. The platform is designed so teams can begin with one surface and expand into workspace or automation features as usage matures.",
  },
];

function PricingPage() {
  const copy = useCopyText();
  const localizedApiRows = useLocalizedValue(apiRows);
  const localizedFaqItems = useLocalizedValue(faqItems);
  const localizedFineTuningModels = useLocalizedValue(fineTuningModels);
  const localizedFlagshipModels = useLocalizedValue(flagshipModels);
  const localizedPlanCards = useLocalizedValue(planCards);

  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white">
      <div className="pt-36 pb-24 text-center px-6">
        <h1 className="text-[56px] md:text-[72px] font-medium tracking-tight leading-[1.05] text-black dark:text-white">
          {copy("Pricing for teams building with MAPLE-GLOBAL")}
        </h1>
        <p className="mt-4 text-[18px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          {copy(
            "Flexible access for product teams, internal operators, and enterprise programs.",
          )}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="mailto:sales@maple-global.ai"
            className={siteButtonClass({ size: "hero", variant: "secondary" })}
          >
            {copy("Contact sales")}
          </a>
          <Link
            to="/login"
            className={siteButtonClass({ size: "hero", variant: "outline" })}
          >
            {copy("Get API key")}
          </Link>
        </div>
      </div>

      <section id="tiers" className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">
          {copy("Plans")}
        </h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          {copy(
            "Choose the plan aligned with your usage, governance, and support needs.",
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {localizedPlanCards.map((plan) => (
            <div
              key={plan.name}
              id={plan.name === "Enterprise" ? "enterprise" : undefined}
              className={`relative rounded-[20px] border p-7 flex flex-col bg-white dark:bg-white/5 ${
                plan.highlight
                  ? "border-black/20 dark:border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none"
                  : "border-gray-200 dark:border-white/10"
              }`}
            >
              {plan.highlight ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-[11px] font-semibold text-white uppercase tracking-wider">
                  {copy("Most popular")}
                </span>
              ) : null}
              <div className="mb-6">
                <h3 className="text-[14px] font-semibold uppercase tracking-widest opacity-60 text-black dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-end gap-1 text-black dark:text-white">
                  <span className="text-[40px] font-medium leading-none">
                    {plan.price}
                  </span>
                  {plan.period ? (
                    <span className="pb-1 text-[14px] opacity-60">
                      {plan.period}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-500 dark:text-gray-400">
                  {plan.desc}
                </p>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[14px]"
                  >
                    <span className="mt-0.5 shrink-0 text-[16px] text-green-600 dark:text-green-400">
                      ✓
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <SiteLink
                className={siteButtonClass({
                  className: "w-full h-[44px] px-5 text-[14px]",
                  size: "sm",
                  variant: plan.highlight ? "secondary" : "outline",
                })}
                href={plan.ctaHref}
              >
                {plan.cta}
              </SiteLink>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">
          {copy("Flagship models")}
        </h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          {copy(
            "Our most capable models are designed for complex reasoning, reviewed workflows, and production-grade deployment.",
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {localizedFlagshipModels.map((model) => (
            <div
              key={model.name}
              className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8"
            >
              <h3 className="text-[24px] font-medium text-black dark:text-white">
                {model.name}
              </h3>
              <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
                {model.tagline}
              </p>
              <p className="mt-1 text-[13px] text-gray-400 dark:text-gray-500">
                {model.context}
              </p>
              <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-5">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                  {copy("Price")}
                </p>
                <div className="space-y-1.5 text-[15px] text-gray-700 dark:text-gray-300">
                  <div>
                    {copy("Input")}:{" "}
                    <span className="font-medium text-black dark:text-white">
                      {model.price.input}
                    </span>
                  </div>
                  <div>
                    {copy("Cached input")}:{" "}
                    <span className="font-medium text-black dark:text-white">
                      {model.price.cachedInput}
                    </span>
                  </div>
                  <div>
                    {copy("Output")}:{" "}
                    <span className="font-medium text-black dark:text-white">
                      {model.price.output}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[16px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-7 py-6 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            {copy(
              "Pricing above reflects standard processing rates for context lengths under 270K.",
            )}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              • <strong>{copy("Batch API")}:</strong>{" "}
              {copy(
                "Save 50% on inputs and outputs by running tasks asynchronously over 24 hours.",
              )}
            </li>
            <li>
              • <strong>{copy("Priority processing")}:</strong>{" "}
              {copy(
                "Reliable, high-speed performance with pay-as-you-go flexibility.",
              )}
            </li>
          </ul>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">
          {copy("Fine-tuning our models")}
        </h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          {copy(
            "Customize MAPLE models for domain-specific workflows, higher precision, and better operational fit.",
          )}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {localizedFineTuningModels.map((model) => (
            <div
              key={model.name}
              className="rounded-[16px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6"
            >
              <h4 className="text-[16px] font-medium text-black dark:text-white mb-5">
                {model.name}
              </h4>
              <div className="space-y-2 text-[13px] text-gray-500 dark:text-gray-400">
                <div>
                  {copy("Training")}:{" "}
                  <span className="block text-black dark:text-white font-medium">
                    {model.inputTrain}
                  </span>
                </div>
                <div>
                  {copy("Input")}:{" "}
                  <span className="block text-black dark:text-white font-medium">
                    {model.inputInfer}
                  </span>
                </div>
                <div>
                  {copy("Output")}:{" "}
                  <span className="block text-black dark:text-white font-medium">
                    {model.outputInfer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="compare"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24"
      >
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">
          {copy("All API models")}
        </h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          {copy("Full pricing across available MAPLE-GLOBAL API endpoints.")}
        </p>
        <div className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/10 text-[12px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5">
            <span>{copy("Model")}</span>
            <span>{copy("Input")}</span>
            <span>{copy("Cached Input")}</span>
            <span>{copy("Output")}</span>
          </div>
          {localizedApiRows.map((row, i) => (
            <div key={`${row.category ?? "row"}-${row.model}`}>
              {row.category ? (
                <div className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/60 dark:bg-white/3 border-b border-gray-100 dark:border-white/10">
                  {row.category}
                </div>
              ) : null}
              <div
                className={`grid grid-cols-[200px_1fr_1fr_1fr] gap-4 px-6 py-4 text-[14px] border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                  i === apiRows.length - 1 ? "border-0" : ""
                }`}
              >
                <span className="font-medium text-black dark:text-white">
                  {row.model}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {row.input}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {row.cachedInput}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {row.output}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">
          {copy("Pricing FAQ")}
        </h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          {copy(
            "Answers for teams comparing self-serve access, governed rollout, and enterprise support.",
          )}
        </p>
        <div className="space-y-4">
          {localizedFaqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-[18px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-5"
            >
              <h3 className="text-[18px] font-medium text-black dark:text-white">
                {item.question}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-gray-600 dark:text-gray-400">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto pb-32">
        <div className="w-full bg-gray-50 dark:bg-white/5 rounded-[32px] py-20 px-8 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-white/5">
          <h2 className="text-[40px] font-medium text-black dark:text-white leading-[1.1] mb-4">
            {copy("Start building today")}
          </h2>
          <p className="text-[16px] text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            {copy(
              "Get your API key in minutes and move from evaluation to implementation quickly.",
            )}
          </p>
          <Link
            to="/login"
            className={siteButtonClass({ size: "xl", variant: "secondary" })}
          >
            {copy("Get started free")}
          </Link>
        </div>
      </section>
    </div>
  );
}
