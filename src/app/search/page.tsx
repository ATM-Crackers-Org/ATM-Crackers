"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts, getHotDeals, formatPrice } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductGrid } from "@/components/product/ProductGrid";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchTerm(query.trim());
  }

  const results = useMemo(() => {
    if (!searchTerm) return [];
    return searchProducts(searchTerm);
  }, [searchTerm]);

  const popularSuggestions = ["Sparklers", "Flower Pots", "Rockets", "Bombs", "Fancy Shots", "Chakkar", "Varnam"];
  const recommendations = getHotDeals(8);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
        <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
        <span>›</span>
        <span className="text-zinc-700 font-medium">Search</span>
      </nav>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 mb-4">
          Search Sivakasi Fireworks
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, SKU, or category (e.g. Laxmi, Bomb, Sparkler)..."
            className="flex-1 px-4 py-3.5 border border-zinc-200 rounded-2xl text-sm outline-none focus:border-[#B91C1C] shadow-sm bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#B91C1C] text-white font-bold rounded-2xl shadow-md hover:bg-[#991B1B] transition-colors text-sm cursor-pointer"
          >
            🔍 Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-600">Popular:</span>
          {popularSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
                setSearchTerm(tag);
              }}
              className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {searchTerm ? (
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200">
            <h2 className="text-lg font-bold text-zinc-900">
              Results for &quot;<span className="text-[#B91C1C]">{searchTerm}</span>&quot;
            </h2>
            <span className="text-xs text-zinc-500 font-semibold">
              {results.length} items found
            </span>
          </div>

          {results.length > 0 ? (
            <ProductGrid products={results} cols={4} />
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100 p-8">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="text-lg font-bold text-zinc-800 mb-2">No matching fireworks found</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
                We couldn&apos;t find anything matching &quot;{searchTerm}&quot;. Try checking for typos or searching a broader term.
              </p>
              <div className="pt-8 border-t border-zinc-100">
                <h4 className="text-base font-bold text-zinc-900 mb-6">Popular Recommendations</h4>
                <ProductGrid products={recommendations.slice(0, 4)} cols={4} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-display font-bold text-zinc-900 mb-6">
            Trending Festival Crackers
          </h2>
          <ProductGrid products={recommendations} cols={4} />
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9]">
        <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading search...</div>}>
          <SearchPageContent />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
