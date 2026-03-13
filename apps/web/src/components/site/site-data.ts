export type MenuLink = {
  label: string;
  href: string;
  description: string;
  badge?: string;
};

export type MegaMenu = {
  id: string;
  label: string;
  sections: Array<{
    title: string;
    links: MenuLink[];
  }>;
  spotlight: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
  };
};

export type FooterColumn = {
  title: string;
  links: MenuLink[];
};

export type BillingMode = "monthly" | "yearly";

export type PricingPlan = {
  name: string;
  tagline: string;
  description: string;
  price: Record<BillingMode, number | "Custom">;
  yearlyNote: string;
  cta: string;
  href: string;
  accent: string;
  featured?: boolean;
  features: string[];
};

export const megaMenus: MegaMenu[] = [
  {
    id: "research",
    label: "Research",
    sections: [
      {
        title: "Research Index",
        links: [
          {
            label: "Research Index",
            href: "/about#research",
            description: "An index of all MAPLE-GLOBAL research publications and technical papers."
          },
          {
            label: "Research Overview",
            href: "/about#journal",
            description: "How we approach building safe and powerful general purpose technologies."
          },
          {
            label: "Research Residency",
            href: "/about",
            description: "A year-long program to transition your career into deep learning research."
          },
          {
            label: "MAPLE-GLOBAL for Science",
            href: "/about",
            description: "Accelerating scientific discovery through advanced intelligence."
          },
          {
            label: "Safety",
            href: "/about#trust",
            description: "Ensuring our systems are robust, trustworthy, and aligned with human values."
          }
        ],
      },
      {
        title: "Latest Advancements",
        links: [
          {
            label: "Omni-4.5 o1",
            href: "/#launches",
            description: "Our newest capabilities reasoning systematically through complex challenges.",
          },
          {
            label: "Omni-4",
            href: "/#launches",
            description: "Highly capable multimodal models for text, vision, and audio."
          },
          {
            label: "Omni Vision 3",
            href: "/#launches",
            description: "Next-generation image and spatial understanding."
          }
        ],
      },
    ],
    spotlight: {
      eyebrow: "Our Approach",
      title: "Building safe and beneficial AI.",
      body: "We are dedicated to creating systems that outthink complex challenges while remaining deeply aligned with human intent.",
      href: "/about",
      cta: "Explore Research",
      stats: [],
    },
  },
  {
    id: "products",
    label: "Products",
    sections: [
      {
        title: "Our Products",
        links: [
          {
            label: "MAPLE-GLOBAL Web",
            href: "/#products",
            description: "The most capable and intelligent web assistant for everyday tasks."
          },
          {
            label: "MAPLE-GLOBAL Enterprise",
            href: "/pricing",
            description: "Enterprise-grade security and privacy for large organizations."
          },
          {
            label: "MAPLE-GLOBAL Team",
            href: "/pricing",
            description: "Collaborative workspaces for small and medium businesses."
          },
          {
            label: "API Platform",
            href: "/#api",
            description: "Build applications with our industry-leading foundational models."
          }
        ],
      },
      {
        title: "Ecosystem",
        links: [
          {
            label: "Custom Instructions",
            href: "/#products",
            description: "Tailor responses to your specific operational workflows."
          },
          {
            label: "Data Analysis",
            href: "/pricing#compare",
            description: "Advanced data analytics embedded directly in your stack."
          },
        ],
      },
    ],
    spotlight: {
      eyebrow: "Spotlight",
      title: "Unlock superhuman productivity.",
      body: "Empower your entire workforce with models that write, code, analyze, and automate on demand.",
      href: "/pricing",
      cta: "View Plans",
      stats: [],
    },
  },
  {
    id: "business",
    label: "Business",
    sections: [
      {
        title: "Business Solutions",
        links: [
          {
            label: "Enterprise",
            href: "/pricing#enterprise",
            description: "Deploy MAPLE-GLOBAL at scale with enterprise-grade security."
          },
          {
            label: "Team",
            href: "/pricing",
            description: "Bring the team together in one shared intelligent workspace."
          },
          {
            label: "Education",
            href: "/#global",
            description: "Tools for students, teachers, and university staff."
          }
        ],
      },
      {
        title: "Use Cases",
        links: [
          {
            label: "Customer Service",
            href: "/about",
            description: "Automate edge cases and provide 24/7 intelligent routing."
          },
          {
            label: "Software Engineering",
            href: "/#",
            description: "Write better code faster alongside an expert pair-programmer."
          },
        ],
      },
    ],
    spotlight: {
      eyebrow: "For Business",
      title: "Scale intelligence across your organization.",
      body: "From Fortune 500s to fast-growth startups, MAPLE-GLOBAL transforms how teams operate, strategize, and deliver.",
      href: "/login",
      cta: "Contact Sales",
      stats: [],
    },
  },
  {
    id: "developers",
    label: "Developers",
    sections: [
      {
        title: "Platform",
        links: [
          {
            label: "Developer Documentation",
            href: "/#",
            description: "Guides, tutorials, and API reference for building apps."
          },
          {
            label: "Platform API",
            href: "/pricing#compare",
            description: "Integrate powerful models into your existing products."
          },
          {
            label: "Playground",
            href: "/login",
            description: "Experiment with models in an interactive environment."
          }
        ],
      },
      {
        title: "Community & Support",
        links: [
          {
            label: "Developer Forum",
            href: "/#",
            description: "Discuss ideas, ask questions, and share what you've built."
          },
          {
            label: "Status",
            href: "/#",
            description: "Real-time updates on API and service availability."
          },
        ],
      },
    ],
    spotlight: {
      eyebrow: "Build with us",
      title: "The intelligence layer for your applications.",
      body: "Give your software the ability to see, hear, speak, and reason using the most advanced AI platform available.",
      href: "/login",
      cta: "Start Building",
      stats: [],
    },
  },
  {
    id: "company",
    label: "Company",
    sections: [
      {
        title: "Company",
        links: [
          {
            label: "About MAPLE-GLOBAL",
            href: "/about",
            description:
              "Our approach to premium AI experiences, launch systems, and delivery.",
          },
          {
            label: "Contact",
            href: "/about#contact",
            description:
              "Talk with our team about launches, redesigns, and subscriptions.",
          },
        ],
      },
      {
        title: "Resources",
        links: [
          {
            label: "Pricing",
            href: "/pricing",
            description:
              "Subscription tiers for startups, scale-ups, and enterprise teams.",
          },
          {
            label: "Login",
            href: "/login",
            description:
              "Access your workspace, billing, and launch operations dashboard.",
          },
        ],
      },
    ],
    spotlight: {
      eyebrow: "Company",
      title: "A design and engineering practice focused on modern AI brands.",
      body: "We build narrative systems, application surfaces, and launch tooling that feel premium in motion as well as in static comps.",
      href: "/about#contact",
      cta: "Contact MAPLE-GLOBAL",
      stats: [
        { label: "Delivery model", value: "Design + code" },
        { label: "Coverage", value: "Global" },
        { label: "Workspace onboarding", value: "Included" },
      ],
    },
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Research",
    links: [
      {
        label: "Research overview",
        href: "/about#research",
        description: "Principles for premium AI storytelling.",
      },
      {
        label: "Design journal",
        href: "/about#journal",
        description: "Interface notes, systems, and patterns.",
      },
      {
        label: "Trust framework",
        href: "/about#trust",
        description: "Governance and reliability guidelines.",
      },
    ],
  },
  {
    title: "Products",
    links: [
      {
        label: "MAPLE-GLOBAL Studio",
        href: "/#products",
        description: "Launch pages and visual systems.",
      },
      {
        label: "MAPLE-GLOBAL Agents",
        href: "/#operations",
        description: "Operational copilots and workflows.",
      },
      {
        label: "Pricing",
        href: "/pricing",
        description: "Plans for every stage of scale.",
      },
    ],
  },
  {
    title: "Business",
    links: [
      {
        label: "For SaaS teams",
        href: "/pricing#tiers",
        description: "Subscription plans and rollout support.",
      },
      {
        label: "Enterprise launches",
        href: "/pricing#enterprise",
        description: "Security, onboarding, and custom support.",
      },
      {
        label: "Book a consult",
        href: "mailto:hello@MAPLE-GLOBAL.dev",
        description: "Talk through your next release.",
      },
    ],
  },
  {
    title: "Developers",
    links: [
      {
        label: "Architecture",
        href: "/about#systems",
        description: "Web, auth, billing, and shared packages.",
      },
      {
        label: "Workspace login",
        href: "/login",
        description: "Access your account and workspace.",
      },
      {
        label: "Release hygiene",
        href: "/about#delivery",
        description: "Build checks, versions, and rollout flow.",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "About",
        href: "/about",
        description: "Company principles and operating model.",
      },
      {
        label: "Contact",
        href: "/about#contact",
        description: "Work with MAPLE-GLOBAL.",
      },
      {
        label: "hello@MAPLE-GLOBAL.dev",
        href: "mailto:hello@MAPLE-GLOBAL.dev",
        description: "General enquiries and partnerships.",
      },
    ],
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "For individuals and small teams getting started.",
    description:
      "A premium landing system, essential analytics, and one workspace.",
    price: {
      monthly: 39,
      yearly: 32,
    },
    yearlyNote: "Billed yearly at $384",
    cta: "Start free",
    href: "/login",
    accent: "from-[#effff6] via-[#b5ebcb] to-[#53a67c]",
    features: [
      "1 workspace and 3 team members",
      "Marketing homepage + pricing page starter kit",
      "Auth-ready login surfaces",
      "Release checklists and analytics snapshots",
    ],
  },
  {
    name: "Pro",
    tagline: "For professionals building advanced SaaS products.",
    description:
      "Expanded components, advanced motion, and collaborative launch ops.",
    price: {
      monthly: 149,
      yearly: 119,
    },
    yearlyNote: "Billed yearly at $1,428",
    cta: "Choose Pro",
    href: "/login",
    accent: "from-[#f7f1da] via-[#e3c98f] to-[#9e7d38]",
    featured: true,
    features: [
      "5 workspaces and 20 team members",
      "Advanced pricing, onboarding, and billing flows",
      "Brand motion system and interaction polish",
      "Priority implementation support",
    ],
  },
  {
    name: "Team",
    tagline: "For teams collaborating on multiple environments.",
    description:
      "Multi-team orchestration, brand governance, and global controls.",
    price: {
      monthly: 349,
      yearly: 289,
    },
    yearlyNote: "Billed yearly at $3,468",
    cta: "Upgrade to Team",
    href: "/login",
    accent: "from-[#e7e5ff] via-[#a4a0ff] to-[#5751d8]",
    features: [
      "Unlimited workspaces and environments",
      "Role-based launch approvals and review lanes",
      "Global localization patterns",
      "Usage insights and executive reporting",
    ],
  },
  {
    name: "Enterprise",
    tagline:
      "For organizations with custom security and support needs.",
    description:
      "Custom scopes, security reviews, white-glove onboarding, and SLAs.",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    yearlyNote: "Annual agreements available",
    cta: "Talk to sales",
    href: "mailto:hello@MAPLE-GLOBAL.dev?subject=Enterprise%20Pricing",
    accent: "from-[#d8fbff] via-[#77dced] to-[#2996be]",
    features: [
      "Custom deployment and launch advisory",
      "Dedicated implementation and design partner",
      "Security review, procurement, and SLA support",
      "Executive onboarding and quarterly planning",
    ],
  },
];

