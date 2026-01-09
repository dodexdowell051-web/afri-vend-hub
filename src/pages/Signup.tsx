import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AfrivendLogo from "@/components/AfrivendLogo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const buyerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const sellerSchema = buyerSchema.extend({
  storeName: z.string().min(2, "Store name must be at least 2 characters")
});

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "buyer";
  const navigate = useNavigate();
  const { signUp, user, profile, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [buyerForm, setBuyerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  
  const [sellerForm, setSellerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    storeName: "",
    password: ""
  });

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/marketplace");
      }
    }
  }, [user, profile, loading, navigate]);

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = buyerSchema.safeParse(buyerForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await signUp(buyerForm.email, buyerForm.password, {
      first_name: buyerForm.firstName,
      last_name: buyerForm.lastName,
      role: "buyer"
    });
    setIsSubmitting(false);
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
      navigate("/marketplace");
    }
  };

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = sellerSchema.safeParse(sellerForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await signUp(sellerForm.email, sellerForm.password, {
      first_name: sellerForm.firstName,
      last_name: sellerForm.lastName,
      role: "seller",
      store_name: sellerForm.storeName
    });
    setIsSubmitting(false);
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Seller account created successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-card rounded-2xl card-shadow p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4">
                <AfrivendLogo variant="full" iconSize={48} />
              </Link>
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground mt-1">
                Join Afrivend and start shopping or selling
              </p>
            </div>

            {/* Account Type Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
                <TabsTrigger value="buyer" className="rounded-lg">I'm a Buyer</TabsTrigger>
                <TabsTrigger value="seller" className="rounded-lg">I'm a Seller</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buyer" className="mt-6">
                <form onSubmit={handleBuyerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        className="h-12 rounded-xl"
                        value={buyerForm.firstName}
                        onChange={(e) => setBuyerForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        className="h-12 rounded-xl"
                        value={buyerForm.lastName}
                        onChange={(e) => setBuyerForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12 rounded-xl"
                      value={buyerForm.email}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password" 
                      className="h-12 rounded-xl"
                      value={buyerForm.password}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="seller" className="mt-6">
                <form onSubmit={handleSellerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerFirstName">First Name</Label>
                      <Input 
                        id="sellerFirstName" 
                        placeholder="John" 
                        className="h-12 rounded-xl"
                        value={sellerForm.firstName}
                        onChange={(e) => setSellerForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerLastName">Last Name</Label>
                      <Input 
                        id="sellerLastName" 
                        placeholder="Doe" 
                        className="h-12 rounded-xl"
                        value={sellerForm.lastName}
                        onChange={(e) => setSellerForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Email</Label>
                    <Input 
                      id="sellerEmail" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12 rounded-xl"
                      value={sellerForm.email}
                      onChange={(e) => setSellerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input 
                      id="storeName" 
                      placeholder="Your Store Name" 
                      className="h-12 rounded-xl"
                      value={sellerForm.storeName}
                      onChange={(e) => setSellerForm(prev => ({ ...prev, storeName: e.target.value }))}
                    />
                    {errors.storeName && <p className="text-sm text-destructive">{errors.storeName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPassword">Password</Label>
                    <Input 
                      id="sellerPassword" 
                      type="password" 
                      placeholder="Create a password" 
                      className="h-12 rounded-xl"
                      value={sellerForm.password}
                      onChange={(e) => setSellerForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Seller Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
