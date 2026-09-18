import api from "@/lib/axiosInstance";
import { getCartKey } from "@/lib/cartKey";
import type {
  CheckoutDto,
  CreateOrderResponse,
  CheckoutPreviewResponse,
} from "@/types/order";

/**
 * POST /orders
 * Creates a COD / manual payment order from the current session's cart.
 */
export async function createOrder(
  dto: Omit<CheckoutDto, "cartKey"> & { cartKey?: string }
): Promise<CreateOrderResponse> {
  const cartKey = dto.cartKey || getCartKey();
  const payload: CheckoutDto = {
    ...dto,
    cartKey,
    deliveryMethod: dto.deliveryMethod || "STANDARD",
    paymentMethod: dto.paymentMethod || "MANUAL",
  };

  const { data } = await api.post<CreateOrderResponse>("/orders", payload, {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}

/**
 * POST /checkout/preview
 * Validates the cart and calculates totals without creating an order.
 */
export async function previewCheckout(
  dto: Omit<CheckoutDto, "cartKey"> & { cartKey?: string }
): Promise<CheckoutPreviewResponse> {
  const cartKey = dto.cartKey || getCartKey();
  const payload: CheckoutDto = {
    ...dto,
    cartKey,
    deliveryMethod: dto.deliveryMethod || "STANDARD",
    paymentMethod: dto.paymentMethod || "MANUAL",
  };

  const { data } = await api.post<CheckoutPreviewResponse>(
    "/checkout/preview",
    payload,
    {
      headers: {
        "x-cart-key": cartKey,
      },
    }
  );
  return data;
}
