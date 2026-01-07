import { UserPlus, Package, Banknote } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in 2 minutes. Just your name and email – no business registration needed.",
  },
  {
    number: "02",
    icon: Package,
    title: "Upload Your Products",
    description: "Snap photos, set your price, add a description. That's it – you're live!",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Get Paid Fast",
    description: "Receive orders, ship to buyers, and get your money in 24-48 hours.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Anyone Can Do It</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            From Product to Profit in Minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're a student, creator, or small business – if you have something to sell, we make it simple.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-primary/80 transition-all duration-500">
                  <step.icon className="w-12 h-12 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
