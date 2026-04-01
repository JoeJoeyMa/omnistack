export type NarrativeSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  callout?: string;
};

export type EditorialEntry = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  badge?: string;
  eyebrow?: string;
  summary: string;
  excerpt: string;
  sections: NarrativeSection[];
  stats?: Array<{
    label: string;
    value: string;
  }>;
};

export type CollectionName = "news" | "stories" | "research" | "business";

export const newsEntries: EditorialEntry[] = [
  {
    slug: "guided-labs-for-math-and-science",
    title: "Guided labs bring step-by-step math and science coaching to MAPLE",
    category: "Product",
    date: "Mar 10, 2026",
    readTime: "5 min read",
    image: "/images/news_1.png",
    badge: "Interactive learning",
    eyebrow: "Recent news",
    summary:
      "MAPLE now combines interactive prompts, worked examples, and reflection checks so students can move from confusion to confidence without leaving the conversation.",
    excerpt:
      "A new guided lab experience helps students practice reasoning, not just retrieve answers.",
    stats: [
      { label: "Pilot schools", value: "42" },
      { label: "Completion lift", value: "+27%" },
      { label: "Subjects", value: "Math + science" },
    ],
    sections: [
      {
        heading: "A tutor that keeps the learner in motion",
        body: [
          "The new guided lab mode breaks a prompt into short checkpoints: define the problem, sketch a plan, test a first pass, and reflect on what changed. Instead of dropping a finished answer into the chat, MAPLE keeps students moving through the reasoning process.",
          "For teachers, that means fewer dead-end moments and more visibility into where a learner needs help. For students, it means the system feels more like a coach and less like a search box.",
        ],
      },
      {
        heading: "Built for classrooms, clubs, and self-study",
        body: [
          "Teams can now publish reusable lab templates for algebra, chemistry, physics, and data literacy. Each template can include scaffolding prompts, rubric reminders, and short reflection moments at the end of a session.",
          "Schools testing the feature told us the biggest benefit was not speed. It was persistence: students were willing to try a second and third attempt because the workflow felt guided rather than graded.",
        ],
        bullets: [
          "Teacher-authored lab templates",
          "Checkpoint-based problem solving",
          "Reflection notes saved with each session",
        ],
      },
      {
        heading: "What comes next",
        body: [
          "Over the next quarter we are extending guided labs to group activities, allowing classmates to compare approaches while preserving individual thinking time. We are also adding multilingual lab prompts for international campuses.",
        ],
        callout:
          "Our direction is simple: use AI to strengthen the learning process, not replace it.",
      },
    ],
  },
  {
    slug: "secure-workflow-capsules-preview",
    title: "Secure workflow capsules enter research preview",
    category: "Product",
    date: "Mar 6, 2026",
    readTime: "4 min read",
    image: "/images/news_2.png",
    badge: "Security preview",
    eyebrow: "Recent news",
    summary:
      "A new secure execution layer lets teams run sensitive prompts, analyses, and automations inside tightly scoped capsules with better visibility and guardrails.",
    excerpt:
      "Research preview users can test isolated workflows with clearer policy controls and audit trails.",
    stats: [
      { label: "Execution scopes", value: "Per task" },
      { label: "Audit history", value: "Full session" },
      { label: "Preview cohort", value: "Invite only" },
    ],
    sections: [
      {
        heading: "Why we built capsules",
        body: [
          "As teams started using MAPLE for operations work, they needed a way to separate experimental prompts from workflows that touched sensitive business context. Capsules create a bounded environment with explicit inputs, outputs, and retention rules.",
          "That boundary gives operators a clearer answer to a difficult question: what exactly did the system see, what did it do, and how can we reproduce it later?",
        ],
      },
      {
        heading: "Security as a workflow primitive",
        body: [
          "Instead of layering controls on at the end, capsules treat permissions, storage limits, and model access as part of the workflow definition itself. Teams can define which tools are available, how long artifacts last, and who can rerun or inspect a task.",
        ],
        bullets: [
          "Scoped model and tool access",
          "Session-level audit timelines",
          "Review queues for high-impact workflows",
        ],
      },
      {
        heading: "Preview goals",
        body: [
          "This preview is focused on learning how operators adopt explicit boundaries in practice. We are working with security, finance, and support teams to understand which defaults make sensitive work faster without making review harder.",
        ],
      },
    ],
  },
  {
    slug: "public-service-readiness-framework",
    title: "MAPLE-GLOBAL signs a public service readiness framework",
    category: "Company",
    date: "Feb 28, 2026",
    readTime: "6 min read",
    image: "/images/news_4.png",
    eyebrow: "Recent news",
    summary:
      "MAPLE-GLOBAL has entered a readiness framework to support public sector teams evaluating AI for planning, analysis, and service delivery with stronger governance requirements.",
    excerpt:
      "The framework focuses on procurement readiness, review controls, and transparent deployment practices.",
    stats: [
      { label: "Regions", value: "12" },
      { label: "Focus", value: "Governed deployment" },
      { label: "Support model", value: "Advisory + enablement" },
    ],
    sections: [
      {
        heading: "From experimentation to accountable delivery",
        body: [
          "Public institutions are moving beyond pilot projects. The challenge is no longer whether AI can help; it is how to introduce it with clear boundaries, procurement discipline, and citizen-centered outcomes.",
          "The readiness framework gives participating teams a structured path to evaluate use cases, document controls, and stage internal rollouts before any public-facing deployment.",
        ],
      },
      {
        heading: "What the framework covers",
        body: [
          "Our work includes reference architectures, procurement templates, evaluation support, and training for program leaders who need to explain AI systems to policy, legal, and operations stakeholders.",
        ],
        bullets: [
          "Use-case framing and prioritization",
          "Control reviews and human oversight plans",
          "Deployment playbooks for internal teams",
        ],
      },
      {
        heading: "A practical posture",
        body: [
          "We are approaching public service adoption the same way we approach any high-trust environment: start with bounded workflows, document the tradeoffs, and keep humans close to the decisions that matter most.",
        ],
      },
    ],
  },
  {
    slug: "northstar-cloud-alliance",
    title: "MAPLE-GLOBAL and Northstar Cloud launch an enterprise alliance",
    category: "Company",
    date: "Feb 27, 2026",
    readTime: "5 min read",
    image: "/images/news_3.png",
    badge: "Alliance",
    eyebrow: "Recent news",
    summary:
      "The partnership combines MAPLE's reasoning and workflow layer with Northstar's infrastructure footprint so large teams can roll out AI programs with fewer integration bottlenecks.",
    excerpt:
      "A joint go-to-market program will support enterprise workspaces, automation services, and managed onboarding.",
    stats: [
      { label: "Joint offering", value: "Workspace + infra" },
      { label: "Primary market", value: "Enterprise" },
      { label: "Rollout window", value: "Q2 2026" },
    ],
    sections: [
      {
        heading: "Closing the last mile of deployment",
        body: [
          "Many enterprise AI programs stall between prototype and rollout. The intelligence layer may work, but security reviews, provisioning, data controls, and onboarding introduce friction that slows adoption.",
          "This alliance is designed to reduce that friction. Customers can pair MAPLE's workflow and model services with a managed deployment path that fits their existing cloud footprint.",
        ],
      },
      {
        heading: "What customers will see first",
        body: [
          "Early customers will get faster workspace setup, clearer environment templates, and a single implementation path for admin controls, observability, and rollout support.",
        ],
        bullets: [
          "Reference environment blueprints",
          "Managed onboarding sprints",
          "Shared delivery support for launch teams",
        ],
      },
      {
        heading: "Why this matters now",
        body: [
          "The market is shifting from isolated demos to integrated operating systems for knowledge work. Partnerships that reduce implementation overhead will define which programs actually stick.",
        ],
      },
    ],
  },
];

