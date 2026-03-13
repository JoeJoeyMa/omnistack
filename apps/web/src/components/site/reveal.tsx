import type { CSSProperties, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/components/ui/button";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  distance?: number;
}>;

export function Reveal({
  className,
  children,
  delay = 0,
  distance = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setVisible(true);
        observer.unobserve(element);
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8%",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn("reveal", visible && "is-visible", className)}
      ref={ref}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-distance": `${distance}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
