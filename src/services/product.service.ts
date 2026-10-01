/**
 * Product Service — all API calls for the /products resource.
 *
 * Endpoints covered:
 *   GET /products                         → getProducts(params)
 *   GET /products/:identifier             → getProductByIdentifier(identifier)
 *
 * Usage:
 *   import { getProducts, getProductByIdentifier, getProductBySlug } from "@/services/product.service";
 */

import api from "@/lib/axiosInstance";
import type {
  Product,
  ProductListResponse,
  ProductItemResponse,
  ProductQueryParams,
} from "@/types/product";

// ─── Deduplication & In-Memory Cache ──────────────────────────────────────────
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

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

export function clearProductCache(): void {
  cache.clear();
  pendingRequests.clear();
}

// ─── GET /products ───────────────────────────────────────────────────────────

/**
 * Fetches active products, with optional search and category filters.
 * Deduplicated and cached to prevent duplicate network calls.
 * @param params { search?: string, category?: string }
 * @param forceRefresh bypass cache
 * @returns Array of Product objects
 */
export async function getProducts(
  params?: ProductQueryParams,
  forceRefresh = false
): Promise<Product[]> {
  const s = params?.search?.trim() || "";
  const c = params?.category?.trim() || "";

  // Product search requires minimum 3 characters to activate API call
  if (params?.search !== undefined && s.length > 0 && s.length < 3) {
    return [];
  }

  const key = `products:${s}:${c}`;

  if (forceRefresh) {
    cache.delete(key);
  }

  // Live search queries have shorter 30s cache; general catalog has 2min
  const ttl = s ? 30 * 1000 : CACHE_TTL_MS;

  return fetchWithDedupe(
    key,
    async () => {
      const { data } = await api.get<ProductListResponse>("/products", {
        params: {
          ...(s ? { search: s } : {}),
          ...(c ? { category: c } : {}),
        },
      });
      return data.data;
    },
    ttl
  );
}

/**
 * Fetches the full products response envelope including count.
 * @param params { search?: string, category?: string }
 * @returns ProductListResponse with message, count, and data
 */
export async function getProductsResponse(
  params?: ProductQueryParams
): Promise<ProductListResponse> {
  const { data } = await api.get<ProductListResponse>("/products", {
    params: {
      ...(params?.search ? { search: params.search.trim() } : {}),
      ...(params?.category ? { category: params.category.trim() } : {}),
    },
  });
  return data;
}

// ─── GET /products/:identifier ───────────────────────────────────────────────

/**
 * Fetches a single product by its id or slug.
 * Deduplicated and cached in-memory.
 * @param identifier product id (e.g. "6aa6633877e6d332b3ea54cc") or slug (e.g. "1-chotta-fancy")
 * @param forceRefresh bypass cache
 * @returns Product object
 */
export async function getProductByIdentifier(
  identifier: string,
  forceRefresh = false
): Promise<Product> {
  const cleanId = encodeURIComponent(identifier.trim());
  const key = `product:${cleanId}`;

  if (forceRefresh) {
    cache.delete(key);
  }

  return fetchWithDedupe(key, async () => {
    const { data } = await api.get<ProductItemResponse>(`/products/${cleanId}`);
    return data.data;
  });
}

/**
 * Alias: fetches product by slug.
 */
export async function getProductBySlug(
  slug: string,
  forceRefresh = false
): Promise<Product> {
  return getProductByIdentifier(slug, forceRefresh);
}

/**
 * Alias: fetches product by MongoDB id.
 */
export async function getProductById(
  id: string,
  forceRefresh = false
): Promise<Product> {
  return getProductByIdentifier(id, forceRefresh);
}
