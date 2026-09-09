"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

export interface CategoryOption {
  id: string;
  name: string;
  product_count: number;
}

interface SearchableCategoryDropdownProps {
  categories: CategoryOption[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  allProductsCount: number;
  className?: string;
  align?: "left" | "right";
  showQuickChips?: boolean;
}

export function SearchableCategoryDropdown({
  categories,
  selectedCategoryId,
  onSelectCategory,
  allProductsCount,
  className = "",
  align = "left",
  showQuickChips = false,
}: SearchableCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Selected category object
  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  // Top 5 popular categories for quick filter chips
  const popularCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.product_count - a.product_count)
      .slice(0, 5);
  }, [categories]);

  const handleSelect = (id: string) => {
    onSelectCategory(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Optional Quick Chips for Instant 1-Tap Access */}
      {showQuickChips && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategoryId === "all"
              ? "bg-crimson text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
          >
            All ({allProductsCount})
          </button>
          {popularCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategoryId === cat.id
                ? "bg-crimson text-white shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
            >
              {cat.name} ({cat.product_count})
            </button>
          ))}
        </div>
      )}

      {/* Main Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs sm:text-sm font-medium text-zinc-800 shadow-xs transition-colors focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-left">
          {selectedCategory ? (
            <span className="font-semibold text-zinc-900">
              {selectedCategory.name}
              <span className="ml-1.5 text-zinc-400 font-normal">
                ({selectedCategory.product_count})
              </span>
            </span>
          ) : (
            <span className="text-zinc-700">
              All Categories ({allProductsCount})
            </span>
          )}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedCategory && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleSelect("all");
              }}
              title="Clear selection"
              className="p-0.5 text-zinc-400 hover:text-crimson transition-colors"
            >
              ✕
            </span>
          )}
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-crimson" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Floating Searchable Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"
            } mt-2 w-72 sm:w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden animate-slide-down`}
          style={{ maxHeight: "380px" }}
        >
          {/* Search Box Header */}
          <div className="p-2.5 border-b border-zinc-100 bg-zinc-50/80 sticky top-0 z-10 backdrop-blur-xs">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-zinc-400 text-xs">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 37+ categories..."
                className="w-full pl-8 pr-7 py-2 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-zinc-400 hover:text-zinc-600 text-xs p-0.5"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="overflow-y-auto max-h-64 divide-y divide-zinc-50 p-1">
            {/* "All Categories" option when no search or matches "all" */}
            {(!searchQuery || "all categories".includes(searchQuery.toLowerCase())) && (
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${selectedCategoryId === "all"
                  ? "bg-crimson/10 text-crimson font-bold"
                  : "text-zinc-700 hover:bg-zinc-100 font-medium"
                  }`}
              >
                <span>All Categories</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                  {allProductsCount}
                </span>
              </button>
            )}

            {/* Filtered Categories list */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${isSelected
                      ? "bg-crimson/10 text-crimson font-bold"
                      : "text-zinc-700 hover:bg-zinc-100 font-medium"
                      }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${isSelected
                        ? "bg-crimson text-white"
                        : "bg-zinc-100 text-zinc-500"
                        }`}
                    >
                      {cat.product_count}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-xs text-zinc-500 mb-1">
                  No category found for &quot;<span className="font-semibold text-zinc-700">{searchQuery}</span>&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-crimson font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Quick Footer hint */}
          <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Showing {filteredCategories.length} categories</span>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className="text-crimson font-semibold hover:underline"
              >
                Reset to All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
