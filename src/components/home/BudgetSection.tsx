import Link from "next/link";

const BUDGETS = [
  { label: "Under ₹499", range: "0-499", desc: "Budget starters & sparklers", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { label: "₹499 – ₹999", range: "499-999", desc: "Chakkars, pots & rockets", bg: "bg-blue-50 text-blue-800 border-blue-200" },
  { label: "₹999 – ₹1,999", range: "999-1999", desc: "Deluxe fountains & fancy shots", bg: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "₹2,000+", range: "2000-999999", desc: "Mega 1000+ varnams & aerials", bg: "bg-red-50 text-red-800 border-red-200" },
];

export function BudgetSection() {
  return (
    <section className="py-12 bg-white border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-8">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1">
            💰 QUICK FILTER
          </p>
          <h2 className="text-2xl font-display font-bold text-zinc-900">
            Shop by Budget
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Find the right celebration packs matching your planned budget
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {BUDGETS.map((b) => (
            <Link
              key={b.range}
              href={`/shop?budget=${b.range}`}
              className={`p-4 rounded-2xl border-2 transition-all text-center hover:scale-105 shadow-sm ${b.bg}`}
            >
              <p className="text-sm sm:text-base font-bold mb-1">{b.label}</p>
              <p className="text-[11px] opacity-80">{b.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
