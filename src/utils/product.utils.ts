import type { StockStatus } from "@/types/product";

/**
 * Product-specific utility helpers.
 * Import from "@/utils/product.utils".
 */

/**
 * Returns the first valid image URL from the images array,
 * falls back to the ATM branded placeholder.
 */
const PRODUCT_PLACEHOLDER =
  "https://placehold.co/600x600/F5A623/111827?text=ATM+Crackers";

export function primaryImage(images: string[]): string {
  return images?.[0] || PRODUCT_PLACEHOLDER;
}

/**
 * Human-readable label for stockStatus field.
 *
 * @example
 *   stockLabel("in_stock")     // "In Stock"
 *   stockLabel("out_of_stock") // "Out of Stock"
 *   stockLabel("limited")      // "Limited Stock"
 */
export function stockLabel(status: StockStatus): string {
  const map: Record<StockStatus, string> = {
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    limited: "Limited Stock",
  };
  return map[status] ?? status;
}

/**
 * Returns the savings amount: mrp - sellingPrice.
 */
export function discountAmount(mrp: number, sellingPrice: number): number {
  return Math.max(0, mrp - sellingPrice);
}

/**
 * Returns true if the product has any discount.
 */
export function hasDiscount(discountPercent: number): boolean {
  return discountPercent > 0;
}
