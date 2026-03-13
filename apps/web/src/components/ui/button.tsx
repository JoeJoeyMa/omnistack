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
