import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  seller_name?: string;
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
  delivery_address?: string | null;
  delivery_phone?: string | null;
}

interface SellerWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  is_locked?: boolean;
  lock_reason?: string | null;
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
  wallet_id: string;
}

interface Dispute {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  reason: string;
  buyer_evidence: string | null;
  seller_evidence: string | null;
  status: string;
  resolution_notes: string | null;
  created_at: string | null;
  buyer_name?: string;
  seller_name?: string;
  order_total?: number;
}

interface Refund {
  id: string;
  order_id: string;
  dispute_id: string | null;
  amount: number;
  reason: string;
  status: string;
  payment_reference: string | null;
  processed_at: string | null;
  created_at: string | null;
}

interface AuditLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  details: unknown;
  created_at: string | null;
  user_email?: string;
}

interface PlatformBalance {
  total_revenue: number;
  total_commissions: number;
  pending_payouts: number;
  completed_payouts: number;
}

interface PlatformSettings {
  commission_rate: string;
  min_withdrawal_amount: string;
  payout_schedule: string;
  auto_payouts_enabled: string;
  escrow_release_days: string;
}

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  pendingSellers: number;
  approvedSellers: number;
  suspendedSellers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalDisputes: number;
  pendingDisputes: number;
}

interface Store {
  id: string;
  name: string;
  user_id: string;
  is_suspended: boolean | null;
}

