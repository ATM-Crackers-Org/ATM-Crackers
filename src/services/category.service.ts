
import api from "@/lib/axiosInstance";
import type {
  Category,
  CategoryListResponse,
  CategoryItemResponse,
} from "@/types/category";
import type { Product, ProductListResponse } from "@/types/product";

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
