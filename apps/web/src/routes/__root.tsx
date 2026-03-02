/// <reference types="vite/client" />
import * as React from 'react'
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'OmniStack Template' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 p-4">
            <Link to="/" className="font-medium">
              Home
            </Link>
            <Link to="/about" className="font-medium">
              About
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">
          <Outlet />
        </main>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}