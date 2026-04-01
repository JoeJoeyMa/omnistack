import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Youtube } from "lucide-react";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { footerColumns } from "./site-data";
import { SiteLink } from "./site-link";

const socials = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: () => (
      <svg
        aria-hidden="true"
        fill="currentColor"
        focusable="false"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "GitHub", href: "https://github.com", icon: Github },
];

export function SiteFooter() {
  const copy = useCopyText();
  const localizedFooterColumns = useLocalizedValue(footerColumns);

  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white pt-20 pb-12 border-t border-gray-100 dark:border-white/10">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-12 lg:gap-24">
          <div className="flex flex-col">
            <Link
              to="/"
              className="text-[28px] font-medium tracking-tight mb-6 text-black dark:text-white"
            >
              MAPLE-GLOBAL
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {localizedFooterColumns.map((column) => (
              <div key={column.title}>
                <p className="text-[15px] font-semibold text-black dark:text-white mb-5">
                  {column.title}
                </p>
                <div className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <SiteLink
                      className="text-[15px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                      href={link.href}
                      key={link.label}
                    >
                      {link.label}
                    </SiteLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 text-gray-600 dark:text-gray-400">
            <span className="text-[15px] font-medium text-black dark:text-white">
              MAPLE-GLOBAL © 2015-2026
            </span>
            <div className="flex items-center gap-6 text-[15px]">
              <Link
                to="/policies"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                {copy("Terms & policies")}
              </Link>
              <Link
                to="/policies/privacy"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                {copy("Privacy policy")}
              </Link>
              <Link
                to="/brand"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                {copy("Brand guidelines")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex items-center gap-6">
              {socials.map((social) => (
                <a
                  aria-label={social.label}
                  className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                  href={social.href}
                  key={social.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
