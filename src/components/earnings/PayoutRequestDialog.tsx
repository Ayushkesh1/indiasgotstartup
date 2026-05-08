import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { useRequestPayout } from "@/hooks/usePayouts";
import { useAuth } from "@/hooks/useAuth";

interface PayoutRequestDialogProps {
  availableAmount: number;
  availablePoints: number;
}

export function PayoutRequestDialog({ availableAmount, availablePoints }: PayoutRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const requestPayout = useRequestPayout();
  const { user } = useAuth();

  const pointsToRedeem = Math.floor(Number(amount) * 100); // $1 = 100 points

  const handleSubmit = () => {
    if (!amount || !paymentMethod || !user?.id) return;
    
    const amountNum = Number(amount);
    if (amountNum > availableAmount || pointsToRedeem > availablePoints) {
      return;
    }

    requestPayout.mutate(
      {
        userId: user.id,
        amount: amountNum,
        pointsRedeemed: pointsToRedeem,
        paymentMethod,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setAmount("");
          setPaymentMethod("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <DollarSign className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Convert your points to cash and request a payout. Minimum payout is $10.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available Balance:</span>
              <span className="font-semibold">${availableAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Available Points:</span>
              <span className="font-semibold">{availablePoints} pts</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">1 point = $0.01 | 100 points = $1</p>
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="10.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max={availableAmount}
              step="0.01"
              className="mt-2"
            />
            {amount && (
              <p className="text-xs text-muted-foreground mt-1">
                Will redeem {pointsToRedeem} points
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !amount ||
              !paymentMethod ||
              Number(amount) < 10 ||
              Number(amount) > availableAmount ||
              pointsToRedeem > availablePoints ||
              requestPayout.isPending
            }
          >
            {requestPayout.isPending ? "Processing..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
