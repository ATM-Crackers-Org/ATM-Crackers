import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HotDeals } from "@/components/home/HotDeals";
import { ComboPacks } from "@/components/home/ComboPacks";
import { BudgetSection } from "@/components/home/BudgetSection";
import { BestSellers } from "@/components/home/BestSellers";
import { BuildCombo } from "@/components/home/BuildCombo";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PromoBanner } from "@/components/home/PromoBanner";
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
        <ComboPacks />
        <BudgetSection />
        <BestSellers />
        <PromoBanner />
        <BuildCombo />
        <WhyChooseUs />
        <CustomerReviews />
        <FAQSection />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
