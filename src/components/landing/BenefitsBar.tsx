import { Users, ShieldCheck, Sparkles, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Real Sellers",
    description: "Shop from real people, not faceless stores",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Protected transactions every time",
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    description: "Trusted sellers you can count on",
  },
  {
    icon: Sparkles,
    title: "Easy Discovery",
    description: "Find unique products easily",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-8 border-y border-border bg-muted/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <benefit.icon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{benefit.title}</p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;