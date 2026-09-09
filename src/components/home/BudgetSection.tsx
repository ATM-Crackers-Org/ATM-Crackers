import Link from "next/link";

const BUDGETS = [
  {
    label: "Under ₹500",
    href: "/shop?price-range=500",
    desc: "Budget starters & sparklers",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400",
  },
  {
    label: "₹500 – ₹1,000",
    href: "/shop?price-range=500-1000",
    desc: "Chakkars, pots & rockets",
    bg: "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400",
  },
  {
    label: "₹1,000 – ₹2,000",
    href: "/shop?price-range=1000-2000",
    desc: "Deluxe fountains & fancy shots",
    bg: "bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400",
  },
  {
    label: "₹2,000+",
    href: "/shop?price-range=2000-50000",
    desc: "Mega 1000+ varnams & aerials",
    bg: "bg-red-50 text-red-800 border-red-200 hover:border-red-400",
  },
];

export function BudgetSection() {
  return (
    <section className="py-12 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              key={b.href}
              href={b.href}
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
