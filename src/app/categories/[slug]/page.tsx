"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useMemo } from "react";
import { getCategoryBySlug, getEnrichedCategories } from "@/lib/categories";
import { getProductsByCategory, formatPrice } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductGrid } from "@/components/product/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const category = getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const [sortBy, setSortBy] = useState<string>("recommended");
  const rawProducts = getProductsByCategory(category.id);
  const otherCategories = getEnrichedCategories()
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  const sortedProducts = useMemo(() => {
    let list = [...rawProducts];
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
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9] py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-[#B91C1C]">
              Home
            </Link>
            <span>›</span>
            <Link href="/categories" className="hover:text-[#B91C1C]">
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
              <div className="text-4xl md:text-5xl mb-3">{category.icon}</div>
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
            <div className="absolute right-4 bottom-2 text-8xl opacity-10 select-none pointer-events-none">
              {category.icon}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
            <div>
              <p className="text-sm font-semibold text-zinc-800">
                Showing {sortedProducts.length} items
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-sm text-zinc-700 bg-white focus:outline-none focus:border-[#B91C1C]"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
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
                    className="p-4 bg-white rounded-2xl border border-zinc-100 text-center hover:border-[#B91C1C] hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <p className="text-xs font-bold text-zinc-800 line-clamp-1 group-hover:text-[#B91C1C]">
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
      <Footer />
      <MobileNav />
    </div>
  );
}
