import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CategoriesPageContent } from "@/components/categories/CategoriesPageContent";

export const metadata = {
  title: "Categories | ATM Crackers",
  description: "Browse all fireworks and cracker categories at ATM Crackers Sivakasi.",
};

export default function CategoriesPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <CategoriesPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
