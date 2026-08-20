"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice, getBestSellers } from "@/lib/products";
import { ProductCarousel } from "@/components/product/ProductCarousel";

const FREE_DELIVERY_THRESHOLD = 999;

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const recommendations = getBestSellers(6);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progressPct = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);
  const delivery = total >= FREE_DELIVERY_THRESHOLD ? 0 : 99;
  const discount = items.reduce((s, i) => s + (i.product.mrp - i.product.price) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="has-mobile-nav">
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center bg-[#FAFAF9]">
          <div className="text-center px-4">
            <p className="text-6xl mb-4">🛒</p>
            <h2 className="text-2xl font-display font-bold text-zinc-800 mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 text-sm mb-6">Add some crackers to get started!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
            >
              🛒 Shop Now
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="bg-[#FAFAF9] min-h-screen py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
            <span>›</span>
            <span className="text-zinc-700 font-medium">Cart ({items.length} items)</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 mb-6">
            Shopping Cart
          </h1>

          {/* Free delivery progress */}
          {remaining > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <p className="text-xs text-amber-700 font-semibold mb-2">
                Add {formatPrice(remaining)} more for <strong>FREE Delivery!</strong>
              </p>
              <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {remaining === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6 text-xs font-semibold text-emerald-700">
              🎉 You qualify for FREE Delivery!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.slug}
                  className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 items-start shadow-sm"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <ProductImage
                      productName={product.name}
                      categoryName={product.category_name}
                      aspectRatio="1/1"
                      size="thumb"
                      showLabel={false}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#B91C1C] font-bold uppercase tracking-wider mb-0.5">
                      {product.category_name}
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 line-clamp-2 mb-2">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 mb-2">Per {product.unit}</p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <QuantitySelector
                        value={quantity}
                        onChange={(v) => updateQuantity(product.slug, v)}
                        size="sm"
                      />
                      <div className="text-right">
                        <p className="text-base font-bold text-zinc-900">
                          {formatPrice(product.price * quantity)}
                        </p>
                        <p className="text-[10px] text-zinc-400 line-through">
                          {formatPrice(product.mrp * quantity)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      removeFromCart(product.slug);
                      showToast("Removed from cart", "error");
                    }}
                    className="shrink-0 w-7 h-7 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors text-sm"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm sticky top-24">
                <h2 className="text-base font-bold text-zinc-900 mb-4">Order Summary</h2>

                <div className="space-y-2.5 text-sm text-zinc-600 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-zinc-900">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">−{formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={`font-semibold ${delivery === 0 ? "text-emerald-600" : "text-zinc-900"}`}>
                      {delivery === 0 ? "FREE" : formatPrice(delivery)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-3 mb-5">
                  <div className="flex justify-between text-base font-bold text-zinc-900">
                    <span>Total</span>
                    <span>{formatPrice(total + delivery)}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 mt-1">
                    You save {formatPrice(discount)} on this order!
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-[#B91C1C] text-white text-sm font-bold rounded-2xl text-center hover:bg-[#991B1B] shadow-[0_4px_20px_rgba(185,28,28,0.3)] transition-all"
                >
                  PROCEED TO CHECKOUT →
                </Link>

                <Link href="/shop" className="block text-center text-xs text-zinc-400 hover:text-zinc-600 mt-3 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* You may also like */}
          <div className="mt-12">
            <ProductCarousel
              products={recommendations}
              title="You May Also Like"
              viewAllHref="/shop"
            />
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
