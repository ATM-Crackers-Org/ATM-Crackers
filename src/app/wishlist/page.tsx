"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getHotDeals } from "@/lib/products";

export default function WishlistPage() {
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const recommendations = getHotDeals(4);

  function handleAddAllToCart() {
    if (items.length === 0) return;
    items.forEach((p) => addToCart(p, 1));
    showToast(`Added ${items.length} items to your cart!`, "cart");
  }

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9] py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
            <span>›</span>
            <span className="text-zinc-700 font-medium">My Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900">
                My Wishlist ({items.length})
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Your saved favourite fireworks for upcoming celebrations.
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors cursor-pointer"
              >
                🛒 Move All to Cart
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <ProductGrid products={items} cols={4} />
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100 p-8 max-w-lg mx-auto mb-12 shadow-sm">
              <span className="text-5xl block mb-3">🤍</span>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Explore our rich catalogue of 191+ Sivakasi crackers and tap the heart icon on items you love.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B91C1C] text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors text-sm"
              >
                Explore All Crackers
              </Link>
            </div>
          )}

          {/* Recommendations if empty or below */}
          {items.length === 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-display font-bold text-zinc-900 mb-6">
                Popular Festival Picks
              </h3>
              <ProductGrid products={recommendations} cols={4} />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
