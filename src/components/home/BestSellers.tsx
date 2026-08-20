import { getBestSellers } from "@/lib/products";
import { ProductCarousel } from "@/components/product/ProductCarousel";

export function BestSellers() {
  const products = getBestSellers(12);

  return (
    <section className="py-14 sm:py-16 bg-[#FAFAF9] border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          products={products}
          title="CUSTOMER FAVOURITES"
          subtitle="Top reviewed fireworks with guaranteed performance and vibrant color bursts"
          viewAllHref="/shop?filter=bestsellers"
        />
      </div>
    </section>
  );
}
