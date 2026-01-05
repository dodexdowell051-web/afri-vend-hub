import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Heart, Users, Target, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Seller First",
    description: "We build every feature with our sellers in mind. Your success is our success.",
  },
  {
    icon: Globe,
    title: "Pan-African Vision",
    description: "We're breaking down barriers to enable commerce across the entire continent.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Our sellers and buyers are a community. We grow together, learn together.",
  },
  {
    icon: Target,
    title: "Simplicity Wins",
    description: "We remove complexity so you can focus on what matters – your business.",
  },
];

const team = [
  { name: "Chidi Okafor", role: "CEO & Co-Founder", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
  { name: "Amara Diallo", role: "CTO & Co-Founder", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop" },
  { name: "Kwesi Mensah", role: "Head of Operations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { name: "Fatou Ndiaye", role: "Head of Seller Success", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto text-center max-w-4xl">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empowering African{" "}
              <span className="text-gradient">Entrepreneurs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We started Afrivend with a simple belief: every African entrepreneur deserves 
              access to a world-class marketplace that understands their unique needs.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To become Africa's most trusted marketplace by empowering millions of 
                  sellers to build sustainable businesses and connecting them with buyers 
                  across the continent.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  We're building the infrastructure that enables commerce to flow freely 
                  across Africa – breaking down the barriers of payment, logistics, and 
                  trust that have held back e-commerce on the continent.
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-3xl font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground">African Countries</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">10K+</p>
                    <p className="text-sm text-muted-foreground">Active Sellers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">₦500M+</p>
                    <p className="text-sm text-muted-foreground">Transacted</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Globe className="w-32 h-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide everything we do at Afrivend
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-card rounded-2xl p-6 card-shadow text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Passionate Africans building the future of commerce on the continent
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-card rounded-2xl p-6 card-shadow text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us in Building Africa's Future
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a seller looking to grow your business or a buyer searching 
              for unique products, Afrivend is your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/seller">
                  Start Selling
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/marketplace">
                  Explore Products
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
