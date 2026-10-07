"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectItemQuantity,
  selectCartTotal,
  selectCartCount,
  selectCartSummary,
} from "@/store/slices/cartSlice";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { FaPlus, FaMinus, FaEye, FaArrowRight } from "react-icons/fa6";
import { FaShoppingBag, FaFire } from "react-icons/fa";

interface ProductTableRowProps {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
}

const ProductTableRow = React.memo(function ProductTableRow({
  product,
  index,
  onQuickView,
}: ProductTableRowProps) {
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const cartQty = useAppSelector(selectItemQuantity(product.id || product.slug));
  const hasQty = cartQty > 0;
  const lineTotal = product.price * cartQty;

  const [isEditing, setIsEditing] = useState(false);
  const [tempQty, setTempQty] = useState("");

  function handleIncrement() {
    if (cartQty === 0) {
      addToCart(product, 1);
      showToast(`Added "${product.name}" to cart`, "cart");
    } else {
      updateQuantity(product.id || product.slug, cartQty + 1);
    }
  }

  function handleDecrement() {
    if (cartQty <= 1) {
      removeFromCart(product.id || product.slug);
      showToast(`Removed "${product.name}" from cart`, "cart");
    } else {
      updateQuantity(product.id || product.slug, cartQty - 1);
    }
  }

  const [imgError, setImgError] = useState(false);
  const rawImg = product.images && product.images.length > 0 ? product.images[0] : "";
  const hasValidImage = Boolean(rawImg && !imgError && !rawImg.includes("placehold.co"));
  const thumbUrl = hasValidImage ? rawImg : "/images/logo.png";

  return (
    <tr
      className={`border-b border-zinc-100 transition-colors ${
        hasQty ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-zinc-50/70"
      }`}
    >
      {/* S.No */}
      <td className="py-2.5 px-3 text-center text-xs font-semibold text-zinc-400">
        {index + 1}
      </td>

      {/* Product Image & Details */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onQuickView(product)}
            className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 relative border border-zinc-200/80 cursor-pointer group flex items-center justify-center ${
              hasValidImage ? "bg-zinc-100" : "bg-zinc-950 p-1"
            }`}
            title={`Quick view - ${product.name}`}
          >
            <Image
              src={thumbUrl}
              alt={product.name}
              fill
              sizes="48px"
              unoptimized
              onError={() => setImgError(true)}
              className={`transition-transform duration-300 group-hover:scale-105 ${
                hasValidImage ? "object-cover" : "object-contain p-1"
              }`}
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
              <FaEye />
            </div>
          </div>

          <div className="min-w-0">
            <Link
              href={`/product/${product.slug}`}
              className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-crimson transition-colors line-clamp-1 leading-snug"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
              <span className="font-medium text-crimson uppercase tracking-wider text-[10px]">
                {product.category_name}
              </span>
              {product.unit && (
                <>
                  <span>•</span>
                  <span>1 {product.unit}</span>
                </>
              )}
              {product.sku && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-zinc-400 font-mono text-[10px]">
                    SKU: {product.sku}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* MRP */}
      <td className="py-2.5 px-3 text-right">
        <span className="text-xs text-zinc-400 line-through">
          {formatPrice(product.mrp)}
        </span>
      </td>

      {/* Discount */}
      <td className="py-2.5 px-3 text-center">
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {product.discount_percent}% OFF
        </span>
      </td>

      {/* Our Rate / Net Price */}
      <td className="py-2.5 px-3 text-right">
        <span className="text-xs sm:text-sm font-extrabold text-crimson">
          {formatPrice(product.price)}
        </span>
      </td>

      {/* Quantity Control (+ / Box / -) */}
      <td className="py-2.5 px-3 text-center">
        <div className="inline-flex items-center justify-center gap-1 bg-white border border-zinc-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={cartQty === 0}
            className="w-7 h-7 rounded-lg bg-zinc-50 hover:bg-red-50 text-zinc-600 hover:text-crimson flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            aria-label="Decrease quantity"
            title="Decrease"
          >
            <FaMinus className="text-[9px]" />
          </button>

          <input
            type="number"
            min="0"
            max="999"
            value={isEditing ? tempQty : cartQty === 0 ? "" : cartQty}
            placeholder="0"
            onFocus={(e) => {
              setIsEditing(true);
              setTempQty(cartQty > 0 ? cartQty.toString() : "");
              e.target.select();
            }}
            onBlur={() => {
              setIsEditing(false);
              if (tempQty === "" || parseInt(tempQty, 10) <= 0) {
                if (cartQty > 0) removeFromCart(product.id || product.slug);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              setTempQty(val);
              const parsed = parseInt(val, 10);
              if (!isNaN(parsed) && parsed > 0) {
                if (cartQty === 0) {
                  addToCart(product, parsed);
                } else {
                  updateQuantity(product.id || product.slug, parsed);
                }
              } else if (val === "0" && cartQty > 0) {
                removeFromCart(product.id || product.slug);
              }
            }}
            className={`w-12 h-7 text-center text-xs sm:text-sm font-extrabold bg-white border rounded-lg outline-none transition-all ${
              hasQty
                ? "text-crimson font-black border-crimson/50 shadow-2xs focus:ring-1 focus:ring-crimson"
                : "text-zinc-500 font-medium border-zinc-200 hover:border-zinc-300 focus:border-crimson focus:ring-1 focus:ring-crimson"
            }`}
            aria-label="Quantity"
            title="Type quantity directly"
          />

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 rounded-lg bg-crimson hover:bg-[#991B1B] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Increase quantity"
            title="Increase"
          >
            <FaPlus className="text-[9px]" />
          </button>
        </div>
      </td>

      {/* Total Amount */}
      <td className="py-2.5 px-4 text-right">
        <span
          className={`text-xs sm:text-sm font-extrabold ${
            hasQty ? "text-emerald-700" : "text-zinc-300"
          }`}
        >
          {hasQty ? formatPrice(lineTotal) : "₹0"}
        </span>
      </td>
    </tr>
  );
});

interface ProductTableViewProps {
  products: Product[];
  categoryGroups?: {
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    products: Product[];
  }[];
  isGrouped?: boolean;
}

export function ProductTableView({
  products,
  categoryGroups,
  isGrouped = false,
}: ProductTableViewProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);
  const cartSummary = useAppSelector(selectCartSummary);

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-3">Product Name & Category</th>
                <th className="py-3 px-3 text-right w-24">MRP</th>
                <th className="py-3 px-3 text-center w-24">Discount</th>
                <th className="py-3 px-3 text-right w-28">Our Rate</th>
                <th className="py-3 px-3 text-center w-36">Quantity</th>
                <th className="py-3 px-4 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {isGrouped && categoryGroups && categoryGroups.length > 0 ? (
                categoryGroups.map((group) => (
                  <React.Fragment key={group.categoryId}>
                    {/* Category Divider Header */}
                    <tr className="bg-gradient-to-r from-red-50/80 via-amber-50/50 to-white border-y border-red-100">
                      <td colSpan={7} className="py-2 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-crimson" />
                            <span className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wide">
                              {group.categoryName}
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-500 bg-white border border-red-200 px-2 py-0.5 rounded-full">
                              {group.products.length} {group.products.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                          <Link
                            href={`/categories/${group.categorySlug}`}
                            className="text-[11px] font-bold text-crimson hover:underline"
                          >
                            Explore &rarr;
                          </Link>
                        </div>
                      </td>
                    </tr>
                    {/* Category Products */}
                    {group.products.map((p, idx) => (
                      <ProductTableRow
                        key={p.slug}
                        product={p}
                        index={idx}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </React.Fragment>
                ))
              ) : (
                products.map((p, idx) => (
                  <ProductTableRow
                    key={p.slug}
                    product={p}
                    index={idx}
                    onQuickView={setQuickViewProduct}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Quick Order Summary Bar when user has items selected */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-40 max-w-lg md:w-[480px] bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crimson flex items-center justify-center text-white shrink-0 shadow-md">
              <FaShoppingBag className="text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-300">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"} in Cart
                </span>
                {cartSummary?.totalDiscount ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                    <FaFire className="text-[8px]" /> Save {formatPrice(cartSummary.totalDiscount)}
                  </span>
                ) : null}
              </div>
              <p className="text-base font-black text-amber-300 tracking-tight leading-none mt-0.5">
                Total: {formatPrice(cartTotal)}
              </p>
            </div>
          </div>

          <Link
            href="/cart"
            className="px-4 py-2.5 bg-crimson hover:bg-[#991B1B] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <span>View Cart</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
