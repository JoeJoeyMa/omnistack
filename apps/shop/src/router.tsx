import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultNotFoundComponent() {
  return <p className="p-8 text-sm text-black/60">Page not found.</p>;
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultNotFoundComponent: DefaultNotFoundComponent,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
