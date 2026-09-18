/**
 * Cart Service — API calls for the /cart resource.
 *
 * Endpoints covered:
 *   GET    /cart                      → getCart()
 *   POST   /cart/items                → addProductToCart(dto)
 *   PATCH  /cart/items/{productId}    → updateCartItemQuantity(productId, quantity)
 *   DELETE /cart/items/{productId}    → removeCartItem(productId)
 *   DELETE /cart                      → clearCartApi()
 */

import api from "@/lib/axiosInstance";
import { getCartKey } from "@/lib/cartKey";
import type {
  AddCartItemDto,
  AddCartItemResponse,
  CartData,
  GetCartResponse,
  UpdateCartItemDto,
} from "@/types/cart";

/**
 * GET /cart
 * Fetches the current cart items and summary for this browser session.
 */
export async function getCart(): Promise<CartData> {
  const cartKey = getCartKey();
  const { data } = await api.get<GetCartResponse>("/cart", {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data.data;
}

/**
 * POST /cart/items
 * Adds a product to the cart on the backend.
 *
 * @param dto { productId: string, quantity: number }
 */
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

/**
 * PATCH /cart/items/{productId}
 * Updates the quantity of a specific item in the cart.
 *
 * @param productId string
 * @param quantity number
 */
export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<any> {
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

/**
 * DELETE /cart/items/{productId}
 * Removes a specific product from the cart.
 *
 * @param productId string
 */
export async function removeCartItem(productId: string): Promise<any> {
  const cartKey = getCartKey();
  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.delete(`/cart/items/${cleanId}`, {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}

/**
 * DELETE /cart
 * Clears all items from the current cart on the backend.
 */
export async function clearCartApi(): Promise<any> {
  const cartKey = getCartKey();
  const { data } = await api.delete("/cart", {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}
