export type ShopCard = {
  id: string;
  title: string;
  brand?: string;
  price: string;
  compareAt?: string;
  reviews?: string;
  rating?: number;
  image: string;
  href: string;
  badge?: string;
};

export const searchSuggestions = [
  "Plant-based protein powders",
  "Vegan leather handbags",
  "Bedroom decor",
  "Waterproof jackets",
  "Hoodies",
] as const;

export const topCategoryLinks = [
  "Women",
  "Men",
  "Beauty",
  "Food & drinks",
  "Baby & toddler",
  "Home",
  "Fitness & nutrition",
  "Accessories",
  "Pet supplies",
  "Toys & games",
  "Electronics",
  "Arts & crafts",
  "Luggage & bags",
  "Sporting goods",
] as const;

export const homeFloatingBrands = [
  {
    id: "baggu",
    name: "baggu",
    background:
      "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/baggu-background-BqbUua-o.webp",
    logo: "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/baggu-logo-B94g3XXc.webp",
    className: "left-[8%] top-[18%]",
  },
  {
    id: "polene",
    name: "polene",
    background:
      "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/polene-background-1htsZuM6.webp",
    logo: "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/polene-logo-DrCqMSU-.webp",
    className: "right-[8%] top-[18%]",
  },
  {
    id: "buckmason",
    name: "buckmason",
    background:
      "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/buckmason-background-CluwrSPN.webp",
    logo: "",
    className: "left-[12%] bottom-[10%]",
  },
  {
    id: "stevemadden",
    name: "stevemadden",
    background:
      "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/stevemadden-background--YiGumEm.webp",
    logo: "https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/stevemadden-logo-BOIPC7s1.webp",
    className: "right-[12%] bottom-[9%]",
  },
] as const;

export const homeFloatingProducts: Array<
  ShopCard & { className: string }
> = [
  {
    id: "devon-red",
    title: "Devon Red Moire Slingback Sandal",
    brand: "Loeffler Randall",
    price: "$295.00",
    reviews: "5",
    rating: 4,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_434.jpg?v=1769104275&width=480",
    href: "/products/7764008009780/devon-red-moire-slingback-sandal",
    className: "right-[18%] top-[10%]",
  },
  {
    id: "cooper-natural",
    title: "Cooper Natural Mary Jane Sneaker",
    brand: "Loeffler Randall",
    price: "$195.00",
    reviews: "7",
    rating: 4.9,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/COOPER-CV-NATRL_5.jpg?v=1758749038&width=480",
    href: "/products/7703579394100/cooper-natural-mary-jane-sneaker",
    className: "left-[17%] bottom-[14%]",
  },
  {
    id: "mira-black",
    title: "Mira Black Everyday Tote",
    brand: "Loeffler Randall",
    price: "$175.00",
    reviews: "2",
    rating: 2.5,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/FREDDIE-WNYL-BLACK_1.jpg?v=1769552618&width=480",
    href: "/products/8741540692020/mira-black-everyday-tote",
    className: "right-[6%] bottom-[22%]",
  },
  {
    id: "nico-natural",
    title: "Nico Natural Two-Band Sandal",
    brand: "Loeffler Randall",
    price: "$350.00",
    reviews: "1",
    rating: 5,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/NICO-CWR-NTNRL_3.jpg?v=1770658971&width=480",
    href: "/products/8741541445684/nico-natural-two-band-sandal",
    className: "left-[4%] top-[34%]",
  },
];

export const featuredCollections = [
  {
    title: "Home coffee essentials",
    description: "Shop Fellow, Our Place, Aarke, and more",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/curations/home_barista.jpg",
  },
  {
    title: "Workwear made modern",
    description: "Shop BRUNT Workwear, Dixxon, Blundstone, and more",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/curations/mens_work.jpg",
  },
  {
    title: "Get your spring glow",
    description: "Shop Summer Fridays, Glossier, Tower 28, and more",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/curations/beauty_spring-glow.jpg",
  },
] as const;

export const browseCategories = [
  {
    title: "Beauty",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/beauty-1.jpg?width=500&height=500&crop=center",
  },
  {
    title: "Womenswear",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/women-1.jpg?width=500&height=500&crop=center",
  },
  {
    title: "Menswear",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/men-1.jpg?width=500&height=500&crop=center",
  },
  {
    title: "Home",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/home-1.jpg?width=500&height=500&crop=center",
  },
  {
    title: "Fitness & nutrition",
    image:
      "https://cdn.shopify.com/shop-assets/static_uploads/shop-categories/fitness-1.png?width=500&height=500&crop=center&format=webp",
  },
] as const;

