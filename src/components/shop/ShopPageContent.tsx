"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import type { Product } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CrackersLoader } from "@/components/ui/CrackersLoader";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

type SortOption = "recommended" | "price_asc" | "price_desc" | "rating" | "newest";

interface CategoryItem {
  id: string;
  name: string;
  product_count: number;
  slug?: string;
  displayOrder: number;
}

interface FilterContentProps {
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  categories: CategoryItem[];
  allProductsCount: number;
  categoryCounts: Map<string, number>;
  setPage: (page: number) => void;
  hasActiveFilter?: boolean;
  onClearAllFilters?: () => void;
}

function FilterContent({
  selectedCategory,
  setSelectedCategory,
  categories,
  allProductsCount,
  categoryCounts,
  setPage,
  hasActiveFilter,
  onClearAllFilters,
}: FilterContentProps) {
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  return (
    <div className="space-y-5">
      {/* Global Clear Filters button in sidebar when any filter is active */}
      {hasActiveFilter && onClearAllFilters && (
        <button
          type="button"
          onClick={onClearAllFilters}
          className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-crimson text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <IoClose className="text-sm" />
          <span>Clear All Filters</span>
        </button>
      )}

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
              className="text-[11px] text-crimson font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Clear</span>
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

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  displayOrder: number;
  products: Product[];
}

function ShopContent({
  initialCategory,
  filterParam,
}: ShopContentProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const PER_PAGE = 24;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

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
              displayOrder: c.displayOrder ?? 999,
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

  const categoryOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categories) {
      map.set(c.id, c.displayOrder);
      if (c.slug) map.set(c.slug, c.displayOrder);
      map.set(c.name.toLowerCase().trim(), c.displayOrder);
    }
    return map;
  }, [categories]);

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

  // Check if any filter is active
  const hasActiveFilter = useMemo(() => {
    return (
      selectedCategory !== "all" ||
      Boolean(filterParam) ||
      sortBy !== "recommended"
    );
  }, [selectedCategory, filterParam, sortBy]);

  // Clear all filters handler
  function handleClearAllFilters() {
    setSelectedCategory("all");
    setSortBy("recommended");
    setPage(1);
    if (filterParam) {
      router.push("/shop");
    }
  }

  // Handle Sort Change with brief cracker loader transition
  function handleSortChange(newSort: SortOption) {
    if (newSort === sortBy) return;
    setIsSorting(true);
    setSortBy(newSort);
    setPage(1);
    setTimeout(() => {
      setIsSorting(false);
    }, 450);
  }

  // Filtered raw product list
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

    return result;
  }, [allProducts, selectedCategory, activeCategoryObj, filterParam]);

  // Is price-sorted mode active (low to high or high to low)?
  const isPriceSorted = sortBy === "price_asc" || sortBy === "price_desc";

  // Flat sorted products (used when price sort or rating sort is active)
  const flatSortedProducts = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filtered, sortBy]);

  // Grouped by Category in order of category.displayOrder
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, CategoryGroup>();

    for (const p of filtered) {
      const key = p.category_id || p.category_slug || p.category_name;
      const order =
        p.category_display_order && p.category_display_order < 999
          ? p.category_display_order
          : categoryOrderMap.get(p.category_id) ??
            categoryOrderMap.get(p.category_slug) ??
            categoryOrderMap.get(p.category_name.toLowerCase().trim()) ??
            999;

      if (!map.has(key)) {
        map.set(key, {
          categoryId: p.category_id,
          categoryName: p.category_name || "Fireworks Collection",
          categorySlug: p.category_slug || "fireworks",
          displayOrder: order,
          products: [],
        });
      }
      map.get(key)!.products.push(p);
    }

    // Sort categories strictly by displayOrder ascending
    const groups = Array.from(map.values()).sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.categoryName.localeCompare(b.categoryName);
    });

    // Within each category, sort products by product.display_order ascending then by name
    groups.forEach((g) => {
      g.products.sort((a, b) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return groups;
  }, [filtered, categoryOrderMap]);

  // Pagination for flat price sorted mode
  const totalPages = Math.ceil(flatSortedProducts.length / PER_PAGE);
  const paginatedFlatProducts = flatSortedProducts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

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
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs text-crimson font-bold hover:underline cursor-pointer flex items-center gap-1 ml-1"
                  >
                    <IoClose />
                    <span>Clear All Filters</span>
                  </button>
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
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="appearance-none pl-3.5 pr-8 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 bg-white focus:outline-none focus:border-crimson shadow-xs cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="recommended">Category Order (Default)</option>
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
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900">
                  Filter Products
                </h2>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-[11px] font-bold text-crimson hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <FilterContent
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                allProductsCount={allProducts.length}
                categoryCounts={categoryCounts}
                setPage={setPage}
                hasActiveFilter={hasActiveFilter}
                onClearAllFilters={handleClearAllFilters}
              />
            </div>
          </aside>

          {/* Products Column */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Pill Bar (when any filter is active) */}
            {hasActiveFilter && !loading && (
              <div className="mb-6 p-3 bg-red-50/60 border border-red-100 rounded-2xl flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-zinc-700">Active Filters:</span>
                  {selectedCategory !== "all" && activeCategoryObj && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-red-200 text-xs text-crimson font-semibold shadow-2xs">
                      Category: {activeCategoryObj.name}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("all");
                          setPage(1);
                        }}
                        className="hover:text-zinc-900 cursor-pointer"
                        title="Remove category filter"
                      >
                        <IoClose />
                      </button>
                    </span>
                  )}
                  {filterParam && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-red-200 text-xs text-crimson font-semibold shadow-2xs">
                      Collection: {filterParam === "new" ? "New Arrivals" : filterParam === "deals" ? "Hot Deals" : "Bestsellers"}
                      <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="hover:text-zinc-900 cursor-pointer"
                        title="Remove collection filter"
                      >
                        <IoClose />
                      </button>
                    </span>
                  )}
                  {sortBy !== "recommended" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-red-200 text-xs text-crimson font-semibold shadow-2xs">
                      Sort: {sortBy === "price_asc" ? "Price: Low to High" : sortBy === "price_desc" ? "Price: High to Low" : "Highest Rated"}
                      <button
                        type="button"
                        onClick={() => handleSortChange("recommended")}
                        className="hover:text-zinc-900 cursor-pointer"
                        title="Reset sort"
                      >
                        <IoClose />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold text-crimson hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <IoClose />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}

            {/* Crackers-themed loading state */}
            {loading ? (
              <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-xs">
                <CrackersLoader
                  size="lg"
                  text="Lighting up Sivakasi Crackers Catalog..."
                  subtext="Loading authentic festival fireworks directly from Sivakasi"
                />
              </div>
            ) : isSorting ? (
              <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-xs">
                <CrackersLoader
                  size="md"
                  text={
                    sortBy === "price_asc"
                      ? "Arranging Fireworks: Price Low to High..."
                      : sortBy === "price_desc"
                      ? "Arranging Fireworks: Price High to Low..."
                      : "Sorting Crackers by Category Order..."
                  }
                  subtext="Updating live prices and offers"
                />
              </div>
            ) : isPriceSorted ? (
              /* Flat Price Sorted List (No Category Headings) */
              <div>
                <div className="mb-4 flex items-center justify-between pb-2 border-b border-zinc-200">
                  <span className="text-xs font-semibold text-zinc-600">
                    Showing all products sorted by price ({flatSortedProducts.length} items)
                  </span>
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {sortBy === "price_asc" ? "⚡ Price: Low to High" : "⚡ Price: High to Low"}
                  </span>
                </div>

                <ProductGrid products={paginatedFlatProducts} cols={4} />

                {/* Pagination for flat sorted products */}
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
            ) : (
              /* Grouped by Category in order of category.displayOrder */
              <div className="space-y-10">
                {categoryGroups.map((group) => (
                  <section
                    key={group.categoryId || group.categorySlug}
                    id={`category-section-${group.categoryId || group.categorySlug}`}
                  >
                    {/* Highlighted Category Banner Header */}
                    <div className="relative mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950 via-zinc-900 to-red-900 text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
                      {/* Decorative background glow & sparks */}
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

                      <div className="relative z-10 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/40 shrink-0 shadow-inner">
                          #{group.displayOrder < 999 ? group.displayOrder : "✨"}
                        </span>
                        <div>
                          <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide flex items-center gap-2">
                            <span>{group.categoryName}</span>
                            <span className="text-amber-400 text-xs sm:text-sm animate-pulse">✨</span>
                          </h2>
                          <p className="text-xs text-zinc-300 mt-0.5">
                            {group.products.length} {group.products.length === 1 ? "firework item" : "firework items"} in this category
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/categories/${group.categorySlug}`}
                        className="relative z-10 self-start sm:self-auto text-xs font-bold text-amber-300 hover:text-white inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-amber-300/20"
                      >
                        <span>Explore Category</span>
                        <span>→</span>
                      </Link>
                    </div>

                    {/* Products Grid for this category */}
                    <ProductGrid products={group.products} cols={4} />
                  </section>
                ))}

                {categoryGroups.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100 p-8 shadow-xs">
                    <p className="text-base font-bold text-zinc-800 mb-1">
                      No fireworks found matching your filters
                    </p>
                    <p className="text-xs text-zinc-500 mb-5">
                      Try clearing your active filters to browse our full catalog.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearAllFilters}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-[#991B1B] transition-colors cursor-pointer"
                    >
                      <IoClose />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                )}
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
              <div className="flex items-center gap-3">
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs font-bold text-crimson hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-zinc-400 hover:text-zinc-700 text-xl font-bold cursor-pointer"
                >
                  <IoClose />
                </button>
              </div>
            </div>
            <FilterContent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              allProductsCount={allProducts.length}
              categoryCounts={categoryCounts}
              setPage={setPage}
              hasActiveFilter={hasActiveFilter}
              onClearAllFilters={handleClearAllFilters}
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
            <CrackersLoader
              fullHeight
              text="Lighting up Sivakasi Crackers Catalog..."
              subtext="Loading genuine factory-direct fireworks"
            />
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
