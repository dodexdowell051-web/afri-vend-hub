import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amara Okonkwo",
    role: "Fashion Designer",
    location: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    quote: "Afrivend helped me reach customers I never could before. My sales doubled in just 3 months!",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Electronics Seller",
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "The fast payouts changed my business. I can now restock quickly and keep my customers happy.",
    rating: 5,
  },
  {
    name: "Fatima Hassan",
    role: "Artisan Crafts",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "Finally a platform that understands African sellers. The support team is amazing!",
    rating: 5,
  },
];

const trustedLogos = [
  { name: "MTN", initials: "MTN" },
  { name: "Safaricom", initials: "S" },
  { name: "Access Bank", initials: "AB" },
  { name: "Flutterwave", initials: "FW" },
  { name: "Paystack", initials: "PS" },
];

const SocialProofSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Trusted by Thousands</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            Sellers Love Afrivend
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the community of successful African entrepreneurs already growing with us.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 lg:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">Trusted Payment Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trustedLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center w-20 h-12 rounded-lg bg-muted text-muted-foreground font-semibold text-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {logo.initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
