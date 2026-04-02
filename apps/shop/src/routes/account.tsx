import type { ShopAccountAddress } from "@maple-global/api-client";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Package,
  PencilLine,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { shopButtonClass } from "~/components/shop/button";
import { PageFrame } from "~/components/shop/page-frame";
import { cn } from "~/components/shop/utils";
import { useShopSessionUser } from "~/lib/auth-session";
import { getShopLoginUrl } from "~/lib/login-redirect";
import {
  deleteShopAccountAddress,
  loadShopAccount,
  updateShopAccountProfile,
  upsertShopAccountAddress,
} from "~/lib/shop-account";
import { getServerUrl } from "~/lib/shop-api";

type ProfileFormState = {
  companyName: string;
  country: string;
  email: string;
  fullName: string;
  phone: string;
};

type AddressFormState = {
  city: string;
  country: string;
  id?: string;
  isDefault: boolean;
  line1: string;
  line2: string;
  postalCode: string;
  recipient: string;
  stateProvince: string;
};

const inputClass =
  "block h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]";

function emptyAddressForm(): AddressFormState {
  return {
    city: "",
    country: "US",
    isDefault: false,
    line1: "",
    line2: "",
    postalCode: "",
    recipient: "",
    stateProvince: "",
  };
}

function addressToForm(address: ShopAccountAddress): AddressFormState {
  return {
    city: address.city,
    country: address.country,
    id: address.id,
    isDefault: address.isDefault,
    line1: address.line1,
    line2: address.line2 || "",
    postalCode: address.postalCode,
    recipient: address.recipient,
    stateProvince: address.stateProvince || "",
  };
}

