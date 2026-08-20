"use client";

import React, { useState } from "react";
import { getEnrichedProducts, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const BUDGETS = [
  { label: "₹500", min: 0, max: 500 },
  { label: "₹1,000", min: 0, max: 1000 },
  { label: "₹2,000", min: 0, max: 2000 },
  { label: "₹5,000+", min: 0, max: 9999 },
];

const CELEBRATIONS = [
  { label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { label: "Kids", emoji: "🎉" },
  { label: "Premium", emoji: "👑" },
  { label: "Grand", emoji: "🎆" },
];

const PREFERENCES = [
  { label: "Colour", emoji: "🌈" },
  { label: "Sound", emoji: "💥" },
  { label: "Mixed", emoji: "🎇" },
  { label: "Fancy", emoji: "✨" },
];

export function BuildCombo() {
  const [budget, setBudget] = useState<number | null>(1000);
  const [celebration, setCelebration] = useState<string | null>("Family");
  const [preference, setPreference] = useState<string | null>("Mixed");
  const [combo, setCombo] = useState<Product[] | null>(null);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  function generateCombo() {
    if (!budget) return;
    const all = getEnrichedProducts();
    const filtered = all.filter((p) => p.price <= budget / 2.5);
    const picked: Product[] = [];
    const catsSeen = new Set<string>();

    for (const p of filtered.sort(() => Math.random() - 0.5)) {
      if (picked.length >= 4) break;
      if (!catsSeen.has(p.category_id)) {
        picked.push(p);
        catsSeen.add(p.category_id);
      }
    }
    setCombo(picked);
  }

  function handleAddAll() {
    if (!combo) return;
    combo.forEach((p) => addToCart(p, 1));
    showToast(`Added ${combo.length} items to your cart!`, "cart");
  }

  const comboTotal = combo?.reduce((s, p) => s + p.price, 0) ?? 0;

  return (
    <section className="py-14 sm:py-16 bg-[#FAFAF9] border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1">
              ✨ SMART SELECTION ASSISTANT
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              Build Your Celebration Box
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Choose your budget and party style, and we&apos;ll assemble a personalized cracker pack
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
            {/* Step 1: Budget */}
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                1. Select Target Budget
              </p>
              <div className="grid grid-cols-4 gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => setBudget(b.max)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                      budget === b.max
                        ? "bg-crimson text-white border-crimson shadow-sm"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Celebration */}
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                2. Celebration Type
              </p>
              <div className="grid grid-cols-4 gap-2">
                {CELEBRATIONS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setCelebration(c.label)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      celebration === c.label
                        ? "bg-crimson text-white border-crimson shadow-sm"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-[11px] font-semibold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Preference */}
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                3. Cracker Preference
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PREFERENCES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPreference(p.label)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      preference === p.label
                        ? "bg-crimson text-white border-crimson shadow-sm"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-[11px] font-semibold">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCombo}
              className="w-full py-3.5 bg-linear-crimson text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all text-sm cursor-pointer"
            >
              ✨ Generate My Custom Box
            </button>
          </div>

          {/* Generated Result Container */}
          {combo && (
            <div className="mt-6 bg-surface text-white rounded-3xl p-6 border border-zinc-800 shadow-xl animate-slide-up">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <h3 className="text-base font-display font-bold text-gold">
                  🎁 Your Recommended Box Pack
                </h3>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-zinc-300">
                  {combo.length} items
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {combo.map((p) => (
                  <div
                    key={p.slug}
                    className="flex items-center justify-between bg-zinc-900/60 rounded-xl px-3.5 py-2 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-zinc-100 line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-zinc-400">{p.category_name}</p>
                    </div>
                    <span className="font-bold text-gold shrink-0">{formatPrice(p.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mb-4">
                <span className="text-xs text-zinc-400">Total Box Value</span>
                <span className="text-base font-bold text-gold">{formatPrice(comboTotal)}</span>
              </div>

              <button
                onClick={handleAddAll}
                className="w-full py-3 bg-linear-gold text-zinc-900 text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                🛒 Add Entire Box to Cart ({formatPrice(comboTotal)})
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
