"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { createOrder } from "@/services/order.service";
import type { DeliveryMethod } from "@/types/order";
import { InvoiceModal, printInvoiceDocument } from "@/components/checkout/InvoiceModal";
import type { CartItem } from "@/context/CartContext";
import {
  FaCartShopping,
  FaCheck,
  FaLocationDot,
  FaWhatsapp,
  FaTruckFast,
  FaSpinner,
  FaReceipt,
  FaBoxOpen,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa6";

export function CheckoutPageContent() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();

  // Single-step Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    landmark: "",
    deliveryOption: "STANDARD" as DeliveryMethod, // "STANDARD" | "EXPRESS"
    paymentMethod: "MANUAL" as const, // Fixed to MANUAL as per backend requirement
    promoCode: "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Submission & Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [confirmedSubtotal, setConfirmedSubtotal] = useState(0);
  const [confirmedGrandTotal, setConfirmedGrandTotal] = useState(0);
  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [confirmedOrderDate, setConfirmedOrderDate] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Delivery is handled via Sivakasi Lorry Transport (To-Pay at parcel godown by customer)
  // No delivery charges are collected on the website.

  const couponDiscount = appliedCoupon
    ? Math.round((total * appliedCoupon.discountPercent) / 100)
    : 0;

  const grandTotal = Math.max(0, total - couponDiscount);

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleApplyCoupon() {
    setCouponError("");
    const code = formData.promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "FESTIVAL10" || code === "ATM10" || code === "ATMCRACKERS") {
      setAppliedCoupon({ code, discountPercent: 10 });
      showToast(`Coupon '${code}' applied! 10% Discount`, "success");
    } else if (code === "DIWALI2025" || code === "FESTIVE15") {
      setAppliedCoupon({ code, discountPercent: 15 });
      showToast(`Coupon '${code}' applied! 15% Discount`, "success");
    } else {
      setCouponError("Invalid promo code. Try 'FESTIVAL10' or 'DIWALI2025'");
      showToast("Invalid promo code", "error");
    }
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();

    // Client-side Validation
    if (!formData.fullName.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    if (!formData.streetAddress.trim()) {
      showToast("Please enter your street delivery address", "error");
      return;
    }

    if (!formData.city.trim()) {
      showToast("Please enter your city / town", "error");
      return;
    }

    const cleanPin = formData.pincode.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      showToast("Please enter a valid 6-digit pincode", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.fullName.trim(),
          mobile: cleanPhone,
          email: formData.email.trim() || undefined,
        },
        shippingAddress: {
          fullName: formData.fullName.trim(),
          streetAddress: formData.streetAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || "Tamil Nadu",
          pincode: cleanPin,
          landmark: formData.landmark.trim() || undefined,
        },
        deliveryMethod: formData.deliveryOption,
        paymentMethod: "MANUAL" as const,
        promoCode: appliedCoupon ? appliedCoupon.code : formData.promoCode.trim() || undefined,
      };

      const response = await createOrder(orderPayload);

      // Extract order identifier returned by backend
      const resData = response.data as Record<string, unknown> | undefined;
      const orderId =
        (typeof resData?.orderId === "string" && resData.orderId) ||
        (typeof resData?.orderNumber === "string" && resData.orderNumber) ||
        (typeof resData?.id === "string" && resData.id) ||
        (typeof response.orderId === "string" && response.orderId) ||
        `ATM-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderDateStr = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const itemsSnapshot = [...items];
      const snapshotSubtotal = itemsSnapshot.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
      const snapshotDiscount = appliedCoupon
        ? Math.round((snapshotSubtotal * appliedCoupon.discountPercent) / 100)
        : 0;
      const snapshotGrandTotal = Math.max(0, snapshotSubtotal - snapshotDiscount);

      setConfirmedItems(itemsSnapshot);
      setConfirmedSubtotal(snapshotSubtotal);
      setConfirmedGrandTotal(snapshotGrandTotal);
      setConfirmedOrderDate(orderDateStr);
      setConfirmedOrderId(orderId);
      setIsSuccess(true);
      await clearCart();
      showToast("Order placed successfully!", "success");
    } catch (err: unknown) {
      console.error("Order creation failed:", err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Failed to place order. Please try again or contact us on WhatsApp.";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── If Cart is Empty & No Confirmed Order ─────────────────────
  if (items.length === 0 && !isSuccess) {
    return (
      <main className="min-h-[65vh] flex items-center justify-center bg-warm-white px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-zinc-400">
            <FaCartShopping />
          </div>
          <h1 className="text-2xl font-display font-bold text-zinc-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Add some sparkling fireworks to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors cursor-pointer"
          >
            <FaCartShopping /> Shop Crackers Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm-white py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <span>›</span>
          <Link href="/cart" className="hover:text-crimson">
            Cart
          </Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">Checkout</span>
        </nav>

        {/* ─── SUCCESS / CONFIRMATION STATE ─────────────────────────── */}
        {isSuccess ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <FaCheck />
            </div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Order Booked • Awaiting Payment Confirmation
            </span>
            <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">
              Order Booked Successfully!
            </h1>
            <p className="text-zinc-600 text-sm mb-6 max-w-md mx-auto">
              Your crackers have been reserved at wholesale rates. Please contact us on WhatsApp and complete payment to confirm and dispatch your parcel.
            </p>

            {/* Step-by-Step Payment Notice */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left max-w-md mx-auto mb-6 text-xs text-emerald-950">
              <p className="font-bold text-sm text-emerald-900 mb-1.5 flex items-center gap-2">
                <FaWhatsapp className="text-emerald-600 text-base" /> How to Confirm Your Order:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-emerald-800">
                <li>Click the <strong>&quot;Send on WhatsApp to Pay &amp; Confirm&quot;</strong> button below.</li>
                <li>Our Sivakasi staff will provide UPI / GPay / PhonePe payment details.</li>
                <li>Once paid, your order is officially confirmed &amp; dispatched via Lorry Transport!</li>
              </ol>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto space-y-2.5 border border-zinc-100">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <FaReceipt className="text-zinc-400 text-xs" /> Order ID:
                </span>
                <span className="font-bold text-zinc-900 tracking-wide">
                  {confirmedOrderId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <FaTruckFast className="text-zinc-400 text-xs" /> Delivery Mode:
                </span>
                <span className="font-semibold text-amber-800">
                  Standard Sivakasi Lorry Transport (Freight To-Pay at Godown)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <FaBoxOpen className="text-zinc-400 text-xs" /> Payment Mode:
                </span>
                <span className="font-semibold text-emerald-700">
                  WhatsApp Payment Verification (MANUAL)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Contact Mobile:</span>
                <span className="font-medium text-zinc-900">
                  +91 {formData.phone}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-zinc-200/60">
                <span className="font-semibold text-zinc-700">Total Payable:</span>
                <span className="font-black text-crimson text-base">
                  {formatPrice(confirmedGrandTotal || grandTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <a
                href={`https://wa.me/918056566845?text=${encodeURIComponent(
                  `Hi ATM Crackers,
I have booked order #${confirmedOrderId} for ₹${(
                    confirmedGrandTotal || grandTotal
                  ).toLocaleString("en-IN")}.
Please share UPI / GPay payment details so I can pay and confirm dispatch.

🧾 *ORDER DETAILS*
----------------------------------
*Order ID:* ${confirmedOrderId}
*Date:* ${confirmedOrderDate}
*Customer:* ${formData.fullName} (+91 ${formData.phone})
*Address:* ${formData.streetAddress}, ${formData.city} - ${formData.pincode}

📦 *ITEMS ORDERED:*
${confirmedItems
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ₹${(
        item.product.price * item.quantity
      ).toLocaleString("en-IN")}`
  )
  .join("\n")}
