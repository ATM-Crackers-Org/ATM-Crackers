import type { ApiListResponse, ApiItemResponse, CategoryRef } from "./category";

export type ProductStatus = "ACTIVE" | "INACTIVE";
export type StockStatus = "in_stock" | "out_of_stock" | "limited";

export interface Product {
  id: string;
  categoryId: string;
  category: CategoryRef;
  name: string;
  slug: string;
  description: string;
  images: string[];
  mrp: number;
  discountPercent: number;
  sellingPrice: number;
  stockStatus: StockStatus;
  status: ProductStatus;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

export type ProductListResponse = ApiListResponse<Product>;
export type ProductItemResponse = ApiItemResponse<Product>;

export interface ProductQueryParams {
  search?: string;
  category?: string;
}
