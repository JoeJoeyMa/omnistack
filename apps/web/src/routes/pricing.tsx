import { createFileRoute, Link } from "@tanstack/react-router";

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
    tagline: "Our most capable model for complex, multi-step reasoning",
    context: "200k context window",
    price: {
      input: "$2.50 / 1M tokens",
      cachedInput: "$1.25 / 1M tokens",
      output: "$10.00 / 1M tokens",
    },
  },
  {
    name: "MAPLE-Core Mini",
    tagline: "A faster, cost-efficient model for well-defined tasks",
    context: "128k context window",
    price: {
      input: "$0.30 / 1M tokens",
      cachedInput: "$0.15 / 1M tokens",
      output: "$1.20 / 1M tokens",
    },
  },
];

const fineTuningModels = [
  { name: "maple-core-4.1", inputTrain: "$25.00 / 1M tokens", inputInfer: "$3.00 / 1M tokens", outputInfer: "$12.00 / 1M tokens" },
  { name: "maple-core-4.1-mini", inputTrain: "$4.00 / 1M tokens", inputInfer: "$0.40 / 1M tokens", outputInfer: "$1.60 / 1M tokens" },
  { name: "maple-core-4.1-nano", inputTrain: "$0.80 / 1M tokens", inputInfer: "$0.10 / 1M tokens", outputInfer: "$0.40 / 1M tokens" },
  { name: "maple-4o-mini", inputTrain: "$3.00 / 1M tokens", inputInfer: "$0.30 / 1M tokens", outputInfer: "$1.20 / 1M tokens" },
];

const apiRows: { category?: string; model: string; input: string; cachedInput: string; output: string }[] = [
  { category: "Text & Reasoning", model: "maple-core-pro", input: "$2.50 / 1M", cachedInput: "$1.25 / 1M", output: "$10.00 / 1M" },
  { model: "maple-core-pro-mini", input: "$0.30 / 1M", cachedInput: "$0.15 / 1M", output: "$1.20 / 1M" },
  { model: "maple-4o", input: "$2.00 / 1M", cachedInput: "$1.00 / 1M", output: "$8.00 / 1M" },
  { model: "maple-4o-mini", input: "$0.15 / 1M", cachedInput: "$0.075 / 1M", output: "$0.60 / 1M" },
  { category: "Audio", model: "maple-audio-1.5", input: "$32.00 / 1M", cachedInput: "$0.40 / 1M", output: "$64.00 / 1M" },
  { model: "maple-audio-1", input: "$10.00 / 1M", cachedInput: "$0.30 / 1M", output: "$20.00 / 1M" },
  { category: "Image", model: "maple-image-pro", input: "$5.00 / 1M", cachedInput: "$0.50 / 1M", output: "—" },
  { model: "maple-image-mini", input: "$0.80 / 1M", cachedInput: "$0.08 / 1M", output: "—" },
  { category: "Embeddings", model: "maple-embed-3-large", input: "$0.13 / 1M", cachedInput: "—", output: "—" },
  { model: "maple-embed-3-small", input: "$0.02 / 1M", cachedInput: "—", output: "—" },
];

const planCards = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    desc: "Try MAPLE-GLOBAL for hobby projects and personal use.",
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
    desc: "For professionals who want more capability and speed.",
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
    desc: "Secure collaboration workspace for your whole team.",
    highlight: false,
    cta: "Start free trial",
    ctaHref: "/login",
    features: [
      "Everything in Pro",
      "Shared team workspace",
      "Admin console",
      "SSO & SAML (coming soon)",
      "Priority support",
      "Usage analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Advanced controls, compliance, and dedicated support.",
    highlight: false,
    cta: "Contact sales",
    ctaHref: "mailto:sales@maple-global.ai",
    features: [
      "Unlimited everything",
      "Enterprise SSO & SCIM",
      "Custom data retention",
      "Dedicated account manager",
      "99.9% SLA uptime",
      "Custom model fine-tuning",
    ],
  },
];

