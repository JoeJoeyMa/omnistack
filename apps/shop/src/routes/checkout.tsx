import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefcaseBusiness, CreditCard, FileCheck2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { PageFrame } from "~/components/shop/page-frame";
import { useShopState } from "~/components/shop/shop-state";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout" }],
  }),
  component: CheckoutPage,
});

function parsePrice(value: string) {
  return Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

function CheckoutPage() {
  const { cart } = useShopState();
  const [paid, setPaid] = useState(false);
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cart],
  );

  return (
    <PageFrame showSearch={false}>
      <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="grid gap-6">
          <div>
            <p className="text-[13px] uppercase tracking-[0.18em] text-black/42">
              Checkout
            </p>
            <h1 className="mt-2 text-[38px] font-medium tracking-[-0.05em] text-[#111]">
              {paid ? "Payment complete" : "Complete your order"}
            </h1>
            <p className="mt-3 max-w-[640px] text-[15px] leading-7 text-black/56">
              {paid
                ? "This front-end flow is now connected end to end. Replace these modules with your real payment, onboarding, customer, and order APIs."
                : "This page is structured for service purchases: client intake, company-setup details, payment, and order summary can all be replaced with live API integrations."}
            </p>
          </div>

          {paid ? (
            <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(84,51,235,0.08)] text-[var(--shop-brand)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-[26px] font-medium tracking-[-0.04em] text-[#111]">
                Your order was accepted
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-black/56">
                The payment and onboarding confirmation step is ready for your
                backend handoff. You can now wire this to your actual payment,
                intake, and service-order creation APIs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--shop-brand)] px-6 text-[15px] font-medium text-white"
                  to="/"
                >
                  Return home
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-[15px] font-medium text-[#111]"
                  search={{ q: "" }}
                  to="/categories"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f6f6f7]">
                    <BriefcaseBusiness className="h-4 w-4 text-black/62" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-medium tracking-[-0.04em] text-[#111]">
                      Client profile
                    </h2>
                    <p className="text-[14px] text-black/52">
                      Replace with your CRM, authenticated customer profile, or lead-intake API.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="Robin Lee" />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="robin@example.com" />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="+1 415 555 0198" />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="Singapore" />
                </div>
              </div>

              <div className="grid gap-4 rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f6f6f7]">
                    <FileCheck2 className="h-4 w-4 text-black/62" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-medium tracking-[-0.04em] text-[#111]">
                      Company setup details
                    </h2>
                    <p className="text-[14px] text-black/52">
                      Replace with your onboarding questionnaire and entity-setup API.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="US Delaware Company Formation" />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="Anysphere Labs Inc." />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="2 founders" />
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="SaaS / AI tooling" />
                  <textarea className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none md:col-span-2" defaultValue="Need formation, EIN coordination, founder equity setup, and first-year compliance planning." rows={4} />
                </div>
                <button className="flex items-center justify-between rounded-[22px] border border-[var(--shop-brand)] bg-[rgba(84,51,235,0.06)] px-4 py-4 text-left" type="button">
                  <span>
                    <span className="block text-[15px] font-medium text-[#111]">Digital document delivery</span>
                    <span className="mt-1 block text-[13px] text-black/52">Kickoff questionnaire immediately, onboarding review within 1 business day</span>
                  </span>
                  <span className="text-[15px] font-medium text-[#111]">$0.00</span>
                </button>
              </div>

              <div className="grid gap-4 rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f6f6f7]">
                    <CreditCard className="h-4 w-4 text-black/62" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-medium tracking-[-0.04em] text-[#111]">
                      Payment
                    </h2>
                    <p className="text-[14px] text-black/52">
                      Swap these mock inputs for your payment provider, invoice, or escrow flow.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="4242 4242 4242 4242" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="12 / 28" />
                    <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="123" />
                    <input className="rounded-[18px] border border-black/8 bg-[#fbfbfb] px-4 py-3 text-[14px] outline-none" defaultValue="Robin Lee" />
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:p-6 xl:sticky xl:top-24 xl:self-start">
          <h2 className="text-[28px] font-medium tracking-[-0.04em] text-[#111]">
            Order summary
          </h2>
          <div className="mt-6 grid gap-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div className="grid grid-cols-[64px_1fr_auto] gap-3" key={item.id}>
                  <img
                    alt={item.title}
                    className="aspect-square w-full rounded-[18px] object-cover"
                    src={item.image}
                  />
                  <div>
                    <p className="text-[14px] font-medium text-[#111]">{item.title}</p>
                    <p className="mt-1 text-[13px] text-black/52">
                      {[item.variantLabel, item.purchaseModeLabel]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                    <p className="mt-1 text-[13px] text-black/52">Qty {item.quantity}</p>
                  </div>
                  <p className="text-[14px] font-medium text-[#111]">
                    ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[14px] leading-6 text-black/56">
                Your checkout is empty. Add a product to the cart first.
              </p>
            )}
          </div>

            <div className="mt-6 grid gap-3 border-t border-black/6 pt-5 text-[15px]">
              <div className="flex items-center justify-between text-black/60">
                <span>Service fees</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-black/60">
                <span>Delivery</span>
                <span>$0.00</span>
              </div>
            <div className="flex items-center justify-between text-[17px] font-medium text-[#111]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--shop-brand)] px-6 text-[16px] font-medium text-white shadow-[0_10px_28px_rgba(84,51,235,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={cart.length === 0 || paid}
            onClick={() => setPaid(true)}
            type="button"
          >
            {paid ? "Paid" : "Confirm and pay"}
          </button>
        </aside>
      </div>
    </PageFrame>
  );
}