export const useSuperAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallets, setWallets] = useState<SellerWallet[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [platformBalance, setPlatformBalance] = useState<PlatformBalance | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commission_rate: "10",
    min_withdrawal_amount: "5000",
    payout_schedule: "manual",
    auto_payouts_enabled: "false",
    escrow_release_days: "3"
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    pendingSellers: 0,
    approvedSellers: 0,
    suspendedSellers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalDisputes: 0,
    pendingDisputes: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Fetch all data in parallel
      const [
        usersRes,
        storesRes,
        productsRes,
        ordersRes,
        walletsRes,
        payoutsRes,
        disputesRes,
        refundsRes,
        auditLogsRes,
        balanceRes,
        settingsRes
      ] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("stores").select("id, name, user_id, is_suspended"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("seller_wallets").select("*"),
        supabase.from("payouts").select("*").order("created_at", { ascending: false }),
        supabase.from("disputes").select("*").order("created_at", { ascending: false }),
        supabase.from("refunds").select("*").order("created_at", { ascending: false }),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("platform_balance").select("*").maybeSingle(),
        supabase.from("platform_settings").select("*")
      ]);

      const usersData = usersRes.data || [];
      const storesData = storesRes.data || [];
      const productsData = productsRes.data || [];
      const ordersData = ordersRes.data || [];
      const walletsData = walletsRes.data || [];
      const payoutsData = payoutsRes.data || [];
      const disputesData = disputesRes.data || [];
      const refundsData = refundsRes.data || [];
      const auditLogsData = auditLogsRes.data || [];

      // Create maps for lookups
      const userMap = new Map(usersData.map(u => [u.id, u]));
      const storeMap = new Map(storesData.map(s => [s.id, s]));

      // Transform products with store and seller info
      const transformedProducts = productsData.map(p => {
        const store = storeMap.get(p.store_id);
        const seller = store ? userMap.get(store.user_id) : null;
        return {
          ...p,
          store_name: store?.name || "Unknown Store",
          seller_name: seller ? `${seller.first_name || ''} ${seller.last_name || ''}`.trim() : "Unknown"
        };
      });

      // Transform orders
      const transformedOrders = ordersData.map(o => ({
        ...o,
        store_name: storeMap.get(o.store_id)?.name || "Unknown Store"
      }));

      // Transform wallets
      const transformedWallets = walletsData.map(w => {
        const user = userMap.get(w.user_id);
        return {
          ...w,
          seller_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Unknown",
          seller_email: user?.email || "Unknown"
        };
      });

      // Transform payouts
      const transformedPayouts = payoutsData.map(p => {
        const user = userMap.get(p.seller_id);
        return {
          ...p,
          seller_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Unknown"
        };
      });

      // Transform disputes
      const transformedDisputes = disputesData.map(d => {
        const buyer = userMap.get(d.buyer_id);
        const seller = userMap.get(d.seller_id);
        const order = ordersData.find(o => o.id === d.order_id);
        return {
          ...d,
          buyer_name: buyer ? `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() : "Unknown",
          seller_name: seller ? `${seller.first_name || ''} ${seller.last_name || ''}`.trim() : "Unknown",
          order_total: order?.total || 0
        };
      });

      // Transform audit logs
      const transformedAuditLogs = auditLogsData.map(log => {
        const user = log.user_id ? userMap.get(log.user_id) : null;
        return {
          ...log,
          user_email: user?.email || "System"
        };
      });

      // Parse settings
      const settings: PlatformSettings = {
        commission_rate: "10",
        min_withdrawal_amount: "5000",
        payout_schedule: "manual",
        auto_payouts_enabled: "false",
        escrow_release_days: "3"
      };
      settingsRes.data?.forEach(s => {
        if (s.key in settings) {
          settings[s.key as keyof PlatformSettings] = s.value;
        }
      });

      // Calculate stats
      const sellers = usersData.filter(u => u.role === "seller");
      const buyers = usersData.filter(u => u.role === "buyer");
      const pendingDisputes = disputesData.filter(d => d.status === "pending" || d.status === "under_review");

      setUsers(usersData as User[]);
      setProducts(transformedProducts);
      setOrders(transformedOrders);
      setWallets(transformedWallets);
      setPayouts(transformedPayouts);
      setDisputes(transformedDisputes);
      setRefunds(refundsData);
      setAuditLogs(transformedAuditLogs);
      setStores(storesData);
      setPlatformBalance(balanceRes.data as PlatformBalance | null);
      setPlatformSettings(settings);

      setStats({
        totalUsers: usersData.length,
        totalSellers: sellers.length,
        totalBuyers: buyers.length,
        pendingSellers: sellers.filter(s => s.seller_status === "pending").length,
        approvedSellers: sellers.filter(s => s.seller_status === "approved").length,
        suspendedSellers: sellers.filter(s => s.seller_status === "suspended").length,
        totalProducts: productsData.length,
        activeProducts: productsData.filter(p => p.is_active).length,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter(o => o.status === "pending").length,
        totalDisputes: disputesData.length,
        pendingDisputes: pendingDisputes.length
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    }

    setLoading(false);
  };

  // Admin actions
  const updateSellerStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ seller_status: status })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to update seller status");
      return false;
    }

    // Create audit log
    await supabase.rpc("create_audit_log", {
      p_action_type: "seller_status_update",
      p_entity_type: "profile",
      p_entity_id: userId,
      p_details: { new_status: status }
    });

    toast.success(`Seller status updated to ${status}`);
    await fetchAllData();
    return true;
  };

  const suspendStore = async (storeId: string, suspend: boolean) => {
    const { error } = await supabase
      .from("stores")
      .update({ is_suspended: suspend })
      .eq("id", storeId);

    if (error) {
      toast.error("Failed to update store status");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: suspend ? "store_suspended" : "store_reactivated",
      p_entity_type: "store",
      p_entity_id: storeId,
      p_details: { is_suspended: suspend }
    });

    toast.success(suspend ? "Store suspended" : "Store reactivated");
    await fetchAllData();
    return true;
  };

  const toggleProductActive = async (productId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to update product");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: isActive ? "product_enabled" : "product_disabled",
      p_entity_type: "product",
      p_entity_id: productId,
      p_details: { is_active: isActive }
    });

    toast.success(isActive ? "Product enabled" : "Product disabled");
    await fetchAllData();
    return true;
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      toast.error("Failed to delete product");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: "product_deleted",
      p_entity_type: "product",
      p_entity_id: productId,
      p_details: {}
    });

    toast.success("Product deleted");
    await fetchAllData();
    return true;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: "order_status_update",
      p_entity_type: "order",
      p_entity_id: orderId,
      p_details: { new_status: status }
    });

    toast.success("Order status updated");
    await fetchAllData();
    return true;
  };

  const toggleWalletLock = async (walletId: string, lock: boolean, reason?: string) => {
    const { error } = await supabase
      .from("seller_wallets")
      .update({ is_locked: lock, lock_reason: lock ? reason : null })
      .eq("id", walletId);

    if (error) {
      toast.error("Failed to update wallet");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: lock ? "wallet_locked" : "wallet_unlocked",
      p_entity_type: "wallet",
      p_entity_id: walletId,
      p_details: { is_locked: lock, reason }
    });

    toast.success(lock ? "Wallet locked" : "Wallet unlocked");
    await fetchAllData();
    return true;
  };

  const processPayoutAction = async (payoutId: string, action: "approve" | "reject" | "mark_sent", notes?: string) => {
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout) return false;

    let updateData: Record<string, unknown> = {};
    
    if (action === "approve") {
      updateData = { status: "approved" };
    } else if (action === "reject") {
      updateData = { status: "rejected", notes };
    } else if (action === "mark_sent") {
      updateData = { 
        status: "completed", 
        processed_at: new Date().toISOString()
      };

      // Update wallet balance
      await supabase
        .from("seller_wallets")
        .update({ balance: 0 })
        .eq("id", payout.wallet_id);

      // Update platform balance
      if (platformBalance) {
        await supabase
          .from("platform_balance")
          .update({
            pending_payouts: platformBalance.pending_payouts - payout.amount,
            completed_payouts: platformBalance.completed_payouts + payout.amount
          })
          .neq("id", "placeholder");
      }
    }

    const { error } = await supabase
      .from("payouts")
      .update(updateData)
      .eq("id", payoutId);

    if (error) {
      toast.error("Failed to process payout");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: `payout_${action}`,
      p_entity_type: "payout",
      p_entity_id: payoutId,
      p_details: { action, amount: payout.amount, notes }
    });

    toast.success(`Payout ${action === "mark_sent" ? "marked as sent" : action}d`);
    await fetchAllData();
    return true;
  };

  const resolveDispute = async (disputeId: string, resolution: "resolved_buyer" | "resolved_seller", notes: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return false;

    const { error } = await supabase
      .from("disputes")
      .update({
        status: resolution,
        resolution_notes: notes,
        resolved_at: new Date().toISOString()
      })
      .eq("id", disputeId);

    if (error) {
      toast.error("Failed to resolve dispute");
      return false;
    }

    // If resolved in buyer's favor, create refund
    if (resolution === "resolved_buyer") {
      await supabase.from("refunds").insert({
        order_id: dispute.order_id,
        dispute_id: disputeId,
        amount: dispute.order_total || 0,
        reason: notes,
        status: "pending"
      });
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: "dispute_resolved",
      p_entity_type: "dispute",
      p_entity_id: disputeId,
      p_details: { resolution, notes }
    });

    toast.success("Dispute resolved");
    await fetchAllData();
    return true;
  };

  const processRefund = async (refundId: string, action: "process" | "complete" | "fail") => {
    const statusMap = {
      process: "processing",
      complete: "completed",
      fail: "failed"
    };

    const updateData: Record<string, unknown> = {
      status: statusMap[action]
    };

    if (action === "complete") {
      updateData.processed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("refunds")
      .update(updateData)
      .eq("id", refundId);

    if (error) {
      toast.error("Failed to update refund");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: `refund_${action}`,
      p_entity_type: "refund",
      p_entity_id: refundId,
      p_details: { action }
    });

    toast.success(`Refund ${action === "complete" ? "completed" : action === "fail" ? "marked as failed" : "processing"}`);
    await fetchAllData();
    return true;
  };

  const updatePlatformSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from("platform_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("platform_settings")
        .update({ value })
        .eq("key", key);
      error = result.error;
    } else {
      const result = await supabase
        .from("platform_settings")
        .insert({ key, value });
      error = result.error;
    }

    if (error) {
      toast.error("Failed to update setting");
      return false;
    }

    await supabase.rpc("create_audit_log", {
      p_action_type: "setting_updated",
      p_entity_type: "platform_settings",
      p_entity_id: null,
      p_details: { key, value }
    });

    toast.success("Setting updated");
    await fetchAllData();
    return true;
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
    disputes,
    refunds,
    auditLogs,
    stores,
    platformBalance,
    platformSettings,
    stats,
    loading,
    refreshData: fetchAllData,
    // Actions
    updateSellerStatus,
    suspendStore,
    toggleProductActive,
    deleteProduct,
    updateOrderStatus,
    toggleWalletLock,
    processPayoutAction,
    resolveDispute,
    processRefund,
    updatePlatformSetting
  };
};
