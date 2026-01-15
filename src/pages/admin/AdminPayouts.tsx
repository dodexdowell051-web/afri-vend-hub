import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { PayoutsTable } from "@/components/admin/PayoutsTable";
import { WalletsOverview } from "@/components/admin/WalletsOverview";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const AdminPayouts = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, user } = useAdminAuth();
  const [wallets, setWallets] = useState<SellerWallet[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name, email");
    const userMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Fetch wallets
    const { data: walletsData } = await supabase.from("seller_wallets").select("*");
    const transformedWallets = walletsData?.map(w => {
      const profile = userMap.get(w.user_id);
      return {
        ...w,
        seller_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : "Unknown",
        seller_email: profile?.email || "Unknown"
      };
    }) || [];

    // Fetch payouts
    const { data: payoutsData } = await supabase
      .from("payouts")
      .select("*")
      .order("created_at", { ascending: false });
    
    const transformedPayouts = payoutsData?.map(p => {
      const profile = userMap.get(p.seller_id);
      return {
        ...p,
        seller_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : "Unknown"
      };
    }) || [];

    setWallets(transformedWallets);
    setPayouts(transformedPayouts);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    } else if (isAdmin) {
      fetchData();
    }
  }, [authLoading, isAdmin, navigate]);

  const handleProcessPayout = async (payoutId: string, newStatus: 'processing' | 'completed' | 'failed') => {
    const { error } = await supabase
      .from("payouts")
      .update({ 
        status: newStatus,
        processed_by: user?.id,
        processed_at: new Date().toISOString()
      })
      .eq("id", payoutId);

    if (error) {
      toast.error("Failed to update payout status");
      return;
    }

    // If completed, update wallet balance and log transaction
    if (newStatus === 'completed') {
      const payout = payouts.find(p => p.id === payoutId);
      if (payout) {
        const wallet = wallets.find(w => w.user_id === payout.seller_id);
        if (wallet) {
          await supabase
            .from("seller_wallets")
            .update({ balance: wallet.balance - payout.amount })
            .eq("id", wallet.id);

          // Update platform balance
          const { data: platformData } = await supabase
            .from("platform_balance")
            .select("*")
            .maybeSingle();

          if (platformData) {
            await supabase
              .from("platform_balance")
              .update({ 
                completed_payouts: platformData.completed_payouts + payout.amount,
                pending_payouts: Math.max(0, platformData.pending_payouts - payout.amount)
              })
              .eq("id", platformData.id);
          }
        }
      }
    }

    toast.success(`Payout marked as ${newStatus}`);
    fetchData();
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
        <SuperAdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Payouts & Wallets</h1>
          </header>
          <div className="p-6">
            <Tabs defaultValue="wallets">
              <TabsList className="mb-6">
                <TabsTrigger value="wallets">Seller Wallets</TabsTrigger>
                <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="wallets">
                <WalletsOverview wallets={wallets} />
              </TabsContent>
              <TabsContent value="payouts">
                <PayoutsTable payouts={payouts} onProcess={handleProcessPayout} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPayouts;
