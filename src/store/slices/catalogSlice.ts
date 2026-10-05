import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { getCategories, getCategoryProducts } from "@/services/category.service";

export interface CatalogState {
  categories: Category[];
  isCategoriesLoading: boolean;
  categoriesLoaded: boolean;
  categoriesError: string | null;
  productsByCategory: Record<string, Product[]>;
  isProductsLoading: Record<string, boolean>;
  productsErrors: Record<string, string | null>;
}

const initialState: CatalogState = {
  categories: [],
  isCategoriesLoading: false,
  categoriesLoaded: false,
  categoriesError: null,
  productsByCategory: {},
  isProductsLoading: {},
  productsErrors: {},
};

export const fetchCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async (forceRefresh: boolean = false, { getState }) => {
    const state = getState() as { catalog: CatalogState };
    if (!forceRefresh && state.catalog.categoriesLoaded) {
      return state.catalog.categories;
    }
    const categories = await getCategories(forceRefresh);
    return categories;
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  "catalog/fetchCategoryProducts",
  async (
    {
      identifier,
      forceRefresh = false,
    }: { identifier: string; forceRefresh?: boolean },
    { getState }
  ) => {
    const state = getState() as { catalog: CatalogState };
    if (!forceRefresh && state.catalog.productsByCategory[identifier]) {
      return {
        identifier,
        products: state.catalog.productsByCategory[identifier],
      };
    }
    const products = await getCategoryProducts(identifier, forceRefresh);
    return { identifier, products };
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.categoriesLoaded = true;
    },
    setCategoryProducts: (
      state,
      action: PayloadAction<{ identifier: string; products: Product[] }>
    ) => {
      state.productsByCategory[action.payload.identifier] =
        action.payload.products;
    },
    clearCatalogCache: (state) => {
      state.categories = [];
      state.categoriesLoaded = false;
      state.productsByCategory = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isCategoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isCategoriesLoading = false;
        state.categories = action.payload;
        state.categoriesLoaded = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isCategoriesLoading = false;
        state.categoriesError = action.error.message || "Failed to load categories";
      })
      // fetchCategoryProducts
      .addCase(fetchCategoryProducts.pending, (state, action) => {
        const id = action.meta.arg.identifier;
        state.isProductsLoading[id] = true;
        state.productsErrors[id] = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        const { identifier, products } = action.payload;
        state.isProductsLoading[identifier] = false;
        state.productsByCategory[identifier] = products;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        const id = action.meta.arg.identifier;
        state.isProductsLoading[id] = false;
        state.productsErrors[id] =
          action.error.message || "Failed to load products for category";
      });
  },
});

export const { setCategories, setCategoryProducts, clearCatalogCache } =
  catalogSlice.actions;

export const selectCategories = (state: { catalog: CatalogState }) =>
  state.catalog.categories;
export const selectIsCategoriesLoading = (state: { catalog: CatalogState }) =>
  state.catalog.isCategoriesLoading;
export const selectCategoryProducts =
  (identifier: string) => (state: { catalog: CatalogState }) =>
    state.catalog.productsByCategory[identifier] || [];
export const selectIsCategoryProductsLoading =
  (identifier: string) => (state: { catalog: CatalogState }) =>
    Boolean(state.catalog.isProductsLoading[identifier]);

export default catalogSlice.reducer;
