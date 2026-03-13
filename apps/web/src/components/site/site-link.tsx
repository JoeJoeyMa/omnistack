import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

type SiteLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
}> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

function isAppRoute(href: string) {
  return href.startsWith("/") && !href.includes("#") && !href.includes("://");
}

export function SiteLink({
  href,
  className,
  children,
  ...props
}: SiteLinkProps) {
  if (isAppRoute(href)) {
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  );
}