export const categoryShelves: Array<{ title: string; items: ShopCard[] }> = [
  {
    title: "What's new in beauty",
    items: [
      {
        id: "bareskin",
        title: "BARESKIN Daily Dewy Sunscreen Mineral SPF 30",
        brand: "Bare Minerals",
        price: "$39.00",
        reviews: "2",
        rating: 4.5,
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Translucent_3000x3000_f141f036-8a24-4992-8074-a4ffc3976a2e.png?v=1770906974&width=384",
        href: "/products/7282153488469/bareskin-daily-dewy-sunscreen-mineral-spf-30",
      },
      {
        id: "baby-cheeks",
        title: "Baby Cheeks Blush Stick - Fizz",
        brand: "Westman Atelier",
        price: "$48.00",
        reviews: "32",
        rating: 4.8,
        image:
          "https://cdn.shopify.com/s/files/1/2596/0058/files/Fizz-BabyCheeks-Open.jpg?v=1773930452&width=384",
        href: "/categories",
      },
      {
        id: "speed-dry",
        title: "Speed Dry Heat Protectant Spray",
        brand: "LolaVie",
        price: "$30.00",
        reviews: "2",
        rating: 5,
        image:
          "https://cdn.shopify.com/s/files/1/0561/5855/2220/files/speed-dry-heat-carousel-01.jpg?v=1773876476&width=384",
        href: "/categories",
      },
      {
        id: "macaron",
        title: "macaron sculpt & bronze duo",
        brand: "Tarte Cosmetics",
        price: "$38.00",
        reviews: "5",
        rating: 5,
        image:
          "https://cdn.shopify.com/s/files/1/0898/4972/4950/files/unique__197689056814__macaron-sculpt-_-bronze-duo-brownsugar__01.jpg?v=1772036208&width=384",
        href: "/categories",
      },
      {
        id: "crown-affair",
        title: "Crown Affair x U Beauty On-The-Go Duo",
        brand: "Crown Affair",
        price: "$36.00",
        reviews: "1",
        rating: 5,
        image:
          "https://cdn.shopify.com/s/files/1/0088/0368/0319/files/TheOntheGoDuo-Thumbnail2.jpg?v=1773182399&width=384",
        href: "/categories",
      },
    ],
  },
  {
    title: "New arrivals in womenswear",
    items: [
      {
        id: "cropped-jacket",
        title: "CROPPED TEXTURED FUNNEL NECK JACKET",
        brand: "OAK + FORT",
        price: "CA$148.00",
        image:
          "https://cdn.shopify.com/s/files/1/0629/6381/0509/files/Outerwear-16293_Taupe-1.jpg?v=1774370444&width=384",
        href: "/categories",
      },
      {
        id: "bermuda-shorts",
        title: "Marfa Linen Bermuda Shorts - Camel",
        brand: "The Frankie Shop",
        price: "$220.00",
        image:
          "https://cdn.shopify.com/s/files/1/1527/0993/files/MARFA-LINEN-BERMUDA-SHORTS-CAMEL-FARHIYA-0628.jpg?v=1774351867&width=384",
        href: "/categories",
      },
      {
        id: "meshki-skort",
        title: "Alix Suiting Mini Skort - Ivory",
        brand: "MESHKI US",
        price: "$84.00",
        compareAt: "$105.00",
        badge: "20% off",
        reviews: "6",
        rating: 5,
        image:
          "https://cdn.shopify.com/s/files/1/0017/7920/4211/files/241211_MESHKI_CordiallyInvited_Drp3_15_0440.jpg?v=1769963492&width=384",
        href: "/categories",
      },
      {
        id: "ballet-flats",
        title: "TAMEKA BALLET FLATS JADE STRIPE MESH",
        brand: "Dolce Vita",
        price: "$69.99",
        compareAt: "$120.00",
        badge: "42% off",
        reviews: "2",
        rating: 2.5,
        image:
          "https://cdn.shopify.com/s/files/1/0037/3807/5202/files/DOLCEVITA-FLATS_TAMEKA_JADESTRIPEMESH-02.jpg?v=1733324130&width=384",
        href: "/categories",
      },
      {
        id: "birthstone",
        title: "Birthstone Necklace - Solo Birthstone Necklace",
        brand: "ANA LUISA",
        price: "$125.00",
        image:
          "https://cdn.shopify.com/s/files/1/2579/7674/files/Gold-Vermeil-Gemstones-Amethyst-Aquamarine-Garnet-Diamond-Emerald-Alexandrite-Ruby-Peridot-Sapphire-Tourmaline-Citrine-Topaz-Custom-Pendant-Necklace-for-Women-Ana-Luisa-Solo-Birthston.jpg?v=1773238227&width=384",
        href: "/categories",
      },
    ],
  },
];
