import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  AlertCircle
} from "lucide-react";

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

interface PlatformBalance {
  total_revenue: number;
  total_commissions: number;
  pending_payouts: number;
  completed_payouts: number;
}

interface FinancialSummaryProps {
  platformBalance: PlatformBalance | null;
  wallets: SellerWallet[];
  commissionRate: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export const FinancialSummary = ({ platformBalance, wallets, commissionRate }: FinancialSummaryProps) => {
  const totalSellerBalances = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  const totalSellerEarnings = wallets.reduce((sum, w) => sum + (w.total_earnings || 0), 0);
  const lockedWallets = wallets.filter(w => w.is_locked);
  
  // Calculate escrow balance (funds held but not yet released)
  const escrowBalance = (platformBalance?.total_revenue || 0) - 
                        (platformBalance?.total_commissions || 0) - 
                        totalSellerEarnings;

  return (
    <div className="space-y-6">
      {/* Platform Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(platformBalance?.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All-time transaction volume</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commissions</CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {formatCurrency(platformBalance?.total_commissions || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">At {commissionRate}% rate</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
            <Building2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(Math.max(0, escrowBalance))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting buyer confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seller Balances</CardTitle>
            <Wallet className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalSellerBalances)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {wallets.length} seller wallets</p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">
              {formatCurrency(platformBalance?.pending_payouts || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting admin approval</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payouts</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(platformBalance?.completed_payouts || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Successfully paid out</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Wallets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{lockedWallets.length}</div>
            <p className="text-xs text-muted-foreground">
              {lockedWallets.length > 0 ? "Require admin review" : "No locked wallets"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Seller Wallets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Individual Seller Wallet Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No seller wallets found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {wallets
                .sort((a, b) => (b.balance || 0) - (a.balance || 0))
                .map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        wallet.is_locked ? "bg-red-100" : "bg-primary/10"
                      }`}>
                        <Wallet className={`w-5 h-5 ${wallet.is_locked ? "text-red-600" : "text-primary"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{wallet.seller_name || "Unknown Seller"}</p>
                        <p className="text-sm text-muted-foreground">{wallet.seller_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{formatCurrency(wallet.balance || 0)}</p>
                        {wallet.is_locked && (
                          <Badge variant="destructive" className="text-xs">Locked</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total: {formatCurrency(wallet.total_earnings || 0)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
