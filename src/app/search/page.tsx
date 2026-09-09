import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchPageContent } from "@/components/search/SearchPageContent";

export const metadata = {
  title: "Search Fireworks | ATM Crackers",
  description: "Search 191+ Sivakasi fireworks and crackers at factory direct prices.",
};

export default function SearchPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <SearchPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
