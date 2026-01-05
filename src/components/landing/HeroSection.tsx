import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-entrepreneurs.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Hero Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="African entrepreneurs working together on a laptop"
                  className="w-full h-auto object-cover aspect-square lg:aspect-[4/5]"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-4 border border-border animate-float hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold text-foreground">+47% Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Text */}
          <div className="text-center lg:text-left order-1 lg:order-2 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Africa's Fastest Growing Marketplace
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Sell & Buy Smarter{" "}
              <span className="text-gradient">Across Africa</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Join thousands of sellers and buyers on Africa's most trusted marketplace. 
              Low fees, fast payouts, and dedicated support.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/seller">
                  Start Selling
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/marketplace">
                  Explore Marketplace
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Active Sellers</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Products Listed</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">African Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