export const storyEntries: EditorialEntry[] = [
  {
    slug: "reno-reclamation-yard",
    title:
      "A reclamation yard in Reno turns intake chaos into searchable work orders",
    category: "Story",
    date: "Mar 4, 2026",
    readTime: "4 min read",
    image: "/images/story_1.png",
    eyebrow: "Stories",
    summary:
      "A family-run operation now uses MAPLE to convert photos, handwritten notes, and part requests into cleaner job records for the team on the ground.",
    excerpt:
      "The business replaced ad hoc text messages with a shared intake system that is easier to search and update.",
    sections: [
      {
        heading: "Before MAPLE",
        body: [
          "The yard relied on photos in group chats, sticky notes on desks, and memory. Staff knew the business well, but information scattered as soon as several jobs arrived at once.",
          "That made pricing slower and created extra callbacks when customers asked about timing or inventory.",
        ],
      },
      {
        heading: "What changed",
        body: [
          "MAPLE now turns incoming notes into structured job drafts with customer details, part numbers, and pickup status. The team reviews each draft before it becomes a work order, so nothing is automatic without a human in the loop.",
          "The owners say the biggest win is not automation. It is shared context: anyone on site can now understand what is happening without chasing the original message trail.",
        ],
      },
      {
        heading: "The result",
        body: [
          "Fewer missed callbacks, faster quote preparation, and a calmer handoff between the front desk and the lot team.",
        ],
        callout:
          "When small businesses say they need AI, they often mean they need less ambiguity.",
      },
    ],
  },
  {
    slug: "charleston-seed-cooperative",
    title:
      "A seed cooperative in Charleston maps seasonal decisions with one shared workspace",
    category: "Story",
    date: "Feb 24, 2026",
    readTime: "5 min read",
    image: "/images/story_2.png",
    eyebrow: "Stories",
    summary:
      "MAPLE helps the cooperative pull together weather notes, shipping updates, and crop guidance so field teams can plan with less back-and-forth.",
    excerpt:
      "The cooperative now uses a shared workspace to compare scenarios before seed shipments go out.",
    sections: [
      {
        heading: "Planning around uncertainty",
        body: [
          "The cooperative's challenge was not a lack of data. It was too many fragmented signals arriving from agronomy teams, supplier emails, spreadsheets, and field messages.",
          "MAPLE gave them a way to turn those signals into scenario briefs the entire team could discuss together.",
        ],
      },
      {
        heading: "A better handoff from analysis to action",
        body: [
          "Staff now draft weekly planning memos directly inside the workspace. Those memos combine field observations, shipping constraints, and grower questions into a single operating view.",
        ],
        bullets: [
          "Scenario comparisons for planting windows",
          "Shared weekly planning briefs",
          "Reusable prompt templates for field ops",
        ],
      },
      {
        heading: "Why it stuck",
        body: [
          "The team did not need a flashy new interface. They needed something that helped them make one decision together, with the same facts in front of them.",
        ],
      },
    ],
  },
  {
    slug: "fresno-family-kitchen",
    title:
      "A family kitchen in Fresno plans prep, inventory, and staffing with a daily AI brief",
    category: "Story",
    date: "Feb 16, 2026",
    readTime: "4 min read",
    image: "/images/story_3.png",
    eyebrow: "Stories",
    summary:
      "Instead of juggling paper prep sheets and late-night text threads, the team uses MAPLE to prepare a single daily brief before the morning rush starts.",
    excerpt:
      "The brief combines sales patterns, ingredient constraints, and event bookings into a clearer opening routine.",
    sections: [
      {
        heading: "The pressure point",
        body: [
          "The kitchen already knew how to move fast. What it lacked was a simple ritual for converting yesterday's signals into today's prep decisions.",
          "Without that ritual, staffing and inventory calls were often made from instinct alone.",
        ],
      },
      {
        heading: "The new routine",
        body: [
          "Each morning, MAPLE generates a concise service brief with sales signals, prep suggestions, and high-risk items to watch. Managers edit the brief, print the final version, and use it during the first team huddle.",
        ],
      },
      {
        heading: "What changed for the team",
        body: [
          "The crew spends less time reconciling disconnected notes and more time aligning around the same plan before service begins.",
        ],
      },
    ],
  },
];

