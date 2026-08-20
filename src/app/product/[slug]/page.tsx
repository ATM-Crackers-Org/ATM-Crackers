"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getProductBySlug, getRelatedProducts, formatPrice } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductImage } from "@/components/ui/ProductImage";
import { DiscountBadge, Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  if (!product) {
    notFound();
    return null;
  }

  const related = getRelatedProducts(product, 8);
  const wishlisted = isWishlisted(product.slug);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, "cart");
  }

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main className="bg-[#FAFAF9] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-[#B91C1C]">Home</Link>
            <span>›</span>
            <Link href="/shop" className="hover:text-[#B91C1C]">Shop</Link>
            <span>›</span>
            <Link href={`/categories/${product.category_slug}`} className="hover:text-[#B91C1C]">
              {product.category_name}
            </Link>
            <span>›</span>
            <span className="text-zinc-600 font-medium line-clamp-1">{product.name}</span>
          </nav>

          {/* Product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm">
              <ProductImage
                productName={product.name}
                categoryName={product.category_name}
                sku={product.sku}
                aspectRatio="1/1"
                size="detail"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <DiscountBadge percent={product.discount_percent} />
                {product.is_new_arrival && <Badge variant="new" />}
                {product.is_trending && <Badge variant="trending" />}
                {product.is_best_seller && <Badge variant="bestseller" />}
              </div>

              {/* Category */}
              <p className="text-xs font-bold text-[#B91C1C] uppercase tracking-widest">
                {product.category_name}
              </p>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <StarRating
                rating={product.rating}
                count={product.reviews_count}
                size="md"
              />

              {/* Price */}
              <div className="bg-zinc-50 rounded-2xl p-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-zinc-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                </div>
                <p className="text-sm text-emerald-600 font-bold">
                  🎉 You save {formatPrice(product.savings)} ({product.discount_percent}% off)
                </p>
              </div>

              {/* Pack info */}
              <div className="flex items-center gap-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-400">📦</span> Per {product.unit}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-400">🔑</span> SKU: {product.sku}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> In Stock
                </span>
              </div>

              {/* Qty + Add to Cart */}
              <div className="flex gap-3 items-center">
                <QuantitySelector value={qty} onChange={setQty} size="md" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#B91C1C] text-white font-bold rounded-2xl hover:bg-[#991B1B] shadow-[0_4px_20px_rgba(185,28,28,0.35)] transition-all text-sm cursor-pointer"
                >
                  🛒 ADD TO CART
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all text-sm text-center flex items-center justify-center"
                >
                  ⚡ BUY NOW
                </Link>
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!", "wishlist");
                  }}
                  className={`w-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all cursor-pointer ${
                    wishlisted ? "bg-pink-50 border-pink-300 text-pink-500" : "border-zinc-200 text-zinc-400"
                  }`}
                >
                  {wishlisted ? "♥" : "♡"}
                </button>
              </div>

              {/* Trust micro */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: "🏭", text: "Factory Direct" },
                  { icon: "📦", text: "Safe Packaging" },
                  { icon: "🚚", text: "Fast Delivery" },
                ].map((t) => (
                  <div key={t.text} className="flex flex-col items-center gap-1 bg-zinc-50 rounded-xl py-3 text-center">
                    <span className="text-lg">{t.icon}</span>
                    <p className="text-[10px] text-zinc-500 font-semibold">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "Product Highlights",
                items: [
                  "Genuine Sivakasi manufactured product",
                  `Pack unit: ${product.unit}`,
                  "Meets all safety standards",
                  "Vibrant colours and/or loud sound effects",
                  "Suitable for all outdoor celebrations",
                ],
              },
              {
                title: "Safety Information",
                items: [
                  "Use only in open outdoor spaces",
                  "Keep away from children under 12",
                  "Do not hold in hand after lighting",
                  "Keep water bucket nearby",
                  "Store in a cool, dry place",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-5 border border-zinc-100">
                <h2 className="text-base font-bold text-zinc-900 mb-3">{section.title}</h2>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                      <span className="text-[#B91C1C] mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <ProductCarousel
                products={related}
                title="More from This Category"
                viewAllHref={`/categories/${product.category_slug}`}
              />
            </div>
          )}
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden bg-white border-t border-zinc-200 px-4 py-3 flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-[#B91C1C] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
        >
          🛒 Add to Cart
        </button>
        <Link
          href="/checkout"
          className="flex-1 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl text-center"
          onClick={handleAddToCart}
        >
          ⚡ Buy Now
        </Link>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
