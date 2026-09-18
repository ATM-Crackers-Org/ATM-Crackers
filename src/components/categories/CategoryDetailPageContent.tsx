"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategoryWithProducts, getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";
import type { Product as ApiProduct } from "@/types/product";
import type { Product as StaticProduct } from "@/lib/products";
import { adaptApiProduct } from "@/utils/product.adapter";
import { getCategoryStyle } from "@/lib/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { formatPrice } from "@/lib/products";
import { CategoryImage } from "@/components/ui/ProductImage";
import { FaTriangleExclamation, FaArrowLeft } from "react-icons/fa6";

interface CategoryDetailPageContentProps {
  slug: string;
}

export function CategoryDetailPageContent({
  slug,
}: CategoryDetailPageContentProps) {
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getCategoryWithProducts(slug),
      getCategories(),
    ])
      .then(([{ category: cat, products }, cats]) => {
        setCategory(cat);
        setApiProducts(products);
        setAllCategories(cats);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const adaptedProducts: StaticProduct[] = useMemo(
    () => apiProducts.map(adaptApiProduct),
    [apiProducts]
  );

  const sortedProducts = useMemo(() => {
    const list = [...adaptedProducts];
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [adaptedProducts, sortBy]);

  const otherCategories = useMemo(
    () => allCategories.filter((c) => c.slug !== slug).slice(0, 6),
    [allCategories, slug]
  );

  // Derive accent colour for the banner
  const accentColor = category
    ? getCategoryStyle(category.name).accent
    : "#B91C1C";

  if (loading) {
    return (
      <main className="min-h-screen bg-warm-white py-8">
        <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-4 bg-zinc-200 rounded w-48" />
          <div className="h-40 bg-zinc-200 rounded-3xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="min-h-screen bg-warm-white py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaTriangleExclamation />
          </div>
          <p className="text-sm text-zinc-500">{error ?? "Category not found."}</p>
          <Link href="/categories" className="mt-4 inline-flex items-center gap-2 text-sm text-crimson font-semibold hover:underline">
            <FaArrowLeft className="text-xs" />
            <span>Back to Categories</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm-white py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">Home</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-crimson">Categories</Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">{category.name}</span>
        </nav>

        {/* Category Banner */}
        <div
          className="rounded-3xl p-6 md:p-10 mb-8 text-white relative overflow-hidden shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #15151A 100%)` }}
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
              {sortedProducts.length} Products Available
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
          <p className="text-sm font-semibold text-zinc-800">
            Showing {sortedProducts.length} items
          </p>
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={slug}
                onChange={(e) => {
                  if (e.target.value) router.push(`/categories/${e.target.value}`);
                }}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
                aria-label="Switch Category"
              >
                {allCategories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.productCount ?? 0})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort */}
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
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <ProductGrid products={sortedProducts} cols={4} />

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
                    {c.productCount ?? 0} items
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
