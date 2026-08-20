import Link from "next/link";
import { getHotDeals } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";

export function HotDeals() {
  const deals = getHotDeals(8);

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1">
              🔥 LIMITED TIME OFFERS
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              Hot Festival Deals
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Special wholesale discounts on top customer-favourite crackers
            </p>
          </div>
          <Link
            href="/shop?filter=deals"
            className="self-start sm:self-auto text-xs sm:text-sm font-bold text-crimson hover:underline"
          >
            View All Hot Deals →
          </Link>
        </div>

        <ProductGrid products={deals} cols={4} />
      </div>
    </section>
  );
}