export const researchEntries: EditorialEntry[] = [
  {
    slug: "maple-reasoning-system-card",
    title: "System card for MAPLE Reasoning 1",
    category: "Research",
    date: "Dec 5, 2025",
    readTime: "8 min read",
    image: "/images/research_1.png",
    eyebrow: "Latest research",
    summary:
      "This system card outlines how we evaluate MAPLE Reasoning 1 across instruction following, tool use, uncertainty reporting, and high-stakes review workflows.",
    excerpt:
      "A practical overview of capabilities, failure modes, and deployment safeguards for our reasoning model.",
    sections: [
      {
        heading: "Evaluation philosophy",
        body: [
          "We evaluate reasoning systems in conditions that look more like real work than benchmark theater. That means ambiguous prompts, incomplete context, and tasks where a model should sometimes pause, ask, or decline.",
          "The goal is not just higher performance. It is higher reliability under operational pressure.",
        ],
      },
      {
        heading: "Where the model is strong",
        body: [
          "MAPLE Reasoning 1 performs best on multi-step writing, analytical synthesis, and tool-assisted workflows where the model can inspect intermediate results before answering.",
        ],
        bullets: [
          "Longer planning chains with fewer dropped constraints",
          "Improved tool selection in structured workflows",
          "Clearer uncertainty signaling when evidence is weak",
        ],
      },
      {
        heading: "Where we remain cautious",
        body: [
          "Like other frontier reasoning systems, the model can sound confident when evidence is thin and can still overfit to superficially plausible instructions. We treat high-trust deployments as reviewed workflows, not unsupervised endpoints.",
        ],
      },
    ],
  },
  {
    slug: "domain-rich-training-playbook",
    title: "Training specialist models on domain-rich corpora",
    category: "Research",
    date: "Nov 12, 2025",
    readTime: "7 min read",
    image: "/images/research_2.png",
    eyebrow: "Latest research",
    summary:
      "We share lessons from training models that need to perform well in narrow, terminology-heavy environments without collapsing into brittle memorization.",
    excerpt:
      "A playbook for balancing breadth, precision, and retrieval when models learn from deep specialist material.",
    sections: [
      {
        heading: "Why generality is not enough",
        body: [
          "General-purpose models often understand the shape of a domain before they understand its consequences. In specialist settings, small wording errors can change the meaning of a recommendation entirely.",
          "That is why we treat domain tuning as a systems problem spanning data quality, retrieval strategy, and evaluation design.",
        ],
      },
      {
        heading: "Training and retrieval together",
        body: [
          "The strongest results came when we combined targeted tuning with grounded retrieval rather than forcing the model to internalize every edge case. That balance preserved fluency while improving factual precision.",
        ],
      },
      {
        heading: "Operational lessons",
        body: [
          "Teams should expect specialist systems to require specialist review. Success depends on workflows, guardrails, and continuously refreshed evidence, not just a stronger model checkpoint.",
        ],
      },
    ],
  },
  {
    slug: "scientific-copilot-workflows",
    title: "Designing scientific copilot workflows for real lab work",
    category: "Research",
    date: "Oct 22, 2025",
    readTime: "6 min read",
    image: "/images/research_3.png",
    eyebrow: "Latest research",
    summary:
      "This paper examines how AI systems can support lab planning, literature synthesis, and experimental note-taking without disrupting how researchers already work.",
    excerpt:
      "Scientific copilots succeed when they reduce coordination overhead and preserve traceability.",
    sections: [
      {
        heading: "The lab is a workflow, not a prompt",
        body: [
          "Scientific work unfolds across notes, instruments, protocols, and team discussion. A useful AI system must fit into that chain of evidence rather than pretend the entire task can be solved in a single exchange.",
        ],
      },
      {
        heading: "Traceability matters",
        body: [
          "Researchers told us they trusted the system more when it showed where a suggestion came from, what assumptions it made, and what still required verification. That insight shaped our workflow design more than any single model metric.",
        ],
      },
      {
        heading: "A human-centered model of speed",
        body: [
          "Faster science does not mean skipping review. It means reducing the time spent on repeated setup, fragmented search, and format conversion so expert attention stays on the real decision points.",
        ],
      },
    ],
  },
];

