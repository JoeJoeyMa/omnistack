const footerGroups = [
  {
    title: "Start selling",
    links: ["For brands", "For creators", "Build your store"],
  },
  {
    title: "Information",
    links: ["Shop Pay", "Help center"],
  },
  {
    title: "Social",
    links: ["X (Twitter)", "Instagram"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Your Privacy Choices"],
  },
];

export function ShopFooter() {
  return (
    <footer className="px-4 pb-10 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-[1400px] rounded-[32px] border border-black/6 bg-white px-6 py-8 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#111] text-sm font-semibold text-white">
              S
            </div>
            <p className="max-w-[420px] text-[15px] leading-7 text-black/62">
              Shop is the next step on our mission to make commerce better for
              everyone.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="overflow-hidden rounded-[12px]"
                href="https://open.shop.app/E2jp6/yphyl/7qog"
              >
                <img
                  alt="Download on the App Store"
                  className="h-10"
                  src="https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/apple-badge-light-QLcYWftF.svg"
                />
              </a>
              <a
                className="overflow-hidden rounded-[12px]"
                href="https://open.shop.app/E2jp6/frmk/3n2h"
              >
                <img
                  alt="Download on Google Play"
                  className="h-10"
                  src="https://shopify-assets.shopifycdn.com/shopifycloud/shop-client/production/assets/google-badge-light-BMF1GKqE.svg"
                />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {footerGroups.map((group) => (
              <div className="grid gap-2" key={group.title}>
                <p className="text-[14px] font-medium text-black">
                  {group.title}
                </p>
                {group.links.map((link) => (
                  <a
                    className="text-[14px] leading-7 text-black/58 transition hover:text-black"
                    href="/"
                    key={link}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-black/6 pt-5 text-[12px] text-black/45 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span>Powered by Shopify</span>
            <span>|</span>
            <a href="/">Start selling for free</a>
          </div>
          <div className="flex items-center gap-6">
            <button type="button">English</button>
            <span>© Shopify Inc. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
