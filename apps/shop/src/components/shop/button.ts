import { cn } from "./utils";

const shopButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(84,51,235,0.18)] disabled:pointer-events-none disabled:opacity-60";

const shopButtonVariantClasses = {
  brand:
    "border-transparent bg-[var(--shop-brand)] text-white shadow-[0_12px_28px_rgba(84,51,235,0.24)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(84,51,235,0.3)] dark:shadow-[0_14px_32px_rgba(84,51,235,0.34)] dark:hover:shadow-[0_20px_38px_rgba(84,51,235,0.38)]",
  danger:
    "border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/16",
  dark:
    "border-black/10 bg-[#111] text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-[#1b1b1c] hover:shadow-[0_18px_34px_rgba(15,23,42,0.22)] dark:border-white/12 dark:bg-[#0f1012] dark:hover:bg-[#17181a]",
  filter:
    "border-black/8 bg-white text-[#111]/72 hover:border-black/14 hover:bg-black/[0.02] hover:text-[#111] dark:border-white/10 dark:bg-white/5 dark:text-white/72 dark:hover:border-white/18 dark:hover:bg-white/10 dark:hover:text-white",
  filterActive:
    "border-[var(--shop-brand)] bg-[rgba(84,51,235,0.08)] text-[var(--shop-brand)] hover:bg-[rgba(84,51,235,0.12)] dark:border-[rgba(149,128,255,0.72)] dark:bg-[rgba(84,51,235,0.18)] dark:text-[#d7ccff] dark:hover:bg-[rgba(84,51,235,0.24)]",
  neutral:
    "border-black/10 bg-white text-[#111] hover:-translate-y-0.5 hover:border-black/16 hover:bg-[#fafafa] dark:border-white/12 dark:bg-[#111214] dark:text-white dark:hover:border-white/18 dark:hover:bg-[#17181a]",
  overlay:
    "border-white/24 bg-white/10 text-white backdrop-blur hover:bg-white/14 dark:border-white/20 dark:bg-white/8 dark:hover:bg-white/12",
  overlaySolid:
    "border-transparent bg-white text-black shadow-[0_10px_24px_rgba(15,23,42,0.16)] hover:bg-white/92",
  soft:
    "border-black/8 bg-[#f7f7f8] text-[#111] hover:-translate-y-0.5 hover:border-black/14 hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#151618] dark:text-white/86 dark:hover:border-white/18 dark:hover:bg-[#1b1c1f] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.26)]",
} as const;

const shopButtonSizeClasses = {
  chip: "px-4 py-2 text-[14px]",
  compact: "px-3 py-1.5 text-[12px]",
  lg: "h-14 px-6 text-[16px]",
  md: "h-12 px-6 text-[15px]",
  sm: "h-11 px-5 text-[14px]",
} as const;

export type ShopButtonVariant = keyof typeof shopButtonVariantClasses;
export type ShopButtonSize = keyof typeof shopButtonSizeClasses;

export function shopButtonClass({
  className,
  size = "md",
  variant = "neutral",
}: {
  className?: string;
  size?: ShopButtonSize;
  variant?: ShopButtonVariant;
} = {}) {
  return cn(
    shopButtonBase,
    shopButtonVariantClasses[variant],
    shopButtonSizeClasses[size],
    className,
  );
}
