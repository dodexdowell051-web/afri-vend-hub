import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, Store, Package, CreditCard, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Free to start – no upfront costs",
  "Only 5% commission on sales",
  "Fast payouts within 48 hours",
  "Reach customers across Africa",
  "24/7 dedicated seller support",
  "Powerful analytics dashboard",
];

const Seller = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          
          <div className="container mx-auto relative z-10 py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Store className="w-4 h-4" />
                  Seller Onboarding
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Turn Your Products Into a{" "}
                  <span className="text-gradient">Thriving Business</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Join Africa's fastest-growing marketplace. Set up your store in minutes 
                  and start selling to thousands of eager buyers.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="flex gap-8 pt-6 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-foreground">₦50M+</p>
                    <p className="text-sm text-muted-foreground">Paid to sellers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">10K+</p>
                    <p className="text-sm text-muted-foreground">Active sellers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">48hrs</p>
                    <p className="text-sm text-muted-foreground">Avg. payout time</p>
                  </div>
                </div>
              </div>

              {/* Right Content - Form */}
              <div className="bg-card rounded-2xl card-shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Start Selling Today</h2>
                
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business">Business Name</Label>
                    <Input id="business" placeholder="Your Store Name" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="products">What do you sell?</Label>
                    <Textarea 
                      id="products" 
                      placeholder="Tell us about your products..." 
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    Create My Store
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* How Selling Works */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Selling Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've made it super simple to start your online business
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Store, title: "Create Store", desc: "Set up your seller profile and storefront" },
                { icon: Package, title: "Add Products", desc: "List your products with photos and prices" },
                { icon: TrendingUp, title: "Get Orders", desc: "Customers discover and buy your products" },
                { icon: CreditCard, title: "Get Paid", desc: "Receive fast payouts to your bank" },
              ].map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-8 h-8 text-primary" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Seller;
