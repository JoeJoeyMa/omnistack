import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useShopCatalog } from "~/lib/use-shop-catalog";
import { cn } from "./utils";

type OmniboxVariant = "home" | "floating";

export function Omnibox({
  className,
  placeholder = "Search company setup, banking, and compliance services",
  variant = "floating",
}: {
  className?: string;
  placeholder?: string;
  variant?: OmniboxVariant;
}) {
  const navigate = useNavigate();
  const catalog = useShopCatalog();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return catalog.searchSuggestions;
    }

    return catalog.searchSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(trimmed),
    );
  }, [catalog.searchSuggestions, query]);

  const closeIfOutside = (nextTarget: EventTarget | null) => {
    if (
      nextTarget instanceof Node &&
      rootRef.current?.contains(nextTarget)
    ) {
      return;
    }

    setOpen(false);
  };

  const isHome = variant === "home";
  const panelClasses = isHome
    ? "inset-x-0 top-full mt-3 origin-top"
    : "inset-x-0 bottom-full mb-3 origin-bottom";

  const runSearch = (value: string) => {
    const nextQuery = value.trim();

    if (!nextQuery) {
      return;
    }

    setOpen(false);
    navigate({
      to: "/categories",
      search: { q: nextQuery } as never,
    });
  };

  return (
    <div
      className={cn("relative w-full", className)}
      onBlurCapture={(event) => closeIfOutside(event.relatedTarget)}
      onFocusCapture={() => setOpen(true)}
      ref={rootRef}
    >
      <div
        className={cn(
          "rounded-[34px] border border-black/8 bg-white/88 p-2 shadow-[0_20px_56px_rgba(15,23,42,0.1)] backdrop-blur-xl transition duration-200",
          isHome
            ? "min-h-[72px] bg-white/84 shadow-[0_28px_72px_rgba(15,23,42,0.12)]"
            : "bg-white/94 shadow-[0_16px_44px_rgba(15,23,42,0.1)]",
          open && "border-black/12 shadow-[0_24px_60px_rgba(15,23,42,0.14)]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-[28px] bg-[#f8f8f9] px-4 py-3.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
            isHome ? "min-h-[56px]" : "min-h-[60px]",
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-black/42" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] text-black outline-none placeholder:text-black/44"
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                runSearch(query);
              }
            }}
            placeholder={placeholder}
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black/42 transition hover:bg-black/[0.04] hover:text-black"
              onClick={() => setQuery("")}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              aria-label="Submit search"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
                isHome
                  ? "bg-[var(--shop-brand)] text-white shadow-[0_8px_24px_rgba(84,51,235,0.28)]"
                  : "bg-black/[0.04] text-black/55 hover:bg-black/[0.08]",
              )}
              onClick={() => runSearch(query)}
              type="button"
            >
              {isHome ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute z-30 rounded-[30px] border border-black/8 bg-white/96 p-4 shadow-[0_22px_64px_rgba(15,23,42,0.14)] backdrop-blur-xl transition duration-200",
          panelClasses,
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <p className="px-2 text-[12px] font-medium text-black/44">
          Suggested searches
        </p>
        <ul className="mt-2 grid gap-1.5">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                className="flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-left text-[14px] text-black/78 transition hover:bg-black/[0.04]"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery(suggestion);
                  runSearch(suggestion);
                }}
                type="button"
              >
                <Search className="h-4 w-4 shrink-0 text-black/32" />
                <span>{suggestion}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
