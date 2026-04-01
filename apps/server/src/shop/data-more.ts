import type { ShopCard } from "./data";

export const storeCollections = [
  {
    title: "Shop Now",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/stevemadden.myshopify.com/1772449182/SM_2026_SPRING_DOMESTIC_RETAIL_DTC_CIAO_JEZZICA_RED_RETRO_BLUE_089.jpeg?crop=region&crop_left=0&crop_top=0&crop_width=1600&crop_height=1227&width=512",
  },
  {
    title: "Jellies",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/stevemadden.myshopify.com/1772449675/SM_2026_SPRING_DOMESTIC_RETAIL_WHOLESALE_OLA_SWIM_STILLS_GROVE_TRACIE-J_012.jpeg?width=512",
  },
  {
    title: "Pops of Color",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/stevemadden.myshopify.com/1772449638/SM_2026_SPRING_DOMESTIC_RETAIL_DTC_CIAO_KENDRIX_0223.jpeg?crop=region&crop_left=0&crop_top=0&crop_width=1600&crop_height=1356&width=512",
  },
  {
    title: "Men's Spring 'Fits",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/stevemadden.myshopify.com/1772449784/SM_2026_SPRING_DOMESTIC_RETAIL_DTC_CIAO_QUINCEY_BROWN_0136.jpeg?crop=region&crop_left=0&crop_top=729&crop_width=1600&crop_height=1270&width=512",
  },
] as const;

export const storeProducts: ShopCard[] = [
  {
    id: "maxima",
    title: "MAXIMA BLACK RHINESTONES",
    price: "$79.99",
    compareAt: "$99.95",
    reviews: "2.7K",
    rating: 4.1,
    badge: "20% off",
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_MAXIMA-R_BLACK_01.jpg?v=1771346398&width=384",
    href: "/products/6554352124037/maxima-black-rhinestones",
  },
  {
    id: "hadyn-white",
    title: "HADYN WHITE LEATHER",
    price: "$69.95",
    reviews: "917",
    rating: 4.1,
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_MENS_HADYN_WHITE-LEATHER_01.jpg?v=1771412833&width=384",
    href: "/products/4691970162821/hadyn-white-leather",
  },
  {
    id: "hadyn-cognac",
    title: "HADYN COGNAC LEATHER",
    price: "$69.95",
    reviews: "988",
    rating: 4.1,
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_HADYN_COGNAC_01_f4a7feff-ac99-4ac7-b83a-8811ae0e823d.jpg?v=1771346507&width=384",
    href: "/products/6738159042693/hadyn-cognac-leather",
  },
  {
    id: "possession",
    title: "POSSESSION BLACK/TAN",
    price: "$79.99",
    compareAt: "$99.95",
    reviews: "1.1K",
    rating: 4.5,
    badge: "20% off",
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_POSSESSION_BLACK-TAN_01.jpg?v=1771346432&width=384",
    href: "/products/6621425762437/possession-black-tan",
  },
  {
    id: "lando",
    title: "LANDO BLACK LEATHER",
    price: "$79.95",
    reviews: "692",
    rating: 4,
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_LANDO_BLACK-LEATHER_01.jpg?v=1771346413&width=384",
    href: "/products/6583992385669/lando-black-leather",
  },
  {
    id: "slinky",
    title: "SLINKY30 BLACK",
    price: "$89.95",
    reviews: "810",
    rating: 4.3,
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_SLINKY30_BLACK_01.jpg?v=1771346305&width=384",
    href: "/products/4298324770906/slinky30-black",
  },
  {
    id: "klayton",
    title: "KLAYTON BLACK",
    price: "$79.99",
    compareAt: "$119.95",
    reviews: "734",
    rating: 4.6,
    badge: "33% off",
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_SHOES_KLAYTON_BLACK_01.jpg?v=1771346415&width=384",
    href: "/products/6585848823941/klayton-black",
  },
  {
    id: "evelyn",
    title: "EVELYN BAG BLACK",
    price: "$88.00",
    reviews: "847",
    rating: 4.8,
    image:
      "https://cdn.shopify.com/s/files/1/2170/8465/files/STEVEMADDEN_HANDBAGS_DT618175_BLACK_01.jpg?v=1692634204&width=384",
    href: "/products/6657692205189/evelyn-bag-black",
  },
];

export const detailGallery = [
  "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_434.jpg?v=1743704973&width=800",
  "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_008.jpg?v=1743704973&width=800",
  "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_2.jpg?v=1743704973&width=800",
  "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_439.jpg?v=1743704968&width=800",
  "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_440.jpg?v=1743704968&width=800",
] as const;

