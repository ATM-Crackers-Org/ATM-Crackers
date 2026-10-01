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
  couponCode?: string;
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

export interface CheckoutPreviewItem {
  productId: string;
  categoryId: string;
  productName: string;
  categoryName: string;
  image: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  itemTotal: number;
}

export interface CheckoutPreviewData {
  items: CheckoutPreviewItem[];
  subtotal: number;
  totalDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  couponCode: string | null;
  couponDiscount: number;
  deliveryMethod: DeliveryMethod;
  paymentStatus: string;
}

export interface CheckoutPreviewResponse {
  message: string;
  data: CheckoutPreviewData;
  statusCode?: number;
}

export interface SessionOrderItem {
  offerId?: string | null;
  offerName?: string | null;
  productId: string;
  categoryId: string;
  productName: string;
  categoryName: string;
  image: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  itemTotal: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface SessionOrder {
  id: string;
  orderNumber: string;
  customer: CheckoutCustomerDto;
  shippingAddress: CheckoutAddressDto;
  items: SessionOrderItem[];
  subtotal: number;
  totalDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod | string;
  paymentStatus: OrderPaymentStatus | string;
  orderStatus: OrderStatus | string;
  couponCode?: string | null;
  couponDiscount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface GetSessionOrdersResponse {
  message: string;
  count: number;
  data: SessionOrder[];
  statusCode?: number;
}

export interface CancelOrderResponse {
  message: string;
  data?: SessionOrder;
  statusCode?: number;
}
