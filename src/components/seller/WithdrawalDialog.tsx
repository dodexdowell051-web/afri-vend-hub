import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface WithdrawalDialogProps {
  balance: number;
  walletId: string | null;
  onSuccess: () => void;
}

const WithdrawalDialog = ({ balance, walletId, onSuccess }: WithdrawalDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    payment_method: "bank_transfer",
  });

  const handleSubmit = async () => {
    if (!user || !walletId) return;

    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (amount < 1000) {
      toast.error("Minimum withdrawal is ₦1,000");
      return;
    }
    if (!form.bank_name || !form.account_number || !form.account_name) {
      toast.error("Please fill in all bank details");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("payouts").insert({
      seller_id: user.id,
      wallet_id: walletId,
      amount,
      bank_name: form.bank_name,
      account_number: form.account_number,
      account_name: form.account_name,
      payment_method: form.payment_method,
      status: "pending",
    });

    if (error) {
      toast.error("Failed to submit withdrawal request");
    } else {
      toast.success("Withdrawal request submitted! Admin will process it shortly.");
      setOpen(false);
      setForm({ amount: "", bank_name: "", account_number: "", account_name: "", payment_method: "bank_transfer" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" disabled={balance <= 0}>
          <Banknote className="w-4 h-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Available balance: ₦{balance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Select
              value={form.bank_name}
              onValueChange={(v) => setForm((p) => ({ ...p, bank_name: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {["Access Bank", "GTBank", "First Bank", "UBA", "Zenith Bank", "Kuda", "Opay", "Palmpay", "Moniepoint", "Wema Bank", "Sterling Bank", "Fidelity Bank", "FCMB", "Union Bank", "Stanbic IBTC", "Polaris Bank"].map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              placeholder="0123456789"
              maxLength={10}
              value={form.account_number}
              onChange={(e) => setForm((p) => ({ ...p, account_number: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              placeholder="Your full name"
              value={form.account_name}
              onChange={(e) => setForm((p) => ({ ...p, account_name: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
