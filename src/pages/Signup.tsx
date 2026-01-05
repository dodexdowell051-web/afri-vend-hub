import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams } from "react-router-dom";
import { Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AfrivendLogo from "@/components/AfrivendLogo";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "buyer";

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
            <Tabs defaultValue={defaultRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
                <TabsTrigger value="buyer" className="rounded-lg">I'm a Buyer</TabsTrigger>
                <TabsTrigger value="seller" className="rounded-lg">I'm a Seller</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buyer" className="mt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" className="h-12 rounded-xl" />
                  </div>
                  <Button variant="default" size="lg" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="seller" className="mt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerFirstName">First Name</Label>
                      <Input id="sellerFirstName" placeholder="John" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerLastName">Last Name</Label>
                      <Input id="sellerLastName" placeholder="Doe" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Email</Label>
                    <Input id="sellerEmail" type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" placeholder="Your Store Name" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPassword">Password</Label>
                    <Input id="sellerPassword" type="password" placeholder="Create a password" className="h-12 rounded-xl" />
                  </div>
                  <Button variant="hero" size="lg" className="w-full">
                    Create Seller Account
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

            {/* Social Signup */}
            <Button variant="outline" size="lg" className="w-full">
              <Mail className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
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
