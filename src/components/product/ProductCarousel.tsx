"use client";

import React, { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  viewAllHref,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      {(title || viewAllHref) && (
        <div className="flex items-end justify-between mb-4 px-4 md:px-0">
          <div>
            {title && (
              <h2 className="text-xl md:text-2xl font-display font-bold text-zinc-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-[#B91C1C] hover:underline whitespace-nowrap"
            >
              View all →
            </a>
          )}
        </div>
      )}

      {/* Carousel container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Scrollable area */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
        >
          {products.map((p) => (
            <div key={p.slug} className="w-[220px] md:w-[240px] flex-shrink-0">
              <ProductCard product={p} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
