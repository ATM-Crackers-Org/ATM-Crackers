import { use } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CategoryDetailPageContent } from "@/components/categories/CategoryDetailPageContent";
import { getCategoryBySlug } from "@/lib/categories";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.slug);
  return {
    title: category ? `${category.name} | ATM Crackers` : "Category | ATM Crackers",
    description: category?.description || "Browse factory direct Sivakasi crackers.",
  };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <CategoryDetailPageContent slug={resolvedParams.slug} />
      <Footer />
      <MobileNav />
    </div>
  );
}
