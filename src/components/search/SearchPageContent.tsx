"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts, getHotDeals } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchableCategoryDropdown } from "@/components/ui/SearchableCategoryDropdown";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchTerm(query.trim());
    setSelectedCategory("all");
  }

  const results = useMemo(() => {
    if (!searchTerm) return [];
    return searchProducts(searchTerm);
  }, [searchTerm]);

  const categoriesInResults = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    results.forEach((p) => {
      const existing = map.get(p.category_id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.category_id, {
          id: p.category_id,
          name: p.category_name,
          count: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [results]);

  const filteredResults = useMemo(() => {
    let list = results;
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }
    if (sortBy === "price_asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [results, selectedCategory, sortBy]);

  const popularSuggestions = ["Sparklers", "Flower Pots", "Rockets", "Bombs", "Fancy Shots", "Chakkar", "Varnam"];
  const recommendations = getHotDeals(8);

  return (
    <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
        <Link href="/" className="hover:text-crimson">Home</Link>
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
            className="flex-1 px-4 py-3.5 border border-zinc-200 rounded-2xl text-sm outline-none focus:border-crimson shadow-sm bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-crimson text-white font-bold rounded-2xl shadow-md hover:bg-[#991B1B] transition-colors text-sm cursor-pointer"
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
                setSelectedCategory("all");
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Results for &quot;<span className="text-crimson">{searchTerm}</span>&quot;
              </h2>
              <span className="text-xs text-zinc-500 font-semibold">
                {filteredResults.length} items found
              </span>
            </div>

            {/* Filter Section: Category Dropdown & Sort */}
            {results.length > 0 && (
              <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
                {/* Searchable Category Dropdown */}
                <div className="w-52 sm:w-64">
                  <SearchableCategoryDropdown
                    categories={categoriesInResults.map((c) => ({
                      id: c.id,
                      name: c.name,
                      product_count: c.count,
                    }))}
                    selectedCategoryId={selectedCategory}
                    onSelectCategory={(id) => setSelectedCategory(id)}
                    allProductsCount={results.length}
                    align="right"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-700 bg-white focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
                    aria-label="Sort results"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredResults.length > 0 ? (
            <ProductGrid products={filteredResults} cols={4} />
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100 p-8">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="text-lg font-bold text-zinc-800 mb-2">No matching fireworks found</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
                We couldn&apos;t find anything matching &quot;{searchTerm}&quot; in the selected filters. Try choosing &quot;All Categories&quot; or searching a broader term.
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

export function SearchPageContent() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading search...</div>}>
        <SearchPageInner />
      </Suspense>
    </main>
  );
}
