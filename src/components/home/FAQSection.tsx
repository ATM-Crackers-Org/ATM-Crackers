"use client";

import React, { useState } from "react";

const FAQS = [
  {
    q: "How do I place an order for Sivakasi crackers?",
    a: "Add your desired products or combo packs to cart, proceed to checkout, enter your delivery address, and select your payment method. You can also order via WhatsApp with our team.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Cards, and Partial COD with nominal advance payment.",
  },
  {
    q: "How are the fireworks packed for safe transit?",
    a: "All items are packed in heavy-duty, moisture-sealed and shock-resistant 3-layer corrugated boxes adhering strictly to fire safety transport norms.",
  },
  {
    q: "How can I track my dispatched consignment?",
    a: "Once dispatched from our Sivakasi hub, you will receive an SMS and WhatsApp tracking link. You can also track your status anytime on our Track Order page.",
  },
  {
    q: "What is the minimum order value?",
    a: "Minimum order value is just ₹500, and orders above ₹999 qualify for standard FREE delivery across Tamil Nadu.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-16 bg-[#FAFAF9]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1">
            HELP & SUPPORT
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Common questions about placing orders, safety standards, and deliveries
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-zinc-900 hover:text-crimson transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-base text-zinc-400 ml-2">
                  {open === idx ? "−" : "+"}
                </span>
              </button>
              {open === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-50 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
