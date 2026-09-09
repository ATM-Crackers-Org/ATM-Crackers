import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { TrackOrderPageContent } from "@/components/order/TrackOrderPageContent";

export const metadata = {
  title: "Track Order | ATM Crackers",
  description: "Track your Sivakasi fireworks dispatch and transport status in real time.",
};

export default function TrackOrderPage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <TrackOrderPageContent />
      <Footer />
      <MobileNav />
    </div>
  );
}