export const comparisonRows = [
  {
    feature: "Workspaces",
    values: ["1", "5", "Unlimited", "Unlimited"],
  },
  {
    feature: "Team seats",
    values: ["3 included", "20 included", "Unlimited", "Unlimited"],
  },
  {
    feature: "Homepage + pricing templates",
    values: ["Included", "Included", "Included", "Custom scope"],
  },
  {
    feature: "Login and billing surfaces",
    values: ["Core", "Advanced", "Advanced", "Custom"],
  },
  {
    feature: "Role-based approvals",
    values: ["-", "Optional", "Included", "Included"],
  },
  {
    feature: "Priority support",
    values: ["-", "Business hours", "24/7", "Dedicated"],
  },
];

export const faqItems = [
  {
    question: "Can MAPLE-GLOBAL adapt this to our existing design system?",
    answer:
      "Yes. The subscription tiers can work from your current design language, or we can extend this new visual system into your broader product and brand surfaces.",
  },
  {
    question: "Do the plans include implementation or just design?",
    answer:
      "These tiers are designed for implementation-ready delivery. The Growth plan and above include deeper engineering collaboration and rollout support.",
  },
  {
    question: "Can we use our own auth providers and billing stack?",
    answer:
      "Yes. The login and pricing experiences can be adapted to your existing auth, subscription, and account infrastructure.",
  },
  {
    question: "Is there an enterprise onboarding path?",
    answer:
      "Yes. Enterprise includes security review support, stakeholder onboarding, implementation planning, and a dedicated working model.",
  },
];
