import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  is_active: boolean | null;
  store_id: string;
  store_name?: string;
  created_at: string | null;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data: stores } = await supabase.from("stores").select("id, name");
    const storeMap = new Map(stores?.map(s => [s.id, s.name]) || []);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
      return;
    }

    const productsWithStore = data?.map(p => ({
      ...p,
      store_name: storeMap.get(p.store_id) || "Unknown"
    })) || [];

    setProducts(productsWithStore);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    } else if (isAdmin) {
      fetchProducts();
    }
  }, [authLoading, isAdmin, navigate]);

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !isActive })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update product");
      return;
    }

    toast.success(isActive ? "Product disabled" : "Product enabled");
    fetchProducts();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Product Management</h1>
          </header>
          <div className="p-6">
            <ProductsTable 
              products={products} 
              onToggleActive={handleToggleActive}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProducts;
