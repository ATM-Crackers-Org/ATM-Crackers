"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import type { Product } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

type SortOption = "recommended" | "price_asc" | "price_desc" | "rating" | "newest";

interface FilterContentProps {
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  categories: Array<{ id: string; name: string; product_count: number; slug?: string }>;
  allProductsCount: number;
  categoryCounts: Map<string, number>;
  setPage: (page: number) => void;
}

function FilterContent({
  selectedCategory,
  setSelectedCategory,
  categories,
  allProductsCount,
  categoryCounts,
  setPage,
}: FilterContentProps) {
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  return (
    <div className="space-y-6">
      {/* Searchable Category List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Category
          </label>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setPage(1);
              }}
              className="text-[11px] text-crimson font-semibold hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Search Input */}
        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs pointer-events-none">
            <FaSearch />
          </span>
          <input
            type="text"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-7 pr-6 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:bg-white focus:border-crimson focus:ring-1 focus:ring-crimson transition-all"
          />
          {categorySearch && (
            <button
              type="button"
              onClick={() => setCategorySearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs p-0.5 cursor-pointer"
            >
              <IoClose />
            </button>
          )}
        </div>

        {/* Scrollable Clean Category List */}
        <div className="max-h-72 overflow-y-auto space-y-1 pr-1 border border-zinc-100 rounded-xl p-1 bg-zinc-50/40">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-crimson text-white font-bold shadow-xs"
                : "text-zinc-700 hover:bg-zinc-100 font-medium"
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                selectedCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-zinc-200/70 text-zinc-600"
              }`}
            >
              {allProductsCount}
            </span>
          </button>

          {filteredCategories.map((cat) => {
            const isSelected =
              selectedCategory === cat.id ||
              (Boolean(cat.slug) && selectedCategory === cat.slug);
            const count =
              categoryCounts.get(cat.id) ||
              categoryCounts.get(cat.slug || "") ||
              cat.product_count ||
              0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug || cat.id);
                  setPage(1);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-crimson text-white font-bold shadow-xs"
                    : "text-zinc-700 hover:bg-zinc-100 font-medium"
                }`}
              >
                <span className="truncate pr-1">{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-zinc-200/70 text-zinc-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="py-4 text-center text-xs text-zinc-400">
              No matching category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShopContentProps {
  initialCategory: string;
  filterParam: string;
}

function ShopContent({
  initialCategory,
  filterParam,
}: ShopContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 20;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; product_count: number; slug?: string }>
  >([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [prodsRes, catsRes] = await Promise.allSettled([
          getProducts(),
          getCategories(),
        ]);
        if (!mounted) return;

        if (prodsRes.status === "fulfilled" && prodsRes.value?.length) {
          setAllProducts(adaptApiProducts(prodsRes.value));
        }
        if (catsRes.status === "fulfilled" && catsRes.value?.length) {
          setCategories(
            catsRes.value.map((c) => ({
              id: c.id,
              name: c.name,
              product_count: c.productCount ?? 0,
              slug: c.slug,
            }))
          );
        }
      } catch (err) {
        console.warn("Shop page live data fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of allProducts) {
      if (p.category_id) map.set(p.category_id, (map.get(p.category_id) || 0) + 1);
      if (p.category_slug) map.set(p.category_slug, (map.get(p.category_slug) || 0) + 1);
    }
    return map;
  }, [allProducts]);

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === "all") return null;
    return (
      categories.find(
        (c) =>
          c.id === selectedCategory ||
          ("slug" in c && c.slug === selectedCategory)
      ) || null
    );
  }, [categories, selectedCategory]);

  const filtered = useMemo(() => {
    let result = allProducts;

    if (filterParam === "new") {
      result = result.filter(
        (p) =>
          p.is_new_arrival ||
          p.name.includes("2026") ||
          (p.category_name && p.category_name.includes("2026"))
      );
    } else if (filterParam === "deals") {
      result = result.filter((p) => p.discount_percent >= 30 || p.is_trending);
    } else if (filterParam === "bestsellers") {
      result = result.filter((p) => p.is_best_seller);
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.category_id === selectedCategory ||
          p.category_slug === selectedCategory ||
          (activeCategoryObj && p.category_name === activeCategoryObj.name)
      );
    }

    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, selectedCategory, activeCategoryObj, sortBy, filterParam]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="min-h-screen bg-warm-white">
      {/* Page header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-2.5">
            <Link href="/" className="hover:text-crimson">
              Home
            </Link>
            <span>›</span>
            <span className="text-zinc-700 font-medium">Products</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
                {filterParam === "new"
                  ? "2026 New Arrivals"
                  : filterParam === "deals"
                  ? "Hot Festival Deals"
                  : filterParam === "bestsellers"
                  ? "Best Selling Fireworks"
                  : "All Fireworks & Crackers"}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs sm:text-sm text-zinc-500">
                  {filtered.length} products available
                </span>
                {activeCategoryObj && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-crimson/10 text-crimson text-xs font-semibold">
                    Category: {activeCategoryObj.name}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPage(1);
                      }}
                      className="hover:text-zinc-900 cursor-pointer"
                      title="Clear category filter"
                    >
                      <IoClose />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                type="button"
                className="md:hidden flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 bg-white shadow-xs cursor-pointer"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FaSlidersH className="text-xs" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-3.5 pr-8 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 bg-white focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
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
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar Card */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-28">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-zinc-900 mb-4 pb-2.5 border-b border-zinc-100">
                Filter Products
              </h2>
              <FilterContent
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                allProductsCount={allProducts.length}
                categoryCounts={categoryCounts}
                setPage={setPage}
              />
            </div>
          </aside>

          {/* Products Column */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-zinc-100 h-64 p-3 space-y-3"
                  >
                    <div className="h-36 bg-zinc-200 rounded-xl" />
                    <div className="h-4 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={paginated} cols={4} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-crimson hover:text-crimson disabled:opacity-40 transition-colors cursor-pointer"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        page === p
                          ? "bg-crimson text-white shadow-xs"
                          : "border border-zinc-200 text-zinc-700 hover:border-crimson hover:text-crimson"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:border-crimson hover:text-crimson disabled:opacity-40 transition-colors cursor-pointer"
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
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-zinc-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-xl font-bold cursor-pointer"
              >
                <IoClose />
              </button>
            </div>
            <FilterContent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              allProductsCount={allProducts.length}
              categoryCounts={categoryCounts}
              setPage={setPage}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-6 py-3.5 bg-crimson text-white font-bold rounded-2xl shadow-md hover:bg-[#991B1B] transition-colors cursor-pointer"
            >
              Apply Filters ({filtered.length} Products)
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export function ShopPageContent() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-warm-white py-12">
          <div className="max-w-360 mx-auto px-4 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-zinc-200 rounded w-48 mx-auto" />
              <div className="h-4 bg-zinc-100 rounded w-32 mx-auto" />
            </div>
          </div>
        </main>
      }
    >
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const filterParam = searchParams.get("filter") || "";

  return (
    <ShopContent
      initialCategory={initialCategory}
      filterParam={filterParam}
    />
  );
}
