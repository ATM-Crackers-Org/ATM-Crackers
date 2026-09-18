"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge, Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { FaHeart, FaEye } from "react-icons/fa";
import { FaRegHeart, FaPlus, FaMinus } from "react-icons/fa6";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [actionType, setActionType] = useState<"add" | "inc" | "dec" | null>(null);
  const { addToCart, updateQuantity, removeFromCart, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(product.slug);
  const cartItem = items.find(
    (i) =>
      (product.id && i.product.id === product.id) ||
      i.product.slug === product.slug
  );
  const inCart = Boolean(cartItem);
  const cartQty = cartItem?.quantity ?? 0;

  async function handleInitialAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (actionType) return;

    setActionType("add");
    try {
      await addToCart(product, 1);
      showToast(`Added "${product.name}" to cart!`, "cart");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add to cart";
      showToast(msg, "error");
    } finally {
      setActionType(null);
    }
  }

  async function handleIncrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (actionType) return;

    setActionType("inc");
    try {
      await updateQuantity(product.id || product.slug, cartQty + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update quantity";
      showToast(msg, "error");
    } finally {
      setActionType(null);
    }
  }

  async function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (actionType) return;

    setActionType("dec");
    try {
      const nextQty = cartQty - 1;
      if (nextQty <= 0) {
        await removeFromCart(product.id || product.slug);
        showToast(`Removed "${product.name}" from cart`, "cart");
      } else {
        await updateQuantity(product.id || product.slug, nextQty);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update quantity";
      showToast(msg, "error");
    } finally {
      setActionType(null);
    }
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      wishlisted ? `Removed "${product.name}" from wishlist` : `Added "${product.name}" to wishlist!`,
      "wishlist"
    );
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  }

  return (
    <div className="product-card group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm transition-all duration-200">
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
        <ProductImage
          productName={product.name}
          categoryName={product.category_name}
          sku={product.sku}
          size="card"
          imageUrl={product.images?.[0]}
          className="transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <DiscountBadge percent={product.discount_percent} />
          {product.is_best_seller && (
            <Badge variant="bestseller" />
          )}
          {product.is_new_arrival && (
            <Badge variant="new" />
          )}
          {product.is_trending && !product.is_best_seller && (
            <Badge variant="hot" />
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm z-10 transition-all cursor-pointer ${wishlisted
              ? "bg-pink-500 text-white"
              : "bg-white/90 text-zinc-400 hover:text-pink-500 hover:bg-white"
            }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="text-xs">{wishlisted ? <FaHeart /> : <FaRegHeart />}</span>
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-2 right-2 bg-white/95 text-zinc-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white cursor-pointer inline-flex items-center gap-1"
        >
          <FaEye className="text-[10px]" />
          <span>Quick View</span>
        </button>
      </Link>

      {/* Info Body */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <p className="text-[10px] text-crimson font-bold uppercase tracking-wider mb-0.5 line-clamp-1">
            {product.category_name}
          </p>

          {/* Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1 hover:text-crimson transition-colors leading-snug mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            count={product.reviews_count}
            size="sm"
            className="mb-1.5"
          />

          {/* Price Strip */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-sm sm:text-base font-bold text-zinc-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] text-zinc-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mb-2.5">
            Save {formatPrice(product.savings)} ({product.discount_percent}% OFF)
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-zinc-50">
          {!inCart ? (
            <button
              onClick={handleInitialAdd}
              disabled={actionType !== null}
              className="w-full h-9 px-3 text-xs sm:text-sm font-bold rounded-xl bg-crimson text-white hover:bg-[#991B1B] active:scale-[0.98] shadow-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {actionType === "add" ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-[11px]" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between w-full h-9 bg-red-50/90 border border-crimson/25 rounded-xl px-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={actionType !== null}
                className="w-7 h-7 rounded-lg bg-white text-crimson hover:bg-crimson hover:text-white border border-red-100 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title={cartQty === 1 ? "Remove from cart" : "Decrease quantity"}
                aria-label="Decrease quantity"
              >
                {actionType === "dec" ? (
                  <span className="w-2.5 h-2.5 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaMinus className="text-[9px]" />
                )}
              </button>

              <span className="text-xs sm:text-sm font-extrabold text-crimson px-2 select-none">
                {cartQty}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={actionType !== null}
                className="w-7 h-7 rounded-lg bg-crimson text-white hover:bg-[#991B1B] flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                {actionType === "inc" ? (
                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaPlus className="text-[9px]" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
