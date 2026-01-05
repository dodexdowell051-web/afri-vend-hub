import { Star } from "lucide-react";

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

const stats = [
  { value: "4.89M", label: "Products Sold" },
  { value: "68K", label: "Active Sellers" },
  { value: "15+", label: "Countries" },
  { value: "98%", label: "Satisfaction" },
];

const SocialProofSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 blob-shape" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 blob-shape-2" />
        {/* Dots */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-accent" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-secondary" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
            What Our Sellers Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of successful African entrepreneurs already thriving with us.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 lg:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
            >
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
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/20">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
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

        {/* Stats */}
        <div className="bg-card rounded-3xl p-8 md:p-12 card-shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;