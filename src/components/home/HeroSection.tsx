import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-midnight text-white py-16 md:py-24 border-b border-zinc-800">
      {/* Background radial linear gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, #7F1D1D 0%, #15151A 50%, #09090B 100%)",
        }}
      />

      {/* Decorative sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[15%] left-[8%] text-xs text-amber opacity-30 animate-float">✦</span>
        <span className="absolute top-[25%] right-[10%] text-sm text-gold opacity-40 animate-float" style={{ animationDelay: "1s" }}>✦</span>
        <span className="absolute top-[65%] left-[12%] text-xs text-gold opacity-25 animate-float" style={{ animationDelay: "1.5s" }}>✦</span>
        <span className="absolute top-[45%] right-[8%] text-sm text-amber opacity-30 animate-float" style={{ animationDelay: "0.5s" }}>✦</span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-gold text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-gold animate-glow" />
          Direct From Sivakasi Factories
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-tight tracking-tight mb-5">
          LIGHT UP YOUR{" "}
          <span className="text-linear-gold block sm:inline">
            CELEBRATIONS
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Premium authentic Sivakasi crackers with certified safety, factory direct wholesale prices, and secure pan-India doorstep delivery.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-linear-crimson text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            🛒 SHOP CRACKERS
          </Link>
          <Link
            href="/shop?filter=combos"
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-gold text-gold font-bold rounded-xl hover:bg-gold/10 transition-all text-sm flex items-center justify-center gap-2"
          >
            🎁 EXPLORE COMBOS
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 max-w-lg mx-auto pt-8 border-t border-zinc-800/80 gap-4">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-display font-bold text-gold">191+</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Products</p>
          </div>
          <div className="text-center border-x border-zinc-800">
            <p className="text-2xl sm:text-3xl font-display font-bold text-gold">37+</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-display font-bold text-gold">10k+</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
