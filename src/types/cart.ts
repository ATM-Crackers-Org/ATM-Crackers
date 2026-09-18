export interface AddCartItemDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface AddCartItemResponse {
  message?: string;
  data?: any;
  statusCode?: number;
}

export interface ApiCartCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiCartItem {
  productId: string;
  categoryId: string;
  category: ApiCartCategory;
  name: string;
  images: string[];
  quantity: number;
  mrp: number;
  discountPercent: number;
  sellingPrice: number;
  itemTotal: number;
  stockStatus: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
}

export interface CartData {
  cartKey: string;
  items: ApiCartItem[];
  summary: CartSummary;
}

export interface GetCartResponse {
  message: string;
  data: CartData;
}
