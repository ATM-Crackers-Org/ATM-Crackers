import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WishlistPageContent } from "@/components/wishlist/WishlistPageContent";

export const metadata = {
  title: "My Wishlist | ATM Crackers",
  description: "View and manage your saved favourite fireworks at ATM Crackers.",
};

export default function WishlistPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <WishlistPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
