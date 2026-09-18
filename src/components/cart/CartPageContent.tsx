"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { getProducts } from "@/services/product.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  FaCartShopping,
  FaArrowRight,
  FaArrowLeft,
  FaTrashCan,
  FaRotateRight,
  FaTruckFast,
} from "react-icons/fa6";

export function CartPageContent() {
  const {
    items,
    total,
    count,
    summary,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  } = useCart();
  const { showToast } = useToast();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted && data) {
          setRecommendations(adaptApiProducts(data).slice(0, 6));
        }
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = summary?.subtotal ?? total;
  const discount =
    summary?.totalDiscount ??
    items.reduce(
      (s, i) => s + Math.max(0, i.product.mrp - i.product.price) * i.quantity,
      0
    );
  const effectiveTotal = summary?.grandTotal ?? total;
  const finalPayable = effectiveTotal;

  // ─── Handlers with API Sync ─────────────────────────────────

  async function handleUpdateQty(productId: string, newQty: number) {
    if (updatingId) return;
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, newQty);
      showToast("Cart updated successfully", "cart");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update quantity";
      showToast(msg, "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || deletingId) return;
    const { id, name } = deleteTarget;
    setDeletingId(id);
    try {
      await removeFromCart(id);
      showToast(`Removed "${name}" from cart`, "cart");
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      showToast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleConfirmClearCart() {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearCart();
      showToast("Cart cleared successfully", "cart");
      setShowClearConfirm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clear cart";
      showToast(msg, "error");
    } finally {
      setIsClearing(false);
    }
  }

  // ─── Loading Skeleton ───────────────────────────────────────
  if (isLoading && items.length === 0) {
    return (
      <main className="bg-warm-white min-h-[70vh] py-8">
        <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-4 w-40 bg-zinc-200 rounded animate-pulse mb-6" />
          <div className="h-8 w-60 bg-zinc-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 items-center animate-pulse"
                >
                  <div className="w-20 h-20 bg-zinc-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-zinc-200 rounded" />
                    <div className="h-4 w-48 bg-zinc-200 rounded" />
                    <div className="h-3 w-20 bg-zinc-200 rounded" />
                  </div>
                  <div className="h-8 w-20 bg-zinc-200 rounded" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-zinc-100 p-5 animate-pulse space-y-4">
                <div className="h-5 w-32 bg-zinc-200 rounded" />
                <div className="h-4 w-full bg-zinc-200 rounded" />
                <div className="h-4 w-full bg-zinc-200 rounded" />
                <div className="h-12 w-full bg-zinc-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Empty Cart State ───────────────────────────────────────
  if (!isLoading && items.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-warm-white">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-zinc-400">
            <FaCartShopping />
          </div>
          <h2 className="text-2xl font-display font-bold text-zinc-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            Add some crackers to get started!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-all"
          >
            <FaCartShopping /> Shop Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-warm-white min-h-screen py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">
            Cart ({count} {count === 1 ? "item" : "items"})
          </span>
        </nav>

        {/* Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900">
            Shopping Cart
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshCart()}
              title="Refresh Cart"
              className="px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaRotateRight className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={isClearing || items.length === 0}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FaTrashCan className="text-[10px]" />
              <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
            </button>
          </div>
        </div>

        {/* Lorry Transport Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 text-xs text-amber-900 flex items-center gap-3">
          <FaTruckFast className="text-amber-600 text-base shrink-0" />
          <div>
            <span className="font-bold block text-sm mb-0.5">Sivakasi Lorry Transport (To-Pay Service)</span>
            <span>
              Direct factory dispatch from Sivakasi via registered parcel service. Lorry freight charges are calculated based on your destination pincode &amp; weight, payable directly by the customer at the parcel office upon pickup. No delivery charges collected on website.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, quantity, itemTotal }) => {
              const productId = product.id || product.slug;
              const isUpdating = updatingId === productId;
              const isDeleting = deletingId === productId;

              return (
                <div
                  key={productId}
                  className={`bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 items-start shadow-sm transition-all duration-200 ${isDeleting ? "opacity-40 pointer-events-none scale-[0.99]" : ""
                    }`}
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <ProductImage
                      productName={product.name}
                      categoryName={product.category_name}
                      aspectRatio="1/1"
                      size="thumb"
                      showLabel={false}
                      imageUrl={product.images?.[0]}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-crimson font-bold uppercase tracking-wider mb-0.5">
                      {product.category_name}
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 mb-2">
                      Per {product.unit} {product.sku ? `· SKU: ${product.sku}` : ""}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <QuantitySelector
                          value={quantity}
                          onChange={(v) => handleUpdateQty(productId, v)}
                          size="sm"
                        />
                        {isUpdating && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <span className="w-2 h-2 border border-crimson border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-base font-bold text-zinc-900">
                          {formatPrice(itemTotal ?? product.price * quantity)}
                        </p>
                        {product.mrp > product.price && (
                          <p className="text-[10px] text-zinc-400 line-through">
                            {formatPrice(product.mrp * quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      setDeleteTarget({ id: productId, name: product.name })
                    }
                    disabled={isDeleting}
                    className="shrink-0 w-8 h-8 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors text-xs cursor-pointer disabled:opacity-50"
                    aria-label={`Remove ${product.name} from cart`}
                    title="Remove item"
                  >
                    {isDeleting ? (
                      <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrashCan />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm sticky top-24">
              <h2 className="text-base font-bold text-zinc-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm text-zinc-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-semibold text-zinc-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      −{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span>Lorry Transport Freight</span>
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    To-Pay at Parcel Office
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 mb-5">
                <div className="flex justify-between text-base font-bold text-zinc-900">
                  <span>Total</span>
                  <span>{formatPrice(finalPayable)}</span>
                </div>
                {discount > 0 && (
                  <p className="text-[10px] text-emerald-600 mt-1">
                    You save {formatPrice(discount)} on this order!
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 bg-crimson text-white text-sm font-bold rounded-2xl text-center hover:bg-[#991B1B] shadow-[0_4px_20px_rgba(185,28,28,0.3)] transition-all"
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 text-center text-xs text-zinc-400 hover:text-zinc-600 mt-3 transition-colors"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <ProductCarousel
              products={recommendations}
              title="You May Also Like"
              viewAllHref="/shop"
            />
          </div>
        )}

        {/* Reusable Item Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteTarget !== null}
          onClose={() => !deletingId && setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Remove from Cart"
          message="Are you sure you want to remove this product from your shopping cart?"
          itemName={deleteTarget?.name}
          confirmText="Remove"
          cancelText="Cancel"
          isLoading={Boolean(deletingId)}
          variant="danger"
        />

        {/* Reusable Clear Cart Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showClearConfirm}
          onClose={() => !isClearing && setShowClearConfirm(false)}
          onConfirm={handleConfirmClearCart}
          title="Clear Shopping Cart?"
          message="Are you sure you want to remove all items from your cart? You will need to add them again."
          confirmText="Yes, Clear Cart"
          cancelText="Keep Items"
          isLoading={isClearing}
          variant="danger"
        />
      </div>
    </main>
  );
}
