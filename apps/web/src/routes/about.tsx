import { createFileRoute, Link } from "@tanstack/react-router";

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
  { year: "2022", event: "MAPLE-GLOBAL founded with a mission to build safe, beneficial AI." },
  { year: "2023", event: "Launched MAPLE-Core, our first large language model, reaching 1M users in 3 months." },
  { year: "2024", event: "Released MAPLE-Core Pro and the API Platform, powering 10,000+ applications worldwide." },
  { year: "2025", event: "Introduced multi-modal capabilities with image and audio understanding." },
  { year: "2026", event: "MAPLE-Global for Business launched, serving enterprise customers across 50+ countries." },
];

const values = [
  {
    title: "Safety first",
    body: "We believe safety and helpfulness are complementary. We invest deeply in alignment research, red-teaming, and responsible deployment before every release.",
  },
  {
    title: "Broad benefit",
    body: "MAPLE-GLOBAL's mission is not to serve any single entity. We build AI that creates value for individuals, teams, and society at large.",
  },
  {
    title: "Transparency",
    body: "We publish system cards, usage policies, and safety evaluations for our models. We believe openness builds trust.",
  },
  {
    title: "Scientific rigor",
    body: "We approach AI development like scientists—testing hypotheses, measuring outcomes, and iterating toward better solutions.",
  },
];

const updates = [
  { title: "MAPLE-Core Pro 2.0 — deeper reasoning across complex domains", cat: "Research", date: "Mar 2026", bg: "bg-[#dbeafe]" },
  { title: "Introducing MAPLE-GLOBAL for Teams — shared workspaces with enterprise-grade controls", cat: "Product", date: "Feb 2026", bg: "bg-[#fce7f3]" },
  { title: "AI Safety Report 2025 — how we evaluate model behavior before deployment", cat: "Safety", date: "Jan 2026", bg: "bg-[#dcfce7]" },
  { title: "MAPLE Open Research Program — grants for academic AI research", cat: "Company", date: "Dec 2025", bg: "bg-[#fef9c3]" },
];

function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Hero */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pt-36 pb-20 text-center">
        <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">Company</p>
        <h1 className="text-[72px] md:text-[96px] font-medium tracking-tight leading-[1.0] text-black dark:text-white">
          About
        </h1>
        <p className="mt-8 text-[20px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          MAPLE-GLOBAL is an AI research and product company. Our mission is to
          ensure that artificial intelligence benefits all of humanity.
        </p>
      </div>

      {/* Vision section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-[40px] md:text-[48px] font-medium leading-[1.1] text-black dark:text-white">
              Our vision for the future of AI
            </h2>
            <p className="mt-5 text-[17px] text-gray-600 dark:text-gray-400 leading-relaxed">
              We believe AI will be one of the most transformative technologies ever built.
              Our goal is to develop it responsibly, make it broadly accessible, and ensure
              it benefits not just a few, but everyone.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="#our-approach"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-black dark:bg-white px-8 text-[14px] font-medium text-white dark:text-black hover:opacity-80 transition-opacity"
              >
                Our plan for AGI
              </a>
              <Link
                to="/"
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-8 text-[14px] font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                Our Charter →
              </Link>
            </div>
          </div>
          {/* Abstract art placeholder */}
          <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#a8d8ea] via-[#d6e8b5] to-[#f9c88a]" />
        </div>
      </section>

      {/* Mission quote */}
      <section className="bg-white dark:bg-white/5 border-y border-gray-200 dark:border-white/10 py-20 mb-28">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <p className="text-[28px] md:text-[36px] font-medium leading-[1.4] text-black dark:text-white">
            "We are building safe and beneficial AI, but will also consider our mission
            fulfilled if our work aids others to achieve this outcome."
          </p>
        </div>
      </section>

      {/* Our values */}
      <section id="our-approach" className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[32px] font-medium text-black dark:text-white">What we believe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              <h3 className="text-[22px] font-medium text-black dark:text-white mb-3">{v.title}</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full-width team photo placeholder */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <div className="w-full h-[420px] rounded-[24px] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
          <p className="text-[16px] text-gray-400 dark:text-gray-500">Team photo — MAPLE-GLOBAL HQ, 2026</p>
        </div>
      </section>

      {/* Learn more — tabs */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <h2 className="text-[28px] font-medium text-black dark:text-white mb-8">Learn more about what we do</h2>
        <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-10">
          {["Research", "Products"].map((tab, i) => (
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
          {updates.map((item) => (
            <Link to="/" key={item.title} className="group block text-black dark:text-white">
              <div className={`w-full aspect-[4/3] rounded-[16px] overflow-hidden ${item.bg} mb-4 group-hover:opacity-95 transition-opacity`} />
              <h3 className="text-[15px] font-medium group-hover:underline leading-snug">{item.title}</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                {item.cat} · {item.date}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <h2 className="text-[32px] font-medium text-black dark:text-white mb-12">Our journey</h2>
        <div className="relative border-l-2 border-gray-200 dark:border-white/10 pl-8 space-y-10">
          {milestones.map((m) => (
            <div key={m.year} className="relative">
              <div className="absolute -left-[37px] top-0.5 w-4 h-4 rounded-full bg-black dark:bg-white border-4 border-[#f5f5f7] dark:border-[#0a0a0a]" />
              <p className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{m.year}</p>
              <p className="text-[17px] text-gray-800 dark:text-gray-200 leading-relaxed">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-28">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[32px] font-medium text-black dark:text-white">Leadership</h2>
          <Link to="/" className="text-[14px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {leadersData.map((leader) => (
            <div key={leader.name} className="text-center group">
              <div className="w-full aspect-square rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/20 flex items-center justify-center mb-4 text-[24px] font-semibold text-gray-600 dark:text-gray-400">
                {leader.initial}
              </div>
              <h3 className="text-[14px] font-semibold text-black dark:text-white leading-tight group-hover:underline">
                {leader.name}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">{leader.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Careers CTA */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-32">
        <div className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] py-20 px-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-[40px] font-medium text-black dark:text-white leading-[1.1] mb-4">
            Careers at MAPLE-GLOBAL
          </h2>
          <p className="text-[16px] text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            We're a small team doing ambitious work. If you're passionate about AI safety and building products people love, we'd love to hear from you.
          </p>
          <Link
            to="/"
            className="inline-flex h-[52px] items-center justify-center rounded-full border border-gray-300 dark:border-white/20 px-10 text-[15px] font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            View all careers
          </Link>
        </div>
      </section>
    </div>
  );
}
