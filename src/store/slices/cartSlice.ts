import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/products";
import type { ApiCartItem, CartSummary } from "@/types/cart";
import {
  getCart,
  addProductToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeCartItem as apiRemoveItem,
  clearCartApi,
} from "@/services/cart.service";

const STORAGE_KEY = "atm_cart";

export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal?: number;
}

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

function persistCartLocally(items: CartItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }
}

function loadInitialCart(): CartItem[] {
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

export interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  isLoading: true,
  isSyncing: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      if (data && Array.isArray(data.items)) {
        return {
          items: data.items.map(adaptApiCartItem),
          summary: data.summary || null,
        };
      }
      return { items: [], summary: null };
    } catch (err: unknown) {
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (
    { product, quantity = 1 }: { product: Product; quantity?: number },
    { dispatch, rejectWithValue }
  ) => {
    // 1. Optimistic update
    dispatch(cartSlice.actions.optimisticAdd({ product, quantity }));

    // 2. Server sync
    try {
      const productId = product.id;
      if (!productId) {
        throw new Error(`Product "${product.name}" has no ID`);
      }
      await addProductToCart({ productId, quantity });
      // Refresh totals from server
      const data = await getCart();
      if (data && Array.isArray(data.items)) {
        return {
          items: data.items.map(adaptApiCartItem),
          summary: data.summary || null,
        };
      }
      return null;
    } catch (err: unknown) {
      // Refetch from server to rollback accurately
      dispatch(fetchCart());
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    },
    { dispatch, rejectWithValue }
  ) => {
    // 1. Optimistic update
    dispatch(cartSlice.actions.optimisticUpdateQuantity({ productId, quantity }));

    // 2. Server sync
    try {
      if (quantity <= 0) {
        await apiRemoveItem(productId);
      } else {
        await apiUpdateQuantity(productId, quantity);
      }
      const data = await getCart();
      if (data && Array.isArray(data.items)) {
        return {
          items: data.items.map(adaptApiCartItem),
          summary: data.summary || null,
        };
      }
      return null;
    } catch (err: unknown) {
      dispatch(fetchCart());
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { dispatch, rejectWithValue }) => {
    // 1. Optimistic remove
    dispatch(cartSlice.actions.optimisticRemove(productId));

    // 2. Server sync
    try {
      await apiRemoveItem(productId);
      const data = await getCart();
      if (data && Array.isArray(data.items)) {
        return {
          items: data.items.map(adaptApiCartItem),
          summary: data.summary || null,
        };
      }
      return null;
    } catch (err: unknown) {
      dispatch(fetchCart());
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(cartSlice.actions.optimisticClear());
    try {
      await clearCartApi();
      return true;
    } catch (err: unknown) {
      dispatch(fetchCart());
      return rejectWithValue(
        (err as { message?: string })?.message || "Failed to clear cart"
      );
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      const local = loadInitialCart();
      if (local.length > 0 && state.items.length === 0) {
        state.items = local;
      }
    },
    optimisticAdd: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingIdx = state.items.findIndex(
        (i) => i.product.id === product.id || i.product.slug === product.slug
      );
      if (existingIdx >= 0) {
        const nextQty = state.items[existingIdx].quantity + quantity;
        state.items[existingIdx] = {
          ...state.items[existingIdx],
          quantity: nextQty,
          itemTotal: nextQty * state.items[existingIdx].product.price,
        };
      } else {
        state.items.push({
          product,
          quantity,
          itemTotal: product.price * quantity,
        });
      }
      persistCartLocally(state.items);
    },
    optimisticUpdateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) => i.product.id !== productId && i.product.slug !== productId
        );
      } else {
        const item = state.items.find(
          (i) => i.product.id === productId || i.product.slug === productId
        );
        if (item) {
          item.quantity = quantity;
          item.itemTotal = quantity * item.product.price;
        }
      }
      persistCartLocally(state.items);
    },
    optimisticRemove: (state, action: PayloadAction<string>) => {
      const identifier = action.payload;
      state.items = state.items.filter(
        (i) => i.product.id !== identifier && i.product.slug !== identifier
      );
      persistCartLocally(state.items);
    },
    optimisticClear: (state) => {
      state.items = [];
      state.summary = null;
      persistCartLocally([]);
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSyncing = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        persistCartLocally(action.payload.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isSyncing = false;
        state.error = (action.payload as string) || "Failed to load cart";
        // Fall back to local items if empty
        if (state.items.length === 0) {
          state.items = loadInitialCart();
        }
      });

    // addToCartThunk
    builder.addCase(addToCartThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        persistCartLocally(action.payload.items);
      }
    });

    // updateQuantityThunk
    builder.addCase(updateQuantityThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        persistCartLocally(action.payload.items);
      }
    });

    // removeFromCartThunk
    builder.addCase(removeFromCartThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        persistCartLocally(action.payload.items);
      }
    });

    // clearCartThunk
    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.items = [];
      state.summary = null;
      persistCartLocally([]);
    });
  },
});

export const {
  hydrateCart,
  optimisticAdd,
  optimisticUpdateQuantity,
  optimisticRemove,
  optimisticClear,
} = cartSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartSummary = (state: { cart: CartState }) =>
  state.cart.summary;
export const selectCartIsLoading = (state: { cart: CartState }) =>
  state.cart.isLoading;
export const selectCartIsSyncing = (state: { cart: CartState }) =>
  state.cart.isSyncing;

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.summary?.grandTotal ??
  state.cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.summary?.totalItems ??
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectItemQuantity =
  (productIdOrSlug: string) => (state: { cart: CartState }) => {
    const item = state.cart.items.find(
      (i) =>
        i.product.id === productIdOrSlug || i.product.slug === productIdOrSlug
    );
    return item?.quantity || 0;
  };

export const selectIsInCart =
  (productIdOrSlug: string) => (state: { cart: CartState }) => {
    return state.cart.items.some(
      (i) =>
        i.product.id === productIdOrSlug || i.product.slug === productIdOrSlug
    );
  };

export default cartSlice.reducer;
