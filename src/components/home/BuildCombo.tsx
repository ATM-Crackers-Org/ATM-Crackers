"use client";

import React, { useState, useCallback, useMemo } from "react";
import { getEnrichedProducts, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ProductImage } from "@/components/ui/ProductImage";

const BUDGETS = [
  { label: "₹500", value: 500 },
  { label: "₹1,000", value: 1000 },
  { label: "₹2,000", value: 2000 },
  { label: "₹5,000+", value: 5000 },
];

const CELEBRATIONS = [
  { label: "Family", emoji: "👨‍👩‍👧‍👦", desc: "Balanced for all ages" },
  { label: "Kids", emoji: "🎉", desc: "Safe, visual & low-noise" },
  { label: "Premium", emoji: "👑", desc: "Aerial & deluxe assortments" },
  { label: "Grand", emoji: "🎆", desc: "Maximum sound & sky bursts" },
];

const PREFERENCES = [
  { label: "Colour", emoji: "🌈", desc: "Vibrant lights & sparklers" },
  { label: "Sound", emoji: "💥", desc: "Loud bursts & crackers" },
  { label: "Mixed", emoji: "🎇", desc: "Perfect lights & sounds" },
  { label: "Fancy", emoji: "✨", desc: "Novelties & aerial shots" },
];

// Helper: Smart custom box generator with filtering, scoring, and shuffling
function assembleSmartBox(
  targetBudget: number,
  celebration: string,
  preference: string,
  seed = 0
): Product[] {
  const all = getEnrichedProducts();
  if (!all.length) return [];

  // Filter and score candidates based on celebration & preference
  const scored = all
    .filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category_name.toLowerCase();

      // Kids: strictly filter out dangerous/loud sound bombs
      if (celebration === "Kids") {
        if (
          name.includes("bomb") ||
          name.includes("sound cracker") ||
          cat.includes("bomb") ||
          name.includes("hydro") ||
          name.includes("atomic") ||
          name.includes("bullet") ||
          name.includes("2 sound") ||
          name.includes("3 sound")
        ) {
          return false;
        }
      }

      // Preference: Colour only -> filter out pure sound bombs
      if (preference === "Colour") {
        if (cat.includes("bomb") || name.includes("sound cracker")) {
          return false;
        }
      }

      // Preference: Sound only -> filter out silent sparklers or soft novelties if possible
      if (preference === "Sound") {
        if (name.includes("pencil") || name.includes("color matches")) {
          return false;
        }
      }

      // Max price per individual item should not exceed 50% of total budget
      const maxItemPrice = Math.max(120, targetBudget * 0.48);
      return p.price <= maxItemPrice && p.price > 0;
    })
    .map((p, idx) => {
      const name = p.name.toLowerCase();
      const cat = p.category_name.toLowerCase();
      let score = 5;

      // Celebration type scoring
      if (celebration === "Kids") {
        if (
          cat.includes("sparkler") ||
          cat.includes("pot") ||
          cat.includes("chakkar") ||
          name.includes("pencil") ||
          name.includes("twinkling") ||
          name.includes("star")
        ) {
          score += 6;
        }
      } else if (celebration === "Premium") {
        if (
          cat.includes("fancy") ||
          cat.includes("shot") ||
          cat.includes("aerial") ||
          cat.includes("fountain") ||
          p.is_best_seller
        ) {
          score += 6;
        }
      } else if (celebration === "Grand") {
        if (
          cat.includes("bomb") ||
          name.includes("wala") ||
          name.includes("sound") ||
          cat.includes("shot") ||
          name.includes("thunder")
        ) {
          score += 6;
        }
      } else {
        // Family: all-round balance
        score += 3;
      }

      // Preference scoring
      if (preference === "Colour") {
        if (
          name.includes("colour") ||
          name.includes("color") ||
          cat.includes("pot") ||
          cat.includes("sparkler") ||
          name.includes("rainbow")
        ) {
          score += 6;
        }
      } else if (preference === "Sound") {
        if (
          name.includes("sound") ||
          cat.includes("bomb") ||
          name.includes("cracker") ||
          name.includes("atom")
        ) {
          score += 6;
        }
      } else if (preference === "Fancy") {
        if (
          cat.includes("fancy") ||
          cat.includes("shot") ||
          name.includes("novelty") ||
          cat.includes("fountain")
        ) {
          score += 6;
        }
      } else {
        // Mixed: bonus for diverse popular items
        if (p.is_trending || p.is_best_seller) score += 3;
      }

      // Deterministic pseudo-random jitter influenced by seed and index
      const pseudoRandom = Math.sin((seed + 1) * 9973 + (idx + 1) * 31) * 10000;
      const jitter = (pseudoRandom - Math.floor(pseudoRandom)) * 8;

      return { product: p, score: score + jitter };
    });

  // Sort by calculated score + jitter
  const shuffled = scored
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  const picked: Product[] = [];
  const catCount = new Map<string, number>();
  let currentTotal = 0;

  // Max items target based on budget
  const maxItems = targetBudget <= 500 ? 5 : targetBudget <= 1000 ? 7 : targetBudget <= 2000 ? 9 : 12;

  // 1st pass: Greedily pick with category diversity (max 2 per category)
  for (const p of shuffled) {
    if (picked.length >= maxItems) break;
    const count = catCount.get(p.category_id) || 0;
    if (count >= 2) continue;

    if (currentTotal + p.price <= targetBudget * 1.05) {
      picked.push(p);
      currentTotal += p.price;
      catCount.set(p.category_id, count + 1);
    }
  }

  // 2nd pass: If current total is below 75% of target budget, backfill with smaller items
  if (currentTotal < targetBudget * 0.75) {
    for (const p of shuffled) {
      if (picked.some((item) => item.slug === p.slug)) continue;
      if (currentTotal + p.price <= targetBudget * 1.05) {
        picked.push(p);
        currentTotal += p.price;
        if (picked.length >= maxItems + 2) break;
      }
    }
  }

  // Fallback: If nothing was picked, grab top 4 candidates
  if (!picked.length) {
    return shuffled.slice(0, 4);
  }

  return picked;
}

