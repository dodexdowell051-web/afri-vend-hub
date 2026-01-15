import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import AfrivendLogo from "@/components/AfrivendLogo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [adminErrors, setAdminErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading && user && profile) {
        // Check if user has admin role in user_roles table
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        if (adminRole) {
          navigate("/admin");
        } else if (profile.role === "seller") {
          navigate("/dashboard");
        } else {
          navigate("/marketplace");
        }
      }
    };
    
    checkUserAndRedirect();
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back!");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrors({});
    
    const result = loginSchema.safeParse({ email: adminEmail, password: adminPassword });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setAdminErrors(fieldErrors);
      return;
    }
    
    setIsAdminSubmitting(true);
    
    // Sign in first
    const { error, data } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (error) {
      setIsAdminSubmitting(false);
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid admin credentials");
      } else {
        toast.error(error.message);
      }
      return;
    }
    
    // Check if user has admin role in user_roles table
    if (data.user) {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (roleError || !roleData) {
        // Not an admin - sign them out
        await supabase.auth.signOut();
        setIsAdminSubmitting(false);
        toast.error("Access denied. Admin privileges required.");
        return;
      }
      
      setIsAdminSubmitting(false);
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-card rounded-2xl card-shadow p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <Link to="/" className="inline-block mb-4">
                <AfrivendLogo variant="full" iconSize={48} />
              </Link>
            </div>

            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">User Login</TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* User Login Tab */}
              <TabsContent value="user">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground mt-1">
                    Log in to your Afrivend account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="h-12 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      className="h-12 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </Button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </TabsContent>

              {/* Admin Login Tab */}
              <TabsContent value="admin">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Admin Access</h1>
                  <p className="text-muted-foreground mt-1">
                    Restricted to authorized administrators
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      placeholder="Enter admin email" 
                      className="h-12 rounded-xl"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                    {adminErrors.email && <p className="text-sm text-destructive">{adminErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input 
                      id="admin-password" 
                      type="password" 
                      placeholder="Enter admin password" 
                      className="h-12 rounded-xl"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                    {adminErrors.password && <p className="text-sm text-destructive">{adminErrors.password}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    disabled={isAdminSubmitting}
                  >
                    {isAdminSubmitting ? "Verifying..." : "Admin Login"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground text-center">
                    🔒 This area is for platform administrators only. 
                    Unauthorized access attempts are logged.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
