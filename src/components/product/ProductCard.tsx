"use client";

import React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge, Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useFlyRocket } from "@/context/FlyRocketContext";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useAppSelector } from "@/store/hooks";
import { selectItemQuantity } from "@/store/slices/cartSlice";
import { FaHeart, FaEye } from "react-icons/fa";
import { FaRegHeart, FaPlus, FaMinus } from "react-icons/fa6";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onQuickView,
}: ProductCardProps) {
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const { triggerFlyRocket } = useFlyRocket();

  const wishlisted = isWishlisted(product.slug);
  const cartQty = useAppSelector(selectItemQuantity(product.id || product.slug));
  const inCart = cartQty > 0;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempQty, setTempQty] = React.useState("");

  function handleInitialAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Launch festive rocket to cart
    if (e.currentTarget) {
      triggerFlyRocket(e.currentTarget as HTMLElement);
    }

    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, "cart");

    // Immediately focus and select quantity input right after first adding
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 60);
  }

  function handleIncrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id || product.slug, cartQty + 1);
  }

  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nextQty = cartQty - 1;
    if (nextQty <= 0) {
      removeFromCart(product.id || product.slug);
      showToast(`Removed "${product.name}" from cart`, "cart");
    } else {
      updateQuantity(product.id || product.slug, nextQty);
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
          type="button"
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
          type="button"
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
              type="button"
              className="w-full h-9 px-3 text-xs sm:text-sm font-bold rounded-xl bg-crimson text-white hover:bg-[#991B1B] active:scale-[0.98] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FaPlus className="text-[11px]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full h-9 bg-red-50/90 border border-crimson/25 rounded-xl px-1">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 rounded-lg bg-white text-crimson hover:bg-crimson hover:text-white border border-red-100 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer active:scale-95 shrink-0"
                title={cartQty === 1 ? "Remove from cart" : "Decrease quantity"}
                aria-label="Decrease quantity"
              >
                <FaMinus className="text-[9px]" />
              </button>

              <div className="flex-1 mx-1.5 flex items-center justify-center">
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  max="999"
                  value={isEditing ? tempQty : cartQty}
                  onFocus={(e) => {
                    setIsEditing(true);
                    setTempQty(cartQty.toString());
                    e.target.select();
                  }}
                  onBlur={() => {
                    setIsEditing(false);
                    if (tempQty === "" || parseInt(tempQty, 10) <= 0) {
                      removeFromCart(product.id || product.slug);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      inputRef.current?.blur();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempQty(val);
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      updateQuantity(product.id || product.slug, parsed);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-[60px] h-7 px-1 text-center text-xs sm:text-sm font-black text-crimson bg-white border border-crimson/40 rounded-lg shadow-2xs outline-none focus:ring-2 focus:ring-crimson focus:border-crimson"
                  aria-label="Quantity"
                  title="Type quantity directly"
                  placeholder="Qty"
                />
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-crimson text-white hover:bg-[#991B1B] flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer active:scale-95 shrink-0"
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <FaPlus className="text-[9px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