----------------------------------
*Subtotal:* ₹${(confirmedSubtotal || total).toLocaleString("en-IN")}
${
  appliedCoupon
    ? `*Promo Discount:* -₹${Math.round(
        ((confirmedSubtotal || total) * appliedCoupon.discountPercent) / 100
      ).toLocaleString("en-IN")}\n`
    : ""
}*Transport:* Standard Lorry Transport (Freight To-Pay at Godown)
💰 *Total Payable:* ₹${(confirmedGrandTotal || grandTotal).toLocaleString("en-IN")}
💳 *Payment:* Pay via WhatsApp (UPI/GPay)

*ATM CRACKERS*
12/476/4 RATHINAPURI NAGAR, MEENAMPATTI Anuppankulam
GSTIN: 33ACHFA6073E1ZN
Email: ATMCRACKERS@GMAIL.COM`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-[#25D366] text-white font-black rounded-xl shadow-lg hover:bg-[#1ebd5a] transition-all text-sm inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
              >
                <FaWhatsapp className="text-xl" /> Send on WhatsApp to Pay &amp; Confirm
              </a>

              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="px-5 py-3.5 bg-zinc-900 text-white font-bold rounded-xl shadow-md hover:bg-zinc-800 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FaFilePdf className="text-crimson text-base" /> View &amp; Download Bill (PDF)
              </button>

              <button
                type="button"
                onClick={() =>
                  printInvoiceDocument({
                    orderId: confirmedOrderId,
                    orderDate: confirmedOrderDate || new Date().toLocaleDateString("en-IN"),
                    customer: {
                      fullName: formData.fullName,
                      phone: formData.phone,
                      email: formData.email,
                      streetAddress: formData.streetAddress,
                      city: formData.city,
                      state: formData.state,
                      pincode: formData.pincode,
                      landmark: formData.landmark,
                    },
                    items: confirmedItems.length > 0 ? confirmedItems : items,
                    subtotal: confirmedSubtotal || total,
                    discount: appliedCoupon
                      ? Math.round(((confirmedSubtotal || total) * appliedCoupon.discountPercent) / 100)
                      : 0,
                    grandTotal: confirmedGrandTotal || grandTotal,
                    deliveryMethod: "STANDARD",
                    paymentMethod: "MANUAL",
                    couponCode: appliedCoupon?.code,
                  })
                }
                className="px-5 py-3.5 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FaPrint className="text-base" /> Quick Print / Save PDF
              </button>

              <Link
                href={`/track-order?orderId=${confirmedOrderId}`}
                className="px-5 py-3.5 border border-zinc-200 bg-white text-zinc-700 font-bold rounded-xl shadow-xs hover:bg-zinc-50 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaLocationDot /> Track Order
              </Link>
            </div>
          </div>
        ) : (
          /* ─── SINGLE-STEP CHECKOUT FORM ─────────────────────────── */
          <form onSubmit={handleSubmitOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Unified Checkout Form */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Customer & Shipping Details */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
                    <div>
                      <h2 className="text-xl font-display font-bold text-zinc-900">
                        1. Delivery & Contact Details
                      </h2>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Direct delivery from Sivakasi factory. No login required.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                      Fast Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Full Name <span className="text-crimson">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Mobile Number (for Dispatch & WhatsApp){" "}
                        <span className="text-crimson">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-50 text-xs text-zinc-500 font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-r-xl text-sm outline-none focus:border-crimson transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Email Address{" "}
                        <span className="text-zinc-400 font-normal">
                          (for receipt)
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Street Address & House No.{" "}
                        <span className="text-crimson">*</span>
                      </label>
                      <textarea
                        rows={2}
                        name="streetAddress"
                        required
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Door no, Building / Apartment name, Street name"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        City / Town <span className="text-crimson">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Madurai"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Pincode <span className="text-crimson">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 625001"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson bg-white transition-colors"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Landmark{" "}
                        <span className="text-zinc-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near Bus Stand / Temple"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-crimson transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Method (Standard Lorry Transport Only - No Options) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                  <div className="mb-4 pb-3 border-b border-zinc-100">
                    <h2 className="text-xl font-display font-bold text-zinc-900">
                      2. Transport &amp; Delivery Method
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Direct factory dispatch from Sivakasi via registered fireworks lorry service.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <FaTruckFast className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-bold text-zinc-900 text-sm">
                            Standard Fireworks Lorry Transport (Direct from Sivakasi)
                          </p>
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Freight To-Pay at Godown
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                          All fireworks packages are dispatched via registered explosives lorry transport. Delivery charges are determined by parcel weight &amp; destination pincode, payable directly by the customer when collecting at the local delivery godown.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment & Order Confirmation Method */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                  <div className="mb-4 pb-3 border-b border-zinc-100">
                    <h2 className="text-xl font-display font-bold text-zinc-900">
                      3. Payment &amp; Confirmation Method
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Book order now, complete payment via WhatsApp to confirm dispatch.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-crimson bg-red-50/20">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-crimson text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <FaWhatsapp className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-bold text-zinc-900 text-sm">
                            Order Booking &amp; WhatsApp Payment (MANUAL)
                          </p>
                          <span className="text-xs font-bold text-crimson bg-red-100 px-2.5 py-0.5 rounded-full">
                            Step 1 of 2
                          </span>
                        </div>
                        <div className="text-xs text-zinc-600 mt-2 space-y-1.5 leading-relaxed">
                          <p className="font-semibold text-zinc-800">
                            How to complete and confirm your order:
                          </p>
                          <ol className="list-decimal list-inside space-y-1 text-zinc-600">
                            <li>Click <strong>&quot;Book Order&quot;</strong> below to reserve your crackers at factory rates.</li>
                            <li>Send your placed order summary via WhatsApp to our Sivakasi staff.</li>
                            <li>Complete payment via <strong>UPI / GPay / PhonePe / Bank Transfer</strong> provided on WhatsApp.</li>
                            <li>Once paid, your order is officially confirmed and dispatched with LR tracking!</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile / Tablet View Place Order Button */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-crimson text-white font-bold rounded-2xl hover:bg-[#991B1B] shadow-lg transition-all text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" /> Booking
                        Order...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Book Order &amp; Pay on WhatsApp ({formatPrice(grandTotal)})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary (Sticky) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm sticky top-24">
                  <h3 className="text-base font-bold text-zinc-900 mb-4 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-full">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </h3>

                  {/* Items Miniature List */}
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-5 divide-y divide-zinc-100">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id || product.slug}
                        className="pt-3 first:pt-0 flex gap-3 items-center"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                          <ProductImage
                            productName={product.name}
                            categoryName={product.category_name}
                            size="thumb"
                            showLabel={false}
                            imageUrl={product.images?.[0]}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            Qty: {quantity} × {formatPrice(product.price)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-zinc-900 shrink-0">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <div className="mb-5 pt-4 border-t border-zinc-100">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Have a Festival Promo Code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder="e.g. FESTIVAL10"
                        className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-xs uppercase outline-none focus:border-crimson transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                        <FaCheck className="text-[10px]" /> Promo &apos;
                        {appliedCoupon.code}&apos; applied (-
                        {appliedCoupon.discountPercent}%)
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-red-500 mt-1.5">
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 text-sm text-zinc-600 pt-4 border-t border-zinc-100">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold text-zinc-900">
                        {formatPrice(total)}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Promo Discount ({appliedCoupon.code}):</span>
                        <span className="font-semibold">
                          −{formatPrice(couponDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs">
                      <span>Transport Freight:</span>
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        To-Pay at Parcel Office
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                      <span>Total Payable:</span>
                      <span className="text-crimson text-xl font-black">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Submit Button */}
                  <div className="mt-6 hidden lg:block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-crimson text-white font-bold rounded-2xl hover:bg-[#991B1B] shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin text-base" /> Booking
                          Order...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Book Order &amp; Pay on WhatsApp ({formatPrice(grandTotal)})
                        </>
                      )}
                    </button>
                  </div>

                  {/* WhatsApp Support Help Box */}
                  <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-100">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Need help ordering?
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Chat directly with Sivakasi team
                      </p>
                    </div>
                    <a
                      href="https://wa.me/918056566845?text=Hi%20ATM%20Crackers,%20I%20need%20help%20with%20my%20order"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#1ebd5a] transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* GST Invoice Modal */}
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          data={{
            orderId: confirmedOrderId,
            orderDate: confirmedOrderDate || new Date().toLocaleDateString("en-IN"),
            customer: {
              fullName: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              streetAddress: formData.streetAddress,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              landmark: formData.landmark,
            },
            items: confirmedItems.length > 0 ? confirmedItems : items,
            subtotal: confirmedSubtotal || total,
            discount: appliedCoupon
              ? Math.round(
                  ((confirmedSubtotal || total) * appliedCoupon.discountPercent) /
                    100
                )
              : 0,
            grandTotal: confirmedGrandTotal || grandTotal,
            deliveryMethod: formData.deliveryOption,
            paymentMethod: "MANUAL",
            couponCode: appliedCoupon?.code,
          }}
        />
      </div>
    </main>
  );
}
