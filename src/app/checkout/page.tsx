import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";

export const metadata = {
  title: "Secure Checkout | ATM Crackers",
  description: "Complete your fireworks order with secure payment and factory direct Sivakasi delivery.",
};

export default function CheckoutPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <CheckoutPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
