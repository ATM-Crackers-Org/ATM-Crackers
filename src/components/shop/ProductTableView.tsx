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
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
              <FaEye />
            </div>
          </div>

          <div className="min-w-0">
            <Link
              href={`/product/${product.slug}`}
              prefetch={false}
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

const ProductMobileOrderCard = React.memo(function ProductMobileOrderCard({
  product,
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
    <div
      className={`p-3 rounded-2xl border transition-all ${
        hasQty
          ? "bg-amber-50/50 border-amber-200/80 shadow-xs"
          : "bg-white border-zinc-200 shadow-2xs"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Product Image */}
        <div
          onClick={() => onQuickView(product)}
          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 relative border border-zinc-200/80 cursor-pointer group flex items-center justify-center ${
            hasValidImage ? "bg-zinc-100" : "bg-zinc-950 p-1"
          }`}
          title={`Quick view - ${product.name}`}
        >
          <Image
            src={thumbUrl}
            alt={product.name}
            fill
            sizes="56px"
            unoptimized
            onError={() => setImgError(true)}
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
            <FaEye />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold text-crimson uppercase tracking-wider line-clamp-1">
              {product.category_name}
            </span>
            {product.unit && (
              <span className="text-[10px] text-zinc-400 shrink-0">• 1 {product.unit}</span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            prefetch={false}
            className="text-xs font-bold text-zinc-900 hover:text-crimson transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            <span className="text-sm font-black text-crimson">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] text-zinc-400 line-through">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              {product.discount_percent}% OFF
            </span>
          </div>
        </div>
      </div>

      {/* Bottom controls: Qty counter + Line total */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-100">
        <div className="text-xs text-zinc-500">
          Total:{" "}
          <span
            className={`font-black ${
              hasQty ? "text-emerald-700 text-sm" : "text-zinc-400"
            }`}
          >
            {hasQty ? formatPrice(lineTotal) : "₹0"}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 bg-white border border-zinc-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={cartQty === 0}
            className="w-7 h-7 rounded-lg bg-zinc-50 hover:bg-red-50 text-zinc-600 hover:text-crimson flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            aria-label="Decrease quantity"
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
            className={`w-10 h-7 text-center text-xs font-black bg-white border rounded-lg outline-none transition-all ${
              hasQty
                ? "text-crimson font-black border-crimson/50 shadow-2xs"
                : "text-zinc-500 font-medium border-zinc-200"
            }`}
            aria-label="Quantity"
          />

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 rounded-lg bg-crimson hover:bg-[#991B1B] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Increase quantity"
          >
            <FaPlus className="text-[9px]" />
          </button>
        </div>
      </div>
    </div>
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
      {/* Mobile Card-List View (< sm) — No squishing, no horizontal scroll */}
      <div className="sm:hidden space-y-4">
        {isGrouped && categoryGroups && categoryGroups.length > 0 ? (
          categoryGroups.map((group) => (
            <div key={group.categoryId} className="space-y-2">
              <div className="bg-linear-to-r from-red-950 via-zinc-900 to-red-900 text-white px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-crimson" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {group.categoryName}
                  </span>
                  <span className="text-[10px] text-zinc-300">
                    ({group.products.length})
                  </span>
                </div>
                <Link
                  href={`/categories/${group.categorySlug}`}
                  prefetch={false}
                  className="text-[11px] font-bold text-amber-300 hover:text-white transition-colors"
                >
                  Explore &rarr;
                </Link>
              </div>
              <div className="space-y-2">
                {group.products.map((p, idx) => (
                  <ProductMobileOrderCard
                    key={p.slug}
                    product={p}
                    index={idx}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2">
            {products.map((p, idx) => (
              <ProductMobileOrderCard
                key={p.slug}
                product={p}
                index={idx}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop / Tablet Table View (hidden on mobile, visible on sm and above) */}
      <div className="hidden sm:block w-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-170">
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
                    <tr className="bg-linear-to-r from-red-50/80 via-amber-50/50 to-white border-y border-red-100">
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
                            prefetch={false}
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
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-40 max-w-lg md:w-120 bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
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
