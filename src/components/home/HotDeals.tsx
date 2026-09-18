"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/services/product.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import type { Product } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { LuSparkles } from "react-icons/lu";

export function HotDeals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((prods) => {
        if (mounted && prods) {
          const adapted = adaptApiProducts(prods);
          // Filter 2026 new arrival products
          const filtered = adapted.filter(
            (p) =>
              p.is_new_arrival ||
              p.name.includes("2026") ||
              (p.category_name && p.category_name.includes("2026"))
          );
          // If fewer than 8, combine with top arrivals
          const result = filtered.length > 0 ? filtered.slice(0, 8) : adapted.slice(0, 8);
          setNewArrivals(result);
        }
      })
      .catch((err) => console.warn("Failed to load 2026 new arrivals:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <LuSparkles className="text-emerald-500 text-xs" />
              <span>2026 NEW ARRIVALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              New Arrivals 2026
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Exclusive 2026 new releases and festival specialties straight from our Sivakasi factory
            </p>
          </div>
          <Link
            href="/shop?filter=new"
            className="self-start sm:self-auto text-xs sm:text-sm font-bold text-crimson hover:underline inline-flex items-center gap-1"
          >
            <span>View All 2026 Arrivals</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <ProductGrid products={newArrivals} cols={4} />
        )}
      </div>
    </section>
  );
}
