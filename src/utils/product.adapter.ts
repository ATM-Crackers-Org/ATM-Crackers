import type { Product as ApiProduct } from "@/types/product";
import type { Product as UiProduct } from "@/lib/products";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function adaptApiProduct(p: ApiProduct): UiProduct {
  const savings = Math.max(0, p.mrp - p.sellingPrice);
  const discountPercent =
    p.discountPercent > 0
      ? p.discountPercent
      : p.mrp > 0 && p.mrp > p.sellingPrice
        ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
        : 0;

  const hash = hashString(p.id || p.slug);
  const rating = Number((4.1 + (hash % 9) * 0.1).toFixed(1));
  const reviewsCount = 12 + (hash % 140);
  const order = p.displayOrder ?? 99;

  return {
    id: p.id || (p as unknown as { _id?: string })._id || "",
    name: p.name,
    slug: p.slug,
    description: p.description || "",
    price: p.sellingPrice,
    mrp: p.mrp,
    savings,
    discount_percent: discountPercent,
    category_name: p.category?.name || "Fireworks",
    category_slug: p.category?.slug || "fireworks",
    category_id: p.categoryId || p.category?.id || "",

    sku: p.id ? `ATM-${p.id.slice(-4).toUpperCase()}` : "ATM-001",
    stock_quantity: p.stockStatus === "in_stock" ? 100 : 0,
    low_stock_threshold: 10,
    is_active: p.status === "ACTIVE",
    is_featured: order <= 3,
    weight: null,
    unit: "box",
    rating,
    reviews_count: reviewsCount,
    is_new_arrival:
      Boolean(p.isNewArrival) ||
      p.name.includes("2026") ||
      Boolean(p.category?.name && p.category.name.includes("2026")),
    is_trending: Boolean(p.isTrending),
    is_best_seller: Boolean(p.isBestSeller),
    images:
      Array.isArray(p.images) && p.images.length > 0
        ? p.images.filter((img) => typeof img === "string" && img.trim().length > 0)
        : (p as { image?: string; imageUrl?: string }).image
        ? [(p as { image?: string; imageUrl?: string }).image!]
        : (p as { image?: string; imageUrl?: string }).imageUrl
        ? [(p as { image?: string; imageUrl?: string }).imageUrl!]
        : [],
  };
}

export function adaptApiProducts(products: ApiProduct[]): UiProduct[] {
  return products.map(adaptApiProduct);
}
