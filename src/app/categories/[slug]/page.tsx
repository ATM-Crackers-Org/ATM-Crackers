import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CategoryDetailPageContent } from "@/components/categories/CategoryDetailPageContent";
import { getCategoryBySlug } from "@/services/category.service";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${category.name} | ATM Crackers`,
      description:
        category.description ||
        `Shop ${category.name} — premium Sivakasi fireworks at factory direct prices.`,
    };
  } catch {
    return {
      title: "Category | ATM Crackers",
      description: "Browse factory direct Sivakasi crackers.",
    };
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <CategoryDetailPageContent slug={slug} />
      <Footer />
      <MobileNav />
    </div>
  );
}
