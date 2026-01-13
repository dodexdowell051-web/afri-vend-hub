import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Order {
  id: string;
  buyer_id: string;
  store_id: string;
  total: number;
  status: string | null;
  payment_status: string | null;
  platform_commission: number | null;
  seller_earning: number | null;
  created_at: string | null;
  customer_name: string | null;
  store_name?: string;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data: stores } = await supabase.from("stores").select("id, name");
    const storeMap = new Map(stores?.map(s => [s.id, s.name]) || []);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
      return;
    }

    const ordersWithStore = data?.map(o => ({
      ...o,
      store_name: storeMap.get(o.store_id) || "Unknown"
    })) || [];

    setOrders(ordersWithStore);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    } else if (isAdmin) {
      fetchOrders();
    }
  }, [authLoading, isAdmin, navigate]);

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
            <h1 className="text-xl font-semibold">Order Management</h1>
          </header>
          <div className="p-6">
            <OrdersTable orders={orders} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminOrders;
