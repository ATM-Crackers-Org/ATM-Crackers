"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export interface PopularSearchItem {
  id: string;
  name: string;
  slug: string;
  type: "category" | "product";
  subtitle?: string;
}

export function usePopularSearches() {
  const [categories, setCategories] = useState<PopularSearchItem[]>([]);
  const [products, setProducts] = useState<PopularSearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPopularData() {
      try {
        const [catsRes, prodsRes] = await Promise.allSettled([
          getCategories(),
          getProducts(),
        ]);

        if (!mounted) return;

        // Extract real categories sorted by displayOrder
        if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value)) {
          const sortedCats = [...catsRes.value]
            .filter((c) => c.name && c.status === "ACTIVE")
            .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

          setCategories(
            sortedCats.slice(0, 6).map((c: Category) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              type: "category" as const,
              subtitle: c.productCount ? `${c.productCount} items` : undefined,
            }))
          );
        }

        // Extract real products sorted by displayOrder / bestSeller
        if (prodsRes.status === "fulfilled" && Array.isArray(prodsRes.value)) {
          const activeProds = prodsRes.value.filter(
            (p) => p.name && p.status === "ACTIVE"
          );

          // Prefer best sellers or trending, otherwise order by displayOrder
          const sortedProds = [...activeProds].sort((a: Product, b: Product) => {
            const scoreA = (a.isBestSeller ? 0 : 1) * 1000 + (a.displayOrder ?? 999);
            const scoreB = (b.isBestSeller ? 0 : 1) * 1000 + (b.displayOrder ?? 999);
            return scoreA - scoreB;
          });

          setProducts(
            sortedProds.slice(0, 6).map((p: Product) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              type: "product" as const,
              subtitle: p.category?.name,
            }))
          );
        }
      } catch (err) {
        console.warn("Failed to load popular search suggestions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPopularData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    categories,
    products,
    loading,
  };
}
