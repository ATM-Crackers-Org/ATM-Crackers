// ─── Base API shape ────────────────────────────────────────────────────────────

/** All list endpoints return this envelope */
export interface ApiListResponse<T> {
  message: string;
  count: number;
  data: T[];
}

/** All single-item endpoints return this envelope */
export interface ApiItemResponse<T> {
  message: string;
  data: T;
}

// ─── Category ──────────────────────────────────────────────────────────────────

export type CategoryStatus = "ACTIVE" | "INACTIVE";

/** Full category object (from GET /categories and GET /categories/:identifier) */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  status: CategoryStatus;
  displayOrder: number;
  /** Only present on list response — not on single-item response */
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

/** Minimal category reference embedded inside Product objects */
export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

// ─── Typed response aliases ────────────────────────────────────────────────────

export type CategoryListResponse = ApiListResponse<Category>;
export type CategoryItemResponse = ApiItemResponse<Category>;
