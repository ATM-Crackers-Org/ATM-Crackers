"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { Product } from "@/lib/products";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "TOGGLE"; product: Product }
  | { type: "REMOVE"; slug: string }
  | { type: "LOAD"; items: Product[] };

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.some(
        (i) => i.slug === action.product.slug
      );
      return {
        items: exists
          ? state.items.filter((i) => i.slug !== action.product.slug)
          : [...state.items, action.product],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.slug !== action.slug) };
    case "LOAD":
      return { items: action.items };
    default:
      return state;
  }
}

interface WishlistContextValue extends WishlistState {
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "atm_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "LOAD", items: JSON.parse(stored) });
      }
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      //
    }
  }, [state.items]);

  const toggleWishlist = useCallback((product: Product) => {
    dispatch({ type: "TOGGLE", product });
  }, []);

  const removeFromWishlist = useCallback((slug: string) => {
    dispatch({ type: "REMOVE", slug });
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => state.items.some((i) => i.slug === slug),
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        count: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
