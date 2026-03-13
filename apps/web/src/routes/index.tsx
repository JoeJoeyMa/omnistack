import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "MAPLE-GLOBAL" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="w-full bg-white text-black">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-4 border-b border-transparent">
        <div className="w-full max-w-[768px] pt-12">
          <h1 className="text-[36px] font-medium text-black text-center mb-8">
            What can I help with?
          </h1>

          <div className="relative w-full shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-3xl border border-gray-200 bg-white group transition-shadow focus-within:shadow-[0_0_20px_rgba(0,0,0,0.08)]">
            <textarea
              className="w-full bg-transparent resize-none p-4 pr-12 min-h-[140px] text-[16px] text-black outline-none placeholder:text-gray-500 rounded-3xl"
              placeholder="Explain MAPLE-GLOBAL for me"
            />
            <button className="absolute right-4 bottom-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              "Learn about MAPLE-GLOBAL Business",
              "Search with MAPLE-GLOBAL",
              "Talk with MAPLE-GLOBAL",
              "Research",
              "More",
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="px-4 py-2 rounded-full border border-gray-200 text-[14px] text-gray-600 hover:bg-gray-50 transition-colors bg-white font-medium"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent news */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto mt-24 mb-32">
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-[28px] font-medium text-black tracking-tight">Recent news</h2>
           <Link to="/" className="text-[14px] text-gray-700 hover:text-black hover:underline transition-colors font-medium">View more</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
          {[
             { title: "New ways to learn math and science in MAPLE-GLOBAL", desc: "Product \u00A0 Mar 10, 2026", bg: "bg-gradient-to-br from-[#cceef4] to-[#e8ebc3]", innerText: "Interactive\nLearning", innerColor: "text-white drop-shadow-sm" },
             { title: "Security Protocols: now in research preview", desc: "Product \u00A0 Mar 6, 2026", bg: "bg-gradient-to-br from-[#6246f9] to-[#806cfb]", innerText: "Introducing\nSecurity", innerColor: "text-white" },
             { title: "Our agreement with the Department of Global Defense", desc: "Company \u00A0 Feb 28, 2026", bg: "bg-gradient-to-br from-[#2a5b9b] to-[#124b89]", innerText: "", innerColor: "" },
             { title: "MAPLE-GLOBAL and Amazon announce strategic partnership", desc: "Company \u00A0 Feb 27, 2026", bg: "bg-gradient-to-br from-[#1268db] to-[#3a83e0]", innerText: "MAPLE-GLOBAL | amazon", innerColor: "text-white" },
          ].map((news, i) => (
             <Link to="/" key={i} className="group flex flex-col sm:flex-row gap-6 items-start">
               <div className={`w-full sm:w-[260px] aspect-square rounded-[8px] sm:rounded-[20px] overflow-hidden ${news.bg} shrink-0 p-8 flex flex-col items-center justify-center text-center relative`}>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                 {news.innerText && (
                   <span className={`z-20 text-[20px] font-semibold leading-tight whitespace-pre-line ${news.innerColor}`}>
                     {news.innerText}
                   </span>
                 )}
               </div>
               <div className="flex flex-col pt-3">
                 <h3 className="text-[22px] font-medium leading-[1.3] text-black group-hover:underline">{news.title}</h3>
                 <p className="text-[14px] text-gray-500 mt-4 font-medium">{news.desc}</p>
               </div>
             </Link>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto mb-32">
         <div className="flex justify-between items-end mb-8">
           <h2 className="text-[28px] font-medium text-black tracking-tight">Stories</h2>
           <Link to="/" className="text-[14px] text-gray-700 hover:text-black hover:underline transition-colors font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "A salvage yard in Nevada", bg: "bg-gray-200" },
             { title: "A seed farm in South Carolina", bg: "bg-gray-300" },
             { title: "A tamale shop in California", bg: "bg-gray-200" },
           ].map((story, i) => (
             <Link to="/" key={i} className="group block text-black">
                <div className={`w-full aspect-square rounded-[8px] sm:rounded-[20px] overflow-hidden ${story.bg} mb-6 relative`}>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                </div>
                <h3 className="text-[20px] font-medium group-hover:underline leading-snug">{story.title}</h3>
             </Link>
           ))}
        </div>
      </section>

      {/* Latest research */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto mb-32">
         <div className="flex justify-between items-end mb-8">
           <h2 className="text-[28px] font-medium text-black tracking-tight">Latest research</h2>
           <Link to="/" className="text-[14px] text-gray-700 hover:text-black hover:underline transition-colors font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "MAPLE-GLOBAL o1 system card", date: "Dec 5, 2025", bg: "bg-[#e2effb]" },
             { title: "Training models on specific domains", date: "Nov 12, 2025", bg: "bg-[#feeceb]" },
             { title: "Enhancing deep learning reasoning", date: "Oct 22, 2025", bg: "bg-[#dcfce7]" },
           ].map((research, i) => (
             <Link to="/" key={i} className="group block text-black">
                <div className={`w-full aspect-[4/3] rounded-[8px] sm:rounded-[20px] overflow-hidden ${research.bg} mb-6 relative`}>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                </div>
                <h3 className="text-[20px] font-medium group-hover:underline leading-snug">{research.title}</h3>
                <p className="text-[14px] text-gray-500 mt-2 font-medium">Research \u00A0 {research.date}</p>
             </Link>
           ))}
        </div>
      </section>

      {/* MAPLE-GLOBAL for business */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto mb-32">
         <div className="flex justify-between items-end mb-8">
           <h2 className="text-[28px] font-medium text-black tracking-tight">MAPLE-GLOBAL for business</h2>
           <Link to="/" className="text-[14px] text-gray-700 hover:text-black hover:underline transition-colors font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Taisei Corporation shapes the next generation of talent with MAPLE-GLOBAL", cat: "MAPLE-GLOBAL Core", bg: "bg-gray-300", logo: "TAISEI" },
             { title: "Powering tax donations with AI powered personalized recommendations", cat: "API", bg: "bg-[#fbc6ce]", logo: "TRUST BANK" },
             { title: "How Higgsfield turns simple ideas into cinematic social videos", cat: "API", bg: "bg-[#fb4a88]", logo: "Higgsfield" },
           ].map((biz, i) => (
             <Link to="/" key={i} className="group block text-black">
                <div className={`w-full aspect-square rounded-[8px] sm:rounded-[20px] overflow-hidden ${biz.bg} mb-6 relative flex items-center justify-center`}>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                   <span className={`z-20 text-[28px] md:text-[36px] font-bold ${biz.bg === 'bg-gray-300' ? 'text-white' : 'text-white'}`}>{biz.logo}</span>
                </div>
                <h3 className="text-[20px] font-medium group-hover:underline leading-snug">{biz.title}</h3>
                <p className="text-[14px] text-gray-500 mt-2 font-medium">{biz.cat}</p>
             </Link>
           ))}
        </div>
      </section>

      {/* Get started CTA */}
      <section className="px-6 lg:px-8 max-w-[1400px] mx-auto pb-32">
         <div className="w-full bg-[#f4f4f4] rounded-[24px] md:rounded-[40px] py-20 md:py-32 px-8 flex flex-col items-center justify-center text-center">
             <h2 className="text-[40px] md:text-[56px] font-medium text-black leading-[1.1] mb-8">
                Get started with MAPLE-GLOBAL
             </h2>
             <Link to="/pricing" className="inline-flex h-[52px] items-center justify-center rounded-full bg-black px-[32px] text-[16px] font-medium text-white transition-opacity hover:opacity-80">
                 Try MAPLE-GLOBAL <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
             </Link>
         </div>
      </section>
    </div>
  );
}

