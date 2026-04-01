/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ChatwootWidget } from "~/components/site/chatwoot-widget";
import { SiteFooter } from "~/components/site/footer";
import { SiteHeader } from "~/components/site/header";
import { LocaleProvider } from "~/lib/locale";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "MAPLE-GLOBAL builds premium AI-first websites, pricing systems, and workspace flows for modern SaaS teams.",
      },
      { title: "MAPLE-GLOBAL" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.png",
        sizes: "any",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        {/* Anti-FOUC: apply dark class before first paint */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional FOUC prevention
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <HeadContent />
      </head>
      <body className="site-shell bg-white dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen flex flex-col antialiased">
        <LocaleProvider>
          <SiteHeader />

          <main className="flex-1 w-full mx-auto relative z-10 pt-[72px]">
            <Outlet />
          </main>

          <SiteFooter />

          {import.meta.env.DEV ? (
            <TanStackRouterDevtools position="bottom-right" />
          ) : null}
          <ChatwootWidget />
          <Scripts />
        </LocaleProvider>
      </body>
    </html>
  );
}
