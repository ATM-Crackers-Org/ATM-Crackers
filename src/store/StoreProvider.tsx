"use client";

import React, { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { hydrateCart, fetchCart } from "./slices/cartSlice";
import { hydrateWishlist } from "./slices/wishlistSlice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(hydrateCart());
      storeRef.current.dispatch(hydrateWishlist());
      storeRef.current.dispatch(fetchCart());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
