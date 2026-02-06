import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, ArrowRight, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetails {
  id: string;
  status: string;
  payment_status?: string;
  total: number;
  created_at: string;
  store: { name: string };
  order_items: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; image_url: string | null };
  }[];
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      const paymentRef = reference || trxref;
      let verificationSuccess = false;

      // Verify payment if reference exists - WAIT for completion
      if (paymentRef) {
        try {
          console.log("Verifying payment with reference:", paymentRef);
          const { data, error } = await supabase.functions.invoke("verify-payment", {
            body: {
              reference: paymentRef,
              orderId,
            },
          });
          
          if (error) {
            console.error("Verification function error:", error);
          } else {
            console.log("Verification response:", data);
            verificationSuccess = data?.success || false;
            setVerified(verificationSuccess);
          }
          
          // Small delay to ensure database updates have propagated
          if (verificationSuccess) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error("Verification error:", error);
        }
      } else {
        setVerified(true);
      }

      // Fetch order details AFTER verification completes
      const fetchOrderWithRetry = async (attempts = 3): Promise<OrderDetails | null> => {
        for (let i = 0; i < attempts; i++) {
          const { data: orderData, error } = await supabase
            .from("orders")
            .select(`
              id,
              status,
              payment_status,
              total,
              created_at,
              store:stores (name),
              order_items (
                id,
                quantity,
                price,
                product:products (name, image_url)
              )
            `)
            .eq("id", orderId)
            .single();

          if (!error && orderData) {
            // If payment was verified but status still pending, wait and retry
            if (verificationSuccess && orderData.payment_status === "pending" && i < attempts - 1) {
              console.log(`Order still pending, retrying in 1s (attempt ${i + 1}/${attempts})`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            return orderData as unknown as OrderDetails;
          }
          
          if (i < attempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        return null;
      };

      const orderData = await fetchOrderWithRetry();
      if (orderData) {
        setOrder(orderData);
      }

      setLoading(false);
    };

    verifyAndFetch();
  }, [orderId, reference, trxref]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Confirming your order...</h2>
            <p className="text-muted-foreground">Please wait while we verify your payment</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find your order details</p>
            <Button asChild>
              <Link to="/marketplace">Continue Shopping</Link>
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
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-accent/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${order.payment_status === 'paid' ? 'bg-green-500' : 'bg-secondary'} animate-pulse`} />
                  <span className="font-medium capitalize">
                    {order.payment_status === 'paid' ? 'Payment Confirmed' : order.status}
                  </span>
                  <span className="text-muted-foreground">
                    {order.payment_status === 'paid' 
                      ? "- We're preparing your order" 
                      : '- Confirming payment...'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Sold by: <span className="font-medium text-foreground">{order.store?.name}</span>
              </p>

              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex gap-3 py-2 border-b last:border-0">
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
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
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₦{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t">
                <span className="font-semibold">Total Paid</span>
                <span className="text-xl font-bold text-primary">₦{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Message */}
          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  You'll receive an order confirmation via email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  The seller will process your order within 1-2 business days
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  You can track your order status in your orders page
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/orders">
                View My Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/marketplace">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