export const detailColors = [
  { label: "Red", swatch: "#b8344d" },
  { label: "Powder Pink", swatch: "#d5b8bd" },
  { label: "Dune", swatch: "#c6a788" },
  { label: "Gold", swatch: "#b69959" },
  { label: "Green", swatch: "#6f8d74" },
  { label: "Leopard", swatch: "#89654a" },
] as const;

export const detailSizes = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
] as const;

export const detailMerchants = [
  {
    title: "Tuckernuck",
    rating: "4.5",
    reviews: "143.7K",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/tnuck.myshopify.com/1757622137/Shop_App__1.jpg?width=1000",
  },
  {
    title: "Larroude",
    rating: "4.3",
    reviews: "2.7K",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/larroude.myshopify.com/1739287885/LRDE_HERO_2_MOBILE.jpg?width=1000",
  },
  {
    title: "Hill House Home",
    rating: "4.8",
    reviews: "25.3K",
    image:
      "https://cdn.shopify.com/shop-assets/shopify_brokers/hill-house-home.myshopify.com/1756482290/Shopapp_Roses_Mobile_2x.jpg?width=1000",
  },
] as const;

export const detailRecommendations: ShopCard[] = [
  {
    id: "cooper-natural",
    title: "Cooper Natural Mary Jane Sneaker",
    price: "$195.00",
    reviews: "7",
    rating: 4.7,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/COOPER-CV-NATRL_5.jpg?v=1758749038&width=480",
    href: "/products/7703579394100/cooper-natural-mary-jane-sneaker",
  },
  {
    id: "mira-black",
    title: "Mira Black Everyday Tote",
    price: "$175.00",
    reviews: "2",
    rating: 4.5,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/FREDDIE-WNYL-BLACK_1.jpg?v=1769552618&width=480",
    href: "/products/8741540692020/mira-black-everyday-tote",
  },
  {
    id: "nico-natural",
    title: "Nico Natural Two-Band Sandal",
    price: "$350.00",
    reviews: "1",
    rating: 4.2,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/NICO-CWR-NTNRL_3.jpg?v=1770658971&width=480",
    href: "/products/8741541445684/nico-natural-two-band-sandal",
  },
  {
    id: "cooper-brown",
    title: "Cooper Dark Brown Mary Jane Sneaker",
    price: "$195.00",
    reviews: "2",
    rating: 4.5,
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/COOPER-SUEDE_DBROWN_1.jpg?v=1762281250&width=480",
    href: "/products/7959077636276/cooper-dark-brown-mary-jane-sneaker",
  },
];

export const cartLineItem = {
  title: "Airplane Mode Travel Hoodie",
  variant: "Cobalt Blue / XS",
  price: "$59.00",
  compareAt: "$140.00",
  quantity: 1,
  image:
    "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/1_b5eef9be-c07d-4955-8cc0-0ea42f648d79.jpg?v=1773786628&width=384",
};

export const cartRecommendations: ShopCard[] = [
  {
    id: "devon-cart",
    title: "Devon Red Moire Slingback Sandal",
    brand: "Loeffler Randall",
    price: "$295.00",
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_434.jpg?v=1769104275&width=384",
    href: "/products/7764008009780/devon-red-moire-slingback-sandal",
  },
  {
    id: "cozy-earth-pajamas",
    title: "Women's Bamboo Stretch-Knit Short Sleeve Pajama Set",
    brand: "Cozy Earth",
    price: "$138.00",
    image:
      "https://cdn.shopify.com/s/files/1/2114/3697/files/Womens_Bamboo_Stretch-Knit_Classic_Short_Sleeve_Pajama_Top_Short_Set_Garden_Toile_in_Sailor_1.jpg?v=1773156189&width=384",
    href: "/cart",
  },
  {
    id: "eyekeeper",
    title: "Stylish Reading Glasses Thicker Frame Design Readers R9107-1",
    brand: "eyekeeper.com",
    price: "$16.99",
    compareAt: "$33.99",
    image:
      "https://cdn.shopify.com/s/files/1/1249/3351/files/stylish-reading-glasses-thicker-frame-design-readers-r9107-1-785224.webp?v=1740197855&width=384",
    href: "/cart",
  },
  {
    id: "airplane-mode",
    title: "Airplane Mode Travel Hoodie",
    brand: "Comfrt",
    price: "$59.00",
    compareAt: "$140.00",
    image:
      "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/1_88.jpg?v=1764174207&width=384",
    href: "/cart",
  },
];
