import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SellerWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  is_locked?: boolean;
  lock_reason?: string;
  seller_name?: string;
  seller_email?: string;
}

interface WalletsOverviewProps {
  wallets: SellerWallet[];
  onToggleLock?: (walletId: string, lock: boolean, reason?: string) => Promise<boolean>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export const WalletsOverview = ({ wallets, onToggleLock }: WalletsOverviewProps) => {
  const [lockDialog, setLockDialog] = useState<{ open: boolean; wallet: SellerWallet | null; action: 'lock' | 'unlock' }>({
    open: false,
    wallet: null,
    action: 'lock'
  });
  const [lockReason, setLockReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalEarnings = wallets.reduce((sum, w) => sum + w.total_earnings, 0);
  const lockedWallets = wallets.filter(w => w.is_locked).length;

  const handleLockAction = async () => {
    if (!lockDialog.wallet || !onToggleLock) return;
    
    setProcessing(true);
    const success = await onToggleLock(
      lockDialog.wallet.id, 
      lockDialog.action === 'lock',
      lockDialog.action === 'lock' ? lockReason : undefined
    );
    setProcessing(false);
    
    if (success) {
      setLockDialog({ open: false, wallet: null, action: 'lock' });
      setLockReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seller Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Balance</CardTitle>
            <Wallet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">Available for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (All Time)</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Wallets</CardTitle>
            <Lock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockedWallets}</div>
            <p className="text-xs text-muted-foreground">Withdrawals blocked</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Available Balance</TableHead>
              <TableHead className="text-right">Total Earnings</TableHead>
              {onToggleLock && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onToggleLock ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  No seller wallets found
                </TableCell>
              </TableRow>
            ) : (
              wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-medium">{wallet.seller_name}</TableCell>
                  <TableCell>{wallet.seller_email}</TableCell>
                  <TableCell>
                    {wallet.is_locked ? (
                      <Badge variant="destructive" className="gap-1">
                        <Lock className="h-3 w-3" /> Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Unlock className="h-3 w-3" /> Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(wallet.balance)}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(wallet.total_earnings)}
                  </TableCell>
                  {onToggleLock && (
                    <TableCell className="text-right">
                      {wallet.is_locked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLockDialog({ open: true, wallet, action: 'unlock' })}
                        >
                          <Unlock className="h-4 w-4 mr-1" /> Unlock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setLockDialog({ open: true, wallet, action: 'lock' })}
                        >
                          <Lock className="h-4 w-4 mr-1" /> Lock
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={lockDialog.open} onOpenChange={(open) => !open && setLockDialog({ open: false, wallet: null, action: 'lock' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {lockDialog.action === 'lock' ? 'Lock Wallet' : 'Unlock Wallet'}
            </DialogTitle>
            <DialogDescription>
              {lockDialog.action === 'lock' 
                ? `This will prevent ${lockDialog.wallet?.seller_name} from making withdrawals.`
                : `This will allow ${lockDialog.wallet?.seller_name} to make withdrawals again.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {lockDialog.action === 'lock' && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for locking</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for locking this wallet..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
              />
            </div>
          )}

          {lockDialog.action === 'unlock' && lockDialog.wallet?.lock_reason && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Previous lock reason:</p>
              <p className="text-sm">{lockDialog.wallet.lock_reason}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLockDialog({ open: false, wallet: null, action: 'lock' })}>
              Cancel
            </Button>
            <Button 
              variant={lockDialog.action === 'lock' ? 'destructive' : 'default'}
              onClick={handleLockAction}
              disabled={processing || (lockDialog.action === 'lock' && !lockReason.trim())}
            >
              {processing ? 'Processing...' : lockDialog.action === 'lock' ? 'Lock Wallet' : 'Unlock Wallet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
