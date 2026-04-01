import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
      <p className="text-[14px] uppercase tracking-[0.24em] text-black/45">
        Not found
      </p>
      <h1 className="mt-4 text-[48px] font-medium tracking-[-0.05em]">
        This shelf is empty.
      </h1>
      <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-7 text-black/58">
        The requested route was not recreated in this shop capture. Use one of
        the core flows instead.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          className="rounded-full bg-[var(--shop-brand)] px-6 py-3 text-white"
          to="/"
        >
          Go home
        </Link>
        <Link
          className="rounded-full border border-black/10 bg-white px-6 py-3"
          search={{ q: "" }}
          to="/categories"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
