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
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{store.name}</h1>
                  <p className="text-muted-foreground">Welcome back, {profile.first_name}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">₦{stats.earnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="h-12">
              <TabsTrigger value="products" className="h-10">Products</TabsTrigger>
              <TabsTrigger value="orders" className="h-10">Orders</TabsTrigger>
              <TabsTrigger value="earnings" className="h-10">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Products</CardTitle>
                  <AddProductDialog onSuccess={fetchProducts} />
                </CardHeader>
                <CardContent>
                  <ProductsTable products={products} loading={productsLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <SellerOrdersTable orders={orders} onOrderUpdated={refreshData} />
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Wallet & Earnings</CardTitle>
                  <WithdrawalDialog 
                    balance={stats.earnings} 
                    walletId={walletId}
                    onSuccess={refreshData}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                      <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                      <p className="text-4xl font-bold text-primary">₦{stats.earnings.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-4">Ready for withdrawal</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-primary/5 to-muted rounded-2xl">
                      <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                      <p className="text-4xl font-bold text-foreground">₦{stats.totalEarnings.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-4">All-time revenue</p>
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
