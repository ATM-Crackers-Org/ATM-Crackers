import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ShopPageContent } from "@/components/shop/ShopPageContent";

export const metadata = {
  title: "Shop Fireworks & Crackers | ATM Crackers",
  description: "Browse 191+ Sivakasi fireworks at factory direct wholesale prices.",
};

export default function ShopPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <ShopPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
