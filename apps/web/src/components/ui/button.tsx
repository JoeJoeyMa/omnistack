import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-white/16 bg-white text-[#08100d] shadow-[0_18px_50px_rgba(255,255,255,0.16)] hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(255,255,255,0.2)]",
        outline:
          "border-white/14 bg-white/[0.05] text-white hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.1]",
        ghost:
          "border-transparent bg-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
        muted:
          "border-[#d8e7dc]/12 bg-[#101915] text-[#d8e7dc] hover:-translate-y-0.5 hover:border-[#d8e7dc]/24 hover:bg-[#15201b]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}

const siteButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-white/20";

const siteButtonVariantClasses = {
  ghost:
    "border-transparent bg-transparent text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white",
  light:
    "border-white/14 bg-white text-[#05070a] shadow-[0_12px_28px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_16px_36px_rgba(15,23,42,0.2)]",
  outline:
    "border-gray-300 bg-transparent text-black hover:-translate-y-0.5 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10",
  primary:
    "border-black bg-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] hover:-translate-y-0.5 hover:bg-[#1b1b1d] hover:shadow-[0_16px_36px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-[#f1f1f1]",
  secondary:
    "border-gray-300 bg-white text-black hover:-translate-y-0.5 hover:bg-gray-50 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-white/5",
  subtle:
    "border-black/10 bg-white text-black/72 hover:border-black/18 hover:bg-white hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/72 dark:hover:border-white/20 dark:hover:text-white",
} as const;

const siteButtonSizeClasses = {
  compact: "px-3 py-1.5 text-[13px]",
  hero: "h-[48px] px-8 text-[15px]",
  md: "h-12 px-6 text-sm",
  nav: "h-[36px] px-[18px] text-[14px]",
  sm: "h-10 px-4 text-[14px]",
  xl: "h-[52px] px-10 text-[15px]",
} as const;

export type SiteButtonVariant = keyof typeof siteButtonVariantClasses;
export type SiteButtonSize = keyof typeof siteButtonSizeClasses;

export function siteButtonClass({
  className,
  size = "md",
  variant = "secondary",
}: {
  className?: string;
  size?: SiteButtonSize;
  variant?: SiteButtonVariant;
} = {}) {
  return cn(
    siteButtonBase,
    siteButtonVariantClasses[variant],
    siteButtonSizeClasses[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
