import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/5" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="bg-card rounded-3xl overflow-hidden card-shadow">
          <div className="grid lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative min-h-[300px] lg:min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                alt="African marketplace sellers"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-primary-foreground p-6">
                  <span className="text-sm font-medium uppercase tracking-wider opacity-80">Limited Time Offer</span>
                  <h3 className="text-3xl md:text-4xl font-bold mt-2">25% Off</h3>
                  <p className="text-lg opacity-90 mt-1">On All Seller Fees</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Get Started Today</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                Ready to Grow Your Business?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of successful sellers already on Afrivend. 
                Start selling today – it's free to get started.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/seller">
                    Start Selling Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch Video
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-8 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free to start
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No hidden fees
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;