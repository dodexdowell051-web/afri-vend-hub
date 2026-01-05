import { Zap, Shield, Headphones, CreditCard, Globe, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Payouts",
    description: "Get your money within 24-48 hours. No waiting for weeks.",
  },
  {
    icon: CreditCard,
    title: "Low Fees",
    description: "Only 5% transaction fee. Keep more of what you earn.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team ready to help you grow.",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    description: "Secure payments and dispute resolution for trust.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Africa map shape */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[500px] bg-accent/5 africa-shape hidden lg:block" />
      
      {/* Decorative dots */}
      <div className="absolute left-1/4 top-20 w-2 h-2 rounded-full bg-secondary" />
      <div className="absolute right-1/3 bottom-20 w-3 h-3 rounded-full bg-accent" />
      <div className="absolute left-1/3 bottom-32 w-2 h-2 rounded-full bg-primary/40" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Decorative blob */}
              <div className="absolute -inset-8 bg-gradient-to-br from-accent/20 to-secondary/10 blob-shape blur-2xl" />
              
              {/* Main circular image */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto rounded-full overflow-hidden border-8 border-background shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&h=500&fit=crop"
                  alt="African entrepreneur"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Small floating image */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-background shadow-xl animate-float hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Happy seller"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Empowering African{" "}
              <span className="text-gradient">Entrepreneurs</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our promise is to provide the tools and support African sellers need to thrive in the digital economy. 
              We're building the future of commerce across the continent.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;