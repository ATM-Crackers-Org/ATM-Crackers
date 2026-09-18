"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { IoClose } from "react-icons/io5";
import { FaCartShopping, FaHeart, FaRegHeart, FaArrowRight, FaCheck } from "react-icons/fa6";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const { addToCart, updateQuantity, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const cartItem = items.find(
    (i) =>
      (product.id && i.product.id === product.id) ||
      i.product.slug === product.slug
  );
  const inCart = Boolean(cartItem);
  const cartQty = cartItem?.quantity ?? 0;

  // Sync quantity if product is already in cart
  useEffect(() => {
    if (cartQty > 0) {
      setQty(cartQty);
    }
  }, [cartQty]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const wishlisted = isWishlisted(product.slug);

  async function handleAddToCart() {
    if (isAdding) return;
    setIsAdding(true);
    try {
      if (inCart) {
        if (qty !== cartQty) {
          await updateQuantity(product.id || product.slug, qty);
          showToast(`Updated "${product.name}" to ${qty} in cart!`, "cart");
        } else {
          showToast(`"${product.name}" is already in your cart (${cartQty})`, "cart");
        }
      } else {
        await addToCart(product, qty);
        showToast(`${product.name} added to cart!`, "cart");
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update cart";
      showToast(msg, "error");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer text-lg"
          aria-label="Close"
        >
          <IoClose />
        </button>

        {/* Image */}
        <div className="rounded-t-3xl overflow-hidden">
          <ProductImage
            productName={product.name}
            categoryName={product.category_name}
            sku={product.sku}
            aspectRatio="4/3"
            size="detail"
            imageUrl={product.images?.[0]}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-crimson font-bold uppercase tracking-widest mb-1">
            {product.category_name}
          </p>
          <h2 className="text-xl font-display font-bold text-zinc-900 mb-2">
            {product.name}
          </h2>
          <StarRating
            rating={product.rating}
            count={product.reviews_count}
            size="md"
            className="mb-4"
          />

          {/* Discount */}
          <div className="flex items-center gap-2 mb-1">
            <DiscountBadge percent={product.discount_percent} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-zinc-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-base text-zinc-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          </div>
          <p className="text-sm text-emerald-600 font-semibold mb-4">
            You save {formatPrice(product.savings)}
          </p>

          <p className="text-xs text-zinc-500 mb-3">Per {product.unit} · SKU: {product.sku}</p>

          {/* Already in Cart Notice */}
          {inCart && (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200/90 rounded-xl mb-3">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <FaCheck className="text-emerald-600 text-xs" />
                <span>
                  Already in Cart: <strong className="font-bold text-emerald-900">{cartQty} {cartQty === 1 ? "unit" : "units"}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Qty + Actions */}
          <div className="flex gap-3 mb-4">
            <QuantitySelector value={qty} onChange={setQty} size="md" />
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-3 text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                inCart && qty === cartQty
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                  : "bg-crimson hover:bg-[#991B1B] shadow-[0_4px_16px_rgba(185,28,28,0.35)]"
              }`}
            >
              {isAdding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{inCart ? "Updating..." : "Adding..."}</span>
                </>
              ) : inCart ? (
                qty !== cartQty ? (
                  <>
                    <FaCartShopping /> Update Cart ({qty})
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
            <button
              onClick={() => {
                toggleWishlist(product);
                showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", "wishlist");
              }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg border transition-all cursor-pointer ${wishlisted
                ? "bg-pink-50 border-pink-200 text-pink-500"
                : "border-zinc-200 text-zinc-400 hover:border-pink-200 hover:text-pink-500"
                }`}
            >
              {wishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-2 text-center text-sm text-crimson font-semibold hover:underline"
          >
            <span>View Full Details</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}
