import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HotDeals } from "@/components/home/HotDeals";
import { BestSellers } from "@/components/home/BestSellers";
import { PromoBanner } from "@/components/home/PromoBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div className="has-mobile-nav">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <CategoryGrid />
        <HotDeals />
        <BestSellers />
        <PromoBanner />
        <WhyChooseUs />
        <CustomerReviews />
        <FAQSection />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
