import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, Package, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ProductFilters from "@/components/marketplace/ProductFilters";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductCardSkeleton } from "@/components/loading/ShimmerSkeleton";

const categories = [
  "All", "Fashion", "Electronics", "Home & Garden", "Beauty", "Food & Beverages", "Sports", "Crafts", "Other"
];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  store: {
    id: string;
    name: string;
  };
}

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        stock,
        image_url,
        category,
        store:stores (id, name)
      `)
      .eq("is_active", true)
      .gt("stock", 0)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as unknown as Product[]);
      // Set max price based on products
      const maxPrice = Math.max(...data.map((p: { price: number }) => p.price), 100000);
      setPriceRange([0, maxPrice]);
    }
    setLoading(false);
  };

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, activeCategory, searchQuery, priceRange]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    await addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Discover African Excellence
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Explore the Marketplace
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Unique products from trusted African sellers, delivered to your doorstep
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for products, categories, or stores..."
                className="pl-12 h-14 rounded-2xl text-base border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <ProductFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            maxPrice={maxPrice}
          />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              {activeCategory !== "All" && ` in ${activeCategory}`}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you're looking for
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
