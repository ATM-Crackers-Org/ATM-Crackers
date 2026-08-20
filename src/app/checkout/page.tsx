"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductImage } from "@/components/ui/ProductImage";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    deliveryOption: "standard", // standard | express
    paymentMethod: "upi", // upi | card | netbanking | cod
    couponCode: "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [orderId, setOrderId] = useState("");

  const deliveryCost =
    total >= 999
      ? formData.deliveryOption === "express"
        ? 99
        : 0
      : formData.deliveryOption === "express"
      ? 199
      : 99;

  const couponDiscount = appliedCoupon
    ? Math.round((total * appliedCoupon.discountPercent) / 100)
    : 0;

  const grandTotal = Math.max(0, total - couponDiscount + deliveryCost);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleApplyCoupon() {
    setCouponError("");
    const code = formData.couponCode.trim().toUpperCase();
    if (code === "FESTIVAL10" || code === "SINGAM10") {
      setAppliedCoupon({ code, discountPercent: 10 });
    } else if (code === "DIWALI2025" || code === "FESTIVE15") {
      setAppliedCoupon({ code, discountPercent: 15 });
    } else {
      setCouponError("Invalid promo code. Try 'FESTIVAL10' or 'DIWALI2025'");
    }
  }

  function handlePlaceOrder() {
    const generatedId = `SGM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    clearCart();
    setStep(4);
  }

  if (items.length === 0 && step !== 4) {
    return (
      <div className="has-mobile-nav">
        <AnnouncementBar />
        <Header />
        <main className="min-h-[65vh] flex items-center justify-center bg-[#FAFAF9] px-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
            <span className="text-6xl block mb-4">🛒</span>
            <h1 className="text-2xl font-display font-bold text-zinc-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-sm text-zinc-500 mb-6">
              Add some sparkling fireworks to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B91C1C] text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors"
            >
              Shop Crackers Now
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9] py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
            <span>›</span>
            <Link href="/cart" className="hover:text-[#B91C1C]">Cart</Link>
            <span>›</span>
            <span className="text-zinc-700 font-medium">Checkout</span>
          </nav>

          {/* Stepper (Steps 1, 2, 3) */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-xl mx-auto">
                {[
                  { num: 1, label: "Address" },
                  { num: 2, label: "Delivery" },
                  { num: 3, label: "Payment" },
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          step >= s.num
                            ? "bg-[#B91C1C] text-white shadow-md"
                            : "bg-zinc-200 text-zinc-500"
                        }`}
                      >
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span
                        className={`text-xs font-semibold mt-1.5 ${
                          step >= s.num ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 transition-colors ${
                          step > s.num ? "bg-[#B91C1C]" : "bg-zinc-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Success / Confirmation */}
          {step === 4 ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-xl text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                ✓
              </div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                Order Confirmed
              </span>
              <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">
                Thank You For Your Order!
              </h1>
              <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto">
                Your order has been placed successfully and is being prepped with secure factory packaging at Sivakasi.
              </p>

              <div className="bg-zinc-50 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto space-y-2 border border-zinc-100">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Order ID:</span>
                  <span className="font-bold text-zinc-900">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Estimated Delivery:</span>
                  <span className="font-bold text-zinc-900">3–5 Business Days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Contact:</span>
                  <span className="font-medium text-zinc-900">{formData.phone || "+91 XXXXX XXXXX"}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/track-order?orderId=${orderId}`}
                  className="px-6 py-3.5 bg-[#B91C1C] text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors text-sm"
                >
                  📍 Track Your Order
                </Link>
                <a
                  href={`https://wa.me/919999999999?text=Hi%20Singam%20Crackers,%20I%20just%20placed%20order%20${orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-xl shadow-md hover:bg-[#1ebd5a] transition-colors text-sm inline-flex items-center justify-center gap-2"
                >
                  💬 Update via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Checkout Steps Area */}
              <div className="lg:col-span-7 space-y-6">
                {/* STEP 1: Address */}
                {step === 1 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-display font-bold text-zinc-900">
                        1. Delivery Address
                      </h2>
                      <span className="text-xs text-zinc-400">Guest Checkout Enabled</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Phone Number (for SMS & WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. ramesh@gmail.com"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Street Address & House No. *
                        </label>
                        <textarea
                          rows={2}
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Door no, Apartment, Street name, Landmark"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Madurai"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="e.g. 625001"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#B91C1C]"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.fullName || !formData.phone || !formData.address) {
                            alert("Please fill in the required fields: Full Name, Phone, and Address.");
                            return;
                          }
                          setStep(2);
                        }}
                        className="px-8 py-3.5 bg-[#B91C1C] text-white font-bold rounded-xl hover:bg-[#991B1B] shadow-md transition-colors text-sm cursor-pointer"
                      >
                        Continue to Delivery →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Delivery */}
                {step === 2 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-display font-bold text-zinc-900">
                        2. Select Delivery Method
                      </h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-[#B91C1C] font-semibold hover:underline"
                      >
                        Edit Address
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.deliveryOption === "standard"
                            ? "border-[#B91C1C] bg-red-50/20"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === "standard"}
                          onChange={handleInputChange}
                          className="mt-1 accent-[#B91C1C]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-zinc-900 text-sm">
                              Standard Road Transport Delivery
                            </p>
                            <span className="font-bold text-sm text-zinc-900">
                              {total >= 999 ? "FREE" : "₹99"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            Dispatched via approved fireworks transport. Takes 3–5 business days.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.deliveryOption === "express"
                            ? "border-[#B91C1C] bg-red-50/20"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="express"
                          checked={formData.deliveryOption === "express"}
                          onChange={handleInputChange}
                          className="mt-1 accent-[#B91C1C]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-zinc-900 text-sm">
                              Express Priority Delivery (Fast-Track)
                            </p>
                            <span className="font-bold text-sm text-zinc-900">
                              {total >= 999 ? "₹99" : "₹199"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            High-priority dispatch from Sivakasi hub. Takes 1–2 business days.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-semibold text-sm hover:bg-zinc-50"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 bg-[#B91C1C] text-white font-bold rounded-xl hover:bg-[#991B1B] shadow-md transition-colors text-sm cursor-pointer"
                      >
                        Continue to Payment →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {step === 3 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-display font-bold text-zinc-900">
                        3. Payment Method
                      </h2>
                      <button
                        onClick={() => setStep(2)}
                        className="text-xs text-[#B91C1C] font-semibold hover:underline"
                      >
                        Change Delivery
                      </button>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        {
                          id: "upi",
                          title: "UPI (Google Pay, PhonePe, Paytm, QR)",
                          desc: "Instant payment with 0% extra fees",
                          icon: "📱",
                        },
                        {
                          id: "card",
                          title: "Credit / Debit Card",
                          desc: "Visa, MasterCard, RuPay accepted",
                          icon: "💳",
                        },
                        {
                          id: "netbanking",
                          title: "Net Banking",
                          desc: "All major Indian banks supported",
                          icon: "🏦",
                        },
                        {
                          id: "cod",
                          title: "Cash on Delivery / Advance Partial",
                          desc: "Pay securely upon package arrival",
                          icon: "💵",
                        },
                      ].map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formData.paymentMethod === pm.id
                              ? "border-[#B91C1C] bg-red-50/20"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={pm.id}
                            checked={formData.paymentMethod === pm.id}
                            onChange={handleInputChange}
                            className="mt-1 accent-[#B91C1C]"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                              <span>{pm.icon}</span> {pm.title}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-4 text-xs text-zinc-500 flex items-center gap-3 mb-6">
                      <span className="text-lg">🔒</span>
                      <span>
                        256-Bit SSL Encrypted & Verified checkout. Your payment information is strictly protected.
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-semibold text-sm hover:bg-zinc-50"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        className="px-8 py-3.5 bg-[#B91C1C] text-white font-bold rounded-xl hover:bg-[#991B1B] shadow-lg transition-all text-sm cursor-pointer"
                      >
                        Place Order ({formatPrice(grandTotal)})
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Order Summary Area */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm sticky top-24">
                  <h3 className="text-base font-bold text-zinc-900 mb-4">
                    Order Summary ({items.length} items)
                  </h3>

                  {/* Items miniature list */}
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-1 mb-5 divide-y divide-zinc-100">
                    {items.map(({ product, quantity }) => (
                      <div key={product.slug} className="pt-3 first:pt-0 flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <ProductImage
                            productName={product.name}
                            categoryName={product.category_name}
                            size="thumb"
                            showLabel={false}
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

                  {/* Coupon Area */}
                  <div className="mb-5 pt-4 border-t border-zinc-100">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Have a Festival Promo Code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                        placeholder="e.g. FESTIVAL10"
                        className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-xs uppercase outline-none focus:border-[#B91C1C]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        ✓ Promo &apos;{appliedCoupon.code}&apos; applied (-{appliedCoupon.discountPercent}%)
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-red-500 mt-1">{couponError}</p>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-2 text-sm text-zinc-600 pt-4 border-t border-zinc-100">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold text-zinc-900">{formatPrice(total)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Promo Discount ({appliedCoupon.code}):</span>
                        <span className="font-semibold">−{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping:</span>
                      <span className="font-semibold text-zinc-900">
                        {deliveryCost === 0 ? "FREE" : formatPrice(deliveryCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                      <span>Total Payable:</span>
                      <span className="text-[#B91C1C] text-lg font-black">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Support Help Box */}
                  <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-100">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Need help ordering?</p>
                      <p className="text-[10px] text-emerald-700">Chat with our Sivakasi staff</p>
                    </div>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#1ebd5a]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
