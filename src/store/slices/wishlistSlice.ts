import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/products";

const STORAGE_KEY = "atm_wishlist";

export interface WishlistState {
  items: Product[];
}

function loadInitialWishlist(): Product[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
  }
  return [];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist: (state) => {
      state.items = loadInitialWishlist();
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((i) => i.slug === action.payload.slug);
      if (exists) {
        state.items = state.items.filter((i) => i.slug !== action.payload.slug);
      } else {
        state.items.push(action.payload);
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        } catch {
          // ignore
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.slug !== action.payload);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        } catch {
          // ignore
        }
      }
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        } catch {
          // ignore
        }
      }
    },
  },
});

export const {
  hydrateWishlist,
  toggleWishlist,
  removeFromWishlist,
  setWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;
export const selectIsWishlisted =
  (slug: string) => (state: { wishlist: WishlistState }) =>
    state.wishlist.items.some((i) => i.slug === slug);

export default wishlistSlice.reducer;
