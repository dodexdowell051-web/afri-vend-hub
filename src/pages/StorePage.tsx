import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, Package, Store, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ProductCard from "@/components/marketplace/ProductCard";
import { ProductCardSkeleton } from "@/components/loading/ShimmerSkeleton";

interface StoreInfo {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

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

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (storeId) {
      fetchStoreAndProducts();
    }
  }, [storeId]);

  const fetchStoreAndProducts = async () => {
    setLoading(true);

    // Fetch store info
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, name, description, logo_url")
      .eq("id", storeId!)
      .eq("is_suspended", false)
      .single();

    if (storeError || !storeData) {
      setLoading(false);
      return;
    }

    setStore(storeData);

    // Fetch store products
    const { data: productsData } = await supabase
      .from("products")
      .select(`
        id, name, description, price, stock, image_url, category,
        store:stores (id, name)
      `)
      .eq("store_id", storeId!)
      .eq("is_active", true)
      .gt("stock", 0)
      .order("created_at", { ascending: false });

    if (productsData) {
      setProducts(productsData as unknown as Product[]);
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    await addToCart(productId);
  };

  if (!loading && !store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Store className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Store not found</h2>
            <p className="text-muted-foreground">
              This store may have been removed or the link is incorrect.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Store Header */}
          {store && (
            <div className="mb-10 p-6 md:p-8 bg-card rounded-2xl border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    {store.name}
                  </h1>
                  {store.description && (
                    <p className="text-muted-foreground max-w-2xl">
                      {store.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {products.length} product{products.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="max-w-xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products in this store..."
                className="pl-12 h-12 rounded-2xl text-base border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              <p className="text-muted-foreground">
                This store doesn't have any products matching your search yet.
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

export default StorePage;
