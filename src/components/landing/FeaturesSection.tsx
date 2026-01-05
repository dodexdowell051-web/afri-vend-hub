import { Zap, Shield, Headphones, CreditCard, Globe, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Payouts",
    description: "Get your money within 24-48 hours. No waiting for weeks like other platforms.",
  },
  {
    icon: CreditCard,
    title: "Low Fees",
    description: "Only 5% transaction fee. Keep more of what you earn with our transparent pricing.",
  },
  {
    icon: Headphones,
    title: "24/7 Seller Support",
    description: "Dedicated support team ready to help you grow your business any time.",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    description: "Secure payments and dispute resolution to build trust with every transaction.",
  },
  {
    icon: Globe,
    title: "Pan-African Reach",
    description: "Sell to customers across 15+ African countries from one dashboard.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track your sales, understand your customers, and grow with data-driven decisions.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Why Choose Afrivend</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg">
            We've built the tools and features that African entrepreneurs actually need. 
            No complexity, just results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 lg:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
