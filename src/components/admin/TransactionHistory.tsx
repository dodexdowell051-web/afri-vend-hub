import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  RefreshCw,
  Filter,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface TransactionHistoryProps {
  transactions: FinancialTransaction[];
  onRefresh: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(Math.abs(amount));
};

const getTransactionTypeConfig = (type: string) => {
  const configs: Record<string, { label: string; color: string; icon: typeof ArrowUpRight }> = {
    escrow_release: { label: "Escrow Release", color: "bg-green-100 text-green-700", icon: ArrowUpRight },
    commission: { label: "Commission", color: "bg-primary/10 text-primary", icon: DollarSign },
    admin_override_release: { label: "Admin Release", color: "bg-blue-100 text-blue-700", icon: ArrowUpRight },
    admin_reversal: { label: "Admin Reversal", color: "bg-red-100 text-red-700", icon: ArrowDownRight },
    payout: { label: "Payout", color: "bg-orange-100 text-orange-700", icon: ArrowDownRight },
    refund: { label: "Refund", color: "bg-yellow-100 text-yellow-700", icon: ArrowDownRight },
  };
  return configs[type] || { label: type, color: "bg-muted text-muted-foreground", icon: Clock };
};

export const TransactionHistory = ({ transactions, onRefresh }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const uniqueTypes = [...new Set(transactions.map(tx => tx.type))];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Financial Transaction History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {getTransactionTypeConfig(type).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredTransactions.map((tx) => {
              const config = getTransactionTypeConfig(tx.type);
              const Icon = config.icon;
              const isPositive = tx.amount > 0 && !["payout", "refund", "admin_reversal"].includes(tx.type);

              return (
                <div
                  key={tx.id}
                  className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                        {tx.order_id && (
                          <span className="text-xs text-muted-foreground">
                            Order #{tx.order_id.slice(0, 8).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{tx.description || "No description"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : "Unknown date"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                    {tx.user_email && (
                      <p className="text-xs text-muted-foreground mt-1">{tx.user_email}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
