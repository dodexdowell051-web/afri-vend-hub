import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import AfrivendLogo from "@/components/AfrivendLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Shield, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        if (adminRole) {
          navigate("/admin");
        }
      }
    };
    
    checkAdminSession();
  }, [navigate]);

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
    
    // Sign in first
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setIsSubmitting(false);
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
        setIsSubmitting(false);
        toast.error("Access denied. Admin privileges required.");
        return;
      }
      
      setIsSubmitting(false);
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Afrivend Admin Portal</h1>
          <p className="text-slate-400 mt-2">Platform Control Center</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Administrator Login</h2>
              <p className="text-sm text-muted-foreground">Restricted access only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Admin Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter admin email" 
                className="h-12 rounded-xl bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Admin Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter admin password" 
                className="h-12 rounded-xl bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              variant="default" 
              size="lg" 
              className="w-full h-12 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              🔒 This portal is exclusively for Afrivend platform administrators. 
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <AfrivendLogo variant="full" iconSize={32} className="opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
