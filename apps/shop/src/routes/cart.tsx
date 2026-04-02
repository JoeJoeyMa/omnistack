import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { PageFrame } from "~/components/shop/page-frame";
import { ProductCard } from "~/components/shop/product-card";
import { useShopState } from "~/components/shop/shop-state";
import { useShopCatalog } from "~/lib/use-shop-catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Cart" }],
  }),
  component: CartPage,
});

function parsePrice(value: string) {
  return Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

function CartPage() {
  const catalog = useShopCatalog();
  const { cart, removeFromCart, updateCartQuantity } = useShopState();
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cart],
  );

  return (
    <PageFrame>
      <div className="grid gap-10">
        <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] text-black/55">Your order</p>
                <h1 className="mt-2 text-[32px] font-medium tracking-[-0.05em]">
                  Cart
                </h1>
              </div>
              <span className="rounded-full bg-black/5 px-3 py-1 text-[13px] text-black/55">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="mt-8 grid place-items-center gap-4 rounded-[28px] border border-dashed border-black/10 bg-[#fbfbfb] px-6 py-14 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
                  <ShoppingBag className="h-6 w-6 text-black/55" />
                </div>
                <div>
                  <h2 className="text-[24px] font-medium tracking-[-0.04em] text-[#111]">
                    Your cart is empty
                  </h2>
                  <p className="mt-2 text-[15px] leading-7 text-black/56">
                    Add a company-formation or compliance package from a detail
                    page, then continue through the onboarding checkout flow
                    from here.
                  </p>
                </div>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--shop-brand)] px-6 text-[15px] font-medium text-white"
                  search={{ q: "" }}
                  to="/categories"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                {cart.map((item) => (
                  <article
                    className="grid gap-5 rounded-[28px] border border-black/6 bg-[#fbfbfb] p-4 md:grid-cols-[120px_1fr]"
                    key={item.id}
                  >
                    <Link
                      params={{ productId: item.productId, slug: item.slug }}
                      to="/products/$productId/$slug"
                    >
                      <img
                        alt={item.title}
                        className="aspect-square w-full rounded-[22px] object-cover"
                        src={item.image}
                      />
                    </Link>

                    <div className="grid gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            className="text-[14px] text-black/55"
                            params={{ slug: item.merchantSlug }}
                            to="/m/$slug"
                          >
                            {item.brand}
                          </Link>
                          <Link
                            className="mt-1 block text-[22px] font-medium leading-tight text-[#111]"
                            params={{ productId: item.productId, slug: item.slug }}
                            to="/products/$productId/$slug"
                          >
                            {item.title}
                          </Link>
                          {item.variantLabel || item.purchaseModeLabel ? (
                            <p className="mt-2 text-[14px] text-black/55">
                              {[item.variantLabel, item.purchaseModeLabel]
                                .filter(Boolean)
                                .join(" • ")}
                            </p>
                          ) : null}
                        </div>
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white"
                          onClick={() => removeFromCart(item.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-[16px]">
                          <span className="font-medium text-[#111]">
                            ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                          </span>
                          {item.compareAt ? (
                            <span className="text-black/40 line-through">
                              {item.compareAt}
                            </span>
                          ) : null}
                        </div>
                        <button
                          className="text-[14px] text-black/46 underline"
                          onClick={() => removeFromCart(item.id)}
                          type="button"
                        >
                          Remove item from cart
                        </button>
                      </div>

                      <div className="inline-flex w-fit items-center gap-3 rounded-full border border-black/8 bg-white px-3 py-2">
                        <button
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f7f7f8]"
                          disabled={item.quantity === 1}
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-4 text-center text-[14px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f7f7f8]"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:p-6 xl:sticky xl:top-24 xl:self-start">
            <h2 className="text-[28px] font-medium tracking-[-0.04em]">Summary</h2>
            <div className="mt-6 grid gap-3 text-[15px]">
              <div className="flex items-center justify-between text-black/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-black/60">
                <span>Service delivery</span>
                <span>Digital onboarding</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/6 pt-4 text-[17px] font-medium">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--shop-brand)] px-6 text-[16px] font-medium text-white shadow-[0_10px_28px_rgba(84,51,235,0.24)]"
              search={{
                checkoutId: "",
                externalId: "",
                provider: undefined,
                status: undefined,
                token: "",
              }}
              to="/checkout"
            >
              Continue to checkout
            </Link>
            <p className="mt-3 text-[13px] leading-6 text-black/48">
              The cart and summary modules are wired for API-backed service
              packages, recurring compliance add-ons, and payment handoff.
            </p>
          </aside>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] font-medium tracking-[-0.04em]">
              You may also like
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalog.cartRecommendations.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
