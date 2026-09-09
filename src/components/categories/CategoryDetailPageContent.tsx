"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getCategoryBySlug, getEnrichedCategories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";

interface CategoryDetailPageContentProps {
  slug: string;
}

export function CategoryDetailPageContent({ slug }: CategoryDetailPageContentProps) {
  const router = useRouter();
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [sortBy, setSortBy] = useState<string>("recommended");
  const rawProducts = getProductsByCategory(category.id);
  const otherCategories = getEnrichedCategories()
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  const sortedProducts = useMemo(() => {
    const list = [...rawProducts];
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [rawProducts, sortBy]);

  return (
    <main className="min-h-screen bg-warm-white py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-crimson">
            Categories
          </Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">{category.name}</span>
        </nav>

        {/* Category Banner */}
        <div
          className="rounded-3xl p-6 md:p-10 mb-8 text-white relative overflow-hidden shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${category.accent} 0%, #15151A 100%)`,
          }}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Category Showcase
            </span>
            <h1 className="text-2xl md:text-4xl font-display font-bold mb-2">
              {category.name}
            </h1>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              {category.description ||
                `Explore our premier selection of ${category.name}. Handcrafted in Sivakasi with maximum quality and safety.`}
            </p>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
              {rawProducts.length} Products Available
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
          <div>
            <p className="text-sm font-semibold text-zinc-800">
              Showing {sortedProducts.length} items
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={category.slug}
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/categories/${e.target.value}`);
                  }
                }}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
                aria-label="Switch Category"
              >
                {getEnrichedCategories().map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.product_count})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort by */}
            <div className="relative">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-700 bg-white focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
                aria-label="Sort products"
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
        </div>

        {/* Products Grid */}
        <ProductGrid products={sortedProducts} cols={4} />

        {/* Other Categories */}
        {otherCategories.length > 0 && (
          <div className="mt-16 pt-10 border-t border-zinc-200">
            <h2 className="text-xl font-display font-bold text-zinc-900 mb-6">
              Explore Other Popular Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {otherCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="p-4 bg-white rounded-2xl border border-zinc-100 text-center hover:border-crimson hover:shadow-md transition-all group"
                >
                  <p className="text-xs font-bold text-zinc-800 line-clamp-1 group-hover:text-crimson">
                    {c.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {c.product_count} items
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
