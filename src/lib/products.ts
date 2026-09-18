
export interface RawProduct {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  weight: number | null;
  unit: string;
}

export interface Product extends RawProduct {
  mrp: number;
  discount_percent: number;
  savings: number;
  rating: number;
  reviews_count: number;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  category_name: string;
  category_slug: string;
  images?: string[];
}


export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
