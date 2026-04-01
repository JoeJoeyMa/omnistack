import type {
  CategoryDetailRecord,
  ProductDetailRecord,
  ProductReview,
  ShopCard,
  ShopCatalogPayload,
  StoreProfile,
} from "@maple-global/api-client/shop";

const serviceImages = {
  uk: "/images/company-services/uk-company-service.png",
  us: "/images/company-services/us-company-service.png",
  china: "/images/company-services/china-company-service.png",
  wise: "/images/company-banking/wise-1.png",
  worldfirst: "/images/company-banking/worldfirst-1.png",
  mercury: "/images/company-banking/mercury-1.png",
  revolut: "/images/company-banking/revolut-1.png",
  airwallex: "/images/company-banking/airwallex-1.png",
  itConsulting: "/images/tech-services/it-consulting-1.png",
  corporateWeb: "/images/tech-services/corporate-web-1.png",
  ecommerceWeb: "/images/tech-services/ecommerce-web-1.png",
  restaurantWeb: "/images/tech-services/restaurant-web-1.png",
  deployment: "/images/tech-services/deployment-1.png",
  emailMarketing: "/images/tech-services/email-marketing-1.png",
  aiKnowledge: "/images/tech-services/ai-knowledge-1.png",
  customerSupport: "/images/tech-services/customer-support-1.png",
  openrouter: "/images/tech-services/openrouter-1.png",
} as const;

const bankingGalleries = {
  wise: [
    "/images/company-banking/wise-1.png",
    "/images/company-banking/wise-2.png",
    "/images/company-banking/wise-3.png",
  ],
  worldfirst: [
    "/images/company-banking/worldfirst-1.png",
    "/images/company-banking/worldfirst-2.png",
    "/images/company-banking/worldfirst-3.png",
  ],
  mercury: [
    "/images/company-banking/mercury-1.png",
    "/images/company-banking/mercury-2.png",
    "/images/company-banking/mercury-3.png",
  ],
  revolut: [
    "/images/company-banking/revolut-1.png",
    "/images/company-banking/revolut-2.png",
    "/images/company-banking/revolut-3.png",
  ],
  airwallex: [
    "/images/company-banking/airwallex-1.png",
    "/images/company-banking/airwallex-2.png",
    "/images/company-banking/airwallex-3.png",
  ],
} as const;

const techGalleries = {
  itConsulting: [
    "/images/tech-services/it-consulting-1.png",
    "/images/tech-services/it-consulting-2.png",
    "/images/tech-services/it-consulting-3.png",
  ],
  corporateWeb: [
    "/images/tech-services/corporate-web-1.png",
    "/images/tech-services/corporate-web-2.png",
    "/images/tech-services/corporate-web-3.png",
  ],
  ecommerceWeb: [
    "/images/tech-services/ecommerce-web-1.png",
    "/images/tech-services/ecommerce-web-2.png",
    "/images/tech-services/ecommerce-web-3.png",
  ],
  restaurantWeb: [
    "/images/tech-services/restaurant-web-1.png",
    "/images/tech-services/restaurant-web-2.png",
    "/images/tech-services/restaurant-web-3.png",
  ],
  deployment: [
    "/images/tech-services/deployment-1.png",
    "/images/tech-services/deployment-2.png",
    "/images/tech-services/deployment-3.png",
  ],
  emailMarketing: [
    "/images/tech-services/email-marketing-1.png",
    "/images/tech-services/email-marketing-2.png",
    "/images/tech-services/email-marketing-3.png",
  ],
  aiKnowledge: [
    "/images/tech-services/ai-knowledge-1.png",
    "/images/tech-services/ai-knowledge-2.png",
    "/images/tech-services/ai-knowledge-3.png",
  ],
  customerSupport: [
    "/images/tech-services/customer-support-1.png",
    "/images/tech-services/customer-support-2.png",
    "/images/tech-services/customer-support-3.png",
  ],
  openrouter: [
    "/images/tech-services/openrouter-1.png",
    "/images/tech-services/openrouter-2.png",
    "/images/tech-services/openrouter-3.png",
  ],
} as const;

const merchant = {
  slug: "mapleglobal",
  name: "Maple Global",
  rating: "4.9",
  reviews: "612",
};

function buildReviews(items: Array<{ author: string; title: string; body: string; rating: number }>) {
  return items satisfies ProductReview[];
}

function productHref(product: ProductDetailRecord) {
  return `/products/${product.productId}/${product.slug}`;
}

function merchantProfile(image: string, badge: string) {
  return {
    ...merchant,
    image,
    badge,
  };
}

type SeedProductInput = Omit<
  ProductDetailRecord,
  "brand" | "merchant" | "recommendations" | "relatedMerchants"
> & {
  merchantBadge: string;
};

function createSeedProduct(input: SeedProductInput): ProductDetailRecord {
  const { merchantBadge, ...rest } = input;

  return {
    ...rest,
    brand: merchant.name,
    merchant: merchantProfile(rest.image, merchantBadge),
    recommendations: [],
    relatedMerchants: [],
  };
}

