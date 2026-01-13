import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Check, Loader2, X } from "lucide-react";
import { format } from "date-fns";

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

interface PayoutsTableProps {
  payouts: Payout[];
  onProcess: (payoutId: string, status: 'processing' | 'completed' | 'failed') => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>;
    case "processing":
      return <Badge className="bg-blue-500/10 text-blue-500">Processing</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "pending":
    default:
      return <Badge className="bg-orange-500/10 text-orange-500">Pending</Badge>;
  }
};

export const PayoutsTable = ({ payouts, onProcess }: PayoutsTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
      payout.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
      payout.account_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search payouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No payout requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.seller_name}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{payout.bank_name || "N/A"}</p>
                      <p className="text-muted-foreground">{payout.account_number}</p>
                      <p className="text-muted-foreground">{payout.account_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>
                    {payout.created_at ? format(new Date(payout.created_at), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.status === "pending" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onProcess(payout.id, 'processing')}>
                            <Loader2 className="w-4 h-4 mr-2" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onProcess(payout.id, 'completed')}>
                            <Check className="w-4 h-4 mr-2" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onProcess(payout.id, 'failed')}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Mark Failed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {payout.status === "processing" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onProcess(payout.id, 'completed')}>
                            <Check className="w-4 h-4 mr-2" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onProcess(payout.id, 'failed')}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Mark Failed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
