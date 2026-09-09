import { use } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductDetailPageContent } from "@/components/product/ProductDetailPageContent";
import { getProductBySlug } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);
  return {
    title: product ? `${product.name} | ATM Crackers` : "Product | ATM Crackers",
    description: product ? `Buy ${product.name} at Sivakasi factory direct price.` : "Authentic Sivakasi fireworks.",
  };
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <ProductDetailPageContent slug={resolvedParams.slug} />
      <Footer />
      <MobileNav />
    </div>
  );
}
