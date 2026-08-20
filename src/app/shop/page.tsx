"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getEnrichedProducts, formatPrice } from "@/lib/products";
import { getEnrichedCategories } from "@/lib/categories";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductGrid } from "@/components/product/ProductGrid";

type SortOption = "recommended" | "price_asc" | "price_desc" | "rating" | "newest";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const PER_PAGE = 20;

  const allProducts = useMemo(() => getEnrichedProducts(), []);
  const categories = useMemo(() => getEnrichedCategories(), []);

  const filtered = useMemo(() => {
    let result = allProducts;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price_asc":    result = [...result].sort((a, b) => a.price - b.price); break;
      case "price_desc":   result = [...result].sort((a, b) => b.price - a.price); break;
      case "rating":       result = [...result].sort((a, b) => b.rating - a.rating); break;
      default:             break;
    }

    return result;
  }, [allProducts, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-zinc-800 mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { setSelectedCategory("all"); setPage(1); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              selectedCategory === "all"
                ? "bg-[#B91C1C] text-white font-semibold"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            All Products ({allProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#B91C1C] text-white font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat.icon} {cat.name} ({cat.product_count})
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 pt-5">
        <h3 className="text-sm font-bold text-zinc-800 mb-3">Price Range</h3>
        <div className="space-y-2">
          {[
            [0, 500, "Under ₹500"],
            [500, 1000, "₹500 – ₹1,000"],
            [1000, 2000, "₹1,000 – ₹2,000"],
            [2000, 50000, "₹2,000+"],
          ].map(([min, max, label]) => (
            <button
              key={label}
              onClick={() => { setPriceRange([min as number, max as number]); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                priceRange[0] === min && priceRange[1] === max
                  ? "bg-zinc-100 text-zinc-800 font-semibold"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { setPriceRange([0, 50000]); setPage(1); }}
            className="text-xs text-[#B91C1C] hover:underline"
          >
            Clear price filter
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9]">
        {/* Page header */}
        <div className="bg-white border-b border-zinc-100">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
              <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
              <span>›</span>
              <span className="text-zinc-700 font-medium">Shop</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900">
                  Shop All Crackers
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                  {filtered.length} products found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  ⚙ Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-zinc-200 rounded-xl text-sm text-zinc-700 bg-white focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-56 shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl border border-zinc-100 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <FilterSidebar />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <ProductGrid products={paginated} cols={4} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-[#B91C1C] hover:text-[#B91C1C] disabled:opacity-40 transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                          page === p
                            ? "bg-[#B91C1C] text-white"
                            : "border border-zinc-200 text-zinc-600 hover:border-[#B91C1C]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-[#B91C1C] hover:text-[#B91C1C] disabled:opacity-40 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-zinc-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-400 text-xl">✕</button>
              </div>
              <FilterSidebar />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-5 py-3.5 bg-[#B91C1C] text-white font-bold rounded-2xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
