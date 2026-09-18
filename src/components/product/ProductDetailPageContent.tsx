"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductByIdentifier } from "@/services/product.service";
import { getCategoryProducts } from "@/services/category.service";
import { adaptApiProduct, adaptApiProducts } from "@/utils/product.adapter";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge, Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import {
  FaCartShopping,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaBox,
  FaBarcode,
  FaCheck,
  FaIndustry,
  FaBoxOpen,
  FaTruckFast,
  FaGift,
  FaFire,
} from "react-icons/fa6";

interface ProductDetailPageContentProps {
  slug: string;
}

export function ProductDetailPageContent({ slug }: ProductDetailPageContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, updateQuantity, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  // Find if current product is already in the cart
  const cartItem = product
    ? items.find(
        (i) =>
          (product.id && i.product.id === product.id) ||
          i.product.slug === product.slug ||
          i.product.slug === slug
      )
    : null;
  const inCart = Boolean(cartItem);
  const cartQty = cartItem?.quantity ?? 0;

  // When returning to product page, initialize quantity to what is already in the cart
  useEffect(() => {
    if (cartQty > 0) {
      setQty(cartQty);
    }
  }, [cartQty]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function loadProduct() {
      try {
        // Attempt fetch from live Products API (supports slug or MongoDB id)
        const apiProd = await getProductByIdentifier(slug);
        if (!mounted) return;

        if (apiProd) {
          const adapted = adaptApiProduct(apiProd);
          setProduct(adapted);

          // Fetch related products in the same category
          try {
            const catIdentifier = apiProd.category?.slug || apiProd.categoryId;
            if (catIdentifier) {
              const catProds = await getCategoryProducts(catIdentifier);
              if (mounted && catProds?.length) {
                const adaptedRelated = adaptApiProducts(catProds).filter(
                  (p) => p.slug !== adapted.slug
                );
                setRelated(adaptedRelated.slice(0, 8));
              }
            }
          } catch {
            setRelated([]);
          }
          return;
        } else {
          if (mounted) setError("Product not found");
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load product");
        }
      }
    }

    loadProduct().finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [slug]);

  async function handleAddToCart() {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      if (inCart) {
        if (qty !== cartQty) {
          await updateQuantity(product.id || product.slug, qty);
          showToast(`Updated "${product.name}" quantity to ${qty} in cart!`, "cart");
        } else {
          showToast(`"${product.name}" is already in your cart (${cartQty})`, "cart");
        }
      } else {
        await addToCart(product, qty);
        showToast(`Added ${qty} × "${product.name}" to cart!`, "cart");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update cart";
      showToast(msg, "error");
    } finally {
      setIsAdding(false);
    }
  }

  // ─── Loading Skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="bg-warm-white min-h-screen">
        <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 py-8 animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 bg-zinc-200 rounded mb-6" />

          {/* Product main skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="h-80 md:h-96 bg-zinc-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-6 w-24 bg-zinc-200 rounded-full" />
              <div className="h-4 w-32 bg-zinc-200 rounded" />
              <div className="h-8 w-3/4 bg-zinc-200 rounded" />
              <div className="h-4 w-28 bg-zinc-200 rounded" />
              <div className="h-24 bg-zinc-200 rounded-2xl" />
              <div className="h-12 w-full bg-zinc-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Not Found / Error State ─────────────────────────────────────────────────
  if (error || !product) {
    return (
      <main className="bg-warm-white min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-crimson/10 text-crimson rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            <FaFire />
          </div>
          <h1 className="text-2xl font-bold font-display text-zinc-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            The product you are looking for might have been moved or is currently unavailable.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/shop"
              className="px-6 py-3 bg-crimson text-white font-bold rounded-xl text-sm hover:bg-crimson-dark shadow-sm transition-all"
            >
              Browse All Fireworks
            </Link>
            <Link
              href="/categories"
              className="px-6 py-3 bg-zinc-100 text-zinc-800 font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
            >
              View Categories
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const wishlisted = isWishlisted(product.slug);

  return (
    <>
      <main className="bg-warm-white min-h-screen">
        <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-crimson">
              Home
            </Link>
            <span>›</span>
            <Link href="/shop" className="hover:text-crimson">
              Shop
            </Link>
            <span>›</span>
            <Link
              href={`/categories/${product.category_slug}`}
              className="hover:text-crimson"
            >
              {product.category_name}
            </Link>
            <span>›</span>
            <span className="text-zinc-600 font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>

          {/* Product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm">
              <ProductImage
                productName={product.name}
                categoryName={product.category_name}
                sku={product.sku}
                aspectRatio="1/1"
                size="detail"
                imageUrl={product.images?.[0]}
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <DiscountBadge percent={product.discount_percent} />
                {product.is_new_arrival && <Badge variant="new" />}
                {product.is_trending && <Badge variant="trending" />}
                {product.is_best_seller && <Badge variant="bestseller" />}
              </div>

              {/* Category */}
              <p className="text-xs font-bold text-crimson uppercase tracking-widest">
                {product.category_name}
              </p>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <StarRating
                rating={product.rating}
                count={product.reviews_count}
                size="md"
              />

              {/* Price */}
              <div className="bg-zinc-50 rounded-2xl p-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-zinc-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                </div>
                <p className="text-sm text-emerald-600 font-bold flex items-center gap-1.5">
                  <FaGift className="text-base" /> You save {formatPrice(product.savings)} (
                  {product.discount_percent}% off)
                </p>
              </div>

              {/* Pack info */}
              <div className="flex items-center gap-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <FaBox className="text-zinc-400" /> Per {product.unit}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaBarcode className="text-zinc-400" /> SKU: {product.sku}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-emerald-500" /> In Stock
                </span>
              </div>

              {/* Already in Cart Mention Banner */}
              {inCart && (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200/90 rounded-2xl">
                  <div className="flex items-center gap-2.5 text-emerald-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                      <FaCheck />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Already in your Cart!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Current quantity: <strong className="font-bold text-emerald-900">{cartQty} {cartQty === 1 ? "unit" : "units"}</strong>
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/cart"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline px-2 py-1"
                  >
                    View Cart →
                  </Link>
                </div>
              )}

              {/* Qty + Add to Cart */}
              <div className="flex gap-3 items-center">
                <QuantitySelector value={qty} onChange={setQty} size="md" />
                {inCart && qty !== cartQty && (
                  <span className="text-xs text-amber-600 font-medium">
                    (Press button below to update to {qty})
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-4 font-bold rounded-2xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed ${
                    inCart && qty === cartQty
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                      : "bg-crimson text-white hover:bg-[#991B1B] shadow-[0_4px_20px_rgba(185,28,28,0.35)]"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{inCart ? "UPDATING..." : "ADDING..."}</span>
                    </>
                  ) : inCart ? (
                    qty !== cartQty ? (
                      <>
                        <FaCartShopping /> UPDATE CART ({qty})
                      </>
                    ) : (
                      <>
                        <FaCheck /> IN CART ({cartQty})
                      </>
                    )
                  ) : (
                    <>
                      <FaCartShopping /> ADD TO CART
                    </>
                  )}
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all text-sm text-center flex items-center justify-center gap-2"
                >
                  <FaBolt className="text-amber-400" /> BUY NOW
                </Link>
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(
                      wishlisted ? "Removed from wishlist" : "Added to wishlist!",
                      "wishlist"
                    );
                  }}
                  className={`w-14 rounded-2xl flex items-center justify-center text-xl border-2 transition-all cursor-pointer ${
                    wishlisted
                      ? "bg-pink-50 border-pink-300 text-pink-500"
                      : "border-zinc-200 text-zinc-400 hover:text-crimson"
                  }`}
                >
                  {wishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Trust micro */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: FaIndustry, text: "Factory Direct" },
                  { icon: FaBoxOpen, text: "Safe Packaging" },
                  { icon: FaTruckFast, text: "Fast Delivery" },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.text}
                      className="flex flex-col items-center gap-1.5 bg-zinc-50 rounded-xl py-3 text-center"
                    >
                      <Icon className="text-lg text-crimson" />
                      <p className="text-[10px] text-zinc-500 font-semibold">
                        {t.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Info sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "Product Highlights",
                items: [
                  "Genuine Sivakasi manufactured product",
                  `Pack unit: ${product.unit}`,
                  "Meets all safety standards",
                  "Vibrant colours and/or loud sound effects",
                  "Suitable for all outdoor celebrations",
                ],
              },
              {
                title: "Safety Information",
                items: [
                  "Use only in open outdoor spaces",
                  "Keep away from children under 12",
                  "Do not hold in hand after lighting",
                  "Keep water bucket nearby",
                  "Store in a cool, dry place",
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-2xl p-5 border border-zinc-100"
              >
                <h2 className="text-base font-bold text-zinc-900 mb-3">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <FaCheck className="text-crimson text-xs mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <ProductCarousel
                products={related}
                title="More from This Category"
                viewAllHref={`/categories/${product.category_slug}`}
              />
            </div>
          )}
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden bg-white border-t border-zinc-200 px-4 py-3 flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex-1 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed ${
            inCart && qty === cartQty
              ? "bg-emerald-600 text-white"
              : "bg-crimson text-white"
          }`}
        >
          {isAdding ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{inCart ? "Updating..." : "Adding..."}</span>
            </>
          ) : inCart ? (
            qty !== cartQty ? (
              <>
                <FaCartShopping /> Update ({qty})
              </>
            ) : (
              <>
                <FaCheck /> In Cart ({cartQty})
              </>
            )
          ) : (
            <>
              <FaCartShopping /> Add to Cart
            </>
          )}
        </button>
        <Link
          href="/checkout"
          className="flex-1 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          <FaBolt className="text-amber-400" /> Buy Now
        </Link>
      </div>
    </>
  );
}
