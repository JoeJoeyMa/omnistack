import {
  categoryShelves,
  homeFloatingProducts,
  type ShopCard,
} from "./data";
import {
  cartRecommendations,
  detailRecommendations,
  storeProducts,
} from "./data-more";

export type ProductReview = {
  author: string;
  body: string;
  rating: number;
  title: string;
};

export type ProductMerchant = {
  badge?: string;
  image: string;
  name: string;
  rating: string;
  reviews: string;
  slug: string;
};

export type ProductPurchaseMode = {
  compareAt?: string;
  id: string;
  label: string;
  note?: string;
  price: string;
};

export type ProductColor = {
  image?: string;
  label: string;
  swatch: string;
};

export type ProductBundle = {
  compareAt?: string;
  href: string;
  image: string;
  price: string;
  title: string;
};

export type ProductDetailRecord = {
  brand: string;
  bundle?: ProductBundle;
  boughtText?: string;
  colors?: ProductColor[];
  description: string;
  gallery: string[];
  image: string;
  lowStockText?: string;
  merchant: ProductMerchant;
  policies: string[];
  price: string;
  productId: string;
  purchaseModes?: ProductPurchaseMode[];
  rating?: number;
  recommendations: ShopCard[];
  relatedMerchants?: ProductMerchant[];
  reviews?: ProductReview[];
  reviewsCount?: string;
  shippingNote?: string;
  sizes?: string[];
  slug: string;
  title: string;
};

export type CategoryStoreShowcase = {
  href: string;
  image: string;
  itemCount: number;
  productTitle: string;
  rating: string;
  storeHref: string;
  storeLabel: string;
  storeName: string;
};

export type CategoryDetailRecord = {
  categoryId: string;
  parentLabel: string;
  sections: Array<{
    items: CategoryStoreShowcase[];
    title: string;
  }>;
  slug: string;
  subcategories: Array<{
    href: string;
    image?: string;
    label: string;
  }>;
  title: string;
};

const allCards: ShopCard[] = [
  ...homeFloatingProducts,
  ...categoryShelves.flatMap((shelf) => shelf.items),
  ...storeProducts,
  ...detailRecommendations,
  ...cartRecommendations,
];

const uniqueCards = Array.from(new Map(allCards.map((item) => [item.href, item])).values());

export const catalogCards = uniqueCards;

