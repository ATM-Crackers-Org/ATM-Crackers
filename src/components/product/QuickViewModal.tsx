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

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

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

  const wishlisted = isWishlisted(product.slug);

  function handleAddToCart() {
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, "cart");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
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
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image */}
        <div className="rounded-t-3xl overflow-hidden">
          <ProductImage
            productName={product.name}
            categoryName={product.category_name}
            sku={product.sku}
            aspectRatio="4/3"
            size="detail"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-[#B91C1C] font-bold uppercase tracking-widest mb-1">
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

          <p className="text-xs text-zinc-500 mb-4">Per {product.unit} · SKU: {product.sku}</p>

          {/* Qty + Actions */}
          <div className="flex gap-3 mb-4">
            <QuantitySelector value={qty} onChange={setQty} size="md" />
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-[#B91C1C] text-white text-sm font-bold rounded-2xl hover:bg-[#991B1B] shadow-[0_4px_16px_rgba(185,28,28,0.35)] transition-all"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => {
                toggleWishlist(product);
                showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", "wishlist");
              }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all ${
                wishlisted
                  ? "bg-pink-50 border-pink-200 text-pink-500"
                  : "border-zinc-200 text-zinc-400 hover:border-pink-200 hover:text-pink-500"
              }`}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="block text-center text-sm text-[#B91C1C] font-semibold hover:underline"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
