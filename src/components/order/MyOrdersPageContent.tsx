"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSessionOrders, cancelOrder } from "@/services/order.service";
import type { SessionOrder } from "@/types/order";
import { formatPrice } from "@/lib/products";
import { useToast } from "@/context/ToastContext";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  FaBoxOpen,
  FaTruckFast,
  FaCheck,
  FaWhatsapp,
  FaLocationDot,
  FaReceipt,
  FaBan,
  FaSpinner,
  FaCopy,
  FaClock,
  FaCircleCheck,
  FaCartShopping,
  FaArrowRotateRight,
} from "react-icons/fa6";

export function MyOrdersPageContent() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<SessionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState<SessionOrder | null>(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      const res = await getSessionOrders();
      if (res && Array.isArray(res.data)) {
        // Sort newest first
        const sorted = [...res.data].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleConfirmCancel() {
    if (!confirmCancelOrder) return;
    const orderNumber = confirmCancelOrder.orderNumber;
    setCancellingOrderId(orderNumber);

    try {
      const res = await cancelOrder(orderNumber);
      showToast(res.message || "Order cancelled successfully!", "success");

      // Update local order state immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber
            ? { ...o, orderStatus: "CANCELLED" }
            : o
        )
      );
      setConfirmCancelOrder(null);
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Failed to cancel order. Please contact us on WhatsApp.";
      showToast(errorMsg, "error");
    } finally {
      setCancellingOrderId(null);
    }
  }

  function handleCopyOrderNumber(orderNumber: string) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      showToast(`Copied ${orderNumber} to clipboard!`, "success");
    }
  }

  function formatDate(isoStr: string) {
    try {
      return new Date(isoStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  }

  function getOrderStatusBadge(status: string) {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <FaClock className="text-[11px]" /> Pending Confirmation
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FaCircleCheck className="text-[11px]" /> Order Confirmed
          </span>
        );
      case "PROCESSING":
      case "PACKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <FaBoxOpen className="text-[11px]" /> {s === "PACKED" ? "Packed at Factory" : "Processing"}
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <FaTruckFast className="text-[11px]" /> Dispatched (In Transit)
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCheck className="text-[11px]" /> Delivered
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 line-through">
            <FaBan className="text-[11px]" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
            {s}
          </span>
        );
    }
  }

  function getPaymentBadge(status: string) {
    const s = (status || "").toUpperCase();
    if (s === "PAID") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          Payment Paid
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
        Payment Pending
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-warm-white py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">My Orders</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 flex items-center gap-3">
              <span>My Orders</span>
              {!isLoading && orders.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-crimson rounded-full border border-red-100">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              View and track all fireworks orders booked in this browser session.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 bg-white text-xs font-bold text-zinc-700 rounded-xl shadow-xs hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FaArrowRotateRight className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ─── LOADING STATE ────────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                  <div className="h-5 w-40 bg-zinc-200 rounded-md" />
                  <div className="h-6 w-24 bg-zinc-200 rounded-full" />
                </div>
                <div className="h-16 bg-zinc-100 rounded-xl" />
                <div className="h-10 bg-zinc-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ─── EMPTY STATE ──────────────────────────────────────────── */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center bg-white rounded-3xl p-10 md:p-14 border border-zinc-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <FaBoxOpen />
            </div>
            <h2 className="text-xl font-display font-bold text-zinc-900 mb-2">
              No orders found for this session
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mb-6 leading-relaxed">
              You haven&apos;t placed any cracker orders in this browser session yet.
              If you placed an order previously or on another device, you can track it anytime using your Order ID.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors text-xs sm:text-sm cursor-pointer"
              >
                <FaCartShopping /> Shop Crackers
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-200 bg-white text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 transition-colors text-xs sm:text-sm cursor-pointer"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}

        {/* ─── ORDERS LIST ──────────────────────────────────────────── */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              // User cancellation rule: before paid and before dispatch (PENDING order)
              const isEligibleToCancel =
                order.orderStatus === "PENDING" &&
                order.paymentStatus !== "PAID";

              return (
                <div
                  key={order.id || order.orderNumber}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Card Header: Order Number, Date, Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          Order Number:
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-mono">
                          {order.orderNumber}
                        </h2>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderNumber(order.orderNumber)}
                          className="text-zinc-400 hover:text-crimson text-xs p-1 rounded-md transition-colors cursor-pointer"
                          title="Copy order number"
                        >
                          <FaCopy />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Booked on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      {getOrderStatusBadge(order.orderStatus)}
                      {getPaymentBadge(order.paymentStatus)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 mb-6 divide-y divide-zinc-50">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="pt-3 first:pt-0 flex items-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-100 bg-zinc-50">
                          <ProductImage
                            productName={item.productName}
                            categoryName={item.categoryName}
                            size="thumb"
                            showLabel={false}
                            imageUrl={item.image}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-zinc-800 line-clamp-1">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {item.categoryName}
                          </p>
                          {item.offerName && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-crimson text-[10px] font-bold rounded-md border border-red-100">
                              {item.offerName}
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-zinc-500">
                            {item.quantity} × {formatPrice(item.sellingPrice)}
                          </p>
                          <p className="text-sm font-bold text-zinc-900 mt-0.5">
                            {formatPrice(item.itemTotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address & Price Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-5 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6 text-xs text-zinc-600">
                    {/* Shipping Address */}
                    <div>
                      <p className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                        <FaLocationDot className="text-crimson" /> Delivery Godown Address
                      </p>
                      <p className="text-zinc-800 font-semibold">
                        {order.shippingAddress?.fullName || order.customer?.name}
                      </p>
                      <p className="text-zinc-600 leading-relaxed mt-0.5">
                        {order.shippingAddress?.streetAddress},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state || "Tamil Nadu"} -{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                      <p className="text-zinc-500 mt-1">
                        Phone: +91 {order.customer?.mobile}
                      </p>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-1.5 md:pl-4 md:border-l md:border-zinc-200">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-zinc-800">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>

                      {order.totalDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>
                            Discount {order.couponCode ? `(${order.couponCode})` : ""}:
                          </span>
                          <span className="font-semibold">
                            −{formatPrice(order.couponDiscount || order.totalDiscount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Lorry Freight:</span>
                        <span className="font-bold text-amber-800">To-Pay at Godown</span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                        <span>Total Payable:</span>
                        <span className="text-crimson text-base font-black">
                          {formatPrice(order.grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={`https://wa.me/918056566845?text=${encodeURIComponent(
                          `Hi ATM Crackers, I want an update regarding my order #${order.orderNumber} (Amount: ₹${order.grandTotal}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#1ebd5a] transition-colors cursor-pointer"
                      >
                        <FaWhatsapp className="text-sm" /> WhatsApp Help
                      </a>
                    </div>

                    {/* Cancellation Action */}
                    {isEligibleToCancel && (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelOrder(order)}
                        disabled={cancellingOrderId === order.orderNumber}
                        className="w-full sm:w-auto px-4 py-2.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {cancellingOrderId === order.orderNumber ? (
                          <>
                            <FaSpinner className="animate-spin text-xs" /> Cancelling...
                          </>
                        ) : (
                          <>
                            <FaBan className="text-xs" /> Cancel Order
                          </>
                        )}
                      </button>
                    )}

                    {order.orderStatus === "CANCELLED" && (
                      <span className="text-xs font-semibold text-zinc-400">
                        This order has been cancelled.
                      </span>
                    )}

                    {!isEligibleToCancel &&
                      order.orderStatus !== "CANCELLED" && (
                        <span className="text-[11px] text-zinc-400">
                          {order.paymentStatus === "PAID"
                            ? "Paid order • Dispatched from factory"
                            : "Order processed • Cannot be cancelled online"}
                        </span>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── CONFIRM CANCEL MODAL ─────────────────────────────────── */}
        {confirmCancelOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 shadow-2xl animate-scale-up">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaBan />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 text-center mb-2">
                Cancel Order {confirmCancelOrder.orderNumber}?
              </h3>
              <p className="text-xs text-zinc-500 text-center mb-6 leading-relaxed">
                Are you sure you want to cancel this order? This action cannot be undone and your crackers reservation will be released.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmCancelOrder(null)}
                  disabled={Boolean(cancellingOrderId)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={Boolean(cancellingOrderId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {cancellingOrderId ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" /> Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
