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

// ─── Deduplication & Memory Cache ─────────────────────────────────────────────
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

async function fetchWithDedupe<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = CACHE_TTL_MS
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }

  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const requestPromise = fetcher()
    .then((result) => {
      cache.set(key, { data: result, timestamp: Date.now() });
      pendingRequests.delete(key);
      return result;
    })
    .catch((err) => {
      pendingRequests.delete(key);
      throw err;
    });

  pendingRequests.set(key, requestPromise as Promise<unknown>);
  return requestPromise;
}

export function clearCategoryCache(): void {
  cache.clear();
  pendingRequests.clear();
}

// ─── GET /categories ───────────────────────────────────────────────────────────

/**
 * Fetches all active categories ordered by displayOrder.
 * Results are deduplicated and cached in-memory to prevent repeated/unwanted API calls.
 * @returns Array of Category objects
 */
export async function getCategories(forceRefresh = false): Promise<Category[]> {
  const key = "categories:all";
  if (forceRefresh) {
    cache.delete(key);
  }
  return fetchWithDedupe(key, async () => {
    const { data } = await api.get<CategoryListResponse>("/categories");
    return data.data;
  });
}

// ─── GET /categories/:identifier ──────────────────────────────────────────────

/**
 * Fetches a single category by its slug or id.
 * @param identifier  slug (e.g. "one-sound-crackers") or MongoDB id
 * @returns Category object
 */
export async function getCategoryBySlug(
  identifier: string,
  forceRefresh = false
): Promise<Category> {
  const cleanId = encodeURIComponent(identifier.trim());
  const key = `category:${cleanId}`;
  if (forceRefresh) {
    cache.delete(key);
  }
  return fetchWithDedupe(key, async () => {
    const { data } = await api.get<CategoryItemResponse>(
      `/categories/${cleanId}`
    );
    return data.data;
  });
}

// ─── GET /categories/:identifier/products ─────────────────────────────────────

/**
 * Fetches all active products for a given category.
 * @param identifier  category slug or id
 * @returns Array of Product objects
 */
export async function getCategoryProducts(
  identifier: string,
  forceRefresh = false
): Promise<Product[]> {
  const cleanId = encodeURIComponent(identifier.trim());
  const key = `category_products:${cleanId}`;
  if (forceRefresh) {
    cache.delete(key);
  }
  return fetchWithDedupe(key, async () => {
    const { data } = await api.get<ProductListResponse>(
      `/categories/${cleanId}/products`
    );
    return data.data;
  });
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
