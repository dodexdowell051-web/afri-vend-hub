import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsBar from "@/components/landing/BenefitsBar";
import CategoriesSection from "@/components/landing/CategoriesSection";
import FeaturedProductsSection from "@/components/landing/FeaturedProductsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <BenefitsBar />
        <CategoriesSection />
        <FeaturedProductsSection />
        <FeaturesSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;