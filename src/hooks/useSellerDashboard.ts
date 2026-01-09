import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  buyer_id: string;
  store_id: string;
  status: string;
  total: number;
  created_at: string;
}

interface Wallet {
  balance: number;
  total_earnings: number;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  earnings: number;
  totalEarnings: number;
}

export const useSellerDashboard = () => {
  const { store, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    earnings: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!store || !user) return;
    
    setLoading(true);

    // Fetch products count
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id);

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });

    // Fetch wallet
    const { data: walletData } = await supabase
      .from("seller_wallets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setOrders((ordersData as Order[]) || []);
    setWallet(walletData as Wallet | null);
    
    setStats({
      totalProducts: productsCount || 0,
      totalOrders: ordersData?.length || 0,
      earnings: walletData?.balance || 0,
      totalEarnings: walletData?.total_earnings || 0
    });

    setLoading(false);
  };

  useEffect(() => {
    if (store) {
      fetchDashboardData();
    }
  }, [store]);

  return {
    orders,
    wallet,
    stats,
    loading,
    refreshData: fetchDashboardData
  };
};
