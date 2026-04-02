import type { ProductReview } from "@maple-global/api-client";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  Star,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { shopButtonClass } from "~/components/shop/button";
import { PageFrame } from "~/components/shop/page-frame";
import { ProductCard } from "~/components/shop/product-card";
import { useShopState } from "~/components/shop/shop-state";
import { cn } from "~/components/shop/utils";
import { getPolicyCopy, getProductDetail } from "~/lib/shop-catalog";
import { isEmptyShopCatalog } from "~/lib/shop-api";
import { useShopCatalog } from "~/lib/use-shop-catalog";

const reviewDraftTemplate = {
  author: "",
  body: "",
  rating: 5,
  title: "",
};

function parseReviewCount(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatReviewCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export const Route = createFileRoute("/products/$productId/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} - Shop` }],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const catalog = useShopCatalog();
  const isCatalogHydrating = isEmptyShopCatalog(catalog);
  const navigate = useNavigate();
  const { productId, slug } = Route.useParams();
  const detail = getProductDetail(catalog, productId, slug);
  const { addToCart, savedProductIds, toggleSaved } = useShopState();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(detail?.colors?.[0]?.label ?? "");
  const [selectedSize, setSelectedSize] = useState(detail?.sizes?.[0] ?? "");
  const [selectedMode, setSelectedMode] = useState(
    detail?.purchaseModes?.[0]?.id ?? "one-time",
  );
  const [quantity, setQuantity] = useState(1);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [cartState, setCartState] = useState<"idle" | "added">("idle");
  const [galleryMotion, setGalleryMotion] = useState<"next" | "prev">("next");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLightboxZoomed, setIsLightboxZoomed] = useState(false);
  const [isReviewComposerOpen, setIsReviewComposerOpen] = useState(false);
  const [reviewSubmitState, setReviewSubmitState] = useState<"idle" | "submitted">(
    "idle",
  );
  const [reviews, setReviews] = useState<ProductReview[]>(detail?.reviews ?? []);
  const [reviewDraft, setReviewDraft] = useState(reviewDraftTemplate);

  useEffect(() => {
    if (!detail) {
      return;
    }

    setSelectedImage(0);
    setSelectedColor(detail.colors?.[0]?.label ?? "");
    setSelectedSize(detail.sizes?.[0] ?? "");
    setSelectedMode(detail.purchaseModes?.[0]?.id ?? "one-time");
    setQuantity(1);
    setShareState("idle");
    setCartState("idle");
    setGalleryMotion("next");
    setIsLightboxOpen(false);
    setIsLightboxZoomed(false);
    setIsReviewComposerOpen(false);
    setReviewSubmitState("idle");
    setReviews(detail.reviews ?? []);
    setReviewDraft(reviewDraftTemplate);
  }, [detail]);

  const seededReviewCount = detail?.reviews?.length ?? 0;
  const displayedReviewCount = useMemo(() => {
    const baseCount = parseReviewCount(detail?.reviewsCount) ?? seededReviewCount;
    const submittedReviews = Math.max(0, reviews.length - seededReviewCount);
    return formatReviewCount(baseCount + submittedReviews);
  }, [detail?.reviewsCount, reviews.length, seededReviewCount]);
  const reviewAverage = useMemo(() => {
    if (!reviews.length) {
      return detail?.rating?.toFixed(1) ?? "4.5";
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [detail?.rating, reviews]);

  const openReviewComposer = () => {
    setReviewSubmitState("idle");
    setIsReviewComposerOpen(true);
  };

  const openLightbox = () => {
    setIsLightboxZoomed(false);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxZoomed(false);
    setIsLightboxOpen(false);
  };

  const selectGalleryImage = (index: number, motion: "next" | "prev" = "next") => {
    if (index === selectedImage) {
      return;
    }

    setGalleryMotion(motion);
    setIsLightboxZoomed(false);
    setSelectedImage(index);
  };

  const shiftGalleryImage = (direction: "next" | "prev") => {
    const total = detail?.gallery.length ?? 0;

    if (!total) {
      return;
    }

    const step = direction === "next" ? 1 : -1;

    setGalleryMotion(direction);
    setIsLightboxZoomed(false);
    setSelectedImage((current) => (current + step + total) % total);
  };

  const handleAddToCart = () => {
    if (!detail) {
      return;
    }

    const activeImage = detail.gallery[selectedImage] ?? detail.image;
    const selectedPurchaseMode =
      detail.purchaseModes?.find((mode) => mode.id === selectedMode) ??
      detail.purchaseModes?.[0];
    const selectedVariantLabel = [selectedColor, selectedSize]
      .filter(Boolean)
      .join(" / ");

    addToCart({
      productId: detail.productId,
      slug: detail.slug,
      title: detail.title,
      brand: detail.brand,
      image: activeImage,
      price: selectedPurchaseMode?.price ?? detail.price,
      compareAt: selectedPurchaseMode?.compareAt,
      fulfillmentType: detail.fulfillmentType ?? "shipping",
      quantity,
      merchantName: detail.merchant.name,
      merchantSlug: detail.merchant.slug,
      purchaseModeLabel: selectedPurchaseMode?.label,
      variantLabel: selectedVariantLabel || undefined,
    });

    setCartState("added");
    window.setTimeout(() => setCartState("idle"), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate({
      to: "/checkout",
      search: {
        checkoutId: "",
        externalId: "",
        provider: undefined,
        status: undefined,
        token: "",
      },
    });
  };

  const handleShare = async () => {
    if (!detail) {
      return;
    }

    const url = `${window.location.origin}/products/${detail.productId}/${detail.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const author = String(formData.get("author") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!author || !title || !body) {
      return;
    }

    const nextReview: ProductReview = {
      author,
      body,
      rating: reviewDraft.rating,
      title,
    };

    setReviews((current) => [nextReview, ...current]);
    setReviewDraft(reviewDraftTemplate);
    setIsReviewComposerOpen(false);
    setReviewSubmitState("submitted");
    window.setTimeout(() => setReviewSubmitState("idle"), 2200);
  };

  useEffect(() => {
    if (!detail || !isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxZoomed(false);
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        shiftGalleryImage("next");
      }

      if (event.key === "ArrowLeft") {
        shiftGalleryImage("prev");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [detail, isLightboxOpen]);

  if (!detail) {
    return (
      <PageFrame>
        <section className="grid min-h-[50vh] place-items-center">
          <div className="max-w-[560px] text-center">
            {isCatalogHydrating ? (
              <>
                <h1 className="text-[40px] font-medium tracking-[-0.05em]">
                  Loading product data
                </h1>
                <p className="mt-4 text-[17px] leading-7 text-black/58">
                  The page shell is up. Product data is being pulled into the
                  storefront now.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-[40px] font-medium tracking-[-0.05em]">
                  This product hasn&apos;t been mapped yet.
                </h1>
                <p className="mt-4 text-[17px] leading-7 text-black/58">
                  The product detail shell is API-ready, but this specific captured
                  product has not been added to the mock catalog yet.
                </p>
                <Link
                  className={shopButtonClass({
                    className: "mt-8",
                    variant: "brand",
                  })}
                  search={{ q: "" }}
                  to="/categories"
                >
                  Back to shopping
                </Link>
              </>
            )}
          </div>
        </section>
      </PageFrame>
    );
  }

  const activeImage = detail.gallery[selectedImage] ?? detail.image;
  const selectedPurchaseMode =
    detail.purchaseModes?.find((mode) => mode.id === selectedMode) ??
    detail.purchaseModes?.[0];
  const isSaved = savedProductIds.includes(detail.productId);
  const hasImageChoices = detail.colors?.some((color) => color.image);
  const selectedVariantLabel = [selectedColor, selectedSize]
    .filter(Boolean)
    .join(" / ");

  return (
    <PageFrame showSearch={!isLightboxOpen && !isReviewComposerOpen}>
      <div className="grid gap-10">
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_29em] xl:items-start xl:gap-10">
          <div className="grid gap-4 xl:sticky xl:top-8 xl:self-start">
            <div className="hidden md:flex md:w-full md:items-start md:gap-4">
              <div className="grid w-[48px] max-h-[84vh] shrink-0 content-start gap-2.5 overflow-auto">
                {detail.gallery.map((image, index) => (
                  <button
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={index === selectedImage}
                    className={cn(
                      "group overflow-hidden rounded-[12px] border bg-[#f5f5f7] p-0.5 transition duration-300",
                      index === selectedImage
                        ? "border-black/18 bg-white shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                        : "border-transparent hover:border-black/10 hover:bg-white hover:shadow-[0_10px_18px_rgba(15,23,42,0.05)]",
                    )}
                    key={`desktop-${image}`}
                    onClick={() =>
                      selectGalleryImage(index, index > selectedImage ? "next" : "prev")
                    }
                    type="button"
                  >
                    <img
                      alt={`${detail.title} preview ${index + 1}`}
                      className="aspect-square w-full rounded-[10px] bg-[#f3f4f6] object-cover transition duration-300 group-hover:scale-[1.03]"
                      src={image}
                    />
                  </button>
                ))}
              </div>

              <div className="relative flex h-[84vh] max-h-[84vh] min-h-[560px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[34px] bg-[#fafafa]">
                <div
                  aria-label="Open image gallery"
                  className="group relative flex h-full w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[34px] p-6 md:p-8 lg:p-10"
                  onClick={openLightbox}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openLightbox();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    alt={detail.title}
                    className={cn(
                      "shop-gallery-image max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.01]",
                      galleryMotion === "next"
                        ? "shop-gallery-image-next"
                        : "shop-gallery-image-prev",
                    )}
                    key={`${detail.productId}-${selectedImage}-desktop`}
                    src={activeImage}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:hidden">
              <div className="overflow-hidden rounded-[36px] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f6f6f8_100%)] p-3 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-4">
                <div
                  aria-label="Open image gallery"
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[30px] bg-[#f6f7f9]"
                  onClick={openLightbox}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openLightbox();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-[#111] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                      Tap to enlarge
                    </span>
                    <span className="rounded-full bg-[#111]/80 px-3 py-1 text-[12px] font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
                      {selectedImage + 1}/{detail.gallery.length}
                    </span>
                  </div>

                  <img
                    alt={detail.title}
                    className={cn(
                      "shop-gallery-image aspect-[4/3.9] w-full rounded-[30px] object-contain transition duration-500 group-hover:scale-[1.015]",
                      galleryMotion === "next"
                        ? "shop-gallery-image-next"
                        : "shop-gallery-image-prev",
                    )}
                    key={`${detail.productId}-${selectedImage}`}
                    src={activeImage}
                  />

                  {detail.gallery.length > 1 ? (
                    <>
                      <button
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[#111] opacity-0 shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur transition duration-300 group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          shiftGalleryImage("prev");
                        }}
                        type="button"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[#111] opacity-0 shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur transition duration-300 group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          shiftGalleryImage("next");
                        }}
                        type="button"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {detail.gallery.map((image, index) => (
                  <button
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={index === selectedImage}
                    className={cn(
                      "overflow-hidden rounded-[20px] border bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-300",
                      index === selectedImage
                        ? "border-[#111] shadow-[0_18px_32px_rgba(15,23,42,0.12)]"
                        : "border-black/8 hover:-translate-y-0.5 hover:border-black/16",
                    )}
                    key={`${image}-${index}`}
                    onClick={() =>
                      selectGalleryImage(index, index > selectedImage ? "next" : "prev")
                    }
                    type="button"
                  >
                    <img
                      alt={`${detail.title} thumbnail ${index + 1}`}
                      className="aspect-square w-full rounded-[16px] object-cover"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="md:px-1 md:pt-2 xl:self-start">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  className="inline-flex items-center gap-2 text-[14px] text-black/55 transition hover:text-black"
                  params={{ slug: detail.merchant.slug }}
                  to="/m/$slug"
                >
                  {detail.brand}
                </Link>
                <h1 className="mt-2 text-[38px] font-medium leading-[0.94] tracking-[-0.05em] text-[#111]">
                  {detail.title}
                </h1>
              </div>
              <button
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/8 bg-[#fafafa] text-black/68 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-black/14 hover:bg-white hover:text-[#111] hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)]"
                type="button"
              >
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    className={cn(
                      "h-4 w-4",
                      index + 1 <= Math.round(Number(reviewAverage))
                        ? "fill-current text-[#f4b63d]"
                        : "text-black/12",
                    )}
                    key={`detail-star-${index}`}
                  />
                ))}
                <span className="text-[14px] text-black/55">({displayedReviewCount})</span>
              </div>
              {detail.boughtText ? (
                <span className="rounded-full bg-[#5c7080] px-3 py-1 text-[12px] font-medium text-white shadow-[0_8px_18px_rgba(92,112,128,0.18)]">
                  {detail.boughtText}
                </span>
              ) : null}
              {detail.lowStockText ? (
                <span className="rounded-full bg-[#fff3e6] px-3 py-1 text-[12px] font-medium text-[#9a4d00]">
                  {detail.lowStockText}
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <span className="text-[30px] font-medium text-[#111]">{detail.price}</span>
              {detail.shippingNote ? (
                <span className="pb-1 text-[14px] text-black/48">
                  {detail.shippingNote}
                </span>
              ) : null}
            </div>

            <div className="mt-3 text-[14px] text-black/55">
              Need a different setup?{" "}
              <Link
                className="font-medium text-[var(--shop-brand)] underline-offset-4 hover:underline"
                search={{
                  checkoutId: "",
                  externalId: "",
                  provider: undefined,
                  status: undefined,
                  token: "",
                }}
                to="/checkout"
              >
                Add notes at checkout
              </Link>
            </div>

            <div className="mt-7 grid gap-6">
              {detail.colors?.length ? (
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium">Color</p>
                    <span className="text-[14px] text-black/48">{selectedColor}</span>
                  </div>

                  {hasImageChoices ? (
                    <div className="grid grid-cols-4 gap-2.5">
                      {detail.colors.map((color) => (
                        <button
                          aria-pressed={color.label === selectedColor}
                          className={cn(
                            "overflow-hidden rounded-[20px] border bg-white p-2 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-300",
                            color.label === selectedColor
                              ? "border-black/16 shadow-[0_16px_30px_rgba(15,23,42,0.12)] ring-2 ring-[rgba(84,51,235,0.14)]"
                              : "border-black/8 hover:-translate-y-0.5 hover:border-black/16 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]",
                          )}
                          key={color.label}
                          onClick={() => {
                            setSelectedColor(color.label);
                            const galleryMatch = detail.gallery.findIndex((image) =>
                              image.includes(
                                color.label
                                  .toLowerCase()
                                  .replace(/\s+/g, "")
                                  .replace(/[^a-z0-9]/g, ""),
                              ),
                            );

                            if (galleryMatch >= 0) {
                              selectGalleryImage(
                                galleryMatch,
                                galleryMatch > selectedImage ? "next" : "prev",
                              );
                            }
                          }}
                          type="button"
                        >
                          {color.image ? (
                            <img
                              alt={color.label}
                              className="aspect-square w-full rounded-[14px] object-cover"
                              src={color.image}
                            />
                          ) : (
                            <div
                              className="aspect-square w-full rounded-[14px] border border-black/10"
                              style={{ backgroundColor: color.swatch }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {detail.colors.map((color) => (
                        <button
                          aria-pressed={color.label === selectedColor}
                          className={cn(
                            "inline-flex h-11 items-center gap-3 rounded-full border bg-white px-3.5 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition duration-300",
                            color.label === selectedColor
                              ? "border-black/18 shadow-[0_14px_26px_rgba(15,23,42,0.08)] ring-2 ring-[rgba(84,51,235,0.14)]"
                              : "border-black/8 hover:-translate-y-0.5 hover:border-black/16 hover:bg-[#fbfbfc]",
                          )}
                          key={color.label}
                          onClick={() => setSelectedColor(color.label)}
                          type="button"
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ backgroundColor: color.swatch }}
                          />
                          {color.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {detail.sizes?.length ? (
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium">Size</p>
                    <span className="text-[14px] text-black/48">{selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {detail.sizes.map((size) => (
                      <button
                        aria-pressed={size === selectedSize}
                        className={cn(
                          "rounded-[18px] border bg-white px-3 py-2.5 text-[14px] font-medium text-[#111] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition duration-300",
                          size === selectedSize
                            ? "border-black/18 shadow-[0_14px_26px_rgba(15,23,42,0.08)] ring-2 ring-[rgba(84,51,235,0.14)]"
                            : "border-black/8 hover:-translate-y-0.5 hover:border-black/16 hover:bg-[#fbfbfc]",
                        )}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-[14px] font-medium">Quantity</p>
              <div className="inline-flex items-center gap-4 rounded-full border border-black/8 bg-[#fafafa] px-3 py-2 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:scale-105 hover:shadow-[0_10px_18px_rgba(15,23,42,0.12)] disabled:bg-[#f1f1f2] disabled:text-black/24 disabled:shadow-none"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-4 text-center text-[14px] font-medium">
                  {quantity}
                </span>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:scale-105 hover:shadow-[0_10px_18px_rgba(15,23,42,0.12)]"
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {detail.purchaseModes?.length ? (
              <div className="mt-6 grid gap-3">
                {detail.purchaseModes.map((mode) => (
                  <button
                    aria-pressed={mode.id === selectedMode}
                    className={cn(
                      "rounded-[24px] border bg-white px-4 py-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition duration-300",
                      mode.id === selectedMode
                        ? "border-black/18 shadow-[0_18px_34px_rgba(15,23,42,0.1)] ring-2 ring-[rgba(84,51,235,0.14)]"
                        : "border-black/8 hover:-translate-y-0.5 hover:border-black/16 hover:bg-[#fcfcfd] hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]",
                    )}
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-[15px] font-medium">
                          <span
                            className={cn(
                              "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                              mode.id === selectedMode
                                ? "border-[var(--shop-brand)] bg-[#f5f1ff] text-[var(--shop-brand)]"
                                : "border-black/12 text-transparent",
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          {mode.label}
                        </p>
                        {mode.note ? (
                          <p
                            className={cn(
                              "mt-1 text-[13px]",
                              mode.id === selectedMode
                                ? "text-[var(--shop-brand)]"
                                : "text-[var(--shop-brand)]",
                            )}
                          >
                            {mode.note}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-medium">{mode.price}</p>
                        {mode.compareAt ? (
                          <p
                            className={cn(
                              "mt-1 text-[13px] line-through",
                              mode.id === selectedMode
                                ? "text-black/42"
                                : "text-black/42",
                            )}
                          >
                            {mode.compareAt}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-8 grid gap-3">
              <button
                className={shopButtonClass({
                  size: "lg",
                  variant: "brand",
                })}
                onClick={handleAddToCart}
                type="button"
              >
                {cartState === "added" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to order
                  </>
                ) : (
                  "Add to order"
                )}
              </button>
              <button
                className={shopButtonClass({
                  size: "lg",
                  variant: "dark",
                })}
                onClick={handleBuyNow}
                type="button"
              >
                Start checkout
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className={cn(
                  shopButtonClass({
                    className: "flex-1 shadow-[0_8px_18px_rgba(15,23,42,0.04)]",
                    size: "sm",
                    variant: "neutral",
                  }),
                  isSaved &&
                    "border-black/18 bg-[#f7f4ff] text-[#111] ring-2 ring-[rgba(84,51,235,0.12)] hover:bg-[#f3efff]",
                )}
                onClick={() => toggleSaved(detail.productId)}
                type="button"
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </button>
              <button
                className={shopButtonClass({
                  className: "flex-1 shadow-[0_8px_18px_rgba(15,23,42,0.04)]",
                  size: "sm",
                  variant: "neutral",
                })}
                onClick={handleShare}
                type="button"
              >
                <Share2 className="h-4 w-4" />
                {shareState === "copied" ? "Copied" : "Share"}
              </button>
            </div>

            <p className="mt-8 text-[14px] leading-6 text-black/62">{detail.description}</p>

            <div className="mt-6 grid gap-3 text-[14px] text-black/58">
              {detail.policies.map((policy) => (
                <details
                  className="group rounded-[18px] border border-black/4 bg-[#fbfbfb] px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.03)] transition duration-300 open:border-black/8 open:bg-white open:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
                  key={policy}
                >
                  <summary className="flex list-none items-center justify-between gap-3 rounded-[14px] text-[#111] transition hover:text-black">
                    <span>{policy}</span>
                    <ChevronDown className="h-4 w-4 transition duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="pt-3 leading-6 text-black/56">
                    {getPolicyCopy(catalog, policy)}
                  </p>
                </details>
              ))}
            </div>

            <Link
              className="mt-8 inline-flex items-center gap-3 rounded-[26px] border border-black/8 bg-[#fafafa] p-3 text-[14px] shadow-[0_10px_22px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:bg-white hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
              params={{ slug: detail.merchant.slug }}
              to="/m/$slug"
            >
              <img
                alt={detail.merchant.name}
                className="h-12 w-12 rounded-[18px] object-cover"
                src={detail.merchant.image}
              />
              <div className="min-w-0">
                {detail.merchant.badge ? (
                  <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--shop-brand)]">
                    {detail.merchant.badge}
                  </p>
                ) : null}
                <p className="mt-1 font-medium text-black">{detail.merchant.name}</p>
                <p className="text-black/45">
                  {detail.merchant.rating} ({detail.merchant.reviews})
                </p>
              </div>
            </Link>
          </aside>
        </section>

        {detail.bundle ? (
          <section className="grid gap-4">
            <h2 className="text-[32px] font-medium tracking-[-0.04em] text-[#111]">
              Bundle and save
            </h2>
            <Link
              className="grid gap-5 overflow-hidden rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)] md:grid-cols-[180px_1fr_auto]"
              params={{
                productId: detail.bundle.href.split("/")[2] ?? detail.productId,
                slug: detail.bundle.href.split("/")[3] ?? detail.slug,
              }}
              to="/products/$productId/$slug"
            >
              <img
                alt={detail.bundle.title}
                className="aspect-square w-full rounded-[24px] bg-[#f5f5f6] object-cover"
                src={detail.bundle.image}
              />
              <div className="grid content-center gap-2">
                <p className="text-[22px] font-medium tracking-[-0.04em] text-[#111]">
                  {detail.bundle.title}
                </p>
                <div className="flex items-center gap-2 text-[15px]">
                  <span className="font-medium text-[#111]">{detail.bundle.price}</span>
                  {detail.bundle.compareAt ? (
                    <span className="text-black/40 line-through">
                      {detail.bundle.compareAt}
                    </span>
                  ) : null}
                </div>
                <p className="text-[14px] leading-6 text-black/56">
                  Bundle cards are separated from the core product payload so
                  you can wire merchandising bundles from your API later.
                </p>
              </div>
              <div className="flex items-center md:justify-end">
                <span className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--shop-brand)] px-5 text-[15px] font-medium text-white shadow-[0_12px_24px_rgba(84,51,235,0.2)]">
                  View bundle
                </span>
              </div>
            </Link>
          </section>
        ) : null}

        <section className="grid gap-5 rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[32px] font-medium tracking-[-0.04em] text-[#111]">
                Reviews
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[44px] font-medium leading-none text-[#111]">
                  {reviewAverage}
                </span>
                <div className="grid gap-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        className={cn(
                          "h-4 w-4",
                          index + 1 <= Math.round(Number(reviewAverage))
                            ? "fill-current text-[#f4b63d]"
                            : "text-black/12",
                        )}
                        key={`review-average-${index}`}
                      />
                    ))}
                  </div>
                  <p className="text-[14px] text-black/52">
                    Based on {displayedReviewCount} ratings
                  </p>
                </div>
              </div>
            </div>
            <button
              className={shopButtonClass({
                className: "shadow-[0_10px_22px_rgba(15,23,42,0.04)]",
                size: "sm",
                variant: "soft",
              })}
              onClick={openReviewComposer}
              type="button"
            >
              Write a review
            </button>
          </div>

          {reviewSubmitState === "submitted" ? (
            <div className="rounded-[20px] border border-[#d9d4ff] bg-[#f6f3ff] px-4 py-3 text-[14px] text-[#4b2fcb]">
              Review saved locally. You can wire this form to your API later without
              changing the UI flow.
            </div>
          ) : null}

          {reviews.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {reviews.map((review) => (
                <article
                  className="rounded-[24px] border border-black/4 bg-[#fafafb] p-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_28px_rgba(15,23,42,0.08)]"
                  key={`${review.author}-${review.title}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[15px] font-medium text-[#111]">{review.author}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          className={cn(
                            "h-3.5 w-3.5",
                            index + 1 <= Math.round(review.rating)
                              ? "fill-current text-[#f4b63d]"
                              : "text-black/12",
                          )}
                          key={`${review.author}-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-[17px] font-medium text-[#111]">
                    {review.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-black/58">
                    {review.body}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-[#fafafb] px-5 py-8 text-center text-[15px] text-black/54">
              No reviews yet. Open the composer and add the first one to validate the
              UI flow before wiring your backend.
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] font-medium tracking-[-0.04em] text-[#111]">
              More from {detail.merchant.name}
            </h2>
            <Link
              className="text-[14px] text-black/52 transition hover:text-black"
              search={{ q: "" }}
              to="/categories"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {detail.recommendations.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        {detail.relatedMerchants?.length ? (
          <section className="grid gap-4">
            <h2 className="text-[32px] font-medium tracking-[-0.04em] text-[#111]">
              Related to {detail.merchant.name}
            </h2>
            <div className="grid gap-4 xl:grid-cols-3">
              {detail.relatedMerchants.map((merchant) => (
                <Link
                  className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
                  key={merchant.slug}
                  params={{ slug: merchant.slug }}
                  to="/m/$slug"
                >
                  <img
                    alt={merchant.name}
                    className="aspect-[16/10] w-full object-cover"
                    src={merchant.image}
                  />
                  <div className="p-5">
                    <p className="text-[24px] font-medium tracking-[-0.04em] text-[#111]">
                      {merchant.name}
                    </p>
                    <p className="mt-2 text-[14px] text-black/52">
                      {merchant.rating} ({merchant.reviews})
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[rgba(247,247,250,0.86)] p-4 backdrop-blur-xl md:p-10"
          onClick={closeLightbox}
          role="dialog"
        >
          <div className="mx-auto flex h-full max-w-[1800px] items-center justify-center">
            <div
              className="relative grid w-full gap-4 rounded-[36px] border border-black/5 bg-[rgba(255,255,255,0.98)] p-4 shadow-[0_34px_90px_rgba(15,23,42,0.14)] md:grid-cols-[48px_minmax(0,1fr)] md:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="hidden max-h-[82vh] content-start gap-2.5 overflow-auto pr-1 md:grid">
                {detail.gallery.map((image, index) => (
                  <button
                    aria-label={`Preview image ${index + 1}`}
                    aria-pressed={index === selectedImage}
                    className={cn(
                      "overflow-hidden rounded-[12px] border bg-white p-0.5 transition duration-300",
                      index === selectedImage
                        ? "border-black/18 shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                        : "border-transparent hover:border-black/10 hover:shadow-[0_10px_18px_rgba(15,23,42,0.05)]",
                    )}
                    key={`${image}-modal-${index}`}
                    onClick={() =>
                      selectGalleryImage(index, index > selectedImage ? "next" : "prev")
                    }
                    type="button"
                  >
                    <img
                      alt={`${detail.title} enlarged preview ${index + 1}`}
                      className="aspect-square w-full rounded-[12px] object-cover"
                      src={image}
                    />
                  </button>
                ))}
              </div>

              <div className="relative min-h-[82vh] min-w-0 overflow-hidden rounded-[28px] bg-[#fcfcfc]">
                <button
                  aria-label="Close gallery"
                  className="absolute right-5 top-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_14px_30px_rgba(15,23,42,0.1)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_18px_34px_rgba(15,23,42,0.12)]"
                  onClick={closeLightbox}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>

                <div
                  aria-label={isLightboxZoomed ? "Zoom out image" : "Zoom in image"}
                  className={cn(
                    "flex h-full min-h-[82vh] items-center justify-center overflow-auto p-4 md:p-8 lg:p-10",
                    isLightboxZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
                  )}
                  onClick={() => setIsLightboxZoomed((current) => !current)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setIsLightboxZoomed((current) => !current);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center transition-transform duration-300 ease-out",
                      isLightboxZoomed ? "scale-[1.9]" : "scale-100",
                    )}
                  >
                    <img
                      alt={detail.title}
                      className={cn(
                        "shop-gallery-image max-h-[72vh] max-w-[min(78vw,1120px)] object-contain",
                        galleryMotion === "next"
                          ? "shop-gallery-image-next"
                          : "shop-gallery-image-prev",
                      )}
                      key={`${detail.productId}-${selectedImage}-lightbox`}
                      src={activeImage}
                    />
                  </div>
                </div>

                {detail.gallery.length > 1 ? (
                  <div className="absolute bottom-5 right-5 z-30 flex items-center gap-3">
                    <button
                      aria-label="Previous image"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:scale-[1.02]"
                      onClick={() => shiftGalleryImage("prev")}
                      type="button"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Next image"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:scale-[1.02]"
                      onClick={() => shiftGalleryImage("next")}
                      type="button"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isReviewComposerOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/48 p-4 backdrop-blur-sm"
          onClick={() => setIsReviewComposerOpen(false)}
          role="dialog"
        >
          <div className="mx-auto flex min-h-full max-w-[640px] items-center justify-center">
            <form
              className="w-full rounded-[32px] border border-black/8 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.24)] md:p-6"
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleReviewSubmit}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[30px] font-medium tracking-[-0.04em] text-[#111]">
                    Write a review
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-black/54">
                    This form already works in the frontend. Once your review API is
                    ready, you only need to replace the submit handler.
                  </p>
                </div>
                <button
                  aria-label="Close review form"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-[#fafafa] transition hover:bg-[#f2f2f4]"
                  onClick={() => setIsReviewComposerOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 text-[14px] font-medium text-[#111]">
                  Your name
                  <input
                    className="h-12 rounded-[18px] border border-black/8 bg-[#fafafb] px-4 text-[15px] outline-none"
                    name="author"
                    onChange={(event) =>
                      setReviewDraft((current) => ({
                        ...current,
                        author: event.target.value,
                      }))
                    }
                    placeholder="Enter a display name"
                    required
                    value={reviewDraft.author}
                  />
                </label>

                <div className="grid gap-2 text-[14px] font-medium text-[#111]">
                  Rating
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const rating = index + 1;
                      const active = rating === reviewDraft.rating;

                      return (
                        <button
                          aria-pressed={active}
                          className={cn(
                            "inline-flex h-11 min-w-[52px] items-center justify-center gap-1 rounded-full border px-3 text-[14px] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition duration-300",
                            active
                              ? "border-black/18 bg-[#f7f4ff] text-[#111] ring-2 ring-[rgba(84,51,235,0.12)]"
                              : "border-black/8 bg-white text-[#111] hover:-translate-y-0.5 hover:border-black/16 hover:bg-[#fbfbfc]",
                          )}
                          key={`review-rating-${rating}`}
                          onClick={() =>
                            setReviewDraft((current) => ({ ...current, rating }))
                          }
                          type="button"
                        >
                          <Star className={cn("h-3.5 w-3.5", active && "fill-current")} />
                          {rating}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="grid gap-2 text-[14px] font-medium text-[#111]">
                  Review title
                  <input
                    className="h-12 rounded-[18px] border border-black/8 bg-[#fafafb] px-4 text-[15px] outline-none"
                    name="title"
                    onChange={(event) =>
                      setReviewDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Headline for your review"
                    required
                    value={reviewDraft.title}
                  />
                </label>

                <label className="grid gap-2 text-[14px] font-medium text-[#111]">
                  Review
                  <textarea
                    className="min-h-[148px] rounded-[22px] border border-black/8 bg-[#fafafb] px-4 py-3 text-[15px] leading-6 outline-none"
                    name="body"
                    onChange={(event) =>
                      setReviewDraft((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    placeholder="Write what worked well, where it could improve, and who it is best for."
                    required
                    value={reviewDraft.body}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  className={shopButtonClass({
                    size: "md",
                    variant: "soft",
                  })}
                  onClick={() => setIsReviewComposerOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={shopButtonClass({
                    size: "md",
                    variant: "brand",
                  })}
                  type="submit"
                >
                  Submit review
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </PageFrame>
  );
}
