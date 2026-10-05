"use client";

import React, { createContext, useContext, useCallback } from "react";
import type { Product } from "@/lib/products";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleWishlist as toggleAction,
  removeFromWishlist as removeAction,
  selectWishlistItems,
  selectWishlistCount,
} from "@/store/slices/wishlistSlice";

interface WishlistContextValue {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const toggleWishlist = useCallback(
    (product: Product) => {
      dispatch(toggleAction(product));
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    (slug: string) => {
      dispatch(removeAction(slug));
    },
    [dispatch]
  );

  const isWishlisted = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        count,
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
