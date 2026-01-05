import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Heart, Star, MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";

const categories = [
  "All", "Fashion", "Electronics", "Home & Living", "Beauty", "Food", "Art & Crafts", "Accessories"
];

const products = [
  {
    id: 1,
    name: "Handmade Ankara Tote Bag",
    price: 25000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    seller: "Amara's Boutique",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 128,
    category: "Fashion",
  },
  {
    id: 2,
    name: "Beaded Statement Necklace",
    price: 15000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    seller: "Zuri Jewelry",
    location: "Accra, Ghana",
    rating: 4.8,
    reviews: 89,
    category: "Accessories",
  },
  {
    id: 3,
    name: "African Print Wall Art",
    price: 35000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    seller: "ArtHub Africa",
    location: "Nairobi, Kenya",
    rating: 5.0,
    reviews: 56,
    category: "Art & Crafts",
  },
  {
    id: 4,
    name: "Natural Shea Butter Set",
    price: 12000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
    seller: "Pure Naturals",
    location: "Abuja, Nigeria",
    rating: 4.7,
    reviews: 234,
    category: "Beauty",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 45000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    seller: "TechZone NG",
    location: "Lagos, Nigeria",
    rating: 4.6,
    reviews: 312,
    category: "Electronics",
  },
  {
    id: 6,
    name: "Handwoven Basket Set",
    price: 18000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=400&fit=crop",
    seller: "Craft Masters",
    location: "Kampala, Uganda",
    rating: 4.9,
    reviews: 67,
    category: "Home & Living",
  },
  {
    id: 7,
    name: "Organic Honey Collection",
    price: 8000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    seller: "Nature's Gold",
    location: "Addis Ababa, Ethiopia",
    rating: 4.8,
    reviews: 145,
    category: "Food",
  },
  {
    id: 8,
    name: "Kente Cloth Dress",
    price: 55000,
    currency: "₦",
    image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=400&fit=crop",
    seller: "Royal African Wear",
    location: "Accra, Ghana",
    rating: 5.0,
    reviews: 89,
    category: "Fashion",
  },
];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number, currency: string) => {
    return `${currency}${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore the Marketplace
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover unique products from trusted African sellers
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-12 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-6 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-secondary transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    by {product.seller}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full mt-4" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
