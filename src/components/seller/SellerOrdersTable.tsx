import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Clock, Truck, CheckCircle, Loader2, Eye, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  seller_earning: number;
  platform_commission: number;
  customer_name: string | null;
  delivery_phone: string | null;
  delivery_address: string | null;
  created_at: string;
  paid_at: string | null;
  order_items?: OrderItem[];
}

interface SellerOrdersTableProps {
  orders: Order[];
  onOrderUpdated: () => void;
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700" },
  processing: { label: "Processing", icon: Package, className: "bg-blue-100 text-blue-700" },
  ready_to_ship: { label: "Ready to Ship", icon: CheckCircle, className: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-emerald-100 text-emerald-700" },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Unpaid", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
};

const SellerOrdersTable = ({ orders, onOrderUpdated }: SellerOrdersTableProps) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);

    try {
      const { data, error } = await supabase.functions.invoke("update-order-status", {
        body: { orderId, status: newStatus },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Order status updated to ${newStatus}`);
      if (data?.walletUpdated) {
        toast.success("Earnings credited to your wallet!");
      }
      onOrderUpdated();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingDetails(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:products (name, image_url)
        )
      `)
      .eq("id", order.id)
      .single();

    if (!error && data) {
      setOrderDetails(data as unknown as Order);
    }
    setLoadingDetails(false);
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusOrder = ["pending", "processing", "ready_to_ship", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= statusOrder.length - 1) return null;
    return statusOrder[currentIndex + 1];
  };

  const getStatusConfig = (status: string) => statusConfig[status] || statusConfig.pending;
  const getPaymentConfig = (status: string) => paymentStatusConfig[status] || paymentStatusConfig.pending;

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Orders will appear here when customers purchase your products</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Your Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  const paymentConfig = getPaymentConfig(order.payment_status || "pending");
                  const StatusIcon = config.icon;
                  const nextStatus = getNextStatus(order.status);
                  const canUpdate = order.payment_status === "paid" && nextStatus;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{order.delivery_phone || ""}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={paymentConfig.className}>
                          <CreditCard className="w-3 h-3 mr-1" />
                          {paymentConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex items-center gap-1 w-fit ${config.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₦{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ₦{(order.seller_earning || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canUpdate && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                              disabled={updating === order.id}
                            >
                              <SelectTrigger className="w-32">
                                {updating === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={order.status}>{config.label}</SelectItem>
                                {nextStatus && (
                                  <SelectItem value={nextStatus}>
                                    Mark as {statusConfig[nextStatus]?.label}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Order #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="py-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Customer Details</h4>
                <p className="text-sm">{orderDetails.customer_name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{orderDetails.delivery_phone}</p>
                <p className="text-sm text-muted-foreground">{orderDetails.delivery_address}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                  {orderDetails.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Total</span>
                  <span>₦{orderDetails.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-destructive">-₦{(orderDetails.platform_commission || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Your Earnings</span>
                  <span className="text-primary">₦{(orderDetails.seller_earning || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerOrdersTable;
