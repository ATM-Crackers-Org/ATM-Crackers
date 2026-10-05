

import api from "@/lib/axiosInstance";
import { getCartKey } from "@/lib/cartKey";
import type {
  AddCartItemDto,
  AddCartItemResponse,
  CartData,
  GetCartResponse,
  UpdateCartItemDto,
} from "@/types/cart";


export async function getCart(): Promise<CartData> {
  const cartKey = getCartKey();
  const { data } = await api.get<GetCartResponse>("/cart", {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data.data;
}


export async function addProductToCart(
  dto: AddCartItemDto
): Promise<AddCartItemResponse> {
  const cartKey = getCartKey();
  const { data } = await api.post<AddCartItemResponse>("/cart/items", dto, {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}


export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<unknown> {
  const cartKey = getCartKey();
  const cleanId = encodeURIComponent(productId.trim());
  const body: UpdateCartItemDto = { quantity };
  const { data } = await api.patch(`/cart/items/${cleanId}`, body, {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}


export async function removeCartItem(productId: string): Promise<unknown> {
  const cartKey = getCartKey();
  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.delete(`/cart/items/${cleanId}`, {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}


export async function clearCartApi(): Promise<unknown> {
  const cartKey = getCartKey();
  const { data } = await api.delete("/cart", {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}
