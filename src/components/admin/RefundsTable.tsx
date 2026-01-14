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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

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

interface RefundsTableProps {
  refunds: Refund[];
  onProcess: (refundId: string, action: "process" | "complete" | "fail") => Promise<boolean>;
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
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Pending</Badge>;
    case "processing":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Processing</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Completed</Badge>;
    case "failed":
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const RefundsTable = ({ refunds, onProcess }: RefundsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState<{refundId: string, action: "process" | "complete" | "fail"} | null>(null);
  const [processing, setProcessing] = useState(false);

  const filteredRefunds = refunds.filter(refund =>
    refund.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!confirmAction) return;
    
    setProcessing(true);
    await onProcess(confirmAction.refundId, confirmAction.action);
    setProcessing(false);
    setConfirmAction(null);
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "process": return "start processing this refund";
      case "complete": return "mark this refund as completed";
      case "fail": return "mark this refund as failed";
      default: return action;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search refunds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRefunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No refunds found
                </TableCell>
              </TableRow>
            ) : (
              filteredRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-mono text-xs">
                    {refund.order_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(refund.amount)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {refund.reason}
                  </TableCell>
                  <TableCell>{getStatusBadge(refund.status)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {refund.payment_reference || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {refund.created_at ? format(new Date(refund.created_at), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {refund.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmAction({ refundId: refund.id, action: "process" })}
                        >
                          <RefreshCcw className="w-4 h-4 mr-1" />
                          Process
                        </Button>
                      )}
                      {refund.status === "processing" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setConfirmAction({ refundId: refund.id, action: "complete" })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmAction({ refundId: refund.id, action: "fail" })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Failed
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction ? getActionLabel(confirmAction.action) : ""}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={processing}>
              {processing ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
