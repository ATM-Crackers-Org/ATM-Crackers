"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import type { Product } from "@/lib/products";
import { ProductCarousel } from "@/components/product/ProductCarousel";

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((prods) => {
        if (mounted && prods) {
          const adapted = adaptApiProducts(prods);
          const best = adapted.filter((p) => p.is_best_seller);
          setProducts(best.length >= 4 ? best.slice(0, 12) : adapted.slice(0, 12));
        }
      })
      .catch((err) => console.warn("Failed to load best sellers:", err));

    return () => {
      mounted = false;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-warm-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          products={products}
          title="CUSTOMER FAVOURITES"
          subtitle="Top reviewed fireworks with guaranteed performance and vibrant color bursts"
          viewAllHref="/shop?filter=bestsellers"
        />
      </div>
    </section>
  );
}
