import type { ReactNode } from "react";
import { ShopFooter } from "./footer";
import { Omnibox } from "./omnibox";

export function PageFrame({
  children,
  showSearch = true,
}: {
  children: ReactNode;
  showSearch?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1480px] px-4 pb-34 pt-5 md:px-8 md:pb-38 lg:px-10 lg:pt-6">
        <div>{children}</div>
        {showSearch ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 md:bottom-7 lg:left-[76px] lg:px-10">
            <div className="pointer-events-auto w-full max-w-[760px]">
              <Omnibox
                placeholder="Search company setup, banking, annual filing, or bookkeeping"
                variant="floating"
              />
            </div>
          </div>
        ) : null}
      </div>
      <ShopFooter />
    </div>
  );
}
