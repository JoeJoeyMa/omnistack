import { Link, useRouterState } from "@tanstack/react-router";
import {
  Grid2X2,
  Home,
  ShoppingCart,
  Tag,
  UserRound,
} from "lucide-react";
import { shopButtonClass } from "./button";
import { useShopState } from "./shop-state";
import { cn } from "./utils";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Explore", icon: Grid2X2 },
  { to: "/cart", label: "View Cart", icon: ShoppingCart },
  { to: "/offers", label: "Exclusive offers", icon: Tag },
];

export function ShopRail() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { cartCount } = useShopState();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-black/8 bg-white/96 px-3 py-2 backdrop-blur lg:inset-x-auto lg:bottom-auto lg:left-0 lg:top-0 lg:h-screen lg:w-[76px] lg:border-r lg:border-t-0 lg:px-0 lg:py-5">
      <div className="flex items-center justify-between gap-2 lg:h-full lg:flex-col">
        <Link
          className={cn(
            shopButtonClass({
              className:
                "hidden h-11 w-11 rounded-[16px] px-0 font-semibold lg:inline-flex",
              size: "sm",
              variant: "dark",
            }),
          )}
          to="/"
        >
          S
        </Link>
        <nav className="grid flex-1 grid-cols-4 gap-1 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/"
                ? pathname === item.to
                : pathname.startsWith(item.to);
            const badge =
              item.to === "/cart" && cartCount > 0
                ? String(cartCount)
                : undefined;
            return (
              <Link
                className={cn(
                  "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-black/40 transition hover:scale-105 hover:text-black lg:h-12 lg:w-12",
                  active &&
                    "bg-[var(--shop-brand)] text-white shadow-[0_8px_22px_rgba(84,51,235,0.26)]",
                )}
                key={item.label}
                to={item.to}
              >
                <Icon className="h-4 w-4" />
                {badge ? (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <Link
          className={cn(
            "relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-105 lg:h-12 lg:w-12",
            pathname.startsWith("/account")
              ? "border-[var(--shop-brand)] bg-[var(--shop-brand)] text-white shadow-[0_8px_22px_rgba(84,51,235,0.26)]"
              : "border-black/8 bg-[#f3f3f4] text-black/75 hover:bg-gray-200 hover:text-black",
          )}
          to="/account"
        >
          <UserRound className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
