export interface CheckoutCustomerDto {
  name: string;
  mobile: string;
  email?: string;
}

export interface CheckoutAddressDto {
  fullName: string;
  streetAddress: string;
  city: string;
  state?: string;
  pincode: string;
  landmark?: string;
}

export type DeliveryMethod = "STANDARD" | "EXPRESS";
export type PaymentMethod = "MANUAL";

export interface CheckoutDto {
  cartKey: string;
  customer: CheckoutCustomerDto;
  shippingAddress: CheckoutAddressDto;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  promoCode?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  itemTotal: number;
  images?: string[];
}

export interface OrderData {
  id?: string;
  _id?: string;
  orderId?: string;
  orderNumber?: string;
  cartKey?: string;
  customer?: CheckoutCustomerDto;
  shippingAddress?: CheckoutAddressDto;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  grandTotal?: number;
  status?: string;
  createdAt?: string;
}

export interface CreateOrderResponse {
  message?: string;
  data?: OrderData | Record<string, unknown>;
  orderId?: string;
  statusCode?: number;
}

export interface CheckoutPreviewResponse {
  message?: string;
  data?: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    grandTotal: number;
    deliveryMethod: DeliveryMethod;
    items?: OrderItem[];
  };
  statusCode?: number;
}
