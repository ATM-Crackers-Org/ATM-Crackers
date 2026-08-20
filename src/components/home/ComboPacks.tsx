import Link from "next/link";

const COMBOS = [
  {
    name: "Family Celebration Combo",
    emoji: "👨‍👩‍👧‍👦",
    linear: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    products: "25+ Items Included",
    value: "₹3,500",
    price: "₹2,499",
    savings: "₹1,001",
    desc: "Complete blend of flower pots, sparklers, chakkars & sound",
    tag: "BESTSELLER",
  },
  {
    name: "Kids Magical Combo",
    emoji: "🎉",
    linear: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    products: "15+ Safe Items",
    value: "₹1,800",
    price: "₹1,199",
    savings: "₹601",
    desc: "Sparklers, pencils, butterfly spinners & novelty items for kids",
    tag: "KIDS SAFE",
  },
  {
    name: "Royal Premium Combo",
    emoji: "👑",
    linear: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
    products: "40+ Deluxe Items",
    value: "₹6,000",
    price: "₹4,499",
    savings: "₹1,501",
    desc: "Grand varnam series, repeating sky shots & sonic bombs",
    tag: "POPULAR",
  },
  {
    name: "Mega Grand Box",
    emoji: "🎆",
    linear: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
    products: "70+ Mega Items",
    value: "₹12,000",
    price: "₹8,999",
    savings: "₹3,001",
    desc: "Ultimate celebration package for weddings & grand festival nights",
    tag: "VIP BOX",
  },
];

export function ComboPacks() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAFAF9] border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1.5">
            🎁 CURATED FESTIVAL BOXES
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
            Celebration Combo Packs
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Carefully curated bundles with guaranteed savings and maximum variety
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMBOS.map((combo) => (
            <div
              key={combo.name}
              className="relative rounded-2xl overflow-hidden p-5 product-card text-white flex flex-col justify-between"
              style={{
                background: combo.linear,
              }}
            >
              <div>
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{combo.emoji}</span>
                  <span className="px-2.5 py-0.5 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {combo.tag}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-display font-bold mb-1 leading-snug">
                  {combo.name}
                </h3>
                <p className="text-xs text-white/80 mb-3 leading-relaxed">
                  {combo.desc}
                </p>
                <p className="text-[11px] font-semibold text-white/90 mb-3">
                  ✓ {combo.products}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2 pt-3 border-t border-white/20 mb-3">
                  <span className="text-2xl font-black">{combo.price}</span>
                  <span className="text-xs text-white/60 line-through">{combo.value}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold ml-auto">
                    Save {combo.savings}
                  </span>
                </div>

                <Link
                  href="/shop?filter=combos"
                  className="block w-full py-2.5 bg-white text-zinc-900 text-xs font-bold rounded-xl text-center shadow-md hover:bg-zinc-100 transition-colors"
                >
                  View Pack Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
