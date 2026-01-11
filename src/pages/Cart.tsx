import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, loading, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to add items to your cart</p>
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {items.length > 0 && (
              <span className="text-muted-foreground">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Browse our marketplace to find amazing products</p>
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/marketplace">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        {/* Image */}
                        <div className="w-28 h-28 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                          {item.product.image_url ? (
                            <img 
                              src={item.product.image_url} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">{item.product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                by {item.product.store?.name || "Unknown Store"}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-end justify-between mt-4">
                            <p className="text-xl font-bold text-primary">
                              ₦{item.product.price.toLocaleString()}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-md"
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-10 text-center font-semibold">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-md"
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                        <span className="font-medium">₦{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-primary">Free</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">₦{totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      asChild
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                      size="lg"
                    >
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/marketplace">Continue Shopping</Link>
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Secure checkout powered by Paystack
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
