"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/lib/products";
import { getProducts } from "@/services/product.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";

export function WishlistPageContent() {
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted && data) {
          setRecommendations(adaptApiProducts(data).slice(0, 4));
        }
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, []);

  function handleAddAllToCart() {
    if (items.length === 0) return;
    items.forEach((p) => addToCart(p, 1));
    showToast(`Added ${items.length} items to your cart!`, "cart");
  }

  return (
    <main className="min-h-screen bg-warm-white py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">Home</Link>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-crimson text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors cursor-pointer"
            >
              <FaCartShopping /> Move All to Cart
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <ProductGrid products={items} cols={4} />
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100 p-8 max-w-lg mx-auto mb-12 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaHeart />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Explore our rich catalogue of Sivakasi crackers and tap the heart icon on items you love.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors text-sm"
            >
              <LuSparkles /> Explore All Crackers
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
  );
}