export const businessEntries: EditorialEntry[] = [
  {
    slug: "taisei-knowledge-transfer",
    title: "Taisei modernizes knowledge transfer with MAPLE workspaces",
    category: "Case study",
    date: "Jan 29, 2026",
    readTime: "6 min read",
    image: "/images/business_2.png",
    badge: "TAISEI",
    eyebrow: "MAPLE-GLOBAL for business",
    summary:
      "A cross-generational workforce needed a faster way to preserve project knowledge, onboarding context, and operational judgment before it disappeared into inboxes and siloed files.",
    excerpt:
      "The company used MAPLE workspaces to turn institutional knowledge into reusable operating context.",
    stats: [
      { label: "Teams onboarded", value: "18" },
      { label: "Playbooks launched", value: "67" },
      { label: "Time to first answer", value: "-41%" },
    ],
    sections: [
      {
        heading: "The business problem",
        body: [
          "Taisei's leadership team saw the same pattern across departments: senior operators knew exactly how to solve edge cases, but their reasoning was rarely documented in a way new hires could reuse.",
          "That created onboarding drag and made every handoff more expensive than it looked on paper.",
        ],
      },
      {
        heading: "The MAPLE approach",
        body: [
          "Instead of building a separate knowledge portal, Taisei used MAPLE workspaces to wrap existing process documents with guided Q&A, expert playbooks, and reusable prompts for common operating scenarios.",
        ],
        bullets: [
          "Workspace collections by function and region",
          "Expert-reviewed playbooks for recurring scenarios",
          "Shared prompts for faster onboarding",
        ],
      },
      {
        heading: "The outcome",
        body: [
          "The biggest gain came from consistency. Newer employees were no longer dependent on who happened to be online to answer a question. They could start from the same shared base of context as the rest of the team.",
        ],
      },
    ],
  },
  {
    slug: "trust-bank-donation-personalization",
    title: "Trust Bank personalizes civic donation journeys with MAPLE APIs",
    category: "Case study",
    date: "Jan 27, 2026",
    readTime: "5 min read",
    image: "/images/business_3.png",
    badge: "TRUST BANK",
    eyebrow: "MAPLE-GLOBAL for business",
    summary:
      "Trust Bank used MAPLE APIs to reframe a complex donation experience as a guided, personalized flow that helped more users finish with confidence.",
    excerpt:
      "The team paired recommendation logic with simpler language and clearer handoffs across devices.",
    stats: [
      { label: "Completion lift", value: "+19%" },
      { label: "Support contacts", value: "-23%" },
      { label: "Channels", value: "Web + mobile" },
    ],
    sections: [
      {
        heading: "Reducing friction without removing choice",
        body: [
          "The donation process asked users to compare unfamiliar programs, deadlines, and regional options. MAPLE helped reframe those choices into a guided flow with short explanations and tailored next steps.",
        ],
      },
      {
        heading: "Why the rollout worked",
        body: [
          "The bank treated personalization as a service design problem, not a model showcase. Every recommendation path had plain-language explanations and visible fallback options so users stayed in control.",
        ],
      },
      {
        heading: "What the team learned",
        body: [
          "Better AI experiences often come from better framing. Once the bank reorganized the journey around intent rather than internal product categories, the model became more useful immediately.",
        ],
      },
    ],
  },
  {
    slug: "higgsfield-video-concepts",
    title:
      "Higgsfield turns lightweight prompts into production-ready video concepts",
    category: "Case study",
    date: "Jan 21, 2026",
    readTime: "5 min read",
    image: "/images/business_1.png",
    badge: "Higgsfield",
    eyebrow: "MAPLE-GLOBAL for business",
    summary:
      "The creative team built a workflow where MAPLE helps shape concepts, tighten briefs, and stage social-ready scripts before editors ever open a timeline.",
    excerpt:
      "The result is a faster path from rough idea to a creative brief the production team can act on.",
    stats: [
      { label: "Brief creation", value: "-52%" },
      { label: "Content formats", value: "12+" },
      { label: "Creative reuse", value: "High" },
    ],
    sections: [
      {
        heading: "From inspiration to usable direction",
        body: [
          "Creative teams rarely struggle to generate ideas. They struggle to turn scattered inspiration into a brief that production can actually use. Higgsfield used MAPLE to close that gap.",
        ],
      },
      {
        heading: "How the workflow is structured",
        body: [
          "MAPLE first expands a concept into campaign angles, audience frames, and content hooks. Editors then choose a direction and generate a tighter script, shot list, and production checklist.",
        ],
      },
      {
        heading: "Why it matters",
        body: [
          "The creative lead described the system as a compression tool for ambiguity. It gets the team to a shared direction earlier, which means more energy can go into craft rather than clarification.",
        ],
      },
    ],
  },
];