function orderStatusLabel(status: string) {
  switch (status) {
    case "paid":
      return {
        className: "border-green-200 bg-green-50 text-green-700",
        label: "Paid",
      };
    case "pending":
      return {
        className: "border-orange-200 bg-orange-50 text-orange-700",
        label: "Pending",
      };
    default:
      return {
        className: "border-gray-200 bg-gray-50 text-gray-600",
        label: status,
      };
  }
}

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account Center" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useShopSessionUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [initLoad, setInitLoad] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [addressNotice, setAddressNotice] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressDeletingId, setAddressDeletingId] = useState<string | null>(
    null,
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<
    Awaited<ReturnType<typeof loadShopAccount>>["recentOrders"]
  >([]);
  const [addresses, setAddresses] = useState<ShopAccountAddress[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    companyName: "",
    country: "US",
    email: user?.email || "",
    fullName: user?.name || "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState<AddressFormState>(
    emptyAddressForm(),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setInitLoad(false), 450);
    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRecentOrders([]);
      setAddresses([]);
      setProfileForm({
        companyName: "",
        country: "US",
        email: "",
        fullName: "",
        phone: "",
      });
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm());
      return;
    }

    let cancelled = false;
    setAccountLoading(true);
    setAccountError("");

    loadShopAccount()
      .then((account) => {
        if (cancelled) {
          return;
        }

        setRecentOrders(account.recentOrders);
        setAddresses(account.addresses);
        setProfileForm({
          companyName: account.profile.companyName || "",
          country: account.profile.country || "US",
          email: account.profile.email,
          fullName: account.profile.fullName,
          phone: account.profile.phone || "",
        });
        const defaultAddress = account.addresses.find(
          (address) => address.isDefault,
        );
        setAddressForm(
          defaultAddress ? addressToForm(defaultAddress) : emptyAddressForm(),
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setAccountError(
            error instanceof Error
              ? error.message
              : "Unable to load your account right now.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAccountLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSignOut() {
    try {
      setLoggingOut(true);
      setAccountError("");

      const response = await fetch(
        new URL("/api/auth/sign-out", getServerUrl()).toString(),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || "Unable to sign out right now.");
      }

      window.location.reload();
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : "Unable to sign out right now.",
      );
      setLoggingOut(false);
    }
  }

  function handleLoginRedirect() {
    window.location.href = getShopLoginUrl(window.location.href);
  }

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileNotice("");
    setAccountError("");

    try {
      const profile = await updateShopAccountProfile({
        companyName: profileForm.companyName.trim() || undefined,
        country: profileForm.country.trim().toUpperCase() || undefined,
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone.trim() || undefined,
      });

      setProfileForm({
        companyName: profile.companyName || "",
        country: profile.country || "US",
        email: profile.email,
        fullName: profile.fullName,
        phone: profile.phone || "",
      });
      setProfileNotice("Profile saved.");
    } catch (error) {
      setAccountError(
        error instanceof Error ? error.message : "Unable to save your profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  }

  function startNewAddress() {
    setEditingAddressId("new");
    setAddressNotice("");
    setAddressForm({
      ...emptyAddressForm(),
      country: profileForm.country || "US",
      recipient: profileForm.fullName || "",
    });
  }

  function startEditAddress(address: ShopAccountAddress) {
    setEditingAddressId(address.id);
    setAddressNotice("");
    setAddressForm(addressToForm(address));
  }

  async function handleAddressSave() {
    setAddressSaving(true);
    setAccountError("");
    setAddressNotice("");

    try {
      const saved = await upsertShopAccountAddress({
        city: addressForm.city.trim(),
        country: addressForm.country.trim().toUpperCase(),
        id: addressForm.id,
        isDefault: addressForm.isDefault,
        line1: addressForm.line1.trim(),
        line2: addressForm.line2.trim() || undefined,
        postalCode: addressForm.postalCode.trim(),
        recipient: addressForm.recipient.trim(),
        stateProvince: addressForm.stateProvince.trim() || undefined,
      });

      setAddresses((current) => {
        const next = current.filter((item) => item.id !== saved.id);
        const merged = saved.isDefault
          ? next.map((item) => ({ ...item, isDefault: false }))
          : next;
        return [saved, ...merged];
      });
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm());
      setAddressNotice("Shipping address saved.");
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : "Unable to save the shipping address.",
      );
    } finally {
      setAddressSaving(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    setAddressDeletingId(addressId);
    setAccountError("");
    setAddressNotice("");

    try {
      await deleteShopAccountAddress({ id: addressId });
      const remaining = addresses.filter((address) => address.id !== addressId);

      setAddresses(
        remaining.some((address) => address.isDefault) || !remaining.length
          ? remaining
          : remaining.map((address, index) => ({
              ...address,
              isDefault: index === 0,
            })),
      );

      if (editingAddressId === addressId) {
        setEditingAddressId(null);
        setAddressForm(emptyAddressForm());
      }

      setAddressNotice("Shipping address removed.");
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : "Unable to remove the shipping address.",
      );
    } finally {
      setAddressDeletingId(null);
    }
  }

  if (initLoad && user === null) {
    return (
      <PageFrame showSearch={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-gray-400">Loading your account...</div>
        </div>
      </PageFrame>
    );
  }

  if (!user) {
    return (
      <PageFrame showSearch={false}>
        <div className="mx-auto mt-16 max-w-[500px] text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-400 shadow-sm">
            <UserRound className="h-10 w-10" />
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900">
            Sign in or create an account
          </h1>
          <p className="mb-8 text-[15px] text-gray-500">
            Sign in to track orders, manage your shipping addresses, and quickly
            checkout using your saved details.
          </p>
          <button
            className={shopButtonClass({
              className: "w-full",
              variant: "brand",
            })}
            onClick={handleLoginRedirect}
            type="button"
          >
            Sign in
          </button>
        </div>
      </PageFrame>
    );
  }

  const displayName = profileForm.fullName || user.name || "Valued Customer";
  const initial = (displayName || user.email).charAt(0).toUpperCase();

  return (
    <PageFrame showSearch={false}>
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
          Personal Center
        </h1>

        {accountError ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {accountError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-4">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="absolute left-0 top-0 h-20 w-full bg-gradient-to-r from-[#635BFF]/10 to-[#09B83E]/10" />

              <div className="relative pt-4">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-3xl font-semibold text-white shadow-md">
                  {initial}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {displayName}
                </h2>
                <div className="mt-1 flex items-center text-[15px] font-medium text-gray-500">
                  <Mail className="mr-1.5 h-4 w-4" />
                  {profileForm.email || user.email}
                </div>

                <div className="mt-5 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Verified Account
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <button
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-[14px] font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1",
                    loggingOut && "cursor-not-allowed opacity-50",
                  )}
                  disabled={loggingOut}
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-gray-900">
                <CreditCard className="h-5 w-5" />
                <h3 className="text-base font-semibold">Payment Methods</h3>
              </div>
              <p className="text-sm leading-6 text-gray-500">
                Stripe checkout is hosted, so saved cards are not stored inside
                MAPLE-GLOBAL yet. Payment details are entered directly on the
                Stripe page when you pay.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:col-span-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>
              </div>

              {accountLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading recent orders...
                  </p>
                </div>
              ) : recentOrders.length ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const badge = orderStatusLabel(order.status);

                    return (
                      <div
                        key={order.checkoutId}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {order.reference}
                              </h3>
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                                  badge.className,
                                )}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              {order.lineItems.length} items ·{" "}
                              {(
                                order.customer.fullName || order.customer.email
                              ).trim()}
                            </p>
                            {order.shippingAddress ? (
                              <p className="mt-1 text-sm text-gray-500">
                                Ship to {order.shippingAddress.recipient},{" "}
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.country}
                              </p>
                            ) : null}
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: order.summary.currencyCode,
                              }).format(order.summary.totalMinor / 100)}
                            </div>
                            {order.receiptUrl ? (
                              <a
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#635BFF] hover:text-[#4E44E7]"
                                href={order.receiptUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                View receipt
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100 pt-2">
                          {order.lineItems.map((item) => (
                            <div
                              key={`${order.checkoutId}:${item.productId}:${item.title}`}
                              className="flex items-center justify-between py-3 text-sm"
                            >
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900">
                                  {item.title}
                                </div>
                                <div className="truncate text-gray-500">
                                  {item.brand}
                                  {item.variantLabel
                                    ? ` · ${item.variantLabel}`
                                    : ""}
                                  {item.purchaseModeLabel
                                    ? ` · ${item.purchaseModeLabel}`
                                    : ""}
                                </div>
                              </div>
                              <div className="ml-4 shrink-0 text-gray-600">
                                x{item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No recent orders found
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[15px] text-gray-500">
                    When you make a purchase, the order details, invoice, and
                    tracking status will appear here.
                  </p>
                  <div className="mt-6">
                    <button
                      className={shopButtonClass({
                        size: "sm",
                        variant: "dark",
                      })}
                      onClick={() => window.location.assign("/categories")}
                      type="button"
                    >
                      Start browsing
                    </button>
                  </div>
                </div>
              )}
            </section>
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Account Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <PencilLine className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Profile Configuration
                      </div>
                      <div className="text-sm text-gray-500">
                        Edit your name and connected contacts
                      </div>
                    </div>
                  </div>

                  {profileNotice ? (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {profileNotice}
                    </div>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Full name
                      </label>
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            fullName: event.target.value,
                          }))
                        }
                        type="text"
                        value={profileForm.fullName}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        className={cn(inputClass, "bg-gray-50 text-gray-500")}
                        disabled
                        type="email"
                        value={profileForm.email}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="Phone number"
                        type="text"
                        value={profileForm.phone}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            companyName: event.target.value,
                          }))
                        }
                        placeholder="Company name"
                        type="text"
                        value={profileForm.companyName}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        className={inputClass}
                        onChange={(event) =>
                          setProfileForm((current) => ({
                            ...current,
                            country: event.target.value,
                          }))
                        }
                        placeholder="US"
                        type="text"
                        value={profileForm.country}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-full bg-[#635BFF] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#4E44E7]",
                        profileSaving && "cursor-not-allowed opacity-70",
                      )}
                      disabled={profileSaving}
                      onClick={handleProfileSave}
                      type="button"
                    >
                      {profileSaving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {profileSaving ? "Saving..." : "Save profile"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Shipping Addresses
                        </div>
                        <div className="text-sm text-gray-500">
                          Manage addresses for faster checkout
                        </div>
                      </div>
                    </div>

                    <button
                      className={shopButtonClass({
                        size: "chip",
                        variant: "soft",
                      })}
                      onClick={startNewAddress}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Add address
                    </button>
                  </div>

                  {addressNotice ? (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {addressNotice}
                    </div>
                  ) : null}

                  {addresses.length ? (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-xl border border-gray-200 p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  {address.recipient}
                                </div>
                                {address.isDefault ? (
                                  <span className="inline-flex items-center rounded-full border border-[#635BFF]/20 bg-[#F7F6FF] px-2 py-0.5 text-[11px] font-semibold text-[#635BFF]">
                                    Default
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-sm leading-6 text-gray-500">
                                <div>{address.line1}</div>
                                {address.line2 ? (
                                  <div>{address.line2}</div>
                                ) : null}
                                <div>
                                  {address.city}
                                  {address.stateProvince
                                    ? `, ${address.stateProvince}`
                                    : ""}
                                  {`, ${address.postalCode}`}
                                </div>
                                <div>{address.country}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                className={shopButtonClass({
                                  size: "compact",
                                  variant: "soft",
                                })}
                                onClick={() => startEditAddress(address)}
                                type="button"
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                className={shopButtonClass({
                                  size: "compact",
                                  variant: "danger",
                                })}
                                disabled={addressDeletingId === address.id}
                                onClick={() => handleDeleteAddress(address.id)}
                                type="button"
                              >
                                {addressDeletingId === address.id ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      No saved shipping addresses yet. Your checkout addresses
                      will appear here automatically after you use them.
                    </div>
                  )}

                  {editingAddressId ? (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <div className="mb-4 text-sm font-semibold text-gray-900">
                        {editingAddressId === "new"
                          ? "Add shipping address"
                          : "Edit shipping address"}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Recipient
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                recipient: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.recipient}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                country: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.country}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Address line 1
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                line1: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.line1}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Address line 2
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                line2: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.line2}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                city: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.city}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            State / Province
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                stateProvince: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.stateProvince}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Postal code
                          </label>
                          <input
                            className={inputClass}
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                postalCode: event.target.value,
                              }))
                            }
                            type="text"
                            value={addressForm.postalCode}
                          />
                        </div>
                        <label className="flex items-center gap-2 pt-8 text-sm text-gray-600">
                          <input
                            checked={addressForm.isDefault}
                            className="h-4 w-4 rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF]"
                            onChange={(event) =>
                              setAddressForm((current) => ({
                                ...current,
                                isDefault: event.target.checked,
                              }))
                            }
                            type="checkbox"
                          />
                          Use as my default shipping address
                        </label>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          className={cn(
                            shopButtonClass({
                              size: "sm",
                              variant: "brand",
                            }),
                            addressSaving && "cursor-not-allowed opacity-70",
                          )}
                          disabled={addressSaving}
                          onClick={handleAddressSave}
                          type="button"
                        >
                          {addressSaving ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {addressSaving ? "Saving..." : "Save address"}
                        </button>
                        <button
                          className={shopButtonClass({
                            size: "sm",
                            variant: "neutral",
                          })}
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm(emptyAddressForm());
                          }}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
