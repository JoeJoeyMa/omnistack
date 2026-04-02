import { createFileRoute, Link } from "@tanstack/react-router";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText, useLocalizedValue } from "~/lib/locale";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | MAPLE-GLOBAL" },
      {
        name: "description",
        content:
          "MAPLE-GLOBAL is an AI research and product company. Our mission is to build safe, beneficial AI that empowers people and organizations worldwide.",
      },
    ],
  }),
  component: AboutPage,
});

const leadersData = [
  { name: "Marcus Chen", role: "Chief Executive Officer", initial: "MC" },
  { name: "Aisha Patel", role: "Chief Technology Officer", initial: "AP" },
  { name: "Liam Thornton", role: "VP, Research", initial: "LT" },
  { name: "Sofia Reyes", role: "VP, Product", initial: "SR" },
  { name: "Jin Nakamura", role: "Head of Safety", initial: "JN" },
  { name: "Priya Mehta", role: "Head of Engineering", initial: "PM" },
];

const milestones = [
  {
    year: "2022",
    event:
      "MAPLE-GLOBAL was founded to make advanced AI more useful, reliable, and broadly accessible.",
  },
  {
    year: "2023",
    event:
      "The first MAPLE model stack launched for research, writing, and operational analysis.",
  },
  {
    year: "2024",
    event:
      "The platform expanded into APIs and governed workflows for product and systems teams.",
  },
  {
    year: "2025",
    event:
      "MAPLE introduced multimodal capabilities for image, audio, and tool-assisted work.",
  },
  {
    year: "2026",
    event:
      "MAPLE-GLOBAL for Business launched with workspace, automation, and deployment programs for enterprise teams.",
  },
];

const values = [
  {
    title: "Safety first",
    body: "We treat safety and usefulness as inseparable. Every release is shaped by alignment work, adversarial testing, and practical deployment review.",
  },
  {
    title: "Broad benefit",
    body: "MAPLE-GLOBAL is built to create value across schools, operators, and product teams rather than optimize for a single narrow audience.",
  },
  {
    title: "Transparency",
    body: "We publish system notes, product guidance, and operating policies so customers can understand how the platform behaves in practice.",
  },
  {
    title: "Scientific rigor",
    body: "We build and evaluate like a research organization: test assumptions, measure outcomes, and keep improving the system with evidence.",
  },
];

const updates = [
  {
    title: "MAPLE Reasoning 1 expands multi-step analysis for product teams",
    cat: "Research",
    date: "Mar 2026",
    bg: "bg-[#dbeafe]",
  },
  {
    title:
      "MAPLE Workspaces adds governed collaboration for cross-functional teams",
    cat: "Product",
    date: "Feb 2026",
    bg: "bg-[#fce7f3]",
  },
  {
    title:
      "AI resilience programs launch for institutions adopting MAPLE at scale",
    cat: "Safety",
    date: "Jan 2026",
    bg: "bg-[#dcfce7]",
  },
  {
    title:
      "MAPLE Foundation opens new support tracks for learning access initiatives",
    cat: "Company",
    date: "Dec 2025",
    bg: "bg-[#fef9c3]",
  },
];

