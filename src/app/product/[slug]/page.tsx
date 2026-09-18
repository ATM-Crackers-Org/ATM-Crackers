import { use } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProductDetailPageContent } from "@/components/product/ProductDetailPageContent";
import { getProductByIdentifier } from "@/services/product.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  let name: string | undefined;

  try {
    const apiProd = await getProductByIdentifier(resolvedParams.slug);
    if (apiProd?.name) {
      name = apiProd.name;
    }
  } catch {
    // API failure fallback
  }

  return {
    title: name ? `${name} | ATM Crackers` : "Product | ATM Crackers",
    description: name
      ? `Buy ${name} at Sivakasi factory direct wholesale price from ATM Crackers.`
      : "Authentic Sivakasi fireworks at factory direct wholesale prices.",
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
