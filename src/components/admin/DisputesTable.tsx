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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Eye,
  Scale,
  User,
  Store,
  FileText
} from "lucide-react";
import { format } from "date-fns";

interface Dispute {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  reason: string;
  buyer_evidence: string | null;
  seller_evidence: string | null;
  status: string;
  resolution_notes: string | null;
  created_at: string | null;
  buyer_name?: string;
  seller_name?: string;
  order_total?: number;
}

interface DisputesTableProps {
  disputes: Dispute[];
  onResolve: (disputeId: string, resolution: "resolved_buyer" | "resolved_seller", notes: string) => Promise<boolean>;
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
    case "under_review":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Under Review</Badge>;
    case "resolved_buyer":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Buyer Favored</Badge>;
    case "resolved_seller":
      return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">Seller Favored</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">Closed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const DisputesTable = ({ disputes, onResolve }: DisputesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState<"resolved_buyer" | "resolved_seller">("resolved_buyer");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const filteredDisputes = disputes.filter(dispute =>
    dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.seller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResolve = async () => {
    if (!selectedDispute || !resolutionNotes.trim()) return;
    
    setProcessing(true);
    const success = await onResolve(selectedDispute.id, resolution, resolutionNotes);
    setProcessing(false);
    
    if (success) {
      setShowResolveDialog(false);
      setSelectedDispute(null);
      setResolutionNotes("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search disputes..."
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
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisputes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono text-xs">
                    {dispute.order_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {dispute.buyer_name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      {dispute.seller_name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(dispute.order_total || 0)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {dispute.reason}
                  </TableCell>
                  <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {dispute.created_at ? format(new Date(dispute.created_at), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {(dispute.status === "pending" || dispute.status === "under_review") && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowResolveDialog(true);
                          }}
                        >
                          <Scale className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Dispute Dialog */}
      <Dialog open={!!selectedDispute && !showResolveDialog} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Dispute Details
            </DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order ID</Label>
                  <p className="font-mono text-sm">{selectedDispute.order_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-bold text-lg">{formatCurrency(selectedDispute.order_total || 0)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Buyer</Label>
                  <p>{selectedDispute.buyer_name || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Seller</Label>
                  <p>{selectedDispute.seller_name || "Unknown"}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Reason for Dispute</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedDispute.reason}</p>
              </div>

              {selectedDispute.buyer_evidence && (
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Buyer's Evidence
                  </Label>
                  <p className="mt-1 p-3 bg-blue-50 rounded-md text-sm">{selectedDispute.buyer_evidence}</p>
                </div>
              )}

              {selectedDispute.seller_evidence && (
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Seller's Evidence
                  </Label>
                  <p className="mt-1 p-3 bg-purple-50 rounded-md text-sm">{selectedDispute.seller_evidence}</p>
                </div>
              )}

              {selectedDispute.resolution_notes && (
                <div>
                  <Label className="text-muted-foreground">Resolution Notes</Label>
                  <p className="mt-1 p-3 bg-green-50 rounded-md text-sm">{selectedDispute.resolution_notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div>Status: {getStatusBadge(selectedDispute.status)}</div>
                {(selectedDispute.status === "pending" || selectedDispute.status === "under_review") && (
                  <Button onClick={() => setShowResolveDialog(true)}>
                    <Scale className="w-4 h-4 mr-2" />
                    Resolve Dispute
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Make a final decision on this dispute. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={resolution === "resolved_buyer" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setResolution("resolved_buyer")}
              >
                <User className="w-6 h-6" />
                <span>Favor Buyer</span>
                <span className="text-xs opacity-70">Refund to buyer</span>
              </Button>
              <Button
                variant={resolution === "resolved_seller" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setResolution("resolved_seller")}
              >
                <Store className="w-6 h-6" />
                <span>Favor Seller</span>
                <span className="text-xs opacity-70">Release to seller</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Resolution Notes *</Label>
              <Textarea
                placeholder="Explain your decision..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolve} 
              disabled={!resolutionNotes.trim() || processing}
              className={resolution === "resolved_buyer" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"}
            >
              {processing ? "Processing..." : "Confirm Resolution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
