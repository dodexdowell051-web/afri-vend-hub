import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, Clock, CheckCircle, Truck, XCircle, CreditCard, Loader2, CheckCheck, Timer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  created_at: string;
  updated_at: string | null;
  paid_at: string | null;
  delivered_at: string | null;
  customer_name: string | null;
  delivery_address: string | null;
  seller_earning: number | null;
  store: {
    name: string;
  };
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  pending: { 
    label: "Pending Payment", 
    icon: Clock, 
    className: "bg-accent/20 text-accent-foreground border-accent" 
  },
  processing: { 
    label: "Processing", 
    icon: Package, 
    className: "bg-blue-100 text-blue-700 border-blue-200" 
  },
  ready_to_ship: {
    label: "Ready to Ship",
    icon: Package,
    className: "bg-indigo-100 text-indigo-700 border-indigo-200"
  },
  shipped: { 
    label: "Shipped", 
    icon: Truck, 
    className: "bg-purple-100 text-purple-700 border-purple-200" 
  },
  delivered: { 
    label: "Delivered", 
    icon: CheckCircle, 
    className: "bg-primary/10 text-primary border-primary/20" 
  },
  completed: { 
    label: "Completed", 
    icon: CheckCheck, 
    className: "bg-green-100 text-green-700 border-green-200" 
  },
  cancelled: { 
    label: "Cancelled", 
    icon: XCircle, 
    className: "bg-destructive/10 text-destructive border-destructive/20" 
  },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Unpaid", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        payment_status,
        total,
        created_at,
        updated_at,
        paid_at,
        delivered_at,
        customer_name,
        delivery_address,
        seller_earning,
        store:stores (name),
        order_items (
          id,
          quantity,
          price,
          product:products (name, image_url)
        )
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as unknown as Order[]);
    }
    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    return paymentStatusConfig[status] || paymentStatusConfig.pending;
  };

  const AUTO_RELEASE_DAYS = 7;

  const canConfirmDelivery = (order: Order) => {
    const isShippedOrDelivered = order.status === "shipped" || order.status === "delivered";
    const isPaid = order.payment_status === "paid";
    const isNotCompleted = !["completed", "cancelled"].includes(order.status);
    return isShippedOrDelivered && isPaid && isNotCompleted;
  };

  const getAutoReleaseInfo = (order: Order) => {
    // Calculate days remaining based on when order was shipped/delivered
    const referenceDate = order.delivered_at || order.updated_at || order.created_at;
    if (!referenceDate) return null;
    const ref = new Date(referenceDate);
    const releaseDate = new Date(ref.getTime() + AUTO_RELEASE_DAYS * 24 * 60 * 60 * 1000);
    const now = new Date();
    const msRemaining = releaseDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
    return { daysRemaining, releaseDate };
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirmingOrderId(orderId);
    try {
      const { data, error } = await supabase.functions.invoke("confirm-delivery", {
        body: { orderId },
      });

      if (error) {
        console.error("Confirm delivery error:", error);
        toast.error(error.message || "Failed to confirm delivery");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Delivery confirmed! Funds have been released to the seller.");
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Confirm delivery error:", error);
      toast.error("Failed to confirm delivery. Please try again.");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to view your orders</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your order history</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your orders</p>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                    <div className="h-20 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const config = getStatusConfig(order.status);
                const paymentConfig = getPaymentStatusConfig(order.payment_status || "pending");
                const StatusIcon = config.icon;
                
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg mb-1">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={`flex items-center gap-1 ${paymentConfig.className}`}>
                            <CreditCard className="w-3 h-3" />
                            {paymentConfig.label}
                          </Badge>
                          <Badge variant="outline" className={`flex items-center gap-1.5 ${config.className}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          Sold by: <span className="font-medium text-foreground">{order.store?.name}</span>
                        </p>
                        {order.paid_at && (
                          <p className="text-xs text-muted-foreground">
                            Paid on {new Date(order.paid_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {order.delivery_address && (
                        <div className="bg-muted/30 rounded-lg p-3 mb-4 text-sm">
                          <p className="font-medium mb-1">Delivery Address</p>
                          <p className="text-muted-foreground">{order.delivery_address}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              {item.product?.image_url ? (
                                <img 
                                  src={item.product.image_url} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product?.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 mt-4 border-t">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold text-primary">₦{order.total.toLocaleString()}</span>
                      </div>

                      {order.delivered_at && order.status === "completed" && (
                        <p className="text-xs text-muted-foreground text-right mt-2">
                          Completed on {new Date(order.delivered_at).toLocaleDateString()}
                        </p>
                      )}

                      {/* Confirm Delivery Button with Countdown */}
                      {canConfirmDelivery(order) && (() => {
                        const autoRelease = getAutoReleaseInfo(order);
                        return (
                          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            {autoRelease && (
                              <div className="flex items-center gap-2 mb-3 text-amber-700">
                                <Timer className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {autoRelease.daysRemaining > 0
                                    ? `${autoRelease.daysRemaining} day${autoRelease.daysRemaining !== 1 ? "s" : ""} left to confirm — funds auto-release on ${autoRelease.releaseDate.toLocaleDateString()}`
                                    : "Auto-release window has passed — funds will be released shortly"}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div>
                                <p className="font-medium text-foreground">Received your order?</p>
                                <p className="text-sm text-muted-foreground">
                                  Confirm delivery to release ₦{(order.seller_earning || 0).toLocaleString()} to the seller
                                </p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                                    disabled={confirmingOrderId === order.id}
                                  >
                                    {confirmingOrderId === order.id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Confirming...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCheck className="w-4 h-4" />
                                        Confirm Delivery
                                      </>
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Order Delivery</AlertDialogTitle>
                                    <AlertDialogDescription className="space-y-2">
                                      <p>By confirming delivery, you acknowledge that:</p>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>You have received the order in satisfactory condition</li>
                                        <li>₦{(order.seller_earning || 0).toLocaleString()} will be released to the seller</li>
                                        <li>This action cannot be undone without admin intervention</li>
                                      </ul>
                                      {autoRelease && autoRelease.daysRemaining > 0 && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                          If you don't confirm, funds will auto-release in {autoRelease.daysRemaining} day{autoRelease.daysRemaining !== 1 ? "s" : ""}.
                                        </p>
                                      )}
                                      <p className="font-medium mt-3">Are you sure you want to continue?</p>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleConfirmDelivery(order.id)}
                                      className="bg-primary hover:bg-primary/90"
                                    >
                                      Yes, Confirm Delivery
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        );
                      })()}

                      {order.status === "completed" && (
                        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2 text-primary">
                            <CheckCheck className="w-5 h-5" />
                            <span className="font-medium">Order Completed — Funds released to seller</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