function AboutPage() {
  const copy = useCopyText();
  const localizedLeaders = useLocalizedValue(leadersData);
  const localizedMilestones = useLocalizedValue(milestones);
  const localizedUpdates = useLocalizedValue(updates);
  const localizedValues = useLocalizedValue(values);

  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pt-36 pb-20 text-center">
        <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">
          {copy("Company")}
        </p>
        <h1 className="text-[72px] md:text-[96px] font-medium tracking-tight leading-[1.0] text-black dark:text-white">
          {copy("About")}
        </h1>
        <p className="mt-8 text-[20px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {copy(
            "MAPLE-GLOBAL builds AI systems for learning, research, and modern work. Our mission is to make advanced AI useful, trustworthy, and broadly beneficial.",
          )}
        </p>
      </div>

      <section
        id="research"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-[40px] md:text-[48px] font-medium leading-[1.1] text-black dark:text-white">
              {copy("Building useful, trustworthy AI")}
            </h2>
            <p className="mt-5 text-[17px] text-gray-600 dark:text-gray-400 leading-relaxed">
              {copy(
                "We believe advanced AI should expand capability without adding opacity. Our work combines model systems, product design, and operational safeguards so schools, teams, and developers can adopt AI with confidence.",
              )}
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="#trust"
                className={siteButtonClass({
                  size: "hero",
                  variant: "secondary",
                })}
              >
                {copy("Our principles")}
              </a>
              <Link
                to="/foundation"
                className={siteButtonClass({
                  size: "hero",
                  variant: "outline",
                })}
              >
                {copy("Foundation")} →
              </Link>
            </div>
          </div>
          <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-gray-100 dark:bg-white/5 relative">
            <img
              src="/images/agi_vision.webp"
              alt="Planning for AGI"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-white/5 border-y border-gray-200 dark:border-white/10 py-20 mb-28">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <p className="text-[28px] md:text-[36px] font-medium leading-[1.4] text-black dark:text-white">
            {copy(
              '"We build AI that is useful in practice, legible in operation, and aligned with the people who rely on it."',
            )}
          </p>
        </div>
      </section>

      <section id="trust" className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[32px] font-medium text-black dark:text-white">
            {copy("Our principles")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localizedValues.map((item) => (
            <div
              key={item.title}
              className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              <h3 className="text-[22px] font-medium text-black dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="journal"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28"
      >
        <div className="w-full h-[420px] rounded-[24px] overflow-hidden bg-gray-100 dark:bg-white/5 relative">
          <img
            src="/images/team_photo.png"
            alt="MAPLE-GLOBAL Team at HQ"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
          <div className="absolute bottom-6 left-8 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20">
            <p className="text-[13px] font-medium text-white drop-shadow-sm">
              {copy("Team photo — MAPLE-GLOBAL HQ, 2026")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <h2 className="text-[28px] font-medium text-black dark:text-white mb-8">
          {copy("Inside MAPLE-GLOBAL")}
        </h2>
        <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-10">
          {[copy("Research"), copy("Products")].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`pb-3 text-[16px] font-medium border-b-2 transition-colors ${
                i === 0
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "border-transparent text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {localizedUpdates.map((item) => (
            <Link
              to="/"
              key={item.title}
              className="group block text-black dark:text-white"
            >
              <div
                className={`w-full aspect-[4/3] rounded-[16px] overflow-hidden ${item.bg} mb-4 group-hover:opacity-95 transition-opacity`}
              />
              <h3 className="text-[15px] font-medium group-hover:underline leading-snug">
                {item.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                {item.cat} · {item.date}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="systems"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28"
      >
        <h2 className="text-[32px] font-medium text-black dark:text-white mb-12">
          {copy("Company milestones")}
        </h2>
        <div className="relative border-l-2 border-gray-200 dark:border-white/10 pl-8 space-y-10">
          {localizedMilestones.map((milestone) => (
            <div key={milestone.year} className="relative">
              <div className="absolute -left-[37px] top-0.5 w-4 h-4 rounded-full bg-black dark:bg-white border-4 border-[#f5f5f7] dark:border-[#0a0a0a]" />
              <p className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                {milestone.year}
              </p>
              <p className="text-[17px] text-gray-800 dark:text-gray-200 leading-relaxed">
                {milestone.event}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="delivery"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28"
      >
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[32px] font-medium text-black dark:text-white">
            {copy("Leadership")}
          </h2>
          <Link
            to="/careers"
            className="text-[14px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline font-medium"
          >
            {copy("Join us")}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {localizedLeaders.map((leader) => (
            <div key={leader.name} className="text-center group">
              <div className="w-full aspect-square rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/20 flex items-center justify-center mb-4 text-[24px] font-semibold text-gray-600 dark:text-gray-400">
                {leader.initial}
              </div>
              <h3 className="text-[14px] font-semibold text-black dark:text-white leading-tight group-hover:underline">
                {leader.name}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                {leader.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-32"
      >
        <div className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] py-20 px-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-[40px] font-medium text-black dark:text-white leading-[1.1] mb-4">
            {copy("Careers at MAPLE-GLOBAL")}
          </h2>
          <p className="text-[16px] text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            {copy(
              "We are a focused team working on ambitious systems. If you care about trustworthy AI and product craft, we would like to hear from you.",
            )}
          </p>
          <Link
            to="/careers"
            className={siteButtonClass({ size: "xl", variant: "outline" })}
          >
            {copy("View all careers")}
          </Link>
          <p className="mt-6 text-[14px] text-gray-500 dark:text-gray-400">
            {copy("Partnerships and general enquiries:")}{" "}
            <a
              className="underline decoration-gray-300 underline-offset-4 hover:text-black dark:hover:text-white"
              href="mailto:hello@maple-global.ai"
            >
              hello@maple-global.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
