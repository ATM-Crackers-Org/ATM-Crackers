import Link from "next/link";
import { getTopCategories } from "@/lib/categories";
import { CategoryImage } from "@/components/ui/ProductImage";

export function CategoryGrid() {
  const categories = getTopCategories(8);

  return (
    <section className="py-14 sm:py-16 bg-[#FAFAF9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1.5">
            BROWSE BY TYPE
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
            Shop by Category
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Discover our wide range of premium Sivakasi fireworks
          </p>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="category-card group block bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm"
            >
              {/* Compact Image */}
              <div className="overflow-hidden">
                <CategoryImage
                  categoryName={cat.name}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-800 line-clamp-1 group-hover:text-crimson transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-zinc-50">
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {cat.product_count} items
                  </span>
                  <span className="text-[11px] font-bold text-crimson group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-crimson text-crimson text-xs sm:text-sm font-bold rounded-xl hover:bg-crimson hover:text-white transition-all"
          >
            View All 37 Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