export const homeSuggestions = [
  { label: "Guided learning workflows", href: "/products" },
  { label: "Research briefs and systems", href: "/research" },
  { label: "Business rollout examples", href: "/business" },
  { label: "Stories from the field", href: "/stories" },
  { label: "Developer platform", href: "/developers" },
];

export const productHighlights = [
  {
    title: "MAPLE Workspace",
    description:
      "A polished everyday interface for research, writing, planning, and collaborative review.",
    href: "/products",
  },
  {
    title: "MAPLE Voice",
    description:
      "Voice-first sessions for meetings, tutoring, and hands-busy workflows where typing gets in the way.",
    href: "/products",
  },
  {
    title: "MAPLE Search",
    description:
      "Fast retrieval across the web and your internal knowledge, with citations and answer framing built in.",
    href: "/products",
  },
  {
    title: "MAPLE API Platform",
    description:
      "Models, workflows, and deployment patterns for teams building AI directly into products.",
    href: "/developers",
  },
];

export const developerResources = [
  {
    title: "Documentation",
    href: "/developers/docs",
    description:
      "Get started with model selection, prompt patterns, SDK usage, and deployment guidance.",
  },
  {
    title: "Developer Forum",
    href: "/developers/forum",
    description:
      "A place to swap implementation notes, launch questions, and workflow patterns with other builders.",
  },
  {
    title: "Status",
    href: "/developers/status",
    description:
      "Service health, maintenance windows, and incident notes for teams depending on MAPLE APIs.",
  },
];