function parseProductRoute(href: string) {
  const match = href.match(/^\/products\/([^/]+)\/([^/?#]+)/);

  if (!match) {
    return null;
  }

  return {
    productId: match[1],
    slug: match[2],
  };
}

const explicitProducts: ProductDetailRecord[] = [
  {
    productId: "7764008009780",
    slug: "devon-red-moire-slingback-sandal",
    brand: "Loeffler Randall",
    title: "Devon Red Moire Slingback Sandal",
    price: "$295.00",
    image:
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_434.jpg?v=1743704973&width=1500",
    gallery: [
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_434.jpg?v=1743704973&width=800",
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_008.jpg?v=1743704973&width=800",
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_2.jpg?v=1743704973&width=800",
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_439.jpg?v=1743704968&width=800",
      "https://cdn.shopify.com/s/files/1/0253/4385/2596/files/DEVON-MO-RED_440.jpg?v=1743704968&width=800",
    ],
    rating: 4,
    reviewsCount: "5",
    boughtText: "100+ bought in past month",
    lowStockText: "Only 9 left",
    shippingNote: "Shipping calculated at checkout",
    colors: [
      { label: "Red", swatch: "#b8344d" },
      { label: "Powder Pink", swatch: "#d5b8bd" },
      { label: "Dune", swatch: "#c6a788" },
      { label: "Gold", swatch: "#b69959" },
      { label: "Green", swatch: "#6f8d74" },
      { label: "Leopard", swatch: "#89654a" },
    ],
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    description:
      "Flat sandal in red moire. Features a latticed strap design, an adjustable slingback strap with a buckle closure, and a padded footbed with a gold-stamped logo.",
    purchaseModes: [
      { id: "one-time", label: "One time purchase", price: "$295.00" },
    ],
    policies: ["More details at Loeffler Randall", "Refund Policy"],
    reviews: [
      {
        author: "Selena",
        rating: 5,
        title: "Beautiful take on the fisherman’s sandal",
        body: "So cute and comfy, even while breaking them in. The silhouette feels elevated but still easy to wear all day.",
      },
      {
        author: "Loren",
        rating: 4,
        title: "Beautiful sandals",
        body: "Great shape and color. Runs a touch roomy, but the comfort level and finish are strong.",
      },
    ],
    merchant: {
      slug: "loefflerrandall",
      name: "Loeffler Randall",
      rating: "4.7",
      reviews: "1.3K",
      badge: "Extra savings",
      image:
        "https://cdn.shopify.com/shop-assets/shopify_brokers/loeffler-randall-1.myshopify.com/1772039820/21.jpeg?crop=region&crop_left=0&crop_top=955&crop_width=2603&crop_height=3216&width=1000",
    },
    recommendations: detailRecommendations,
    relatedMerchants: [
      {
        slug: "tnuck",
        name: "Tuckernuck",
        rating: "4.5",
        reviews: "143.7K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/tnuck.myshopify.com/1757622137/Shop_App__1.jpg?width=1000",
      },
      {
        slug: "larroude",
        name: "Larroude",
        rating: "4.3",
        reviews: "2.7K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/larroude.myshopify.com/1739287885/LRDE_HERO_2_MOBILE.jpg?width=1000",
      },
      {
        slug: "shopdoen",
        name: "DÔEN",
        rating: "4.7",
        reviews: "1.2K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/shopdoen.myshopify.com/1759985315/shop_app_mobile_header.jpg?width=1000",
      },
    ],
  },
  {
    productId: "7282153488469",
    slug: "bareskin-daily-dewy-sunscreen-mineral-spf-30",
    brand: "Bare Minerals",
    title: "BARESKIN Daily Dewy Sunscreen Mineral SPF 30",
    price: "$39.00",
    image:
      "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Translucent_3000x3000_f141f036-8a24-4992-8074-a4ffc3976a2e.png?v=1770906974&width=1500",
    gallery: [
      "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Translucent_3000x3000_f141f036-8a24-4992-8074-a4ffc3976a2e.png?v=1770906974&width=800",
      "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Deep_3000x3000_f77521a5-942e-4b09-b4e2-78ba8414c773.png?v=1770906974&width=800",
      "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_MediumDeep_3000x3000_76b2696a-9a5d-45bb-954f-f95ea66a9d7e.png?v=1770906974&width=800",
      "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Medium_3000x3000_167d2ea0-8228-499f-b79b-2ec0cb5dc507.png?v=1770906974&width=800",
    ],
    rating: 4.5,
    reviewsCount: "2",
    boughtText: "100+ bought in past month",
    shippingNote: "Shipping calculated at checkout",
    colors: [
      {
        label: "Sheer Untinted",
        swatch: "#e8d9ca",
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Translucent_3000x3000_f141f036-8a24-4992-8074-a4ffc3976a2e.png?v=1770906974&width=128",
      },
      {
        label: "Sheer Medium",
        swatch: "#bb8d6c",
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Medium_3000x3000_d9d80a2a-584a-460e-bb03-462c074fe047.png?v=1770906974&width=128",
      },
      {
        label: "Sheer Medium Deep",
        swatch: "#8e6148",
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Medium-Deep_3000x3000_d9b20229-3adf-4790-893e-8a59f97ac2cb.png?v=1770906974&width=128",
      },
      {
        label: "Sheer Deep",
        swatch: "#5b3d2a",
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1H26_BSDS_PDP_SILO_TX_Deep_3000x3000_4dda7cd4-86bd-4ca1-b872-30864971a6b5.png?v=1770906974&width=128",
      },
    ],
    description:
      "What It Is: An ultra-light mineral sunscreen with broad-spectrum SPF 30 that hydrates, protects, and perfects skin, delivering everyday wear with little to no white cast.\n\nWhat It Does: Elevate your everyday SPF with undetectable protection, breathable hydration, and a dewy finish that layers cleanly under makeup.",
    purchaseModes: [
      { id: "one-time", label: "One time purchase", price: "$39.00" },
      {
        id: "subscribe",
        label: "Subscribe & save",
        note: "Save 10%",
        price: "$35.10",
        compareAt: "$39.00",
      },
    ],
    policies: ["Shipping Policy", "Refund Policy"],
    reviews: [
      {
        author: "Kelsey",
        rating: 4.5,
        title: "So far, so good.",
        body: "The finish is lightweight and easy to wear daily. It blends well and doesn’t leave a heavy cast on skin.",
      },
      {
        author: "Maria",
        rating: 4.5,
        title: "Nice Product!",
        body: "Hydrating texture, clean packaging, and a nice glow under makeup. I’d buy it again.",
      },
    ],
    bundle: {
      title: "Dew It All Duo",
      price: "$55.80",
      compareAt: "$62.00",
      href: "/products/7325459906645/dew-it-all-duo",
      image:
        "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_2Q26_DewItAllDuo_Bundle_BSDS_GNCLS_PDP_SILO.png?v=1774373439&format=webp",
    },
    merchant: {
      slug: "bareminerals",
      name: "Bare Minerals",
      rating: "4.5",
      reviews: "35.4K",
      image:
        "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/preview_images/c8f942bb76384618b5946fbddb98f210.thumbnail.0000000000.jpg?v=1767618709&width=1000",
    },
    recommendations: [
      {
        id: "orig-loose",
        title: "ORIGINAL Loose Powder Foundation SPF 15",
        price: "$39.50",
        reviews: "2.1K",
        rating: 4.7,
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_3Q25_OLF_Silo_wLid_Fair_3000x3000_0c0c4615-1b9e-432f-999b-5a255f0f54db.png?v=1754324059&width=384",
        href: "/products/6891998117973/original-loose-powder-foundation-spf-15",
      },
      {
        id: "complexion-rescue",
        title: "COMPLEXION RESCUE Tinted Moisturizer SPF 30",
        price: "$39.50",
        reviews: "2.5K",
        rating: 4.7,
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_4Q25_CRTM_01Opal_TX_US_RGB_3000x3000_b3135545-dda5-4eb8-a37f-0b03a1c26ab0.png?v=1761324339&width=384",
        href: "/products/6891998281813/complexion-rescue-tinted-moisturizer-with-hyaluronic-acid-and-mineral-spf-30",
      },
      {
        id: "barepro",
        title: "BAREPRO 24HR Skin-Perfecting Powder Foundation",
        price: "$42.00",
        reviews: "639",
        rating: 4.5,
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/BM_1Q25_BPSPPF24_PDP_Top-Down_2ml_Open_Fair_10_Cool_R150_3000x3000_13b163e7-6a34-4969-88d8-ba0695ba9792.png?v=1733345551&width=384",
        href: "/products/7054121238613/barepro-24hr-skin-perfecting-powder-foundation",
      },
      {
        id: "loose-eye",
        title: "Loose Mineral Eye Color",
        price: "$13.30",
        compareAt: "$19.00",
        badge: "30% off",
        reviews: "808",
        rating: 4.6,
        image:
          "https://cdn.shopify.com/s/files/1/0552/0883/7205/files/4951_30904_EC_CulturedPearl_2014COMP_3000x3000_R150.png?v=1735215877&width=384",
        href: "/products/6891998019669/loose-mineral-eye-color",
      },
    ],
    relatedMerchants: [
      {
        slug: "laurageller",
        name: "Laura Geller Beauty",
        rating: "4.4",
        reviews: "161.1K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/laurageller.myshopify.com/1772470859/Shop_Mobile_Banner.jpg?width=1000",
      },
      {
        slug: "kitsch",
        name: "Kitsch",
        rating: "4.6",
        reviews: "816.1K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/mykitsch.myshopify.com/1767636849/Shop-App-Mobile-Banner_2.jpg?width=1000",
      },
      {
        slug: "ogee",
        name: "Ogee",
        rating: "4.7",
        reviews: "46.9K",
        image:
          "https://cdn.shopify.com/shop-assets/shopify_brokers/ogee.myshopify.com/1753722034/Shopappbanner.jpg?width=1000",
      },
    ],
  },
];

const productMap = new Map<string, ProductDetailRecord>(
  explicitProducts.map((product) => [product.productId, product]),
);

export function getProductDetail(productId: string, slug: string) {
  const explicit = productMap.get(productId);

  if (explicit) {
    return explicit;
  }

  const matchedCard = uniqueCards.find((item) => {
    const route = parseProductRoute(item.href);
    return route?.productId === productId;
  });

  if (!matchedCard) {
    return null;
  }

  return {
    productId,
    slug,
    brand: matchedCard.brand ?? "Featured brand",
    title: matchedCard.title,
    price: matchedCard.price,
    image: matchedCard.image,
    gallery: [matchedCard.image, matchedCard.image, matchedCard.image],
    rating: matchedCard.rating,
    reviewsCount: matchedCard.reviews ?? "0",
    shippingNote: "Shipping calculated at checkout",
    description:
      "This product page is wired for frontend integration and uses captured visual styling from shop.app. Replace this mock detail payload with your product API when backend data is ready.",
    purchaseModes: [{ id: "one-time", label: "One time purchase", price: matchedCard.price }],
    policies: ["Shipping Policy", "Refund Policy"],
    merchant: {
      slug: (matchedCard.brand ?? "brand")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ""),
      name: matchedCard.brand ?? "Featured brand",
      rating: matchedCard.rating?.toFixed(1) ?? "4.5",
      reviews: matchedCard.reviews ?? "1K",
      image: matchedCard.image,
    },
    recommendations: uniqueCards.filter((item) => item.href !== matchedCard.href).slice(0, 4),
    relatedMerchants: [],
    reviews: [
      {
        author: "Shop user",
        rating: matchedCard.rating ?? 4.5,
        title: "Solid everyday pick",
        body: "Mock review content for frontend integration. Replace with API-backed review data later.",
      },
    ],
  } satisfies ProductDetailRecord;
}

export const foodDrinksCategory: CategoryDetailRecord = {
  categoryId: "251",
  slug: "food-drinks",
  title: "Food & drinks",
  parentLabel: "All Categories",
  subcategories: [
    {
      label: "Coffee",
      href: "/categories/252/coffee",
      image:
        "https://shopify-assets.shopifycdn.com/shop-assets/static_uploads/shop-categories/20260326_252_L2_food_drinks_coffee_pill.png?format=webp",
    },
    {
      label: "Pantry",
      href: "/categories/293/pantry",
      image:
        "https://shopify-assets.shopifycdn.com/shop-assets/static_uploads/shop-categories/20260326_293_L2_food_drinks_pantry_pill.png?format=webp",
    },
    {
      label: "Snacks",
      href: "/categories/255/snacks",
      image:
        "https://shopify-assets.shopifycdn.com/shop-assets/static_uploads/shop-categories/20260326_255_L2_food_drinks_snacks_pill.png?format=webp",
    },
    {
      label: "Tea",
      href: "/categories/253/tea",
      image:
        "https://shopify-assets.shopifycdn.com/shop-assets/static_uploads/shop-categories/20260326_253_L2_food_drinks_tea_pill.png?format=webp",
    },
    {
      label: "Candy & chocolate",
      href: "/categories/254/candy-chocolate",
      image:
        "https://shopify-assets.shopifycdn.com/shop-assets/static_uploads/shop-categories/20260326_254_L2_food_drinks_candy_chocolate_pill.png?format=webp",
    },
  ],
  sections: [
    {
      title: "Coffee",
      items: [
        {
          storeName: "Bones Coffee Company",
          storeLabel: "Bones Coffee Company",
          storeHref: "/m/bonescoffeecompany",
          rating: "4.8",
          itemCount: 4,
          productTitle: "Highland Grog | 12oz",
          image:
            "https://cdn.shopify.com/s/files/1/1475/5488/files/HIGBagFront.jpg?v=1764704752&width=384",
          href: "/products/442784383013/highland-grog-12oz",
        },
        {
          storeName: "Danger Coffee",
          storeLabel: "DC",
          storeHref: "/m/dangercoffee",
          rating: "4.6",
          itemCount: 4,
          productTitle: "Medium Roast Whole Bean Remineralized Coffee",
          image:
            "https://cdn.shopify.com/s/files/1/0610/0785/5788/files/MediumBean-Angle.webp?v=1755931198&width=384",
          href: "/products/7166336663724/medium-roast-whole-bean-remineralized-coffee",
        },
        {
          storeName: "Javvy Coffee",
          storeLabel: "Javvy Coffee",
          storeHref: "/m/javvycoffee",
          rating: "4.3",
          itemCount: 4,
          productTitle: "Caramel Protein Coffee",
          image:
            "https://cdn.shopify.com/s/files/1/0435/8216/1057/files/BR410_Mockup_ProteinCoffee_Caramel_20servings_V3_002_Q325-front-2000x2000.png?v=1765892518&width=384",
          href: "/products/8235224826017/caramel-protein-coffee",
        },
        {
          storeName: "Blackout Coffee Co",
          storeLabel: "Blackout Coffee Co",
          storeHref: "/m/blackoutcoffeeco",
          rating: "4.8",
          itemCount: 4,
          productTitle: "Morning Reaper Coffee",
          image:
            "https://cdn.shopify.com/s/files/1/0049/7644/3503/files/Morning_Reaper_-_T.png?v=1761238914&width=384",
          href: "/products/1641849028719/morning-reaper-coffee",
        },
        {
          storeName: "Sea Island Coffee",
          storeLabel: "Sea Island Coffee",
          storeHref: "/m/seaislandcoffee",
          rating: "4.8",
          itemCount: 4,
          productTitle: "Jamaica Blue Mountain, Signature Collection",
          image:
            "https://cdn.shopify.com/s/files/1/2952/1550/files/Jamaica_Blue_Mountain_Signature_Collection_-_Tin_63913de2-6be0-4269-9c46-2e5880b3bbc7.png?v=1746698880&width=384",
          href: "/products/1294576779307/jamaica-blue-mountain-signature-collection",
        },
        {
          storeName: "Black & White Coffee Roasters",
          storeLabel: "B&W",
          storeHref: "/m/blackwhiteroasters",
          rating: "4.9",
          itemCount: 4,
          productTitle: "The 2 Bag",
          image:
            "https://cdn.shopify.com/s/files/1/2988/2574/products/The2Bag_4x-100.jpg?v=1747150179&width=384",
          href: "/products/6838230450254/the-2-bag",
        },
      ],
    },
    {
      title: "Pantry",
      items: [
        {
          storeName: "Clean Monday Meals",
          storeLabel: "Clean Monday Meals",
          storeHref: "/m/cleanmondaymeals",
          rating: "4.7",
          itemCount: 4,
          productTitle: "Clean Ramen Noodles",
          image:
            "https://cdn.shopify.com/s/files/1/0617/0892/7203/files/Clean_Ramen_Banner.png?v=1769357827&width=384",
          href: "/products/8608039993571/clean-ramen-noodles",
        },
        {
          storeName: "Vanilla Bean Kings",
          storeLabel: "Vanilla Bean Kings",
          storeHref: "/m/vanillabeankings",
          rating: "4.8",
          itemCount: 4,
          productTitle: "Organic Madagascar Grade A Vanilla Beans",
          image:
            "https://cdn.shopify.com/s/files/1/0700/7049/files/organic-Vanilla_Beans_Whole_Madagascar_Bourbon_10_Pack-square.jpg?v=1725907136&width=384",
          href: "/products/6541751943238/co-op-pricing-organic-madagascar-grade-a-vanilla-beans-per-ounce",
        },
        {
          storeName: "HEATONIST",
          storeLabel: "HEATONIST",
          storeHref: "/m/heatonist",
          rating: "4.9",
          itemCount: 4,
          productTitle: "Monthly Hot Ones Box",
          image:
            "https://cdn.shopify.com/s/files/1/2086/9287/files/Hotonessub-1.jpg?v=1722066878&width=384",
          href: "/products/64285769737/monthly-hot-ones-box",
        },
      ],
    },
  ],
};

export function getCategoryDetail(categoryId: string, slug: string) {
  if (categoryId === foodDrinksCategory.categoryId && slug === foodDrinksCategory.slug) {
    return foodDrinksCategory;
  }

  return null;
}
