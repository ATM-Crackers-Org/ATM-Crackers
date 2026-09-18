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

// ─── GET /products ───────────────────────────────────────────────────────────

/**
 * Fetches active products, with optional search and category filters.
 * @param params { search?: string, category?: string }
 * @returns Array of Product objects
 */
export async function getProducts(
  params?: ProductQueryParams
): Promise<Product[]> {
  const { data } = await api.get<ProductListResponse>("/products", {
    params: {
      ...(params?.search ? { search: params.search.trim() } : {}),
      ...(params?.category ? { category: params.category.trim() } : {}),
    },
  });
  return data.data;
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
 * @param identifier product id (e.g. "6aa6633877e6d332b3ea54cc") or slug (e.g. "1-chotta-fancy")
 * @returns Product object
 */
export async function getProductByIdentifier(
  identifier: string
): Promise<Product> {
  const cleanId = encodeURIComponent(identifier.trim());
  const { data } = await api.get<ProductItemResponse>(`/products/${cleanId}`);
  return data.data;
}

/**
 * Alias: fetches product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  return getProductByIdentifier(slug);
}

/**
 * Alias: fetches product by MongoDB id.
 */
export async function getProductById(id: string): Promise<Product> {
  return getProductByIdentifier(id);
}