const seedProducts: ProductDetailRecord[] = [
  {
    productId: "svc-uk-formation",
    slug: "uk-company-formation-compliance",
    brand: merchant.name,
    title: "UK Limited Company Formation",
    price: "£149.00",
    image: serviceImages.uk,
    gallery: [serviceImages.uk, serviceImages.uk, serviceImages.uk],
    rating: 4.9,
    reviewsCount: "124",
    shippingNote: "Kickoff within 1 business day after payment",
    boughtText: "Most requested by cross-border sellers",
    description:
      "Built around the 1st Formations package model for UK limited companies, this service covers company name screening, Companies House filing, incorporation documents, domain and business-support setup, and a guided onboarding handoff. Maple Global adds annual accounts and confirmation statement planning, year-end compliance reminders, and finance handover support so the service can move from setup into ongoing operation without rebuilding the frontend flow later.",
    purchaseModes: [
      {
        id: "uk-digital",
        label: "Digital formation",
        price: "£149.00",
        compareAt: "£199.00",
        note: "Includes incorporation filing, digital documents, domain setup, and bank account guidance",
      },
      {
        id: "uk-privacy",
        label: "Privacy and address package",
        price: "£329.00",
        compareAt: "£399.00",
        note: "Adds registered office support, service address handling, and filings follow-up",
      },
      {
        id: "uk-compliance",
        label: "Formation plus annual compliance",
        price: "£599.00",
        compareAt: "£699.00",
        note: "Adds first-year annual accounts prep, confirmation statement workflow, and bookkeeping handoff",
      },
    ],
    policies: [
      "Service delivery",
      "Documents included",
      "Annual compliance",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.uk,
      badge: "UK incorporation",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Lena H.",
        rating: 5,
        title: "Fast filing and clear follow-up",
        body: "We used the service to launch a UK trading entity and the value was in the handoff after registration. The annual filing checklist and document pack were already mapped out.",
      },
      {
        author: "Owen G.",
        rating: 5,
        title: "Good for remote founders",
        body: "The package made sense for a non-UK founder because address, filings, and the post-incorporation steps were explained in one place.",
      },
      {
        author: "Sofia M.",
        rating: 4,
        title: "Solid compliance bundle",
        body: "The real difference versus a bare filing service is the follow-on compliance support. That is what made this usable for our finance team.",
      },
    ]),
  },
  {
    productId: "svc-us-formation",
    slug: "us-delaware-company-formation-atlas",
    brand: merchant.name,
    title: "US Delaware Company Formation",
    price: "US$500.00",
    image: serviceImages.us,
    gallery: [serviceImages.us, serviceImages.us, serviceImages.us],
    rating: 4.9,
    reviewsCount: "102",
    shippingNote: "Documents prepared in minutes, kickoff starts the same day",
    boughtText: "Popular with software and AI founders",
    description:
      "This service follows the Stripe Atlas startup flow for forming a Delaware entity: company incorporation, EIN coordination, founder equity setup, 83(b) election support, and a startup-ready document stack. Maple Global layers in annual report reminders, registered-agent renewal tracking, bookkeeping and tax handoff planning, and an operating checklist so the product can move from launch to recurring compliance inside the same API-driven storefront.",
    purchaseModes: [
      {
        id: "us-atlas-base",
        label: "Atlas-style launch package",
        price: "US$500.00",
        compareAt: "US$650.00",
        note: "Includes Delaware filing, EIN process, founder equity setup, and 83(b) workflow",
      },
      {
        id: "us-atlas-finance",
        label: "Launch plus finance stack",
        price: "US$980.00",
        compareAt: "US$1,180.00",
        note: "Adds bookkeeping setup, tax calendar, and payment-stack onboarding",
      },
      {
        id: "us-atlas-compliance",
        label: "Launch plus annual compliance",
        price: "US$1,280.00",
        compareAt: "US$1,480.00",
        note: "Adds Delaware annual-report support, registered-agent renewal planning, and finance review",
      },
    ],
    policies: [
      "Service delivery",
      "Registered agent and tax setup",
      "Annual compliance",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.us,
      badge: "US incorporation",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Nadia P.",
        rating: 5,
        title: "Best path for a US startup shell",
        body: "The Delaware setup, EIN guidance, and founder-equity paperwork were the key pieces we needed. The annual compliance follow-up made the package feel complete.",
      },
      {
        author: "Michael T.",
        rating: 5,
        title: "Clear startup workflow",
        body: "We did not need to stitch together three vendors. Registration, tax number guidance, and the finance onboarding checklist were already aligned.",
      },
      {
        author: "Ariel C.",
        rating: 4,
        title: "Useful if payments matter on day one",
        body: "For a product company that needs to invoice and accept payments quickly, the Atlas-style setup and follow-up playbook are the useful part.",
      },
    ]),
  },
  {
    productId: "svc-china-formation",
    slug: "china-company-registration-finance",
    brand: merchant.name,
    title: "China Company Registration",
    price: "¥12,800.00",
    image: serviceImages.china,
    gallery: [serviceImages.china, serviceImages.china, serviceImages.china],
    rating: 4.8,
    reviewsCount: "89",
    shippingNote: "Registration plan issued within 1 business day",
    boughtText: "Chosen for China market entry and local operations",
    description:
      "Based on the Start China Business setup workflow, this package covers company name filing, entity registration, company chops, bank-account coordination, tax registration, invoicing equipment, and the follow-on steps often needed after the licence is issued. Maple Global turns that into a usable product by adding monthly bookkeeping options, annual corporate filing support, finance review preparation, and a structured compliance handoff for ongoing operation.",
    purchaseModes: [
      {
        id: "china-consulting",
        label: "Consulting entity setup",
        price: "¥12,800.00",
        compareAt: "¥14,800.00",
        note: "Includes registration, chops, bank-account coordination, and tax onboarding",
      },
      {
        id: "china-trading",
        label: "Trading company setup",
        price: "¥18,800.00",
        compareAt: "¥21,800.00",
        note: "Adds import-export readiness review, invoice workflow, and licence coordination",
      },
      {
        id: "china-compliance",
        label: "Setup plus bookkeeping and annual filing",
        price: "¥26,800.00",
        compareAt: "¥29,800.00",
        note: "Adds monthly bookkeeping, tax filing support, annual report prep, and year-end review",
      },
    ],
    policies: [
      "Service delivery",
      "Setup scope",
      "Annual compliance",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.china,
      badge: "China incorporation",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Eric W.",
        rating: 5,
        title: "Useful for post-licence tasks",
        body: "Most agencies stop at the licence. This package explicitly included chops, banking coordination, tax onboarding, and the bookkeeping handoff we actually needed.",
      },
      {
        author: "Sherry L.",
        rating: 4,
        title: "Good structure for foreign-invested entities",
        body: "The checklist was practical and the annual filing coverage meant our China finance work was not an afterthought.",
      },
      {
        author: "Vincent K.",
        rating: 5,
        title: "Strong finance follow-through",
        body: "The registration piece was straightforward, but the valuable part was the monthly bookkeeping and annual review planning after setup.",
      },
    ]),
  },
  {
    productId: "svc-wise-account",
    slug: "wise-business-account-setup",
    brand: merchant.name,
    title: "Wise Business Account Setup",
    price: "US$299.00",
    image: serviceImages.wise,
    gallery: [...bankingGalleries.wise],
    rating: 4.9,
    reviewsCount: "76",
    shippingNote: "Onboarding checklist issued the same day",
    boughtText: "Requested by agencies and remote teams",
    description:
      "Built from the current Wise Business account positioning, this service is structured around multi-currency balances, local receiving details, supplier payments, batch transfers, team cards, and accounting integrations. Maple Global turns that into a usable onboarding product with document prep, application guidance, finance-tool mapping, and recurring bookkeeping and annual review handoff so the account can sit inside a broader operating stack.",
    purchaseModes: [
      {
        id: "wise-guided",
        label: "Guided account opening",
        price: "US$299.00",
        compareAt: "US$399.00",
        note: "Includes eligibility review, document checklist, Wise onboarding guidance, and beneficiary setup",
      },
      {
        id: "wise-payments",
        label: "Account plus payments setup",
        price: "US$499.00",
        compareAt: "US$649.00",
        note: "Adds local receiving details mapping, supplier payout workflows, and batch transfer setup",
      },
      {
        id: "wise-finance",
        label: "Account plus finance handoff",
        price: "US$799.00",
        compareAt: "US$949.00",
        note: "Adds bookkeeping integration, team card policy setup, and annual review support",
      },
    ],
    policies: [
      "Service delivery",
      "Account opening scope",
      "Platform eligibility",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.wise,
      badge: "Wise onboarding",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Jason R.",
        rating: 5,
        title: "Fastest route for multi-currency operations",
        body: "The useful part was not only the account application. The receiving-account setup, payout flow, and bookkeeping mapping were already organised.",
      },
      {
        author: "Mira L.",
        rating: 5,
        title: "Good for paying global suppliers",
        body: "We needed a clean supplier-payment workflow and batch transfer guidance. The service packaged both with the actual account opening steps.",
      },
      {
        author: "Theo K.",
        rating: 4,
        title: "Practical for finance teams",
        body: "The accounting integrations and year-end finance handoff made it more useful than a simple account-opening checklist.",
      },
    ]),
  },
  {
    productId: "svc-worldfirst-account",
    slug: "worldfirst-business-account-setup",
    brand: merchant.name,
    title: "WorldFirst Business Account Setup",
    price: "US$349.00",
    image: serviceImages.worldfirst,
    gallery: [...bankingGalleries.worldfirst],
    rating: 4.8,
    reviewsCount: "63",
    shippingNote: "Seller onboarding starts within 1 business day",
    boughtText: "Popular with marketplace sellers",
    description:
      "Based on the current WorldFirst business account messaging, this service covers local receiving accounts, marketplace collection flows, FX support, international transfers, and World Card setup for global sellers. Maple Global adds application handling, settlement-structure planning, ecommerce finance workflows, and recurring bookkeeping and annual filing coordination so the account can plug into a wider commerce backend later.",
    purchaseModes: [
      {
        id: "worldfirst-core",
        label: "Seller account opening",
        price: "US$349.00",
        compareAt: "US$449.00",
        note: "Includes application guidance, KYC pack prep, and payout route planning",
      },
      {
        id: "worldfirst-marketplace",
        label: "Marketplace collection setup",
        price: "US$579.00",
        compareAt: "US$729.00",
        note: "Adds marketplace receipt flows, currency collection mapping, and FX usage guidance",
      },
      {
        id: "worldfirst-finance",
        label: "Seller finance stack",
        price: "US$899.00",
        compareAt: "US$1,049.00",
        note: "Adds card policy setup, bookkeeping handoff, and year-end finance review support",
      },
    ],
    policies: [
      "Service delivery",
      "Account opening scope",
      "Platform eligibility",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.worldfirst,
      badge: "Marketplace banking",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Nora C.",
        rating: 5,
        title: "Strong fit for ecommerce collections",
        body: "Marketplace receiving accounts and international settlements were the main reasons we bought this. The finance handoff was a useful bonus.",
      },
      {
        author: "Alex P.",
        rating: 4,
        title: "Useful FX and transfer support",
        body: "The service clearly mapped how to collect, convert, and transfer funds instead of leaving the team to figure it out after approval.",
      },
      {
        author: "Harvey S.",
        rating: 5,
        title: "Better than a generic bank-intro service",
        body: "Seller flows, World Card setup, and bookkeeping coordination were covered in one package, which is what we needed.",
      },
    ]),
  },
  {
    productId: "svc-mercury-account",
    slug: "mercury-business-banking-setup",
    brand: merchant.name,
    title: "Mercury Business Banking Setup",
    price: "US$399.00",
    image: serviceImages.mercury,
    gallery: [...bankingGalleries.mercury],
    rating: 4.9,
    reviewsCount: "81",
    shippingNote: "Startup banking checklist delivered the same day",
    boughtText: "Common choice for venture-backed startups",
    description:
      "This service follows Mercury's current business banking structure around free checking and savings, virtual and physical cards, free domestic and USD international wires, approvals, automations, and accounting integrations. Maple Global packages the application flow, banking-ops setup, spend-control planning, and bookkeeping or annual review coordination so founders can move from incorporation to operating finance without rebuilding the storefront later.",
    purchaseModes: [
      {
        id: "mercury-core",
        label: "Startup banking opening",
        price: "US$399.00",
        compareAt: "US$499.00",
        note: "Includes eligibility review, application prep, and account-structure planning",
      },
      {
        id: "mercury-ops",
        label: "Banking plus spend controls",
        price: "US$649.00",
        compareAt: "US$799.00",
        note: "Adds card issuance planning, approvals, payment workflows, and accounting integrations",
      },
      {
        id: "mercury-finance",
        label: "Banking plus finance operations",
        price: "US$989.00",
        compareAt: "US$1,149.00",
        note: "Adds treasury and wire workflow review, bookkeeping handoff, and annual finance close support",
      },
    ],
    policies: [
      "Service delivery",
      "Account opening scope",
      "Platform eligibility",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.mercury,
      badge: "Startup banking",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Priya D.",
        rating: 5,
        title: "Good bridge from formation to operations",
        body: "We already had a Delaware entity. This service handled the banking application and the spend-control setup our ops team needed.",
      },
      {
        author: "Ben F.",
        rating: 5,
        title: "Approvals and bookkeeping were well mapped",
        body: "The value was in the approvals, cards, and accounting integration setup. It felt like finance operations, not only account opening.",
      },
      {
        author: "Clare N.",
        rating: 4,
        title: "Useful for remote startup teams",
        body: "The documents, eligibility notes, and follow-on finance review made the Mercury onboarding process much easier to run remotely.",
      },
    ]),
  },
  {
    productId: "svc-revolut-account",
    slug: "revolut-business-account-setup",
    brand: merchant.name,
    title: "Revolut Business Account Setup",
    price: "US$329.00",
    image: serviceImages.revolut,
    gallery: [...bankingGalleries.revolut],
    rating: 4.8,
    reviewsCount: "58",
    shippingNote: "Implementation call and checklist shared within 1 business day",
    boughtText: "Chosen for team cards and multi-currency spend",
    description:
      "Built around the current Revolut Business site, this service focuses on global payments, multi-currency accounts, ACH and SWIFT receiving details, physical and virtual cards, spend approvals, analytics, and accounting integrations. Maple Global layers in account opening support, card and expense-policy planning, bookkeeping sync setup, and annual finance review support for teams expanding across markets.",
    purchaseModes: [
      {
        id: "revolut-core",
        label: "Business account opening",
        price: "US$329.00",
        compareAt: "US$429.00",
        note: "Includes application support, receiving-account mapping, and initial payment setup",
      },
      {
        id: "revolut-expense",
        label: "Account plus expense controls",
        price: "US$559.00",
        compareAt: "US$699.00",
        note: "Adds team cards, spend approvals, AI expense workflows, and policy setup",
      },
      {
        id: "revolut-finance",
        label: "Account plus finance stack",
        price: "US$869.00",
        compareAt: "US$999.00",
        note: "Adds accounting integrations, reporting setup, and annual finance close support",
      },
    ],
    policies: [
      "Service delivery",
      "Account opening scope",
      "Platform eligibility",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.revolut,
      badge: "Global spend",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Ivan M.",
        rating: 5,
        title: "Great for distributed teams",
        body: "Cards, approvals, and multi-currency balances were the key reasons we needed Revolut. The service packaged the rollout cleanly.",
      },
      {
        author: "Elisa T.",
        rating: 4,
        title: "Clear expense-management setup",
        body: "The product detail matched what we wanted: account opening, team spend controls, and finance-system integration preparation.",
      },
      {
        author: "Sean K.",
        rating: 5,
        title: "Useful for global operating teams",
        body: "Receiving account details, transfers, and bookkeeping sync were covered in one go, which reduced a lot of manual setup.",
      },
    ]),
  },
  {
    productId: "svc-airwallex-account",
    slug: "airwallex-global-business-account-setup",
    brand: merchant.name,
    title: "Airwallex Global Business Account Setup",
    price: "US$459.00",
    image: serviceImages.airwallex,
    gallery: [...bankingGalleries.airwallex],
    rating: 4.9,
    reviewsCount: "67",
    shippingNote: "Cross-border setup plan issued the same day",
    boughtText: "Preferred for global collections and treasury",
    description:
      "This service follows the current Airwallex Business Accounts proposition: local collections across 70+ countries, FX and transfers to 150+ destinations, multi-currency corporate cards, and accounting-system integrations. Maple Global packages account opening support, global funds-routing design, supplier and payroll transfer planning, and recurring bookkeeping plus annual review handoff so the account is ready for a production finance workflow.",
    purchaseModes: [
      {
        id: "airwallex-core",
        label: "Global account opening",
        price: "US$459.00",
        compareAt: "US$579.00",
        note: "Includes application support, local collection setup, and FX routing guidance",
      },
      {
        id: "airwallex-transfers",
        label: "Account plus treasury flows",
        price: "US$729.00",
        compareAt: "US$879.00",
        note: "Adds supplier and payroll transfer workflows, currency wallet design, and card rollout planning",
      },
      {
        id: "airwallex-finance",
        label: "Account plus finance operations",
        price: "US$1,049.00",
        compareAt: "US$1,199.00",
        note: "Adds accounting integrations, recurring bookkeeping handoff, and annual finance review support",
      },
    ],
    policies: [
      "Service delivery",
      "Account opening scope",
      "Platform eligibility",
      "Refund Policy",
    ],
    merchant: {
      ...merchant,
      image: serviceImages.airwallex,
      badge: "Cross-border treasury",
    },
    recommendations: [],
    relatedMerchants: [],
    reviews: buildReviews([
      {
        author: "Derek J.",
        rating: 5,
        title: "Best fit for cross-border receipts",
        body: "We needed local collections and transfer routing more than a domestic bank. This setup product handled both the application and the follow-on finance flow.",
      },
      {
        author: "Yvonne H.",
        rating: 5,
        title: "Strong for global operating finance",
        body: "Cards, transfers, FX, and bookkeeping integration were all accounted for. That made the Airwallex rollout much easier to operationalise.",
      },
      {
        author: "Marco V.",
        rating: 4,
        title: "Practical treasury onboarding",
        body: "The service focused on treasury and collections design instead of only paperwork, which is why we chose it.",
      },
    ]),
  },
  createSeedProduct({
    productId: "svc-it-consulting",
    slug: "it-consulting-architecture-advisory",
    title: "IT Consulting and Architecture Advisory",
    price: "US$1,800.00",
    image: serviceImages.itConsulting,
    gallery: [...techGalleries.itConsulting],
    rating: 4.9,
    reviewsCount: "67",
    shippingNote: "Architecture discovery starts within 1 business day",
    boughtText: "Chosen for platform planning before build",
    description:
      "This advisory service is modeled on enterprise engineering consultancies such as Thoughtworks: architecture review, cloud and data strategy, delivery planning, AI-first implementation options, and technology risk assessment. Maple Global packages that into a concrete scope with solution mapping, stack recommendation, phased delivery plan, cost envelope, and build-ready tickets so your team can move directly into implementation.",
    purchaseModes: [
      {
        id: "it-architecture",
        label: "Architecture review",
        price: "US$1,800.00",
        compareAt: "US$2,200.00",
        note: "Includes stack review, system map, delivery risks, and recommended architecture direction",
      },
      {
        id: "it-roadmap",
        label: "Architecture plus roadmap",
        price: "US$3,200.00",
        compareAt: "US$3,800.00",
        note: "Adds database, hosting, security, observability, and phased implementation roadmap",
      },
      {
        id: "it-fractional-cto",
        label: "Fractional CTO sprint",
        price: "US$5,600.00",
        compareAt: "US$6,400.00",
        note: "Adds weekly delivery leadership, vendor selection, and engineering decision support for one month",
      },
    ],
    policies: ["Service delivery", "Architecture scope", "Hosting and deployment", "Refund Policy"],
    merchantBadge: "Architecture advisory",
    reviews: buildReviews([
      {
        author: "Noah C.",
        rating: 5,
        title: "Helped us choose the right stack",
        body: "We were deciding between a fast no-code setup and a proper application stack. The architecture review gave us a phased plan we could actually execute.",
      },
      {
        author: "Rachel Y.",
        rating: 5,
        title: "Good before starting a rebuild",
        body: "The most useful part was the delivery roadmap and database decision support. It gave our team clarity before any coding started.",
      },
      {
        author: "Theo B.",
        rating: 4,
        title: "Strong for mixed web and AI projects",
        body: "The advisory scope covered web architecture, data flows, and AI integration tradeoffs without staying at a purely high-level strategy layer.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-corporate-web",
    slug: "corporate-website-nextjs-build",
    title: "Corporate Website Build",
    price: "US$2,400.00",
    image: serviceImages.corporateWeb,
    gallery: [...techGalleries.corporateWeb],
    rating: 4.9,
    reviewsCount: "74",
    shippingNote: "Wireframe and content structure delivered within 3 business days",
    boughtText: "Popular with service companies and global brands",
    description:
      "This delivery package is based on modern Next.js and Vercel practices: server rendering, static generation, CMS-friendly content architecture, forms, analytics, SEO, and zero-downtime deployment. Maple Global turns that into a launch-ready corporate website with visual direction, page templates, bilingual structure when needed, lead capture, deployment setup, and handoff documentation so your content team can keep operating after launch.",
    purchaseModes: [
      {
        id: "corp-starter",
        label: "Starter corporate site",
        price: "US$2,400.00",
        compareAt: "US$2,900.00",
        note: "Includes landing page, service pages, contact form, SEO foundation, and Vercel deployment",
      },
      {
        id: "corp-growth",
        label: "Growth website package",
        price: "US$4,200.00",
        compareAt: "US$4,900.00",
        note: "Adds CMS structure, blog or newsroom, bilingual content model, analytics, and CRM-ready forms",
      },
      {
        id: "corp-brand",
        label: "Brand and content system",
        price: "US$6,800.00",
        compareAt: "US$7,600.00",
        note: "Adds design system, reusable blocks, multi-region routing, and editorial handoff for ongoing publishing",
      },
    ],
    policies: ["Service delivery", "Website build scope", "Hosting and deployment", "Refund Policy"],
    merchantBadge: "Next.js build",
    reviews: buildReviews([
      {
        author: "Jasmine H.",
        rating: 5,
        title: "Exactly what we needed for a brand site",
        body: "We needed a modern corporate site with clear performance, bilingual pages, and proper deployment. The package covered all of it cleanly.",
      },
      {
        author: "Albert R.",
        rating: 5,
        title: "Good balance of design and engineering",
        body: "The build was not just static pages. Analytics, content structure, and deployment handoff were already built into the scope.",
      },
      {
        author: "Mina D.",
        rating: 4,
        title: "Practical for small teams",
        body: "The CMS handoff and reusable sections mattered because our content team could maintain the site without reworking the frontend.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-ecommerce-web",
    slug: "ecommerce-website-headless-build",
    title: "Ecommerce Website Build",
    price: "US$4,800.00",
    image: serviceImages.ecommerceWeb,
    gallery: [...techGalleries.ecommerceWeb],
    rating: 4.9,
    reviewsCount: "83",
    shippingNote: "Store architecture and checkout plan delivered within 3 business days",
    boughtText: "Strong fit for headless commerce launches",
    description:
      "This product is modeled on high-performance commerce builds using Next.js, headless storefront patterns, and production-ready checkout handoff. Maple Global packages catalog structure, collection pages, product detail templates, cart and checkout shell, marketing modules, search and filter design, analytics, and deployment so you can later replace the static data with your own APIs without rebuilding the whole interface.",
    purchaseModes: [
      {
        id: "commerce-shell",
        label: "Storefront shell",
        price: "US$4,800.00",
        compareAt: "US$5,600.00",
        note: "Includes home, collections, product detail, cart, checkout shell, search, and responsive storefront layouts",
      },
      {
        id: "commerce-growth",
        label: "Storefront plus growth tools",
        price: "US$7,200.00",
        compareAt: "US$8,100.00",
        note: "Adds bundles, promotions, reviews, recommendation rails, email hooks, and analytics events",
      },
      {
        id: "commerce-ops",
        label: "Commerce plus operations",
        price: "US$9,600.00",
        compareAt: "US$10,800.00",
        note: "Adds CMS-ready catalog admin shape, API contract planning, multi-market currency support, and deployment hardening",
      },
    ],
    policies: ["Service delivery", "Website build scope", "Hosting and deployment", "Refund Policy"],
    merchantBadge: "Headless commerce",
    reviews: buildReviews([
      {
        author: "Chris L.",
        rating: 5,
        title: "Good storefront foundation for later API work",
        body: "We needed the frontend shell first and planned to wire real catalog APIs later. The component breakdown and routing structure made that possible.",
      },
      {
        author: "Sara P.",
        rating: 5,
        title: "Strong for high-performance ecommerce",
        body: "Collection pages, product templates, and checkout flow were built with the right level of detail so our backend team can plug in data later.",
      },
      {
        author: "Dean W.",
        rating: 4,
        title: "Useful when performance matters",
        body: "The package leaned into a modern Next.js commerce setup instead of a heavy template marketplace approach, which was the right choice for us.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-restaurant-web",
    slug: "restaurant-website-ordering-system",
    title: "Restaurant Website and Ordering System",
    price: "US$3,800.00",
    image: serviceImages.restaurantWeb,
    gallery: [...techGalleries.restaurantWeb],
    rating: 4.8,
    reviewsCount: "58",
    shippingNote: "Restaurant flow mapping starts within 2 business days",
    boughtText: "Picked for restaurants needing ordering and content in one site",
    description:
      "This package follows modern restaurant website patterns such as menu-first pages, online ordering, reservation or table management hooks, catering enquiry flows, SEO landing pages, and CMS-friendly updates. Maple Global turns that into a launch-ready restaurant stack with homepage, menus, location pages, ordering and contact flows, campaign pages, and deployment handoff for online and offline growth.",
    purchaseModes: [
      {
        id: "restaurant-site",
        label: "Restaurant website",
        price: "US$3,800.00",
        compareAt: "US$4,400.00",
        note: "Includes branded site, menus, location and contact pages, and responsive reservations or enquiry flow",
      },
      {
        id: "restaurant-ordering",
        label: "Website plus ordering",
        price: "US$5,600.00",
        compareAt: "US$6,300.00",
        note: "Adds online ordering shell, pickup and delivery UX, menu sections, and conversion tracking",
      },
      {
        id: "restaurant-omnichannel",
        label: "Omnichannel restaurant stack",
        price: "US$7,400.00",
        compareAt: "US$8,300.00",
        note: "Adds promo pages, loyalty or campaign flows, POS integration planning, and franchise-ready content patterns",
      },
    ],
    policies: ["Service delivery", "Website build scope", "Hosting and deployment", "Refund Policy"],
    merchantBadge: "Restaurant stack",
    reviews: buildReviews([
      {
        author: "Maggie T.",
        rating: 5,
        title: "Better than a static menu page",
        body: "We needed menus, ordering, catering enquiries, and campaign pages together. This package treated the restaurant site like a real sales channel.",
      },
      {
        author: "Paul K.",
        rating: 4,
        title: "Strong for multi-location restaurants",
        body: "The site structure and location handling were the useful parts for us because our menus and promotions change frequently.",
      },
      {
        author: "Nina E.",
        rating: 5,
        title: "Clear path for online ordering",
        body: "The ordering shell and deployment handoff gave us a usable frontend without forcing a specific POS or backend too early.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-deployment",
    slug: "vercel-cloudflare-deployment-platform",
    title: "Vercel and Cloudflare Deployment Setup",
    price: "US$1,500.00",
    image: serviceImages.deployment,
    gallery: [...techGalleries.deployment],
    rating: 4.9,
    reviewsCount: "61",
    shippingNote: "Infrastructure checklist issued within hours",
    boughtText: "Common add-on for production launches",
    description:
      "This service packages production deployment across Vercel and Cloudflare Workers into a concrete implementation scope: domains, edge rendering, serverless functions, worker APIs, storage, database routing, observability, and zero-downtime release practices. Maple Global adds CI/CD setup, environment management, preview flows, rollback planning, and runbook handoff so your frontend and backend can ship reliably.",
    purchaseModes: [
      {
        id: "deploy-core",
        label: "Production deployment",
        price: "US$1,500.00",
        compareAt: "US$1,900.00",
        note: "Includes Vercel or Cloudflare setup, env management, domain wiring, and release checklist",
      },
      {
        id: "deploy-edge",
        label: "Edge platform package",
        price: "US$2,600.00",
        compareAt: "US$3,100.00",
        note: "Adds workers, caches, storage, observability, queues or cron jobs, and release rollback design",
      },
      {
        id: "deploy-full",
        label: "Launch plus DevOps handoff",
        price: "US$4,200.00",
        compareAt: "US$4,900.00",
        note: "Adds CI/CD, staging and preview environments, runbooks, and ongoing deployment support for one month",
      },
    ],
    policies: ["Service delivery", "Hosting and deployment", "Architecture scope", "Refund Policy"],
    merchantBadge: "Edge deployment",
    reviews: buildReviews([
      {
        author: "Wendy F.",
        rating: 5,
        title: "Good for teams shipping to production fast",
        body: "The package covered deployment details, preview environments, and rollback planning instead of just pointing us at hosting docs.",
      },
      {
        author: "Omar S.",
        rating: 5,
        title: "Useful Vercel and Cloudflare split",
        body: "We needed static pages on Vercel and worker APIs on Cloudflare. The delivery model and environment management were the important parts.",
      },
      {
        author: "Luca R.",
        rating: 4,
        title: "Solid infra handoff",
        body: "The runbook and observability setup gave us confidence that the site could actually operate after launch.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-email-marketing",
    slug: "email-marketing-automation-delivery",
    title: "Email Delivery and Marketing Automation",
    price: "US$1,200.00",
    image: serviceImages.emailMarketing,
    gallery: [...techGalleries.emailMarketing],
    rating: 4.8,
    reviewsCount: "54",
    shippingNote: "Deliverability checklist starts the same day",
    boughtText: "Chosen for transactional plus lifecycle email setup",
    description:
      "This service combines developer-grade email delivery and marketing automation patterns based on platforms such as Resend and Mailchimp. Maple Global packages domain authentication, transactional templates, broadcast setup, segments, automations, webhooks, analytics, and reporting so your product emails and growth emails can run from one structured system.",
    purchaseModes: [
      {
        id: "email-transactional",
        label: "Transactional email setup",
        price: "US$1,200.00",
        compareAt: "US$1,500.00",
        note: "Includes domain auth, sender setup, template system, event webhooks, and deliverability checklist",
      },
      {
        id: "email-growth",
        label: "Lifecycle and marketing flows",
        price: "US$2,100.00",
        compareAt: "US$2,500.00",
        note: "Adds newsletters, segments, automations, abandoned-cart or lead flows, and analytics dashboards",
      },
      {
        id: "email-full",
        label: "Email ops package",
        price: "US$3,400.00",
        compareAt: "US$3,900.00",
        note: "Adds copy templates, campaign calendar, CRM sync, and team handoff for recurring operations",
      },
    ],
    policies: [
      "Service delivery",
      "Email and automation scope",
      "Hosting and deployment",
      "Refund Policy",
    ],
    merchantBadge: "Email systems",
    reviews: buildReviews([
      {
        author: "Adam Y.",
        rating: 5,
        title: "Covered both product email and campaigns",
        body: "We wanted transactional email, broadcasts, and lifecycle automation in one scope. The setup product handled both without feeling generic.",
      },
      {
        author: "Clara J.",
        rating: 4,
        title: "Good for launch teams without email ops",
        body: "Deliverability, templates, and automations were packaged together clearly enough that our team could keep running after handoff.",
      },
      {
        author: "Sean P.",
        rating: 5,
        title: "Strong domain and webhook setup",
        body: "The important part was getting the technical email foundation right while still leaving room for real marketing flows.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-ai-knowledge-base",
    slug: "ai-knowledge-base-rag-system",
    title: "AI Knowledge Base and RAG System",
    price: "US$3,600.00",
    image: serviceImages.aiKnowledge,
    gallery: [...techGalleries.aiKnowledge],
    rating: 4.9,
    reviewsCount: "49",
    shippingNote: "Knowledge-source mapping begins within 2 business days",
    boughtText: "Picked for support, docs, and internal search use cases",
    description:
      "This product turns Pinecone-style RAG architecture into a deployable service: document ingestion, chunking, embeddings, vector storage, retrieval, prompt orchestration, answer grounding, and admin controls. Maple Global packages that into a working knowledge system for support, internal operations, or product docs, with content pipelines and future API integration in mind.",
    purchaseModes: [
      {
        id: "rag-starter",
        label: "RAG proof of concept",
        price: "US$3,600.00",
        compareAt: "US$4,200.00",
        note: "Includes document pipeline, vector store setup, retrieval flow, prompt design, and grounded answer output",
      },
      {
        id: "rag-production",
        label: "Production knowledge base",
        price: "US$5,800.00",
        compareAt: "US$6,600.00",
        note: "Adds admin upload flows, observability, source controls, citations, and deployment to your target environment",
      },
      {
        id: "rag-ops",
        label: "Knowledge ops system",
        price: "US$8,400.00",
        compareAt: "US$9,400.00",
        note: "Adds role-based workflows, re-index routines, analytics, and monthly optimisation support",
      },
    ],
    policies: [
      "Service delivery",
      "AI knowledge base scope",
      "Hosting and deployment",
      "Refund Policy",
    ],
    merchantBadge: "RAG system",
    reviews: buildReviews([
      {
        author: "Irene W.",
        rating: 5,
        title: "Exactly what we needed for a knowledge assistant",
        body: "The scope covered ingestion, vector search, prompt design, and operational controls, not just a chatbot demo.",
      },
      {
        author: "Ken Z.",
        rating: 5,
        title: "Grounded answers mattered",
        body: "The useful part was how the system referenced our own documents and stayed maintainable as new material was added.",
      },
      {
        author: "Phoebe L.",
        rating: 4,
        title: "Strong for internal docs and support",
        body: "We used it as a support and operations knowledge layer. The content-pipeline design was the part that made it sustainable.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-customer-support-ai",
    slug: "customer-support-ai-helpdesk",
    title: "Customer Support AI and Helpdesk Setup",
    price: "US$2,800.00",
    image: serviceImages.customerSupport,
    gallery: [...techGalleries.customerSupport],
    rating: 4.8,
    reviewsCount: "44",
    shippingNote: "Support workflow workshop scheduled within 2 business days",
    boughtText: "Built for teams combining AI agents with human support",
    description:
      "This service packages an Intercom-style AI support stack into a deployable operating model: omnichannel inbox, AI agent or chatbot flows, ticketing, knowledge hub, handoff to human agents, reporting, and support automations. Maple Global adds workflow design, escalation paths, content strategy, agent QA, and deployment notes so the system works as a real helpdesk instead of a demo bot.",
    purchaseModes: [
      {
        id: "support-core",
        label: "AI helpdesk starter",
        price: "US$2,800.00",
        compareAt: "US$3,300.00",
        note: "Includes inbox design, AI agent flows, knowledge-base mapping, ticketing, and escalation rules",
      },
      {
        id: "support-ops",
        label: "Support operations package",
        price: "US$4,600.00",
        compareAt: "US$5,200.00",
        note: "Adds agent workspace, quality scoring, reporting, SLA logic, and outbound support messaging",
      },
      {
        id: "support-scale",
        label: "Support scale rollout",
        price: "US$6,900.00",
        compareAt: "US$7,800.00",
        note: "Adds multi-channel routing, integration planning, training, and optimisation support after go-live",
      },
    ],
    policies: [
      "Service delivery",
      "Customer support workflow",
      "AI knowledge base scope",
      "Refund Policy",
    ],
    merchantBadge: "AI helpdesk",
    reviews: buildReviews([
      {
        author: "Brian X.",
        rating: 5,
        title: "Good mix of AI and human support",
        body: "We did not want a blind chatbot. The workflow design around handoff, tickets, and reporting made the setup credible.",
      },
      {
        author: "Lily G.",
        rating: 4,
        title: "Practical for customer service teams",
        body: "The package treated support as an operation with QA and reporting, not just a widget on the website.",
      },
      {
        author: "Roy F.",
        rating: 5,
        title: "Strong for product and support alignment",
        body: "The integration planning and knowledge-hub structure were the parts we needed most, and they were included from the start.",
      },
    ]),
  }),
  createSeedProduct({
    productId: "svc-openrouter-integration",
    slug: "openrouter-multi-model-integration",
    title: "OpenRouter and Multi-Model API Integration",
    price: "US$1,600.00",
    image: serviceImages.openrouter,
    gallery: [...techGalleries.openrouter],
    rating: 4.9,
    reviewsCount: "39",
    shippingNote: "Model routing review starts within 1 business day",
    boughtText: "Picked when teams need one gateway for many model vendors",
    description:
      "This product packages OpenRouter-style model routing into an implementation service: unified API integration, provider fallback, model selection, latency and pricing policy, key management, request logging, and environment setup. Maple Global turns that into a usable foundation for AI features so your application can switch between vendors without rewriting every integration.",
    purchaseModes: [
      {
        id: "openrouter-core",
        label: "Unified model gateway",
        price: "US$1,600.00",
        compareAt: "US$1,950.00",
        note: "Includes OpenRouter integration, model selection, key handling, and request routing design",
      },
      {
        id: "openrouter-policy",
        label: "Routing and policy package",
        price: "US$2,700.00",
        compareAt: "US$3,100.00",
        note: "Adds provider fallback, budget controls, logging, privacy rules, and environment rollout",
      },
      {
        id: "openrouter-production",
        label: "Production AI gateway",
        price: "US$4,100.00",
        compareAt: "US$4,700.00",
        note: "Adds observability, failover tests, prompt-management conventions, and application integration support",
      },
    ],
    policies: [
      "Service delivery",
      "Model routing and API keys",
      "Hosting and deployment",
      "Refund Policy",
    ],
    merchantBadge: "Model gateway",
    reviews: buildReviews([
      {
        author: "Ethan M.",
        rating: 5,
        title: "Good if you do not want vendor lock-in",
        body: "We needed one AI integration layer across multiple providers. This package handled routing, key policy, and fallback cleanly.",
      },
      {
        author: "Queenie T.",
        rating: 5,
        title: "Useful for rapid AI shipping",
        body: "The OpenRouter integration was only part of it. The budget controls and model-routing decisions were the pieces that made it production-friendly.",
      },
      {
        author: "Jon R.",
        rating: 4,
        title: "Helpful foundation for AI products",
        body: "The delivery gave us a stable gateway layer so we can add or replace model vendors without reworking every app surface later.",
      },
    ]),
  }),
];

const cardMeta: Record<string, { badge?: string }> = {
  "svc-uk-formation": { badge: "Best seller" },
  "svc-us-formation": { badge: "Founder pick" },
  "svc-china-formation": { badge: "Market entry" },
  "svc-wise-account": { badge: "FX favorite" },
  "svc-worldfirst-account": { badge: "Seller pick" },
  "svc-mercury-account": { badge: "Startup bank" },
  "svc-revolut-account": { badge: "Spend control" },
  "svc-airwallex-account": { badge: "Treasury pick" },
  "svc-it-consulting": { badge: "Architecture" },
  "svc-corporate-web": { badge: "Brand site" },
  "svc-ecommerce-web": { badge: "Headless store" },
  "svc-restaurant-web": { badge: "Ordering UX" },
  "svc-deployment": { badge: "Launch ops" },
  "svc-email-marketing": { badge: "Growth system" },
  "svc-ai-knowledge-base": { badge: "RAG ready" },
  "svc-customer-support-ai": { badge: "Support AI" },
  "svc-openrouter-integration": { badge: "Model routing" },
};

function productToCard(product: ProductDetailRecord): ShopCard {
  return {
    id: product.productId,
    title: product.title,
    brand: product.brand,
    price: product.price,
    compareAt: product.purchaseModes?.[0]?.compareAt,
    reviews: product.reviewsCount,
    rating: product.rating,
    image: product.image,
    href: productHref(product),
    badge: cardMeta[product.productId]?.badge,
  };
}

const products = seedProducts.map((product) => ({
  ...product,
  recommendations: seedProducts
    .filter((candidate) => candidate.productId !== product.productId)
    .map(productToCard),
})) satisfies ProductDetailRecord[];

const cards = products.map(productToCard);
const cardById = Object.fromEntries(cards.map((card) => [card.id, card])) as Record<
  string,
  ShopCard
>;
const productById = Object.fromEntries(
  products.map((product) => [product.productId, product]),
) as Record<string, ProductDetailRecord>;

const formationIds = [
  "svc-uk-formation",
  "svc-us-formation",
  "svc-china-formation",
] as const;
const bankingIds = [
  "svc-wise-account",
  "svc-worldfirst-account",
  "svc-mercury-account",
  "svc-revolut-account",
  "svc-airwallex-account",
] as const;
const webAndDeploymentIds = [
  "svc-it-consulting",
  "svc-corporate-web",
  "svc-ecommerce-web",
  "svc-restaurant-web",
  "svc-deployment",
] as const;
const aiGrowthIds = [
  "svc-email-marketing",
  "svc-ai-knowledge-base",
  "svc-customer-support-ai",
  "svc-openrouter-integration",
] as const;
const financeIds = [
  "svc-airwallex-account",
  "svc-mercury-account",
  "svc-wise-account",
  "svc-worldfirst-account",
  "svc-revolut-account",
] as const;

function buildSectionItems(ids: readonly string[]) {
  return ids.map((id) => {
    const product = productById[id];

    return {
      href: productHref(product),
      image: product.image,
      itemCount: ids.length,
      productTitle: product.title,
      rating: `${product.rating}`,
      storeHref: `/m/${merchant.slug}`,
      storeLabel: "MG",
      storeName: merchant.name,
    };
  });
}

const globalCategory: CategoryDetailRecord = {
  categoryId: "business-and-technology-services",
  slug: "business-and-technology-services",
  title: "Business and technology services",
  parentLabel: "Maple Global services",
  subcategories: [
    {
      label: "Company formation",
      href: productHref(productById["svc-us-formation"]),
      image: serviceImages.us,
    },
    {
      label: "Business accounts and treasury",
      href: productHref(productById["svc-airwallex-account"]),
      image: serviceImages.airwallex,
    },
    {
      label: "Websites and deployment",
      href: productHref(productById["svc-ecommerce-web"]),
      image: serviceImages.ecommerceWeb,
    },
    {
      label: "AI, support, and growth",
      href: productHref(productById["svc-ai-knowledge-base"]),
      image: serviceImages.aiKnowledge,
    },
  ],
  sections: [
    {
      title: "Company formation",
      items: buildSectionItems(formationIds),
    },
    {
      title: "Business accounts and treasury",
      items: buildSectionItems(bankingIds),
    },
    {
      title: "Websites and deployment",
      items: buildSectionItems(webAndDeploymentIds),
    },
    {
      title: "AI, support, and growth",
      items: buildSectionItems(aiGrowthIds),
    },
  ],
};

const store: StoreProfile = {
  slug: merchant.slug,
  name: merchant.name,
  heroImage: serviceImages.corporateWeb,
  rating: merchant.rating,
  reviews: "612 reviews",
  products: cards,
  collections: [
    { title: "Company formation", image: serviceImages.uk },
    { title: "Business accounts", image: serviceImages.airwallex },
    { title: "IT consulting", image: serviceImages.itConsulting },
    { title: "Corporate websites", image: serviceImages.corporateWeb },
    { title: "Ecommerce stores", image: serviceImages.ecommerceWeb },
    { title: "Restaurant ordering", image: serviceImages.restaurantWeb },
    { title: "AI knowledge and support", image: serviceImages.aiKnowledge },
    { title: "Model integration", image: serviceImages.openrouter },
  ],
};

export function createShopSeedCatalog(): ShopCatalogPayload {
  return {
    updatedAt: new Date().toISOString(),
    searchSuggestions: [
      "UK limited company",
      "Delaware C corp",
      "China company registration",
      "Wise business account",
      "WorldFirst seller account",
      "Mercury startup banking",
      "Airwallex global account",
      "IT consulting",
      "Corporate website build",
      "Ecommerce website",
      "Restaurant ordering website",
      "Vercel deployment",
      "Cloudflare Workers",
      "Email marketing",
      "AI knowledge base",
      "Customer support AI",
      "OpenRouter integration",
      "Vector database",
      "Annual accounts and filing",
      "Bookkeeping and finance handoff",
    ],
    home: {
      floatingBrands: [],
      floatingProducts: [
        {
          ...cardById["svc-ecommerce-web"],
          className: "right-[10%] top-[11%]",
        },
        {
          ...cardById["svc-airwallex-account"],
          className: "left-[8%] bottom-[15%]",
        },
        {
          ...cardById["svc-ai-knowledge-base"],
          className: "right-[4%] bottom-[22%]",
        },
        {
          ...cardById["svc-openrouter-integration"],
          className: "left-[6%] top-[18%]",
        },
      ],
    },
    categoryLanding: {
      topCategoryLinks: [
        "UK company",
        "US Delaware",
        "China registration",
        "Wise",
        "Corporate website",
        "Ecommerce store",
        "Restaurant website",
        "Cloudflare Workers",
        "Email marketing",
        "AI knowledge base",
        "Customer support AI",
        "OpenRouter",
      ],
      featuredCollections: [
        {
          title: "Launch a company and finance stack",
          description:
            "Company formation, business accounts, compliance planning, and finance handoff for cross-border operations.",
          image: serviceImages.airwallex,
        },
        {
          title: "Build a corporate website",
          description:
            "Next.js website delivery with content structure, forms, analytics, SEO, and deployment ready for live operations.",
          image: serviceImages.corporateWeb,
        },
        {
          title: "Ship a modern ecommerce storefront",
          description:
            "Collections, product detail, cart, checkout shell, promotions, and API-ready storefront components for later backend integration.",
          image: serviceImages.ecommerceWeb,
        },
        {
          title: "Restaurant ordering and growth",
          description:
            "Menus, online ordering, location pages, campaign flows, and omnichannel restaurant site delivery.",
          image: serviceImages.restaurantWeb,
        },
        {
          title: "AI systems for support and knowledge",
          description:
            "RAG knowledge bases, AI helpdesks, email systems, and multi-model API routing for modern operations.",
          image: serviceImages.aiKnowledge,
        },
      ],
      browseCategories: [
        { title: "Company formation", image: serviceImages.us },
        { title: "Business accounts", image: serviceImages.wise },
        { title: "Custom websites", image: serviceImages.corporateWeb },
        { title: "Deployment and edge", image: serviceImages.deployment },
        { title: "AI and support systems", image: serviceImages.customerSupport },
      ],
      shelves: [
        {
          title: "Company formation services",
          items: formationIds.map((id) => cardById[id]),
        },
        {
          title: "Business account opening",
          items: bankingIds.map((id) => cardById[id]),
        },
        {
          title: "Website and commerce builds",
          items: [
            cardById["svc-corporate-web"],
            cardById["svc-ecommerce-web"],
            cardById["svc-restaurant-web"],
            cardById["svc-deployment"],
            cardById["svc-it-consulting"],
          ],
        },
        {
          title: "AI, support, and automation",
          items: aiGrowthIds.map((id) => cardById[id]),
        },
        {
          title: "Cross-border operations and finance",
          items: financeIds.map((id) => cardById[id]),
        },
      ],
    },
    categories: [globalCategory],
    products,
    stores: [store],
    cartRecommendations: [
      cardById["svc-us-formation"],
      cardById["svc-airwallex-account"],
      cardById["svc-ecommerce-web"],
      cardById["svc-deployment"],
      cardById["svc-ai-knowledge-base"],
    ],
    policyCopy: {
      "Service delivery":
        "After payment, Maple Global issues a kickoff questionnaire and delivery checklist first. The service then moves through discovery, implementation planning, build or onboarding, testing, and handoff based on the package you selected.",
      "Documents included":
        "Company-formation services include incorporation or registration documents, founder or shareholder paperwork, onboarding notes, and a compliance handoff pack that your backend can later replace with live generated files.",
      "Annual compliance":
        "Formation and finance-related services are structured to support recurring work, including annual accounts, annual return or report reminders, bookkeeping coordination, and year-end finance review preparation.",
      "Registered agent and tax setup":
        "US formation packages include registered-agent lifecycle planning, EIN coordination, and tax-calendar support so the operating shell stays usable beyond day one.",
      "Setup scope":
        "China setup packages cover registration steps, company chops, bank-account coordination, tax registration flow, and optional bookkeeping or invoice workflow support.",
      "Account opening scope":
        "Bank-account products cover onboarding guidance, document preparation, application support, and post-approval operating setup. Provider approval, review timelines, and final account terms remain subject to the platform you apply to.",
      "Platform eligibility":
        "Eligibility depends on your jurisdiction, entity type, industry, shareholder profile, and the compliance rules of Wise, WorldFirst, Mercury, Revolut, or Airwallex. Replace this placeholder with your final legal and operational disclosures before going live.",
      "Architecture scope":
        "Architecture and advisory packages cover discovery, stack recommendation, delivery planning, database and hosting decisions, and implementation roadmap output. They do not automatically include full design or engineering execution unless the selected package says so.",
      "Website build scope":
        "Website and storefront packages cover interface delivery, responsive layouts, routing, component structure, SEO foundations, and deployment setup. Live backend integrations, payment provider contracts, CMS access, and content production must be finalised in your implementation plan.",
      "Hosting and deployment":
        "Deployment scope can include Vercel, Cloudflare Workers, domains, environment variables, preview environments, observability, and release workflow setup. Ongoing hosting charges and third-party platform fees remain billed by the infrastructure providers you choose.",
      "Email and automation scope":
        "Email-delivery packages cover sender-domain setup, templates, automations, webhooks, analytics, and reporting structure. Sending reputation, list hygiene, compliance content, and final platform pricing remain your responsibility after handoff.",
      "AI knowledge base scope":
        "Knowledge-base packages cover ingestion, chunking, embeddings, vector storage, retrieval, prompting, and admin or content flows defined in the selected package. Model costs, vector database fees, and live data-governance policies should be finalised before production launch.",
      "Customer support workflow":
        "Support packages cover AI agent flows, inbox or ticketing design, handoff rules, knowledge content strategy, reporting, and integrations scoped in the selected tier. Your team remains responsible for staffing, final support policy, and regulated-response review.",
      "Model routing and API keys":
        "Model-routing packages cover unified API integration, provider fallback, key and environment setup, logging, and routing rules. Usage fees, vendor-specific legal terms, and any managed key or billing exposure must be reviewed before production release.",
      "Refund Policy":
        "Refund handling should depend on whether advisory work, filing work, design work, or implementation support has already started. Replace this placeholder with your final legal and operational refund policy before going live.",
    },
  };
}