export function BuildCombo() {
  const [budget, setBudget] = useState<number>(1000);
  const [celebration, setCelebration] = useState<string>("Family");
  const [preference, setPreference] = useState<string>("Mixed");
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);
  const [removedSlugs, setRemovedSlugs] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setShuffleSeed((s) => s + 1);
    setRemovedSlugs([]);
    setTimeout(() => setIsShuffling(false), 200);
  }, []);

  const baseItems = useMemo(() => {
    return assembleSmartBox(budget, celebration, preference, shuffleSeed);
  }, [budget, celebration, preference, shuffleSeed]);

  const combo = useMemo(() => {
    return baseItems.filter((p) => !removedSlugs.includes(p.slug));
  }, [baseItems, removedSlugs]);

  function handleRemoveItem(slug: string) {
    setRemovedSlugs((prev) => [...prev, slug]);
  }

  function handleAddAll() {
    if (!combo.length) return;
    combo.forEach((p) => addToCart(p, 1));
    showToast(`Added ${combo.length} items from your custom box to cart!`, "cart");
  }

  const comboTotal = useMemo(
    () => combo.reduce((sum, p) => sum + p.price, 0),
    [combo]
  );

  const comboMrp = useMemo(
    () => combo.reduce((sum, p) => sum + p.mrp, 0),
    [combo]
  );

  const comboSavings = Math.max(0, comboMrp - comboTotal);
  const budgetFillPercent = Math.min(100, Math.round((comboTotal / budget) * 100));

  return (
    <section id="custom-box" className="py-14 sm:py-16 bg-warm-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-zinc-200 shadow-sm space-y-5">
            {/* Step 1: Target Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  1. Select Target Budget
                </p>
                <span className="text-xs text-zinc-400 font-medium">
                  Current: <strong className="text-zinc-800">₹{budget.toLocaleString()}</strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => {
                      setBudget(b.value);
                      setRemovedSlugs([]);
                    }}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${budget === b.value
                      ? "bg-crimson text-white border-crimson shadow-sm scale-[1.02]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Celebration Type */}
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                2. Celebration Type
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CELEBRATIONS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      setCelebration(c.label);
                      setRemovedSlugs([]);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${celebration === c.label
                      ? "bg-crimson text-white border-crimson shadow-sm scale-[1.02]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-xs font-bold leading-tight">{c.label}</span>
                    <span
                      className={`text-[10px] line-clamp-1 font-normal ${celebration === c.label ? "text-white/80" : "text-zinc-400"
                        }`}
                    >
                      {c.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Cracker Preference */}
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                3. Cracker Preference
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PREFERENCES.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setPreference(p.label);
                      setRemovedSlugs([]);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${preference === p.label
                      ? "bg-crimson text-white border-crimson shadow-sm scale-[1.02]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                  >
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-xs font-bold leading-tight">{p.label}</span>
                    <span
                      className={`text-[10px] line-clamp-1 font-normal ${preference === p.label ? "text-white/80" : "text-zinc-400"
                        }`}
                    >
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleShuffle}
                disabled={isShuffling}
                className="flex-1 py-3 bg-crimson text-white font-bold rounded-xl shadow-md hover:bg-[#991B1B] transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>✨ Generate My Custom Box</span>
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                title="Shuffle products in this box"
                className="px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200 font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-98 shrink-0"
              >
                <span className={`text-base ${isShuffling ? "animate-spin" : ""}`}>🔀</span>
                <span className="hidden sm:inline">Shuffle Items</span>
              </button>
            </div>
          </div>

          {/* Generated Custom Box Result Container */}
          {combo.length > 0 && (
            <div className="mt-6 bg-zinc-900 text-white rounded-3xl p-5 sm:p-7 border border-zinc-800 shadow-xl">
              {/* Box Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎁</span>
                    <h3 className="text-base sm:text-lg font-display font-bold text-amber-300">
                      Your Recommended Celebration Box
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tailored for <strong className="text-zinc-200">{celebration}</strong> •{" "}
                    <strong className="text-zinc-200">{preference}</strong> preference
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-zinc-300 font-medium">
                    {combo.length} items packed
                  </span>
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔀 Shuffle</span>
                  </button>
                </div>
              </div>

              {/* Budget Progress & Savings Bar */}
              <div className="py-4 border-b border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">
                    Box Total:{" "}
                    <strong className="text-amber-300 text-sm">{formatPrice(comboTotal)}</strong> / Target{" "}
                    <span className="text-zinc-300">₹{budget.toLocaleString()}</span>
                  </span>
                  {comboSavings > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                      Save {formatPrice(comboSavings)} (Wholesale Direct)
                    </span>
                  )}
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${budgetFillPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List in Box */}
              <div className="py-3 divide-y divide-zinc-800/80 max-h-80 overflow-y-auto pr-1">
                {combo.map((p) => (
                  <div
                    key={p.slug}
                    className="py-2.5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                        <ProductImage
                          productName={p.name}
                          categoryName={p.category_name}
                          sku={p.sku}
                          size="thumb"
                          showLabel={false}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate group-hover:text-amber-300 transition-colors">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                            {p.category_name}
                          </span>
                          <span className="text-[10px] text-zinc-500">• 1 Pack</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                          {formatPrice(p.price)}
                        </span>
                        {p.mrp > p.price && (
                          <span className="text-[10px] text-zinc-500 line-through block">
                            {formatPrice(p.mrp)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(p.slug)}
                        title="Remove from custom box"
                        className="text-zinc-500 hover:text-red-400 text-xs p-1 rounded hover:bg-white/5 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Add to Cart Button */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400">Total Box Value</span>
                    <p className="text-xs text-emerald-400 font-medium">Free Pan-India Delivery Eligible</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-amber-300">
                      {formatPrice(comboTotal)}
                    </span>
                    {comboMrp > comboTotal && (
                      <span className="text-xs text-zinc-500 line-through ml-2">
                        {formatPrice(comboMrp)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddAll}
                  className="w-full py-3.5 bg-linear-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold rounded-xl shadow-lg hover:brightness-105 active:scale-98 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🛒 Add Entire Box to Cart ({formatPrice(comboTotal)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
