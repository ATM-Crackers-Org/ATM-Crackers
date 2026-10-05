"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import type { Product } from "@/lib/products";
import type { CartSummary } from "@/types/cart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  CartItem,
  adaptApiCartItem,
  fetchCart,
  addToCartThunk,
  updateQuantityThunk,
  removeFromCartThunk,
  clearCartThunk,
  selectCartItems,
  selectCartSummary,
  selectCartIsLoading,
  selectCartTotal,
  selectCartCount,
} from "@/store/slices/cartSlice";

export type { CartItem };
export { adaptApiCartItem };

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
  refreshCart: (showLoading?: boolean) => Promise<void>;
  isInCart: (productIdOrSlug: string) => boolean;
  getItemQuantity: (productIdOrSlug: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);
  const isLoading = useAppSelector(selectCartIsLoading);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  const itemsRef = useRef<CartItem[]>(items);
  itemsRef.current = items;

  // Debounce timers for quantity updates to eliminate rapid-fire API spam
  const quantityDebounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Helper to find productId from either productId or slug
  const resolveProductId = useCallback((identifier: string): string => {
    const match = itemsRef.current.find(
      (i) => i.product.id === identifier || i.product.slug === identifier
    );
    return match?.product.id || identifier;
  }, []);

  const refreshCart = useCallback(
    async (_showLoading = false): Promise<void> => {
      await dispatch(fetchCart());
    },
    [dispatch]
  );

  const addToCart = useCallback(
    async (product: Product, quantity = 1): Promise<void> => {
      await dispatch(addToCartThunk({ product, quantity })).unwrap();
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    async (productIdOrSlug: string): Promise<void> => {
      const productId = resolveProductId(productIdOrSlug);

      const existingTimer = quantityDebounceTimers.current.get(productId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        quantityDebounceTimers.current.delete(productId);
      }

      await dispatch(removeFromCartThunk(productId)).unwrap();
    },
    [dispatch, resolveProductId]
  );

  const updateQuantity = useCallback(
    async (productIdOrSlug: string, quantity: number): Promise<void> => {
      const productId = resolveProductId(productIdOrSlug);

      if (quantity <= 0) {
        await removeFromCart(productIdOrSlug);
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const existingTimer = quantityDebounceTimers.current.get(productId);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        const newTimer = setTimeout(async () => {
          quantityDebounceTimers.current.delete(productId);
          try {
            await dispatch(
              updateQuantityThunk({ productId, quantity })
            ).unwrap();
            resolve();
          } catch (err) {
            reject(err);
          }
        }, 250);

        quantityDebounceTimers.current.set(productId, newTimer);
      });
    },
    [dispatch, resolveProductId, removeFromCart]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    quantityDebounceTimers.current.forEach((t) => clearTimeout(t));
    quantityDebounceTimers.current.clear();
    await dispatch(clearCartThunk()).unwrap();
  }, [dispatch]);

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
