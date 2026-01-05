import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["All", "Fashion", "Electronics", "Home"];

const products = [
  {
    id: 1,
    name: "Handwoven Kente Bag",
    category: "Fashion",
    price: 45000,
    originalPrice: 65000,
    discount: "30% off",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    price: 28000,
    originalPrice: 35000,
    discount: "20% off",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Ankara Print Dress",
    category: "Fashion",
    price: 32000,
    originalPrice: 45000,
    discount: "29% off",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Artisan Table Lamp",
    category: "Home",
    price: 18000,
    originalPrice: 25000,
    discount: "28% off",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const FeaturedProductsSection = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = activeTab === "All" 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 blob-shape blur-2xl" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Products</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Top Seller Products
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-background rounded-full p-1 border border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Discount Badge */}
                <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  {product.discount}
                </span>
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-card transition-colors">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/marketplace">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;