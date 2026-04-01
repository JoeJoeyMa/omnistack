import { createRouter } from "@tanstack/react-router";
import { useCopyText } from "~/lib/locale";
import { routeTree } from "./routeTree.gen";

function DefaultNotFoundComponent() {
  const copy = useCopyText();

  return <p>{copy("Page not found")}</p>;
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
