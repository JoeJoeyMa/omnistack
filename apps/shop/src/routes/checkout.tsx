import type {
  ShopCheckoutConfig,
  ShopCheckoutDeliveryMode,
  ShopCheckoutFinalizeResult,
  ShopCheckoutLineItem,
  ShopCheckoutProvider,
  ShopCheckoutProviderConfig,
  ShopFulfillmentType,
} from "@maple-global/api-client";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LoaderCircle,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageFrame } from "~/components/shop/page-frame";
import { useShopState } from "~/components/shop/shop-state";
import { cn } from "~/components/shop/utils";
import { useShopSessionUser } from "~/lib/auth-session";
import { loadShopAccount } from "~/lib/shop-account";
import { getShopApiClient } from "~/lib/shop-api";

const providerKeys = ["stripe", "paypal", "alipay", "wechat_pay"] as const;

const fallbackCheckoutConfig: ShopCheckoutConfig = {
  providers: [
    {
      checkoutMode: "hosted",
      description: "Card checkout powered by Stripe Checkout.",
      label: "Stripe",
      provider: "stripe",
      reason: "Load the server config to see whether Stripe is enabled.",
      status: "requires_keys",
    },
    {
      checkoutMode: "redirect",
      description: "Redirect to PayPal approval and return here for capture.",
      label: "PayPal",
      provider: "paypal",
      reason: "Load the server config to see whether PayPal is enabled.",
      status: "requires_keys",
    },
    {
      checkoutMode: "hosted",
      description: "Prepared as a Stripe-hosted alternative payment method.",
      label: "Alipay",
      provider: "alipay",
      reason: "Enable this after Stripe account support is ready.",
      status: "coming_soon",
    },
    {
      checkoutMode: "hosted",
      description: "Prepared as a Stripe-hosted wallet flow.",
      label: "WeChat Pay",
      provider: "wechat_pay",
      reason: "Enable this after Stripe account support is ready.",
      status: "coming_soon",
    },
  ],
  supportsMixedCurrencies: false,
};

const shippingFees = {
  CNY: { shipping_priority: 2800, shipping_standard: 0 },
  GBP: { shipping_priority: 1400, shipping_standard: 0 },
  USD: { shipping_priority: 1800, shipping_standard: 0 },
} as const;

const surfaceClass =
  "rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm";
const inputClass =
  "block h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]";
const textareaClass =
  "block min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-[15px] leading-6 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]";

type SupportedCurrency = keyof typeof shippingFees;
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CN", name: "China" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "TW", name: "Taiwan" },
  { code: "HK", name: "Hong Kong" },
  { code: "MY", name: "Malaysia" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "NZ", name: "New Zealand" },
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    checkoutId: typeof search.checkoutId === "string" ? search.checkoutId : "",
    externalId: typeof search.externalId === "string" ? search.externalId : "",
    provider:
      typeof search.provider === "string" &&
      providerKeys.includes(search.provider as (typeof providerKeys)[number])
        ? (search.provider as ShopCheckoutProvider)
        : undefined,
    status:
      search.status === "return" || search.status === "cancelled"
        ? search.status
        : undefined,
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: CheckoutPage,
});

function parsePrice(value: string) {
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0;

  if (value.trim().startsWith("£")) {
    return {
      amountMinor: Math.round(numeric * 100),
      currencyCode: "GBP" as const,
    };
  }

  if (value.trim().startsWith("¥")) {
    return {
      amountMinor: Math.round(numeric * 100),
      currencyCode: "CNY" as const,
    };
  }

  return {
    amountMinor: Math.round(numeric * 100),
    currencyCode: "USD" as const,
  };
}

function normalizeCurrencyCode(value: string): SupportedCurrency {
  return value in shippingFees ? (value as SupportedCurrency) : "USD";
}

function formatMinorAmount(amountMinor: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    currency: normalizeCurrencyCode(currencyCode),
    style: "currency",
  }).format(amountMinor / 100);
}

function formatLineTotal(item: { price: string; quantity: number }) {
  const parsed = parsePrice(item.price);
  return formatMinorAmount(
    parsed.amountMinor * item.quantity,
    parsed.currencyCode,
  );
}

