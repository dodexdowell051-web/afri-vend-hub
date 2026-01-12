import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WalletTransaction {
  id: string;
  amount: number;
  type: "credit" | "debit" | "withdrawal";
  status: "pending" | "completed" | "failed";
  description: string | null;
  created_at: string;
}

interface WalletCardProps {
  balance: number;
  totalEarnings: number;
}

const WalletCard = ({ balance, totalEarnings }: WalletCardProps) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    // First get the wallet
    const { data: wallet } = await supabase
      .from("seller_wallets")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (wallet) {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        setTransactions(data as WalletTransaction[]);
      }
    }
    setLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "debit":
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Wallet Summary */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-4">₦{balance.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              Total Earnings: ₦{totalEarnings.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-2">
            Earnings are credited when orders are marked as delivered
          </p>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {tx.description || tx.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </p>
                    {getStatusBadge(tx.status)}
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

export default WalletCard;
