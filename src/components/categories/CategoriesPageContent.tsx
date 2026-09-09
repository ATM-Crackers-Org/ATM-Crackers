import Link from "next/link";
import { getEnrichedCategories } from "@/lib/categories";
import { CategoryImage } from "@/components/ui/ProductImage";

export function CategoriesPageContent() {
  const categories = getEnrichedCategories();

  return (
    <main className="min-h-screen bg-warm-white py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <span>›</span>
          <span className="text-zinc-700 font-medium">Categories</span>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-2">
            Explore Our Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-zinc-900">
            All Cracker Categories
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Discover all 37+ categories of authentic Sivakasi fireworks directly from the factory.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-zinc-100 product-card shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
            >
              <div className="overflow-hidden">
                <CategoryImage
                  categoryName={cat.name}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-sm font-bold text-zinc-800 line-clamp-1 group-hover:text-crimson transition-colors mb-1">
                  {cat.name}
                </h2>
                <p className="text-xs text-zinc-400 line-clamp-1 mb-3">
                  {cat.description || `${cat.name} collection`}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-50 pt-2">
                  <span className="text-xs font-semibold text-zinc-500">
                    {cat.product_count} Products
                  </span>
                  <span className="text-xs font-bold text-crimson group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
