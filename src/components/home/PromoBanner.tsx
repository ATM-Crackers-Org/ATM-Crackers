import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-banner p-8 sm:p-12 text-white shadow-xl">
          {/* Decorative Corner Sparkles */}
          <div className="absolute top-4 right-4 text-gold/30 text-3xl select-none">✦</div>
          <div className="absolute bottom-4 left-4 text-gold/20 text-xl select-none">✦</div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-gold text-xs font-bold uppercase tracking-wider mb-3">
                🔥 Diwali & Festival Special
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-black leading-tight mb-2">
                MAKE THIS FESTIVAL BRIGHTER
              </h2>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Avail early bird festival discounts up to 25% OFF with assured safe packing and doorstep freight delivery.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-gold text-zinc-900 font-bold rounded-xl shadow-lg hover:opacity-95 transition-all text-sm"
              >
                🛒 SHOP FESTIVAL CRACKERS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
