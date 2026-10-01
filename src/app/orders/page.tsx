import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { MyOrdersPageContent } from "@/components/order/MyOrdersPageContent";

export const metadata = {
  title: "My Orders | ATM Crackers",
  description: "View and track all fireworks orders placed in your current session.",
};

export default function MyOrdersPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <MyOrdersPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
