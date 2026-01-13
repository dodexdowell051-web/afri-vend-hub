import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [commissionRate, setCommissionRate] = useState<string>("10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("key", "commission_rate")
      .maybeSingle();

    if (data) {
      setCommissionRate(data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    } else if (isAdmin) {
      fetchSettings();
    }
  }, [authLoading, isAdmin, navigate]);

  const handleSaveCommission = async () => {
    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error("Please enter a valid commission rate (0-100)");
      return;
    }

    setSaving(true);

    // Check if setting exists
    const { data: existing } = await supabase
      .from("platform_settings")
      .select("id")
      .eq("key", "commission_rate")
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("platform_settings")
        .update({ value: commissionRate })
        .eq("key", "commission_rate");
      error = result.error;
    } else {
      const result = await supabase
        .from("platform_settings")
        .insert({ key: "commission_rate", value: commissionRate, description: "Platform commission percentage" });
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast.error("Failed to save commission rate");
      return;
    }

    toast.success("Commission rate updated successfully");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Platform Settings</h1>
          </header>
          <div className="p-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Commission Settings
                </CardTitle>
                <CardDescription>
                  Set the platform commission percentage for all new orders. This will not affect existing orders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission Rate (%)</Label>
                  <div className="flex gap-3">
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="max-w-[150px]"
                    />
                    <Button onClick={handleSaveCommission} disabled={saving}>
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current rate: {commissionRate}% of each order goes to the platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;
