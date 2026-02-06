import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSuperAdminDashboard } from "@/hooks/useSuperAdminDashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { SuperAdminOverview } from "@/components/admin/SuperAdminOverview";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { 
    users, 
    stores, 
    products, 
    orders, 
    wallets, 
    payouts, 
    disputes, 
    refunds,
    financialTransactions, 
    platformBalance, 
    platformSettings,
    loading: dataLoading,
    refreshData
  } = useSuperAdminDashboard();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading || dataLoading) {
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
            <div>
              <h1 className="text-xl font-semibold">Super Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Platform Overview & Control Center</p>
            </div>
          </header>
          <div className="p-6">
            <SuperAdminOverview 
              users={users}
              stores={stores}
              products={products}
              orders={orders}
              wallets={wallets}
              payouts={payouts}
              disputes={disputes}
              refunds={refunds}
              financialTransactions={financialTransactions}
              platformBalance={platformBalance}
              platformSettings={platformSettings}
              onRefresh={refreshData}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