function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Hero */}
      <div className="pt-36 pb-24 text-center px-6">
        <h1 className="text-[56px] md:text-[72px] font-medium tracking-tight leading-[1.05] text-black dark:text-white">
          API Pricing
        </h1>
        <p className="mt-4 text-[18px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Pay only for what you use. No monthly minimums, no hidden fees.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="mailto:sales@maple-global.ai"
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-black dark:bg-white px-8 text-[15px] font-medium text-white dark:text-black hover:opacity-80 transition-opacity"
          >
            Contact sales
          </a>
          <Link
            to="/login"
            className="inline-flex h-[48px] items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-8 text-[15px] font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Get API key
          </Link>
        </div>
      </div>

      {/* Plan cards */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">Plans</h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">Choose the plan that fits your workflow.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {planCards.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[20px] border p-7 flex flex-col ${
                plan.highlight
                  ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-[11px] font-semibold text-white uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-[14px] font-semibold uppercase tracking-widest opacity-60">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-[40px] font-medium leading-none">{plan.price}</span>
                  {plan.period && <span className="pb-1 text-[14px] opacity-60">{plan.period}</span>}
                </div>
                <p className={`mt-3 text-[14px] leading-relaxed ${plan.highlight ? "opacity-80" : "text-gray-500 dark:text-gray-400"}`}>
                  {plan.desc}
                </p>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px]">
                    <span className={`mt-0.5 shrink-0 text-[16px] ${plan.highlight ? "opacity-80" : "text-green-600 dark:text-green-400"}`}>✓</span>
                    <span className={plan.highlight ? "opacity-90" : "text-gray-700 dark:text-gray-300"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className={`w-full inline-flex h-[44px] items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
                  plan.highlight
                    ? "bg-white dark:bg-black text-black dark:text-white hover:opacity-80"
                    : "border border-gray-300 dark:border-white/20 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship models */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">Flagship models</h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          Our frontier models spend more time reasoning before responding, making them ideal for complex, multi-step problems.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {flagshipModels.map((model) => (
            <div
              key={model.name}
              className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8"
            >
              <h3 className="text-[24px] font-medium text-black dark:text-white">{model.name}</h3>
              <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">{model.tagline}</p>
              <p className="mt-1 text-[13px] text-gray-400 dark:text-gray-500">{model.context}</p>
              <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-5">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Price</p>
                <div className="space-y-1.5 text-[15px] text-gray-700 dark:text-gray-300">
                  <div>Input: <span className="font-medium text-black dark:text-white">{model.price.input}</span></div>
                  <div>Cached input: <span className="font-medium text-black dark:text-white">{model.price.cachedInput}</span></div>
                  <div>Output: <span className="font-medium text-black dark:text-white">{model.price.output}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[16px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-7 py-6 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
          <p>Pricing above reflects standard processing rates for context lengths under 270K.</p>
          <ul className="mt-3 space-y-2">
            <li>• <strong>Batch API:</strong> Save 50% on inputs and outputs by running tasks asynchronously over 24 hours.</li>
            <li>• <strong>Priority processing:</strong> Reliable, high-speed performance with pay-as-you-go flexibility.</li>
          </ul>
        </div>
      </section>

      {/* Fine-tuning models */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">Fine-tuning our models</h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          Customize our models to get higher performance for your specific use cases.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fineTuningModels.map((m) => (
            <div key={m.name} className="rounded-[16px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <h4 className="text-[16px] font-medium text-black dark:text-white mb-5">{m.name}</h4>
              <div className="space-y-2 text-[13px] text-gray-500 dark:text-gray-400">
                <div>Training: <span className="block text-black dark:text-white font-medium">{m.inputTrain}</span></div>
                <div>Input: <span className="block text-black dark:text-white font-medium">{m.inputInfer}</span></div>
                <div>Output: <span className="block text-black dark:text-white font-medium">{m.outputInfer}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API pricing table */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-24">
        <h2 className="text-[32px] font-medium text-center mb-3 text-black dark:text-white">All API models</h2>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 text-center mb-12">
          Full pricing table for all available MAPLE-GLOBAL API endpoints.
        </p>
        <div className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/10 text-[12px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5">
            <span>Model</span>
            <span>Input</span>
            <span>Cached Input</span>
            <span>Output</span>
          </div>
          {apiRows.map((row, i) => (
            <div key={i}>
              {row.category && (
                <div className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/60 dark:bg-white/3 border-b border-gray-100 dark:border-white/10">
                  {row.category}
                </div>
              )}
              <div className={`grid grid-cols-[200px_1fr_1fr_1fr] gap-4 px-6 py-4 text-[14px] border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${i === apiRows.length - 1 ? "border-0" : ""}`}>
                <span className="font-medium text-black dark:text-white">{row.model}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.input}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.cachedInput}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.output}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto pb-32">
        <div className="w-full bg-black dark:bg-white rounded-[32px] py-20 px-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-[40px] font-medium text-white dark:text-black leading-[1.1] mb-4">
            Start building today
          </h2>
          <p className="text-[16px] text-white/70 dark:text-black/70 mb-8 max-w-lg mx-auto">
            Get your API key in minutes. No credit card required to start.
          </p>
          <Link
            to="/login"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-white dark:bg-black px-10 text-[15px] font-medium text-black dark:text-white hover:opacity-80 transition-opacity"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}
