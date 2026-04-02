import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { siteButtonClass } from "~/components/ui/button";
import { useCopyText } from "~/lib/locale";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [{ title: "Coming Soon | MAPLE-GLOBAL" }],
  }),
  component: NotFound,
});

function NotFound() {
  const copy = useCopyText();

  return (
    <div className="w-full min-h-[85vh] bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[72px] md:text-[96px] font-medium tracking-tight mb-4">
        {copy("Page not found")}
      </h1>
      <p className="text-[18px] text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
        {copy(
          "The page you requested could not be found. You can return home or continue to pricing and the newsroom.",
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className={siteButtonClass({ size: "hero", variant: "outline" })}
        >
          {copy("Return home")}
        </Link>
        <Link
          to="/pricing"
          className={siteButtonClass({ size: "hero", variant: "secondary" })}
        >
          {copy("View pricing")} <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          to="/news"
          className={siteButtonClass({ size: "hero", variant: "outline" })}
        >
          {copy("Open newsroom")}
        </Link>
      </div>
    </div>
  );
}
