"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { FaFire } from "react-icons/fa6";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  cols = 4,
  className = "",
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (loading) return <ProductGridSkeleton count={cols * 2} />;

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-zinc-400">
          <FaFire />
        </div>
        <h3 className="text-lg font-semibold text-zinc-700 mb-2">
          No products found
        </h3>
        <p className="text-sm text-zinc-400">
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  const colClass =
    cols === 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : cols === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2";

  return (
    <>
      <div className={`grid ${colClass} gap-3 md:gap-4 ${className}`}>
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
