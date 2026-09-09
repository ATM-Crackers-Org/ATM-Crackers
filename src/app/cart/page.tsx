import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata = {
  title: "Shopping Cart | ATM Crackers",
  description: "View and manage items in your shopping cart at ATM Crackers Sivakasi.",
};

export default function CartPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <CartPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
