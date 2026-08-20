"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge, Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(product.slug);
  const inCart = isInCart(product.slug);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, "cart");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist!",
      "wishlist"
    );
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }

  return (
    <div className="product-card group relative bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col justify-between">
      {/* Image Area */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
        <ProductImage
          productName={product.name}
          categoryName={product.category_name}
          sku={product.sku}
          size="card"
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <DiscountBadge percent={product.discount_percent} />
          {product.is_new_arrival && (
            <Badge variant="new" label="NEW" />
          )}
          {product.is_trending && !product.is_new_arrival && (
            <Badge variant="hot" label="🔥 HOT" />
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm z-10 transition-all ${
            wishlisted
              ? "bg-pink-500 text-white"
              : "bg-white/90 text-zinc-400 hover:text-pink-500 hover:bg-white"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="text-xs">{wishlisted ? "♥" : "♡"}</span>
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-2 right-2 bg-white/95 text-zinc-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
        >
          👁 Quick View
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
        <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-50">
          <QuantitySelector value={qty} onChange={setQty} size="sm" />
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              inCart
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-crimson text-white hover:bg-crimson-dark shadow-sm"
            }`}
          >
            {inCart ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
