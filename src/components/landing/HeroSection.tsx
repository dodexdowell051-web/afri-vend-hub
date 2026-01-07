import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-entrepreneurs.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blob in top right */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/10 blob-shape blur-3xl" />
        {/* Small dots pattern */}
        <div className="absolute top-40 left-10 w-32 h-32 dot-pattern opacity-50" />
        {/* Floating accent dots */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-secondary animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-primary/40 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-accent/60 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              No Business Needed • Start in Minutes
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Anyone Can{" "}
              <span className="text-gradient">Sell.</span>{" "}
              <br className="hidden sm:block" />
              Everyone Can Buy.
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Got a product? Start selling in minutes. No business registration required. 
              Just your product, fair fees, and real buyers waiting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/seller">
                  Start Selling Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/marketplace">
                  Shop from Real Sellers
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Everyday Sellers</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Unique Products</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">African Countries</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative">
              {/* Decorative blob behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/10 blob-shape-2 blur-2xl" />
              
              {/* Main Image Container with organic shape */}
              <div className="relative blob-shape overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="African entrepreneurs working together on a laptop"
                  className="w-full h-auto object-cover aspect-square"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              </div>
              
              {/* Decorative floating elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-float" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 blob-shape blur-xl animate-float" style={{ animationDelay: '2s' }} />
              
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-4 border border-border animate-float hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold text-foreground">+47% Growth</p>
                  </div>
                </div>
              </div>

              {/* Second floating card */}
              <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-xl p-3 border border-border animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <span className="text-xl">🎉</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">New Seller</p>
                    <p className="text-sm font-semibold text-foreground">Just Joined!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;