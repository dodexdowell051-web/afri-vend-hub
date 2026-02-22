import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Crown,
  UserCheck,
  UserX,
  AlertTriangle,
  Scale,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { FinancialSummary } from "./FinancialSummary";
import { TransactionHistory } from "./TransactionHistory";

interface User {
  id: string;
  role: string | null;
  seller_status: string | null;
}

interface Store {
  is_suspended: boolean | null;
}

interface Product {
  is_active: boolean | null;
}

interface Order {
  status: string | null;
}

interface Dispute {
  status: string;
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

interface FinancialTransaction {
  id: string;
  order_id: string | null;
  payout_id: string | null;
  wallet_id: string | null;
  user_id: string | null;
  amount: number;
  type: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
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

interface SuperAdminOverviewProps {
  users: User[];
  stores: Store[];
  products: Product[];
  orders: Order[];
  wallets: SellerWallet[];
  payouts: unknown[];
  disputes: Dispute[];
  refunds: unknown[];
  financialTransactions: FinancialTransaction[];
  platformBalance: PlatformBalance | null;
  platformSettings: PlatformSettings;
  onRefresh: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export const SuperAdminOverview = ({ 
  users, 
  stores, 
  products, 
  orders, 
  wallets,
  disputes,
  financialTransactions,
  platformBalance, 
  platformSettings, 
  onRefresh 
}: SuperAdminOverviewProps) => {
  // Calculate stats from raw data
  const totalUsers = users.length;
  const totalSellers = users.filter(u => u.role === 'seller').length;
  const totalBuyers = users.filter(u => u.role === 'buyer').length;
  const pendingSellers = users.filter(u => u.role === 'seller' && u.seller_status === 'pending').length;
  const approvedSellers = users.filter(u => u.role === 'seller' && u.seller_status === 'approved').length;
  const suspendedSellers = stores.filter(s => s.is_suspended).length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalDisputes = disputes.length;
  const pendingDisputes = disputes.filter(d => d.status === 'pending').length;
  const commissionRate = platformSettings.commission_rate;

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Crown className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
            <p className="text-muted-foreground">Complete platform control & oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Financial
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={onRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-6">
      {/* Financial Overview - Top Priority */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(platformBalance?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time platform earnings</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{formatCurrency(platformBalance?.total_commissions || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">At {commissionRate}% rate</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Wallet className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(platformBalance?.pending_payouts || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payouts</CardTitle>
            <Wallet className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(platformBalance?.completed_payouts || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Alerts */}
      {(pendingSellers > 0 || pendingDisputes > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {pendingSellers > 0 && (
            <Link to="/admin/users">
              <Card className="border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-700">{pendingSellers} Pending Seller Applications</p>
                    <p className="text-sm text-muted-foreground">Review and approve sellers</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {pendingDisputes > 0 && (
            <Link to="/admin/disputes">
              <Card className="border-red-500/50 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-700">{pendingDisputes} Open Disputes</p>
                    <p className="text-sm text-muted-foreground">Requires your attention</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* User & Seller Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{totalBuyers} buyers</span>
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{totalSellers} sellers</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seller Status</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSellers}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{approvedSellers} approved</span>
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">{pendingSellers} pending</span>
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{suspendedSellers} suspended</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{activeProducts} active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} pending orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Disputes & Issues */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisputes}</div>
            <p className="text-xs text-muted-foreground">{pendingDisputes} requiring action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended Sellers</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{suspendedSellers}</div>
            <p className="text-xs text-muted-foreground">Stores currently suspended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissionRate}%</div>
            <Link to="/admin/settings" className="text-xs text-primary hover:underline">Modify settings →</Link>
          </CardContent>
        </Card>
      </div>
      </TabsContent>

      {/* Financial Tab */}
      <TabsContent value="financial" className="space-y-6">
        <FinancialSummary 
          platformBalance={platformBalance}
          wallets={wallets}
          commissionRate={commissionRate}
        />
        <TransactionHistory 
          transactions={financialTransactions}
          onRefresh={onRefresh}
        />
      </TabsContent>
    </Tabs>
  );
};
