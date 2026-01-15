import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Percent, Wallet, Clock, Zap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlatformSettings {
  commission_rate: string;
  min_withdrawal_amount: string;
  payout_schedule: string;
  auto_payouts_enabled: string;
  escrow_release_days: string;
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [settings, setSettings] = useState<PlatformSettings>({
    commission_rate: "10",
    min_withdrawal_amount: "5000",
    payout_schedule: "manual",
    auto_payouts_enabled: "false",
    escrow_release_days: "3"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*");

    if (data) {
      const settingsMap: Record<string, string> = {};
      data.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      setSettings(prev => ({
        ...prev,
        ...settingsMap
      }));
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

  const saveSetting = async (key: string, value: string, description: string) => {
    setSaving(key);

    const { data: existing } = await supabase
      .from("platform_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("platform_settings")
        .update({ value })
        .eq("key", key);
      error = result.error;
    } else {
      const result = await supabase
        .from("platform_settings")
        .insert({ key, value, description });
      error = result.error;
    }

    setSaving(null);

    if (error) {
      toast.error(`Failed to save ${key.replace(/_/g, ' ')}`);
      return;
    }

    toast.success(`${key.replace(/_/g, ' ')} updated successfully`);
  };

  const handleSaveCommission = () => {
    const rate = parseFloat(settings.commission_rate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error("Please enter a valid commission rate (0-100)");
      return;
    }
    saveSetting("commission_rate", settings.commission_rate, "Platform commission percentage");
  };

  const handleSaveMinWithdrawal = () => {
    const amount = parseFloat(settings.min_withdrawal_amount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid minimum amount");
      return;
    }
    saveSetting("min_withdrawal_amount", settings.min_withdrawal_amount, "Minimum withdrawal amount in NGN");
  };

  const handleSavePayoutSchedule = (value: string) => {
    setSettings(prev => ({ ...prev, payout_schedule: value }));
    saveSetting("payout_schedule", value, "Payout schedule frequency");
  };

  const handleToggleAutoPayout = (checked: boolean) => {
    const value = checked ? "true" : "false";
    setSettings(prev => ({ ...prev, auto_payouts_enabled: value }));
    saveSetting("auto_payouts_enabled", value, "Enable automatic payouts");
  };

  const handleSaveEscrowDays = () => {
    const days = parseInt(settings.escrow_release_days);
    if (isNaN(days) || days < 0 || days > 30) {
      toast.error("Please enter valid days (0-30)");
      return;
    }
    saveSetting("escrow_release_days", settings.escrow_release_days, "Days after delivery to release escrow");
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
        <SuperAdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">Platform Settings</h1>
              <p className="text-sm text-muted-foreground">Configure system rules and platform behavior</p>
            </div>
          </header>
          <div className="p-6 max-w-4xl space-y-6">
            {/* Commission Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Commission Settings
                </CardTitle>
                <CardDescription>
                  Set the platform commission percentage for all new orders.
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
                      value={settings.commission_rate}
                      onChange={(e) => setSettings(prev => ({ ...prev, commission_rate: e.target.value }))}
                      className="max-w-[150px]"
                    />
                    <Button onClick={handleSaveCommission} disabled={saving === "commission_rate"}>
                      {saving === "commission_rate" ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current rate: {settings.commission_rate}% of each order goes to the platform
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Withdrawal Settings
                </CardTitle>
                <CardDescription>
                  Configure minimum withdrawal amounts for sellers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount (₦)</Label>
                  <div className="flex gap-3">
                    <Input
                      id="minWithdrawal"
                      type="number"
                      min="0"
                      step="100"
                      value={settings.min_withdrawal_amount}
                      onChange={(e) => setSettings(prev => ({ ...prev, min_withdrawal_amount: e.target.value }))}
                      className="max-w-[200px]"
                    />
                    <Button onClick={handleSaveMinWithdrawal} disabled={saving === "min_withdrawal_amount"}>
                      {saving === "min_withdrawal_amount" ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sellers must have at least ₦{parseInt(settings.min_withdrawal_amount).toLocaleString()} to request withdrawal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Payout Schedule
                </CardTitle>
                <CardDescription>
                  Configure when and how seller payouts are processed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Payout Frequency</Label>
                  <Select 
                    value={settings.payout_schedule} 
                    onValueChange={handleSavePayoutSchedule}
                    disabled={saving === "payout_schedule"}
                  >
                    <SelectTrigger className="max-w-[250px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual (Admin Approval)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {settings.payout_schedule === "manual" 
                      ? "All payouts require manual admin approval"
                      : `Payouts will be processed ${settings.payout_schedule}`
                    }
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <Label htmlFor="autoPayout" className="font-medium">Automatic Payouts</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically process approved payouts via payment gateway
                    </p>
                  </div>
                  <Switch
                    id="autoPayout"
                    checked={settings.auto_payouts_enabled === "true"}
                    onCheckedChange={handleToggleAutoPayout}
                    disabled={saving === "auto_payouts_enabled"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Escrow Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Escrow & Security
                </CardTitle>
                <CardDescription>
                  Configure escrow release timing and security rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="escrowDays">Escrow Release Delay (Days)</Label>
                  <div className="flex gap-3">
                    <Input
                      id="escrowDays"
                      type="number"
                      min="0"
                      max="30"
                      value={settings.escrow_release_days}
                      onChange={(e) => setSettings(prev => ({ ...prev, escrow_release_days: e.target.value }))}
                      className="max-w-[150px]"
                    />
                    <Button onClick={handleSaveEscrowDays} disabled={saving === "escrow_release_days"}>
                      {saving === "escrow_release_days" ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Funds are held for {settings.escrow_release_days} day(s) after delivery before release to seller
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Security Rules (Always Enforced)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Duplicate payouts are automatically prevented</li>
                    <li>• Withdrawals blocked until order is delivered</li>
                    <li>• All admin actions are logged to audit trail</li>
                    <li>• Audit logs cannot be edited or deleted</li>
                  </ul>
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
