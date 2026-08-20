import Link from "next/link";
import { getTopCategories } from "@/lib/categories";

export function Footer() {
  const categories = getTopCategories(8);

  return (
    <footer className="bg-midnight text-zinc-300 border-t border-zinc-800">
      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 bg-linear-crimson rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md">
                S
              </div>
              <div>
                <span className="text-lg font-display font-black text-white leading-none tracking-tight block">
                  SINGAM
                </span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.25em] leading-none block">
                  CRACKERS
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Wholesale & retail supplier of certified Sivakasi fireworks. Direct factory shipping across Tamil Nadu & India.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-semibold text-zinc-300 rounded-lg">
                🏭 Sivakasi Hub
              </span>
              <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-semibold text-zinc-300 rounded-lg">
                🔒 Safe Transit
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-zinc-400 hover:text-gold transition-colors">
                  Shop All Fireworks
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=deals" className="text-zinc-400 hover:text-gold transition-colors">
                  Festival Hot Deals
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=combos" className="text-zinc-400 hover:text-gold transition-colors">
                  Celebration Combo Packs
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestsellers" className="text-zinc-400 hover:text-gold transition-colors">
                  Customer Favourites
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-zinc-400 hover:text-gold transition-colors">
                  Track Consignment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-zinc-400 hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    <span>{c.icon}</span> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Customer Support
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-400 mb-4">
              <p className="flex items-center gap-2">
                <span>📍</span> Sivakasi, Virudhunagar Dist, Tamil Nadu
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> +91 99999 99999 (9 AM – 8 PM)
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span> support@singamcrackers.com
              </p>
            </div>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1ebd5a] transition-colors"
            >
              💬 WhatsApp Us Directly
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800/80 py-4 bg-black/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <p>© 2025 Singam Crackers, Sivakasi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Safety Certified</span>
            <span>•</span>
            <span>Wholesale & Retail</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