export const foundationPillars = [
  {
    title: "Learning access",
    description:
      "Support schools, libraries, and community programs that use AI to widen access to high-quality learning.",
  },
  {
    title: "AI resilience",
    description:
      "Fund practical work that helps institutions adopt AI with stronger governance, review, and safety practices.",
  },
];

export const foundationResources = [
  {
    title: "Guided labs bring step-by-step math and science coaching to MAPLE",
    href: "/news/guided-labs-for-math-and-science",
    category: "Product",
    date: "Mar 10, 2026",
  },
  {
    title: "MAPLE-GLOBAL signs a public service readiness framework",
    href: "/news/public-service-readiness-framework",
    category: "Company",
    date: "Feb 28, 2026",
  },
  {
    title: "System card for MAPLE Reasoning 1",
    href: "/research/maple-reasoning-system-card",
    category: "Research",
    date: "Dec 5, 2025",
  },
];

export const policyCards = [
  {
    title: "Terms and platform rules",
    href: "/policies",
    description:
      "How MAPLE services may be used, what we review, and how billing and account responsibilities work.",
  },
  {
    title: "Privacy and data handling",
    href: "/policies/privacy",
    description:
      "What we collect, how we store it, and which controls teams can use to manage retention and access.",
  },
  {
    title: "Brand guidance",
    href: "/brand",
    description:
      "How to use the MAPLE-GLOBAL name, marks, and product references in public materials.",
  },
];

export const careerOpenings = [
  {
    title: "Product Designer, Web Experience",
    team: "Design",
    location: "Singapore or remote (APAC)",
    summary:
      "Own narrative systems, landing surfaces, and high-craft product marketing pages across the MAPLE ecosystem.",
  },
  {
    title: "Applied AI Engineer",
    team: "Engineering",
    location: "Remote",
    summary:
      "Build workflow orchestration, evaluation tooling, and productized intelligence features for our customer stack.",
  },
  {
    title: "Research Program Lead",
    team: "Research",
    location: "Hybrid",
    summary:
      "Shape partnerships, grants, and prototype programs that connect applied research with public-good outcomes.",
  },
];

export function getCollectionEntries(collection: CollectionName) {
  switch (collection) {
    case "news":
      return newsEntries;
    case "stories":
      return storyEntries;
    case "research":
      return researchEntries;
    case "business":
      return businessEntries;
  }
}

export function getEntry(collection: CollectionName, slug: string) {
  return getCollectionEntries(collection).find((entry) => entry.slug === slug);
}

export function getRelatedEntries(
  collection: CollectionName,
  slug: string,
  count = 3,
) {
  return getCollectionEntries(collection)
    .filter((entry) => entry.slug !== slug)
    .slice(0, count);
}
