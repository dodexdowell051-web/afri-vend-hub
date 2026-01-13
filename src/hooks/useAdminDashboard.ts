import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  seller_status: string | null;
  created_at: string | null;
}

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

interface SellerWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  seller_name?: string;
  seller_email?: string;
}

interface Payout {
  id: string;
  seller_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  created_at: string | null;
  seller_name?: string;
}

interface PlatformBalance {
  total_revenue: number;
  total_commissions: number;
  pending_payouts: number;
  completed_payouts: number;
}

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  pendingSellers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

export const useAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallets, setWallets] = useState<SellerWallet[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [platformBalance, setPlatformBalance] = useState<PlatformBalance | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);

    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch stores for product names
    const { data: storesData } = await supabase
      .from("stores")
      .select("id, name, user_id, is_suspended");

    const storeMap = new Map(storesData?.map(s => [s.id, s]) || []);

    // Fetch products with store info
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch wallets
    const { data: walletsData } = await supabase
      .from("seller_wallets")
      .select("*");

    // Fetch payouts
    const { data: payoutsData } = await supabase
      .from("payouts")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch platform balance
    const { data: balanceData } = await supabase
      .from("platform_balance")
      .select("*")
      .maybeSingle();

    // Fetch commission rate from settings
    const { data: commissionData } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "commission_rate")
      .maybeSingle();

    // Create user map for lookups
    const userMap = new Map(usersData?.map(u => [u.id, u]) || []);

    // Transform data with related info
    const transformedProducts = productsData?.map(p => ({
      ...p,
      store_name: storeMap.get(p.store_id)?.name || "Unknown Store"
    })) || [];

    const transformedOrders = ordersData?.map(o => ({
      ...o,
      store_name: storeMap.get(o.store_id)?.name || "Unknown Store"
    })) || [];

    const transformedWallets = walletsData?.map(w => {
      const user = userMap.get(w.user_id);
      return {
        ...w,
        seller_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Unknown",
        seller_email: user?.email || "Unknown"
      };
    }) || [];

    const transformedPayouts = payoutsData?.map(p => {
      const user = userMap.get(p.seller_id);
      return {
        ...p,
        seller_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Unknown"
      };
    }) || [];

    setUsers(usersData as User[] || []);
    setProducts(transformedProducts);
    setOrders(transformedOrders);
    setWallets(transformedWallets);
    setPayouts(transformedPayouts);
    setPlatformBalance(balanceData as PlatformBalance | null);
    setCommissionRate(commissionData?.value ? parseFloat(commissionData.value) : 10);

    // Calculate stats
    const sellers = usersData?.filter(u => u.role === "seller") || [];
    const buyers = usersData?.filter(u => u.role === "buyer") || [];
    const pendingSellers = usersData?.filter(u => u.role === "seller" && u.seller_status === "pending") || [];

    setStats({
      totalUsers: usersData?.length || 0,
      totalSellers: sellers.length,
      totalBuyers: buyers.length,
      pendingSellers: pendingSellers.length,
      totalProducts: productsData?.length || 0,
      activeProducts: productsData?.filter(p => p.is_active)?.length || 0,
      totalOrders: ordersData?.length || 0,
      pendingOrders: ordersData?.filter(o => o.status === "pending")?.length || 0
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    users,
    products,
    orders,
    wallets,
    payouts,
    platformBalance,
    commissionRate,
    stats,
    loading,
    refreshData: fetchAllData
  };
};
