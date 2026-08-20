"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("orderId") || "";

  const [orderInput, setOrderInput] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);
  const [hasSearched, setHasSearched] = useState(Boolean(initialId));

  useEffect(() => {
    if (initialId) {
      setOrderInput(initialId);
      setSearchedId(initialId);
      setHasSearched(true);
    }
  }, [initialId]);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderInput.trim()) return;
    setSearchedId(orderInput.trim().toUpperCase());
    setHasSearched(true);
  }

  const TIMELINE_STEPS = [
    {
      title: "Order Placed",
      time: "Today, 10:15 AM",
      desc: "Order confirmed and sent to Sivakasi packing warehouse.",
      done: true,
    },
    {
      title: "Quality Checked & Verified",
      time: "Today, 01:45 PM",
      desc: "All cracker batches tested for safety and certified.",
      done: true,
    },
    {
      title: "Packed in Secure Factory Box",
      time: "Today, 04:30 PM",
      desc: "Packed with triple-layer moisture & shock-resistant insulation.",
      done: true,
    },
    {
      title: "Shipped via Licensed Carrier",
      time: "In Transit",
      desc: "Dispatched through authorized fireworks freight logistics.",
      done: true,
      current: true,
    },
    {
      title: "Out for Delivery",
      time: "Expected in 2 Days",
      desc: "Delivery executive will contact your registered phone number.",
      done: false,
    },
    {
      title: "Delivered",
      time: "Pending",
      desc: "Enjoy safe and sparkling celebrations!",
      done: false,
    },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
        <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
        <span>›</span>
        <span className="text-zinc-700 font-medium">Track Order</span>
      </nav>

      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-4xl block mb-2">🚚</span>
        <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">
          Track Your Fireworks Order
        </h1>
        <p className="text-sm text-zinc-500">
          Enter your Order ID (e.g. SGM-849201) to view real-time factory dispatch and transport status.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm max-w-xl mx-auto mb-10">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            placeholder="Enter Order ID (e.g. SGM-849201)"
            className="flex-1 px-4 py-3.5 border border-zinc-200 rounded-xl text-sm uppercase outline-none focus:border-[#B91C1C]"
            required
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#B91C1C] text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-colors text-sm cursor-pointer"
          >
            Track Status
          </button>
        </form>

        <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
          <span>Need sample ID? Try: <button type="button" onClick={() => setOrderInput("SGM-739102")} className="text-[#B91C1C] underline font-medium">SGM-739102</button></span>
        </div>
      </div>

      {/* Timeline Status Result */}
      {hasSearched && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-zinc-100 shadow-md max-w-2xl mx-auto animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 gap-2 mb-8">
            <div>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Order Reference
              </span>
              <h2 className="text-xl font-bold text-zinc-900">{searchedId}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                In Transit
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-zinc-200">
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-5 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    step.done
                      ? step.current
                        ? "bg-[#B91C1C] text-white ring-4 ring-red-100 animate-bounce"
                        : "bg-emerald-500 text-white"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                  }`}
                >
                  {step.done ? (step.current ? "🚚" : "✓") : idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        step.done ? "text-zinc-900" : "text-zinc-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span className="text-xs text-zinc-400 whitespace-nowrap">{step.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Logistics & WhatsApp Help */}
          <div className="mt-10 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-zinc-800">Carrier: Sivakasi Express Cargo Logistics</p>
              <p className="text-[11px] text-zinc-500">Contact driver or dispatch center if needed</p>
            </div>
            <a
              href={`https://wa.me/919999999999?text=Hello%20ATM%20Crackers,%20need%20status%20for%20order%20${searchedId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#1ebd5a] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-[#FAFAF9]">
        <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading order tracker...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
