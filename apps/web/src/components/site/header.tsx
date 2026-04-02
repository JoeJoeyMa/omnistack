import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { cn } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { useCopyText, useLocalizedValue } from "~/lib/locale";
import { LocaleToggle } from "./locale-toggle";
import { megaMenus } from "./site-data";
import { SiteLink } from "./site-link";
import { ThemeToggle } from "./theme-toggle";

const directLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Shop", href: "/shop" },
  { label: "Foundation", href: "/foundation" },
];

export function SiteHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const copy = useCopyText();
  const localizedMegaMenus = useLocalizedValue(megaMenus);
  const localizedDirectLinks = useLocalizedValue(directLinks);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signOutPending, setSignOutPending] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const session = authClient.useSession();
  const user = session.data?.user ?? null;
  const userLabel = user?.name?.trim() || user?.email || copy("Account");

  const activeMenu = useMemo(
    () => localizedMegaMenus.find((menu) => menu.id === openMenuId) ?? null,
    [localizedMegaMenus, openMenuId],
  );

  async function handleSignOut() {
    setSignOutPending(true);

    try {
      await authClient.signOut();
      closeAll();
      window.location.href = "/";
    } finally {
      setSignOutPending(false);
    }
  }

  const clearCloseTimer = useEffectEvent(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  });

  const scheduleClose = useEffectEvent(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setOpenMenuId(null);
    }, 120);
  });

  const closeAll = useEffectEvent(() => {
    setOpenMenuId(null);
    setMobileOpen(false);
    clearCloseTimer();
  });

  const handleHeaderMouseEnter = useEffectEvent(() => {
    if (mobileOpen) {
      return;
    }

    clearCloseTimer();
  });

  const handleHeaderMouseLeave = useEffectEvent(() => {
    if (mobileOpen || !openMenuId) {
      return;
    }

    scheduleClose();
  });

  const syncScrollState = useEffectEvent(() => {
    setScrolled(window.scrollY > 12);
  });

  useEffect(() => {
    syncScrollState();
    const handleScroll = () => syncScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    setOpenMenuId(null);
    setMobileOpen(false);
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-colors duration-300",
        scrolled || openMenuId || mobileOpen
          ? "bg-white dark:bg-[#0a0a0a]"
          : "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm",
      )}
    >
      <div>
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-[2px] py-4"
          onMouseEnter={handleHeaderMouseEnter}
          onMouseLeave={handleHeaderMouseLeave}
        >
          <div className="flex items-center gap-2">
            <Link
              className="group flex shrink-0 items-center justify-center cursor-pointer"
              onClick={closeAll}
              to="/"
            >
              <span className="flex items-center gap-3 text-[20px] font-semibold tracking-tight text-black dark:text-white">
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-auto object-contain dark:invert"
                  src="/logo.svg"
                />
                MAPLE-GLOBAL
              </span>
            </Link>

            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-5 xl:flex ml-4 group/nav"
              onMouseEnter={clearCloseTimer}
            >
              {localizedMegaMenus.map((menu) => (
                <button
                  className={cn(
                    "text-[14px] font-medium transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white",
                    openMenuId === menu.id && "text-black dark:text-white",
                  )}
                  key={menu.id}
                  onBlur={scheduleClose}
                  onFocus={() => setOpenMenuId(menu.id)}
                  onMouseEnter={() => {
                    clearCloseTimer();
                    setOpenMenuId(menu.id);
                  }}
                  type="button"
                >
                  {menu.label}
                </button>
              ))}
              {localizedDirectLinks.map((link) => (
                <Link
                  className={cn(
                    "text-[14px] font-medium transition-colors text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white",
                    pathname === link.href && "text-black dark:text-white",
                  )}
                  key={link.href}
                  onClick={closeAll}
                  to={link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                aria-label={copy("Recent news")}
                className="ml-2 transition-colors cursor-pointer text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                to="/news"
              >
                <Search className="h-[16px] w-[16px]" />
              </Link>
            </nav>
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <LocaleToggle />
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-black transition-colors hover:border-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white"
                  onClick={closeAll}
                  to="/login"
                >
                  {userLabel}
                </Link>
                <button
                  className="text-[14px] font-medium transition-colors text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  disabled={signOutPending}
                  onClick={handleSignOut}
                  type="button"
                >
                  {signOutPending ? copy("Signing out...") : copy("Sign out")}
                </button>
              </>
            ) : (
              <Link
                className="text-[14px] font-medium transition-colors flex items-center gap-1 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                onClick={closeAll}
                to="/login"
              >
                {copy("Log in")}
              </Link>
            )}
            <Link
              className={cn(
                "inline-flex h-[36px] items-center justify-center rounded-full bg-white dark:bg-black px-[18px] text-[14px] font-medium text-black dark:text-white border border-gray-200 dark:border-white/10 transition-transform hover:scale-[1.02]",
                openMenuId ? "opacity-90 hover:opacity-100" : "",
              )}
              onClick={closeAll}
              to="/pricing"
            >
              {copy("Try MAPLE-GLOBAL")}{" "}
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-end text-black xl:hidden cursor-pointer"
            onClick={() => {
              setMobileOpen((value) => !value);
              setOpenMenuId(null);
            }}
            type="button"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mega Panel Dropdown */}
        <nav
          aria-label={activeMenu ? `${activeMenu.label} menu` : "Expanded menu"}
          className={cn(
            "absolute left-0 top-full w-full overflow-hidden bg-white dark:bg-[#0a0a0a] transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:shadow-none",
            openMenuId
              ? "max-h-[600px] opacity-100 border-b border-gray-100 dark:border-white/10"
              : "max-h-0 opacity-0 pointer-events-none border-b-0",
          )}
          onMouseEnter={handleHeaderMouseEnter}
          onMouseLeave={handleHeaderMouseLeave}
        >
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8 pb-[80px] pt-12">
            {activeMenu ? (
              <div className="grid grid-cols-[1fr_350px] gap-16 lg:gap-32">
                <div className="flex flex-col gap-6">
                  {activeMenu.sections[0]?.links.map((link) => (
                    <SiteLink
                      className="text-[32px] leading-[1.1] font-medium text-black dark:text-white hover:opacity-50 transition-opacity block"
                      href={link.href}
                      key={link.label}
                      onClick={closeAll}
                    >
                      {link.label}
                    </SiteLink>
                  ))}
                </div>

                {activeMenu.sections[1] && (
                  <div className="pt-2">
                    <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-6">
                      {activeMenu.sections[1].title}
                    </p>
                    <div className="flex flex-col gap-4">
                      {activeMenu.sections[1].links.map((link) => (
                        <SiteLink
                          className="text-[15px] font-medium text-black dark:text-white hover:opacity-50 transition-opacity block"
                          href={link.href}
                          key={link.label}
                          onClick={closeAll}
                        >
                          {link.label}
                        </SiteLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "absolute left-0 top-full w-full overflow-hidden bg-white dark:bg-[#0a0a0a] transition-[max-height,opacity] duration-300 ease-in-out xl:hidden",
            mobileOpen
              ? "max-h-[100vh] h-[100vh] opacity-100 shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:shadow-none border-t border-gray-100 dark:border-white/10"
              : "max-h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="px-6 py-8 pb-32 max-h-[calc(100vh-4rem)] overflow-y-auto w-full">
            <div className="flex flex-col gap-8">
              {localizedMegaMenus.map((menu) => (
                <div key={menu.id} className="flex flex-col gap-4">
                  <p className="text-[14px] font-semibold text-gray-500 dark:text-gray-400">
                    {menu.label}
                  </p>
                  <div className="flex flex-col gap-4">
                    {menu.sections
                      .flatMap((s) => s.links)
                      .map((link) => (
                        <SiteLink
                          className="text-[24px] leading-tight font-medium text-black dark:text-white hover:opacity-50 transition-opacity"
                          href={link.href}
                          key={link.label}
                          onClick={closeAll}
                        >
                          {link.label}
                        </SiteLink>
                      ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-4">
                {localizedDirectLinks.map((link) => (
                  <Link
                    className="text-[24px] leading-tight font-medium text-black dark:text-white"
                    key={link.href}
                    onClick={closeAll}
                    to={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="h-[1px] w-full bg-gray-200 dark:bg-white/10 my-4" />
              <div className="flex flex-col gap-5">
                {user ? (
                  <>
                    <Link
                      className="text-[18px] font-medium text-black dark:text-white"
                      onClick={closeAll}
                      to="/login"
                    >
                      {userLabel}
                    </Link>
                    <button
                      className="text-left text-[18px] font-medium text-black dark:text-white"
                      disabled={signOutPending}
                      onClick={handleSignOut}
                      type="button"
                    >
                      {signOutPending
                        ? copy("Signing out...")
                        : copy("Sign out")}
                    </button>
                  </>
                ) : (
                  <Link
                    className="text-[18px] font-medium text-black dark:text-white"
                    to="/login"
                    onClick={closeAll}
                  >
                    {copy("Log in")}
                  </Link>
                )}
                <Link
                  className="text-[18px] font-medium text-black dark:text-white flex items-center gap-2"
                  to="/pricing"
                  onClick={closeAll}
                >
                  {copy("Try MAPLE-GLOBAL")}{" "}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
