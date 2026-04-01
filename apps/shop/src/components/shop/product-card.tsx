import { Link } from "@tanstack/react-router";
import type { ShopCard } from "@maple-global/api-client";
import { Heart, Star } from "lucide-react";
import { useShopState } from "./shop-state";
import { cn } from "./utils";

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#111]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          className={cn(
            "h-3.5 w-3.5",
            index + 1 <= Math.round(rating)
              ? "fill-current text-[#111]"
              : "text-black/12",
          )}
          key={`${rating}-${index}`}
        />
      ))}
    </div>
  );
}

function getSavedId(item: ShopCard) {
  const match = item.href.match(/^\/products\/([^/]+)/);
  return match?.[1] ?? item.id;
}

export function ProductCard({
  item,
  showBrand = true,
  layout = "grid",
}: {
  item: ShopCard;
  showBrand?: boolean;
  layout?: "grid" | "compact";
}) {
  const { savedProductIds, toggleSaved } = useShopState();
  const savedId = getSavedId(item);
  const isSaved = savedProductIds.includes(savedId);

  if (layout === "compact") {
    return (
      <Link
        className="group block rounded-[24px] border border-black/6 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
        to={item.href}
      >
        <div className="relative overflow-hidden rounded-[18px] bg-[#f3f3f4]">
          <img
            alt={item.title}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            src={item.image}
          />
        </div>
        <div className="mt-3 grid gap-1">
          <p className="truncate text-[13px] text-black/52">{item.brand}</p>
          <p className="line-clamp-2 text-[15px] font-medium leading-5">
            {item.title}
          </p>
          <div className="flex items-center gap-2">
            {item.reviews ? <Stars rating={item.rating} /> : null}
            {item.reviews ? (
              <span className="text-[12px] text-black/48">({item.reviews})</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <span className="font-medium">{item.price}</span>
            {item.compareAt ? (
              <span className="text-black/40 line-through">{item.compareAt}</span>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="group relative rounded-[26px] border border-black/6 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_20px_42px_rgba(15,23,42,0.1)]">
      {item.badge ? (
        <span className="absolute left-5 top-5 z-10 rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-white">
          {item.badge}
        </span>
      ) : null}
      <button
        aria-label={isSaved ? "Remove from saved items" : "Save item"}
        className={cn(
          "absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-black shadow-[0_8px_18px_rgba(15,23,42,0.12)] backdrop-blur transition duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_14px_24px_rgba(15,23,42,0.16)]",
          isSaved && "bg-[#111] text-white hover:bg-[#1b1b1c]",
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleSaved(savedId);
        }}
        type="button"
      >
        <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
      </button>
      <Link className="block" to={item.href}>
        <div className="overflow-hidden rounded-[20px] bg-[#f4f4f5]">
          <img
            alt={item.title}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            src={item.image}
          />
        </div>
      </Link>
      <div className="mt-3 grid gap-1.5 px-1">
        {showBrand && item.brand ? (
          <p className="text-[13px] text-black/50">{item.brand}</p>
        ) : null}
        <Link
          className="line-clamp-2 text-[15px] font-medium leading-5 transition group-hover:text-[var(--shop-brand)]"
          to={item.href}
        >
          {item.title}
        </Link>
        {item.reviews ? (
          <div className="flex items-center gap-2">
            <Stars rating={item.rating} />
            <span className="text-[12px] text-black/48">({item.reviews})</span>
          </div>
        ) : null}
        <div className="flex items-center gap-2 text-[14px]">
          <span className="font-medium">{item.price}</span>
          {item.compareAt ? (
            <span className="text-black/40 line-through">{item.compareAt}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