function currencyState(lines: Array<{ price: string }>) {
  const currencies = new Set(
    lines.map((item) => parsePrice(item.price).currencyCode),
  );
  return {
    currencyCode: currencies.size === 1 ? [...currencies][0] : "USD",
    mixedCurrencies: currencies.size > 1,
  } as const;
}

function checkoutSummary(
  lines: Array<{ price: string; quantity: number }>,
  deliveryMode: ShopCheckoutDeliveryMode,
) {
  const subtotalMinor = lines.reduce((sum, item) => {
    const parsed = parsePrice(item.price);
    return sum + parsed.amountMinor * item.quantity;
  }, 0);
  const { currencyCode, mixedCurrencies } = currencyState(lines);
  const shippingMinor =
    mixedCurrencies || deliveryMode === "service"
      ? 0
      : shippingFees[currencyCode][deliveryMode];

  return {
    currencyCode,
    mixedCurrencies,
    shippingMinor,
    subtotalMinor,
    totalMinor: subtotalMinor + shippingMinor,
  };
}

function hasType(
  lines: Array<{ fulfillmentType: ShopFulfillmentType }>,
  type: ShopFulfillmentType,
) {
  return lines.some((item) => item.fulfillmentType === type);
}

function providerIcon(provider: ShopCheckoutProvider) {
  switch (provider) {
    case "paypal":
    case "wechat_pay":
      return Wallet;
    case "alipay":
    case "stripe":
    default:
      return CreditCard;
  }
}

function providerTone(provider: ShopCheckoutProvider) {
  switch (provider) {
    case "paypal":
      return "text-[#003087] border-[#003087]/20 bg-[#F5F7FA]";
    case "alipay":
      return "text-[#1677FF] border-[#1677FF]/20 bg-[#F5F8FF]";
    case "wechat_pay":
      return "text-[#09B83E] border-[#09B83E]/20 bg-[#F4FCF6]";
    default:
      return "text-[#635BFF] border-[#635BFF]/20 bg-[#F7F6FF]";
  }
}

function providerStatusCopy(provider: ShopCheckoutProviderConfig) {
  switch (provider.status) {
    case "enabled":
      return {
        className: "border-gray-200 bg-gray-50 text-gray-700",
        label: provider.checkoutMode === "redirect" ? "Enabled" : "Live",
      };
    case "requires_keys":
      return {
        className: "border-orange-200 bg-orange-50 text-orange-700",
        label: "Keys needed",
      };
    default:
      return {
        className: "border-gray-200 bg-gray-50 text-gray-500",
        label: "Coming soon",
      };
  }
}

function providerButtonLabel(provider?: ShopCheckoutProvider) {
  switch (provider) {
    case "paypal":
      return "Pay with PayPal";
    case "alipay":
      return "Pay with Alipay";
    case "wechat_pay":
      return "Pay with WeChat Pay";
    default:
      return "Pay";
  }
}

function optionalValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function CheckoutNotice({
  children,
  icon: Icon,
  tone,
}: {
  children: ReactNode;
  icon: typeof AlertCircle;
  tone: "danger" | "info" | "success";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-900"
      : tone === "success"
        ? "border-green-200 bg-green-50 text-green-900"
        : "border-blue-200 bg-blue-50 text-blue-900";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        toneClass,
      )}
    >
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

function ProviderGlyph({ provider }: { provider: ShopCheckoutProvider }) {
  const Icon = providerIcon(provider);
  return <Icon className="h-5 w-5" />;
}

function CheckoutSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: any;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function CheckoutLineItem({ item }: { item: ShopCheckoutLineItem }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="relative h-16 w-16 shrink-0 rounded-lg border border-gray-200 bg-white">
        <img
          alt={item.title}
          className="h-full w-full rounded-lg object-cover"
          src={item.image}
        />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/90 text-[11px] font-medium text-white ring-2 ring-white">
          {item.quantity}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center min-h-[64px]">
        <div className="flex justify-between gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            {item.variantLabel && (
              <p className="mt-0.5 text-gray-500">{item.variantLabel}</p>
            )}
            {item.purchaseModeLabel && (
              <p className="mt-0.5 text-gray-500">{item.purchaseModeLabel}</p>
            )}
          </div>
          <p className="font-medium text-gray-900">{formatLineTotal(item)}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  strong?: boolean;
  value: string | ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-[15px] py-1",
        strong ? "font-semibold text-gray-900 text-base" : "text-gray-600",
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CheckoutPage() {
  const search = Route.useSearch();
  const { cart, clearCart } = useShopState();
  const { user: sessionUser } = useShopSessionUser();
  const [checkoutConfig, setCheckoutConfig] = useState<ShopCheckoutConfig>(
    fallbackCheckoutConfig,
  );
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [completedOrder, setCompletedOrder] =
    useState<ShopCheckoutFinalizeResult | null>(null);
  const handledReturnKeyRef = useRef("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<ShopCheckoutProvider>("stripe");
  const [deliveryMode, setDeliveryMode] =
    useState<ShopCheckoutDeliveryMode>("service");
  const [customer, setCustomer] = useState({
    companyName: "",
    country: "US",
    email: "",
    fullName: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    city: "",
    country: "US",
    line1: "",
    line2: "",
    postalCode: "",
    recipient: "",
    stateProvince: "",
  });
  const [serviceDetails, setServiceDetails] = useState({
    businessType: "",
    fulfillmentNotes: "",
    projectName: "",
  });

  const activeItems = completedOrder?.lineItems ?? cart;
  const hasShippingItems = hasType(activeItems, "shipping");
  const hasServiceItems = hasType(activeItems, "service");
  const shippedItems = activeItems.filter(
    (item) => item.fulfillmentType === "shipping",
  );
  const services = activeItems.filter(
    (item) => item.fulfillmentType === "service",
  );
  const liveSummary = useMemo(
    () => checkoutSummary(cart, deliveryMode),
    [cart, deliveryMode],
  );
  const summary = completedOrder?.summary ?? liveSummary;
  const summaryCurrency = normalizeCurrencyCode(summary.currencyCode);
  const mixedCurrencies = completedOrder ? false : liveSummary.mixedCurrencies;
  const providerMap = useMemo(
    () =>
      new Map(checkoutConfig.providers.map((item) => [item.provider, item])),
    [checkoutConfig.providers],
  );
  const activeProvider = providerMap.get(selectedProvider) ?? null;
  const enabledProviders = useMemo(
    () => checkoutConfig.providers.filter((item) => item.status === "enabled"),
    [checkoutConfig.providers],
  );
  const returnedExternalId = search.externalId || search.token;
  const returnKey =
    search.status && search.provider && search.checkoutId
      ? `${search.status}:${search.provider}:${search.checkoutId}:${returnedExternalId}`
      : "";
  const orderKindLabel = hasShippingItems
    ? hasServiceItems
      ? "Physical goods + service onboarding"
      : "Physical goods"
    : "Service-only order";

  useEffect(() => {
    if (!sessionUser) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      email: current.email || sessionUser.email,
      fullName: current.fullName || sessionUser.name || "",
    }));

    if (sessionUser.name) {
      setShippingAddress((current) => ({
        ...current,
        recipient: current.recipient || sessionUser.name || "",
      }));
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!sessionUser) {
      return;
    }

    let cancelled = false;

    loadShopAccount()
      .then((account) => {
        if (cancelled) {
          return;
        }

        const defaultAddress =
          account.addresses.find((address) => address.isDefault) ??
          account.addresses[0];

        setCustomer((current) => ({
          companyName:
            current.companyName || account.profile.companyName || "",
          country:
            current.country === "US"
              ? account.profile.country || current.country
              : current.country,
          email: current.email || account.profile.email,
          fullName: current.fullName || account.profile.fullName,
          phone: current.phone || account.profile.phone || "",
        }));

        if (!defaultAddress) {
          return;
        }

        setShippingAddress((current) => ({
          city: current.city || defaultAddress.city,
          country:
            current.country === "US"
              ? defaultAddress.country
              : current.country,
          line1: current.line1 || defaultAddress.line1,
          line2: current.line2 || defaultAddress.line2 || "",
          postalCode: current.postalCode || defaultAddress.postalCode,
          recipient: current.recipient || defaultAddress.recipient,
          stateProvince:
            current.stateProvince || defaultAddress.stateProvince || "",
        }));
      })
      .catch(() => {
        // Keep checkout functional even if account data is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [sessionUser]);

  useEffect(() => {
    let cancelled = false;

    getShopApiClient()
      .shopCheckoutConfig()
      .then((config) => {
        if (!cancelled) {
          setCheckoutConfig(config);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setCheckoutConfig(fallbackCheckoutConfig);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load checkout provider configuration.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingConfig(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hasShippingItems) {
      setDeliveryMode((current) =>
        current === "service" ? "shipping_standard" : current,
      );
      return;
    }

    setDeliveryMode("service");
  }, [hasShippingItems]);

  useEffect(() => {
    if (providerMap.has(selectedProvider)) {
      return;
    }

    const fallbackProvider =
      enabledProviders[0]?.provider ?? checkoutConfig.providers[0]?.provider;

    if (fallbackProvider) {
      setSelectedProvider(fallbackProvider);
    }
  }, [
    checkoutConfig.providers,
    enabledProviders,
    providerMap,
    selectedProvider,
  ]);

  useEffect(() => {
    if (search.status === "cancelled") {
      setNoticeMessage(
        "Payment was cancelled before completion. Your checkout details are still here.",
      );
    }
  }, [search.status]);

  useEffect(() => {
    if (
      search.status !== "return" ||
      !search.provider ||
      !search.checkoutId ||
      !returnedExternalId ||
      handledReturnKeyRef.current === returnKey
    ) {
      return;
    }

    handledReturnKeyRef.current = returnKey;
    setFinalizing(true);
    setErrorMessage("");

    getShopApiClient()
      .shopCheckoutFinalize({
        checkoutId: search.checkoutId,
        externalId: returnedExternalId,
        provider: search.provider,
      })
      .then((result) => {
        setCompletedOrder(result);
        setNoticeMessage(result.message);

        if (result.status === "paid") {
          clearCart();
        }
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to confirm the payment status.",
        );
      })
      .finally(() => {
        setFinalizing(false);
      });
  }, [
    clearCart,
    returnKey,
    returnedExternalId,
    search.checkoutId,
    search.provider,
    search.status,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoticeMessage("");
    setErrorMessage("");

    if (!cart.length) {
      setErrorMessage("Add at least one item to the cart before checkout.");
      return;
    }

    if (mixedCurrencies) {
      setErrorMessage(
        "This checkout currently supports one currency per payment. Split mixed-currency items into separate orders first.",
      );
      return;
    }

    if (!activeProvider) {
      setErrorMessage("Choose a payment provider before continuing.");
      return;
    }

    if (activeProvider.status !== "enabled") {
      setErrorMessage(
        activeProvider.reason ?? "This payment provider is not enabled yet.",
      );
      return;
    }

    // Service payment for physical goods is now allowed (e.g. digital fulfillment / instore pickup)

    const nextCustomer = {
      companyName: optionalValue(customer.companyName),
      country: customer.country.trim().toUpperCase(),
      email: customer.email.trim(),
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
    };

    if (!nextCustomer.fullName || !nextCustomer.email || !nextCustomer.phone) {
      setErrorMessage("Complete the customer details before continuing.");
      return;
    }

    const nextShippingAddress =
      hasShippingItems && deliveryMode !== "service"
        ? {
            city: shippingAddress.city.trim(),
            country: shippingAddress.country.trim().toUpperCase(),
            line1: shippingAddress.line1.trim(),
            line2: optionalValue(shippingAddress.line2),
            postalCode: shippingAddress.postalCode.trim(),
            recipient: shippingAddress.recipient.trim(),
            stateProvince: optionalValue(shippingAddress.stateProvince),
          }
        : undefined;

    if (
      nextShippingAddress &&
      (!nextShippingAddress.recipient ||
        !nextShippingAddress.line1 ||
        !nextShippingAddress.city ||
        !nextShippingAddress.country ||
        !nextShippingAddress.postalCode)
    ) {
      setErrorMessage("Complete the shipping address before continuing.");
      return;
    }

    const nextServiceDetails =
      hasServiceItems || deliveryMode === "service"
        ? {
            businessType: optionalValue(serviceDetails.businessType),
            fulfillmentNotes: optionalValue(serviceDetails.fulfillmentNotes),
            projectName: optionalValue(serviceDetails.projectName),
          }
        : undefined;

    setSubmitting(true);

    try {
      const session = await getShopApiClient().shopCheckoutCreate({
        customer: nextCustomer,
        deliveryMode,
        lineItems: cart,
        provider: selectedProvider,
        returnOrigin: window.location.origin,
        serviceDetails: nextServiceDetails,
        shippingAddress: nextShippingAddress,
      });

      window.location.assign(session.redirectUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the checkout session.",
      );
      setSubmitting(false);
    }
  }

  if (completedOrder?.status === "paid") {
    return (
      <PageFrame showSearch={false}>
        <div className="mx-auto max-w-3xl space-y-8 py-12">
          {noticeMessage && (
            <CheckoutNotice icon={CheckCircle2} tone="success">
              {noticeMessage}
            </CheckoutNotice>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-[#F6F8FA] px-6 py-10 text-center sm:px-10 sm:py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F5E7] mb-6">
                <CheckCircle2 className="h-8 w-8 text-[#09B83E]" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Payment successful
              </h1>
              <p className="mt-2 text-[15px] text-gray-500">
                Thank you for your order! Your reference is{" "}
                <span className="font-medium text-gray-900">
                  {completedOrder.reference}
                </span>
                .
              </p>
            </div>

            <div className="px-6 py-8 sm:px-10">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Order details
              </h2>
              <div className="divide-y divide-gray-100">
                {completedOrder.lineItems.map((item) => (
                  <CheckoutLineItem
                    item={item}
                    key={`${item.productId}-${item.title}`}
                  />
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#F9FAFB] p-6 border border-gray-100">
                <div className="space-y-3">
                  <SummaryRow
                    label="Subtotal"
                    value={formatMinorAmount(
                      completedOrder.summary.subtotalMinor,
                      completedOrder.summary.currencyCode,
                    )}
                  />
                  <SummaryRow
                    label="Shipping"
                    value={
                      completedOrder.summary.shippingMinor > 0
                        ? formatMinorAmount(
                            completedOrder.summary.shippingMinor,
                            completedOrder.summary.currencyCode,
                          )
                        : "Included"
                    }
                  />
                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <SummaryRow
                      label="Total paid"
                      strong
                      value={formatMinorAmount(
                        completedOrder.summary.totalMinor,
                        completedOrder.summary.currencyCode,
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gray-900 px-8 text-[15px] font-semibold !text-white shadow-sm hover:bg-gray-800 transition-colors"
                  search={{ q: "" }}
                  to="/categories"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame showSearch={false}>
      {/* Stripe-like Split Layout */}
      <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-white w-full border-t border-gray-100 -mt-8 mx-auto xl:max-w-[1400px]">
        {/* Left Side: Forms */}
        <div className="flex-1 bg-white px-4 py-8 sm:px-6 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-[560px]">
            {finalizing && (
              <div className="mb-8">
                <CheckoutNotice icon={LoaderCircle} tone="info">
                  Confirming payment. Please do not close this page.
                </CheckoutNotice>
              </div>
            )}

            {errorMessage && (
              <div className="mb-8">
                <CheckoutNotice icon={AlertCircle} tone="danger">
                  {errorMessage}
                </CheckoutNotice>
              </div>
            )}

            {noticeMessage && (
              <div className="mb-8">
                <CheckoutNotice icon={CheckCircle2} tone="info">
                  {noticeMessage}
                </CheckoutNotice>
              </div>
            )}

            {!completedOrder && !cart.length ? (
              <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-gray-300">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <Package className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-[22px] font-semibold text-gray-900">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-[15px] text-gray-500">
                  Looks like you haven't added anything yet.
                </p>
                <Link
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-[#635BFF] px-6 text-[15px] font-medium text-white shadow-sm hover:bg-[#4E44E7] transition-colors"
                  search={{ q: "" }}
                  to="/categories"
                >
                  Return to shop
                </Link>
              </div>
            ) : (
              <form
                id="shop-checkout-form"
                onSubmit={handleSubmit}
                className="space-y-10 pb-20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Checkout
                  </h1>
                  {hasShippingItems ? (
                    <div className="flex p-1 bg-gray-100/80 rounded-lg shrink-0 border border-gray-200/60">
                      <button
                        type="button"
                        onClick={() => setDeliveryMode("shipping_standard")}
                        className={cn(
                          "px-4 py-1.5 text-[14px] font-medium rounded-md transition-all",
                          deliveryMode !== "service"
                            ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-900",
                        )}
                      >
                        Physical delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMode("service")}
                        className={cn(
                          "px-4 py-1.5 text-[14px] font-medium rounded-md transition-all",
                          deliveryMode === "service"
                            ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-900",
                        )}
                      >
                        Digital service
                      </button>
                    </div>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {orderKindLabel}
                    </span>
                  )}
                </div>

                {/* Contact Section */}
                <section>
                  <CheckoutSectionHeader title="Contact info" />
                  {sessionUser ? (
                    <div className="mb-4">
                      <CheckoutNotice icon={CheckCircle2} tone="success">
                        Signed in as{" "}
                        <span className="font-semibold">
                          {sessionUser.name || sessionUser.email}
                        </span>
                        . Your MAPLE-GLOBAL account name and email were loaded
                        into checkout automatically.
                      </CheckoutNotice>
                    </div>
                  ) : null}
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="email-input"
                        >
                          Email
                        </label>
                        <input
                          id="email-input"
                          className={inputClass}
                          onChange={(e) =>
                            setCustomer((c) => ({
                              ...c,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Email address"
                          required
                          type="email"
                          value={customer.email}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="phone-input"
                        >
                          Mobile number
                        </label>
                        <input
                          id="phone-input"
                          className={inputClass}
                          onChange={(e) =>
                            setCustomer((c) => ({
                              ...c,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Phone number"
                          required
                          type="tel"
                          value={customer.phone}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                        htmlFor="name-input"
                      >
                        Full Name
                      </label>
                      <input
                        id="name-input"
                        className={inputClass}
                        onChange={(e) =>
                          setCustomer((c) => ({
                            ...c,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="John Doe"
                        required
                        type="text"
                        value={customer.fullName}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="company-input"
                        >
                          Company (optional)
                        </label>
                        <input
                          id="company-input"
                          className={inputClass}
                          onChange={(e) =>
                            setCustomer((c) => ({
                              ...c,
                              companyName: e.target.value,
                            }))
                          }
                          placeholder="Company Name"
                          type="text"
                          value={customer.companyName}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="contact-country-input"
                        >
                          Country/Region
                        </label>
                        <select
                          id="contact-country-input"
                          className={inputClass}
                          onChange={(e) =>
                            setCustomer((c) => ({
                              ...c,
                              country: e.target.value,
                            }))
                          }
                          required
                          value={customer.country}
                        >
                          <option value="">Select country...</option>
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Delivery Section */}
                {hasShippingItems && deliveryMode !== "service" ? (
                  <section>
                    <CheckoutSectionHeader title="Shipping details" />
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="shipping-country-input"
                          >
                            Country/Region
                          </label>
                          <select
                            id="shipping-country-input"
                            className={inputClass}
                            onChange={(e) =>
                              setShippingAddress((c) => ({
                                ...c,
                                country: e.target.value,
                              }))
                            }
                            required
                            value={shippingAddress.country}
                          >
                            <option value="">Select country...</option>
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="recipient-input"
                          >
                            Recipient
                          </label>
                          <input
                            id="recipient-input"
                            className={inputClass}
                            onChange={(e) =>
                              setShippingAddress((c) => ({
                                ...c,
                                recipient: e.target.value,
                              }))
                            }
                            placeholder="Recipient Name"
                            required
                            type="text"
                            value={shippingAddress.recipient}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="address1-input"
                        >
                          Address line 1
                        </label>
                        <input
                          id="address1-input"
                          className={inputClass}
                          onChange={(e) =>
                            setShippingAddress((c) => ({
                              ...c,
                              line1: e.target.value,
                            }))
                          }
                          placeholder="Street address"
                          required
                          type="text"
                          value={shippingAddress.line1}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                          htmlFor="address2-input"
                        >
                          Address line 2 (Optional)
                        </label>
                        <input
                          id="address2-input"
                          className={inputClass}
                          onChange={(e) =>
                            setShippingAddress((c) => ({
                              ...c,
                              line2: e.target.value,
                            }))
                          }
                          placeholder="Apartment, suite, etc."
                          type="text"
                          value={shippingAddress.line2}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="city-input"
                          >
                            City
                          </label>
                          <input
                            id="city-input"
                            className={inputClass}
                            onChange={(e) =>
                              setShippingAddress((c) => ({
                                ...c,
                                city: e.target.value,
                              }))
                            }
                            placeholder="City"
                            required
                            type="text"
                            value={shippingAddress.city}
                          />
                        </div>
                        <div className="col-span-1">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="state-input"
                          >
                            State
                          </label>
                          <input
                            id="state-input"
                            className={inputClass}
                            onChange={(e) =>
                              setShippingAddress((c) => ({
                                ...c,
                                stateProvince: e.target.value,
                              }))
                            }
                            placeholder="State"
                            type="text"
                            value={shippingAddress.stateProvince}
                          />
                        </div>
                        <div className="col-span-1">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="zip-input"
                          >
                            ZIP
                          </label>
                          <input
                            id="zip-input"
                            className={inputClass}
                            onChange={(e) =>
                              setShippingAddress((c) => ({
                                ...c,
                                postalCode: e.target.value,
                              }))
                            }
                            placeholder="12345"
                            required
                            type="text"
                            value={shippingAddress.postalCode}
                          />
                        </div>
                      </div>

                      {/* Shipping Option Methods */}
                      <fieldset className="mt-8 pt-6 border-t border-gray-100">
                        <legend className="text-[15px] font-semibold text-gray-900 mb-4">
                          Shipping method
                        </legend>
                        <div className="grid gap-3">
                          {(
                            [
                              {
                                description: "Free standard delivery.",
                                fee: shippingFees[summaryCurrency]
                                  .shipping_standard,
                                mode: "shipping_standard",
                                title: "Standard",
                              },
                              {
                                description: "Fast-track priority delivery.",
                                fee: shippingFees[summaryCurrency]
                                  .shipping_priority,
                                mode: "shipping_priority",
                                title: "Priority",
                              },
                            ] as const
                          ).map((option) => {
                            const active = deliveryMode === option.mode;
                            return (
                              <label
                                key={option.mode}
                                className={cn(
                                  "relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition duration-200",
                                  active
                                    ? "border-[#635BFF] bg-[#F7F6FF] ring-1 ring-[#635BFF]"
                                    : "border-gray-200 bg-white hover:bg-gray-50",
                                )}
                              >
                                <input
                                  type="radio"
                                  name="shipping-method"
                                  className="sr-only"
                                  checked={active}
                                  onChange={() => setDeliveryMode(option.mode)}
                                />
                                <span className="flex flex-1">
                                  <span className="flex flex-col">
                                    <span className="block text-sm font-medium text-gray-900">
                                      {option.title}
                                    </span>
                                    <span className="mt-1 flex items-center text-[13px] text-gray-500">
                                      {option.description}
                                    </span>
                                  </span>
                                </span>
                                <span className="ml-4 text-[15px] font-medium text-gray-900">
                                  {option.fee > 0
                                    ? formatMinorAmount(
                                        option.fee,
                                        summaryCurrency,
                                      )
                                    : "Free"}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  </section>
                ) : null}

                {/* Service Options */}
                {hasServiceItems || deliveryMode === "service" ? (
                  <section>
                    {/* <CheckoutSectionHeader title="Service Details" subtitle="Required for digital/service fulfillment." />
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="project-input">
                            Project or company
                          </label>
                          <input
                            id="project-input"
                            className={inputClass}
                            onChange={(e) =>
                              setServiceDetails((c) => ({ ...c, projectName: e.target.value }))
                            }
                            type="text"
                            value={serviceDetails.projectName}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="business-type-input">
                            Business type
                          </label>
                          <input
                            id="business-type-input"
                            className={inputClass}
                            onChange={(e) =>
                              setServiceDetails((c) => ({ ...c, businessType: e.target.value }))
                            }
                            type="text"
                            value={serviceDetails.businessType}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="notes-input">
                          Fulfillment brief
                        </label>
                        <textarea
                          id="notes-input"
                          className={textareaClass}
                          onChange={(e) =>
                            setServiceDetails((c) => ({ ...c, fulfillmentNotes: e.target.value }))
                          }
                          placeholder="Any specific onboarding notes..."
                          value={serviceDetails.fulfillmentNotes}
                        />
                      </div>
                    </div> */}
                  </section>
                ) : null}

                {/* Payment Method */}
                <section>
                  <CheckoutSectionHeader title="Payment" />

                  {loadingConfig ? (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-500">
                      Loading payment provider setup...
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    {checkoutConfig.providers.map((provider) => {
                      const active = selectedProvider === provider.provider;
                      const badge = providerStatusCopy(provider);
                      const Icon = providerIcon(provider.provider);

                      return (
                        <label
                          key={provider.provider}
                          className={cn(
                            "relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition duration-200",
                            active
                              ? "border-[#635BFF] bg-[#F7F6FF] ring-1 ring-[#635BFF]"
                              : "border-gray-200 bg-white hover:bg-gray-50",
                            provider.status !== "enabled" &&
                              !active &&
                              "opacity-80 grayscale-[50%]",
                          )}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            className="sr-only"
                            checked={active}
                            onChange={() =>
                              setSelectedProvider(provider.provider)
                            }
                          />
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "mr-4 flex h-10 w-10 items-center justify-center rounded-lg border",
                                  providerTone(provider.provider),
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="block text-[15px] font-medium text-gray-900">
                                  {provider.label}
                                </span>
                                {active && provider.reason && (
                                  <span className="block text-[13px] text-gray-500 mt-0.5">
                                    {provider.reason}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                                badge.className,
                              )}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {!enabledProviders.length && !loadingConfig && (
                    <div className="mt-4 p-4 rounded-xl border border-orange-200 bg-orange-50 text-[14px] text-orange-800">
                      We're currently provisioning live payment methods.
                    </div>
                  )}

                  <div className="mt-8 pt-8">
                    <button
                      className={cn(
                        "flex w-full items-center justify-center rounded-xl px-6 py-4 text-[16px] font-semibold text-white shadow-sm transition duration-300",
                        submitting ||
                          finalizing ||
                          mixedCurrencies ||
                          activeProvider?.status !== "enabled"
                          ? "cursor-not-allowed bg-gray-300 shadow-none text-gray-500"
                          : "bg-[#635BFF] hover:bg-[#4E44E7] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,91,255,0.25)]",
                      )}
                      disabled={
                        submitting ||
                        finalizing ||
                        mixedCurrencies ||
                        activeProvider?.status !== "enabled"
                      }
                      type="submit"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-between w-full">
                          <span>
                            {providerButtonLabel(activeProvider?.provider)}
                          </span>
                          <span>
                            {formatMinorAmount(
                              summary.totalMinor,
                              summaryCurrency,
                            )}
                          </span>
                        </span>
                      )}
                    </button>
                    <p className="mt-4 text-center text-[13px] text-gray-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Secure, 256-bit
                      encrypted transaction
                    </p>
                  </div>
                </section>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[420px] xl:w-[480px] border-b lg:border-l lg:border-b-0 border-gray-200 bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-8 shrink-0">
          <div className="sticky top-8 flex flex-col lg:pt-4 mx-auto max-w-[560px]">
            <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 mb-6 divide-y divide-gray-100">
              {cart.map((item) => (
                <CheckoutLineItem
                  item={item}
                  key={item.productId + item.title}
                />
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              <SummaryRow
                label="Subtotal"
                value={formatMinorAmount(
                  summary.subtotalMinor,
                  summaryCurrency,
                )}
              />
              <SummaryRow
                label={
                  deliveryMode === "service"
                    ? "Delivery"
                    : deliveryMode === "shipping_priority"
                      ? "Priority shipping"
                      : "Standard shipping"
                }
                value={
                  summary.shippingMinor > 0
                    ? formatMinorAmount(summary.shippingMinor, summaryCurrency)
                    : deliveryMode === "service"
                      ? "Not applicable"
                      : "Free"
                }
              />
              <div className="pt-4 mt-2 border-t border-gray-200">
                <SummaryRow
                  label="Total Due"
                  strong
                  value={
                    <span className="text-2xl font-semibold tracking-tight">
                      {formatMinorAmount(summary.totalMinor, summaryCurrency)}
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
