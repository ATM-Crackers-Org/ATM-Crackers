/**
 * Category Service — all API calls for the /categories resource.
 *
 * Endpoints covered:
 *   GET /categories                         → getCategories()
 *   GET /categories/:identifier             → getCategoryBySlug(slug)
 *   GET /categories/:identifier/products    → getCategoryProducts(slug)
 *
 * Usage:
 *   import { getCategories, getCategoryBySlug, getCategoryProducts } from "@/services/category.service";
 */

import api from "@/lib/axiosInstance";
import type {
  Category,
  CategoryListResponse,
  CategoryItemResponse,
} from "@/types/category";
import type { Product, ProductListResponse } from "@/types/product";

// ─── GET /categories ───────────────────────────────────────────────────────────

/**
 * Fetches all active categories ordered by displayOrder.
 * @returns Array of Category objects
 */
export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<CategoryListResponse>("/categories");
  return data.data;
}

// ─── GET /categories/:identifier ──────────────────────────────────────────────

/**
 * Fetches a single category by its slug or id.
 * @param identifier  slug (e.g. "one-sound-crackers") or MongoDB id
 * @returns Category object
 */
export async function getCategoryBySlug(identifier: string): Promise<Category> {
  const { data } = await api.get<CategoryItemResponse>(
    `/categories/${identifier}`
  );
  return data.data;
}

// ─── GET /categories/:identifier/products ─────────────────────────────────────

/**
 * Fetches all active products for a given category.
 * @param identifier  category slug or id
 * @returns Array of Product objects
 */
export async function getCategoryProducts(
  identifier: string
): Promise<Product[]> {
  const { data } = await api.get<ProductListResponse>(
    `/categories/${identifier}/products`
  );
  return data.data;
}

// ─── getCategoryWithProducts (combined helper) ─────────────────────────────────

/**
 * Convenience: fetches the category metadata AND its products in parallel.
 * @param identifier  slug or id
 */
export async function getCategoryWithProducts(identifier: string): Promise<{
  category: Category;
  products: Product[];
}> {
  const [category, products] = await Promise.all([
    getCategoryBySlug(identifier),
    getCategoryProducts(identifier),
  ]);
  return { category, products };
}
