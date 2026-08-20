"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { Product } from "@/lib/products";

// ─── Types ────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}

type CartAction =
  | { type: "ADD"; product: Product; quantity?: number }
  | { type: "REMOVE"; slug: string }
  | { type: "UPDATE"; slug: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(
        (i) => i.product.slug === action.product.slug
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.product.slug === action.product.slug
            ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
            : i
        );
      } else {
        items = [...state.items, { product: action.product, quantity: action.quantity ?? 1 }];
      }
      return computeTotals({ ...state, items });
    }
    case "REMOVE": {
      const items = state.items.filter((i) => i.product.slug !== action.slug);
      return computeTotals({ ...state, items });
    }
    case "UPDATE": {
      if (action.quantity < 1) {
        const items = state.items.filter((i) => i.product.slug !== action.slug);
        return computeTotals({ ...state, items });
      }
      const items = state.items.map((i) =>
        i.product.slug === action.slug ? { ...i, quantity: action.quantity } : i
      );
      return computeTotals({ ...state, items });
    }
    case "CLEAR":
      return { items: [], total: 0, count: 0 };
    case "LOAD":
      return computeTotals({ ...state, items: action.items });
    default:
      return state;
  }
}

function computeTotals(state: CartState): CartState {
  const total = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  return { ...state, total, count };
}

// ─── Context ──────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (slug: string) => boolean;
  getItemQuantity: (slug: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "atm_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    count: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        dispatch({ type: "LOAD", items });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD", product, quantity });
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    dispatch({ type: "REMOVE", slug });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    dispatch({ type: "UPDATE", slug, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const isInCart = useCallback(
    (slug: string) => state.items.some((i) => i.product.slug === slug),
    [state.items]
  );

  const getItemQuantity = useCallback(
    (slug: string) =>
      state.items.find((i) => i.product.slug === slug)?.quantity ?? 0,
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
