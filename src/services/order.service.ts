import api from "@/lib/axiosInstance";
import { getCartKey } from "@/lib/cartKey";
import type {
  CheckoutDto,
  CreateOrderResponse,
  CheckoutPreviewResponse,
  GetSessionOrdersResponse,
  CancelOrderResponse,
} from "@/types/order";

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

/**
 * GET /orders/session
 * Fetches all orders created in the current browser cart session.
 */
export async function getSessionOrders(): Promise<GetSessionOrdersResponse> {
  const cartKey = getCartKey();
  const { data } = await api.get<GetSessionOrdersResponse>("/orders/session", {
    headers: {
      "x-cart-key": cartKey,
    },
  });
  return data;
}

/**
 * PATCH /orders/{orderNumber}/cancel
 * Cancels a pending order before dispatch / payment.
 */
export async function cancelOrder(
  orderNumber: string
): Promise<CancelOrderResponse> {
  const cartKey = getCartKey();
  const cleanOrderNumber = encodeURIComponent(orderNumber.trim());
  const { data } = await api.patch<CancelOrderResponse>(
    `/orders/${cleanOrderNumber}/cancel`,
    {},
    {
      headers: {
        "x-cart-key": cartKey,
      },
    }
  );
  return data;
}
