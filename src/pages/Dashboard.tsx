import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Wallet, TrendingUp, Store, Share2, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useSellerDashboard } from "@/hooks/useSellerDashboard";
import { AddProductDialog } from "@/components/seller/AddProductDialog";
import { ProductsTable } from "@/components/seller/ProductsTable";
import { StoreSettingsDialog } from "@/components/seller/StoreSettingsDialog";
import SellerOrdersTable from "@/components/seller/SellerOrdersTable";
import WalletCard from "@/components/seller/WalletCard";
import WithdrawalDialog from "@/components/seller/WithdrawalDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [walletId, setWalletId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, profile, store, loading } = useAuth();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { stats, orders, loading: statsLoading, refreshData } = useSellerDashboard();

  // Fetch wallet ID for withdrawal
  useEffect(() => {
    if (user) {
      supabase
        .from("seller_wallets")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setWalletId(data.id);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && profile && profile.role !== "seller") {
      navigate("/marketplace");
    }
  }, [user, profile, loading, navigate]);

  if (loading || !profile || !store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold truncate">{store.name}</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {profile.first_name}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs sm:text-sm"
                  onClick={() => {
                    const storeLink = `${window.location.origin}/store/${store.id}`;
                    navigator.clipboard.writeText(storeLink);
                    setLinkCopied(true);
                    toast.success("Store link copied! Share it with your customers.");
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                >
                  {linkCopied ? (
                    <><Check className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Share2 className="w-4 h-4" /> Share Store Link</>
                  )}
                </Button>
                <StoreSettingsDialog />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Products</p>
                    <p className="text-lg md:text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4 md:w-6 md:h-6 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Orders</p>
                    <p className="text-lg md:text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-accent/30 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4 md:w-6 md:h-6 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Balance</p>
                    <p className="text-lg md:text-2xl font-bold truncate">₦{stats.earnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-lg md:text-2xl font-bold truncate">₦{stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="products" className="space-y-4 md:space-y-6">
            <TabsList className="h-10 md:h-12 w-full sm:w-auto">
              <TabsTrigger value="products" className="h-8 md:h-10 flex-1 sm:flex-none text-xs sm:text-sm">Products</TabsTrigger>
              <TabsTrigger value="orders" className="h-8 md:h-10 flex-1 sm:flex-none text-xs sm:text-sm">Orders</TabsTrigger>
              <TabsTrigger value="earnings" className="h-8 md:h-10 flex-1 sm:flex-none text-xs sm:text-sm">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-2xl">My Products</CardTitle>
                  <AddProductDialog onSuccess={fetchProducts} />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="min-w-[500px] md:min-w-0 px-4 md:px-0">
                      <ProductsTable products={products} loading={productsLoading} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <SellerOrdersTable orders={orders} onOrderUpdated={refreshData} />
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-2xl">Wallet & Earnings</CardTitle>
                  <WithdrawalDialog 
                    balance={stats.earnings} 
                    walletId={walletId}
                    onSuccess={refreshData}
                  />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Available Balance</p>
                      <p className="text-2xl md:text-4xl font-bold text-primary">₦{stats.earnings.toLocaleString()}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-4">Ready for withdrawal</p>
                    </div>
                    <div className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-muted rounded-2xl">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Total Earnings</p>
                      <p className="text-2xl md:text-4xl font-bold text-foreground">₦{stats.totalEarnings.toLocaleString()}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-4">All-time revenue</p>
                    </div>
                  </div>
                  <WalletCard balance={stats.earnings} totalEarnings={stats.totalEarnings} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
