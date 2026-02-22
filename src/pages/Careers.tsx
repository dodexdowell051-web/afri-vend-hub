import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Megaphone, Users, Mail, Globe } from "lucide-react";

const roles = [
  { icon: Code, title: "Developers", description: "Frontend, backend, and mobile engineers to build the future of African e-commerce." },
  { icon: Megaphone, title: "Marketers", description: "Growth hackers, content creators, and brand strategists to spread the Afrivend story." },
  { icon: Users, title: "Operations", description: "Logistics, customer support, and operations managers to keep things running smoothly." },
  { icon: Globe, title: "Campus Ambassadors", description: "University students passionate about entrepreneurship and e-commerce across Nigeria." },
];

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <PageWrapper>
        <main className="flex-1">
          {/* Hero */}
          <section className="hero-gradient text-primary-foreground py-20">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Join Our Team</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Build Africa's Most Trusted Marketplace</h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                At Afrivend, we're on a mission to empower African entrepreneurs by creating a secure, transparent marketplace where trust drives commerce. We're just getting started — and we want you on the journey.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="py-16 container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Afrivend exists to solve the trust problem in African online commerce. Starting from Owerri, Imo State, we're building a platform where every transaction is protected by escrow, every seller is accountable, and every buyer shops with confidence. We believe that when people can trade securely, economies grow — and that starts with the right team.
            </p>
          </section>

          {/* Roles */}
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-bold text-foreground mb-2">Who We're Looking For</h2>
              <p className="text-muted-foreground mb-8">We're always interested in passionate people across these areas:</p>
              <div className="grid gap-6 sm:grid-cols-2">
                {roles.map((role) => (
                  <Card key={role.title} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <role.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{role.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* No Open Roles CTA */}
          <section className="py-16 container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-8 md:p-12 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-3">No Open Roles Right Now</h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                  We don't have any specific positions open at the moment, but we're always looking for exceptional talent. If you believe you can contribute to Afrivend's mission, we'd love to hear from you.
                </p>
                <p className="text-foreground font-medium mb-6">
                  Send your CV and a short introduction to:
                </p>
                <Button variant="default" size="lg" asChild>
                  <a href="mailto:careers@afrivend.com" className="gap-2">
                    <Mail className="w-4 h-4" />
                    careers@afrivend.com
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Careers;
