"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product } from "@/lib/products";
import type { ApiCartItem, CartSummary } from "@/types/cart";
import {
  getCart,
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCartApi,
} from "@/services/cart.service";

// ─── Types ────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal?: number;
}

export interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  summary: CartSummary | null;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productIdOrSlug: string) => Promise<void>;
  updateQuantity: (productIdOrSlug: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productIdOrSlug: string) => boolean;
  getItemQuantity: (productIdOrSlug: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "atm_cart";

/**
 * Maps an API cart item into the UI CartItem shape used across the frontend.
 */
export function adaptApiCartItem(item: ApiCartItem): CartItem {
  const savings = Math.max(0, item.mrp - item.sellingPrice);
  const discountPercent =
    item.discountPercent > 0
      ? item.discountPercent
      : item.mrp > 0 && item.mrp > item.sellingPrice
      ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
      : 0;

  const productSlug = item.category?.slug
    ? `${item.category.slug}-${item.productId}`
    : item.productId;

  const product: Product = {
    id: item.productId,
    name: item.name,
    slug: productSlug,
    sku: `ATM-${item.productId.slice(-4).toUpperCase()}`,
    description: null,
    price: item.sellingPrice,
    mrp: item.mrp,
    savings,
    discount_percent: discountPercent,
    category_name: item.category?.name || "Crackers",
    category_slug: item.category?.slug || "crackers",
    category_id: item.categoryId || item.category?.id || "",
    stock_quantity: item.stockStatus === "in_stock" ? 100 : 0,
    low_stock_threshold: 10,
    is_active: true,
    is_featured: false,
    weight: null,
    unit: "box",
    rating: 4.5,
    reviews_count: 24,
    is_new_arrival: false,
    is_trending: false,
    is_best_seller: false,
    images: item.images && item.images.length > 0 ? item.images : [],
  };

  return {
    product,
    quantity: item.quantity,
    itemTotal: item.itemTotal ?? item.sellingPrice * item.quantity,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Computed fallbacks in case summary is not yet loaded
  const total =
    summary?.grandTotal ??
    items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count =
    summary?.totalItems ?? items.reduce((sum, i) => sum + i.quantity, 0);

  // Helper to find productId from either productId or slug
  const resolveProductId = useCallback(
    (identifier: string): string => {
      const match = items.find(
        (i) => i.product.id === identifier || i.product.slug === identifier
      );
      return match?.product.id || identifier;
    },
    [items]
  );

  // ─── Fetch Cart from API ──────────────────────────────────────
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCart();
      if (data && Array.isArray(data.items)) {
        const adaptedItems = data.items.map(adaptApiCartItem);
        setItems(adaptedItems);
        setSummary(data.summary || null);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(adaptedItems));
        } catch {
          // ignore localStorage error
        }
      } else {
        setItems([]);
        setSummary(null);
      }
    } catch (err) {
      console.warn("Could not fetch cart from API, checking local storage:", err);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } catch {
        // ignore
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from API on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // ─── Add To Cart (POST /cart/items) ──────────────────────────
  const addToCart = useCallback(
    async (product: Product, quantity = 1): Promise<void> => {
      const productId = product.id;
      if (!productId) {
        console.warn(
          `[CartContext] Product "${product.name}" has no ID; cannot add via API.`
        );
        return;
      }

      // 1. Optimistic update
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.product.id === productId || i.product.slug === product.slug
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantity,
            itemTotal:
              (updated[idx].quantity + quantity) * updated[idx].product.price,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity,
            itemTotal: product.price * quantity,
          },
        ];
      });

      // 2. API Call & Sync
      try {
        await addProductToCart({ productId, quantity });
        await refreshCart();
      } catch (err) {
        console.error("Failed to add product to cart API:", err);
        // Rollback state on error
        await refreshCart();
        throw err;
      }
    },
    [refreshCart]
  );

  // ─── Update Quantity (PATCH /cart/items/{productId}) ──────────
  const updateQuantity = useCallback(
    async (productIdOrSlug: string, quantity: number): Promise<void> => {
      const productId = resolveProductId(productIdOrSlug);

      if (quantity <= 0) {
        await removeFromCart(productIdOrSlug);
        return;
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId || i.product.slug === productIdOrSlug
            ? {
                ...i,
                quantity,
                itemTotal: i.product.price * quantity,
              }
            : i
        )
      );

      try {
        await updateCartItemQuantity(productId, quantity);
        await refreshCart();
      } catch (err) {
        console.error("Failed to update cart quantity on API:", err);
        await refreshCart();
        throw err;
      }
    },
    [resolveProductId, refreshCart]
  );

  // ─── Remove Item (DELETE /cart/items/{productId}) ─────────────
  const removeFromCart = useCallback(
    async (productIdOrSlug: string): Promise<void> => {
      const productId = resolveProductId(productIdOrSlug);

      // Optimistic remove
      setItems((prev) =>
        prev.filter(
          (i) => i.product.id !== productId && i.product.slug !== productIdOrSlug
        )
      );

      try {
        await removeCartItem(productId);
        await refreshCart();
      } catch (err) {
        console.error("Failed to delete cart item on API:", err);
        await refreshCart();
        throw err;
      }
    },
    [resolveProductId, refreshCart]
  );

  // ─── Clear Cart (DELETE /cart) ────────────────────────────────
  const clearCart = useCallback(async (): Promise<void> => {
    setItems([]);
    setSummary(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    try {
      await clearCartApi();
      await refreshCart();
    } catch (err) {
      console.error("Failed to clear cart on API:", err);
      await refreshCart();
      throw err;
    }
  }, [refreshCart]);

  // ─── Helpers ─────────────────────────────────────────────────
  const isInCart = useCallback(
    (identifier: string) =>
      items.some(
        (i) => i.product.id === identifier || i.product.slug === identifier
      ),
    [items]
  );

  const getItemQuantity = useCallback(
    (identifier: string) =>
      items.find(
        (i) => i.product.id === identifier || i.product.slug === identifier
      )?.quantity ?? 0,
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        summary,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
