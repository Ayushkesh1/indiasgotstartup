import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRequestCreatorPayout, useCreatorPaymentInfo } from "@/hooks/useCreatorEarnings";
import { IndianRupee, Wallet } from "lucide-react";

interface CreatorPayoutDialogProps {
  availableBalance: number;
  canRequest: boolean;
  hasPaymentInfo: boolean;
}

export function CreatorPayoutDialog({ 
  availableBalance, 
  canRequest,
  hasPaymentInfo 
}: CreatorPayoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(availableBalance.toString());
  const { toast } = useToast();
  const { mutate: requestPayout, isPending } = useRequestCreatorPayout();
  const { data: paymentInfo } = useCreatorPaymentInfo();

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (numAmount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    if (!paymentInfo) {
      toast({
        title: "Payment info required",
        description: "Please add your payment details first",
        variant: "destructive",
      });
      return;
    }

    const paymentDetails: Record<string, string> = {};
    
    if (paymentInfo.preferred_method === "upi" && paymentInfo.upi_id) {
      paymentDetails.upi_id = paymentInfo.upi_id;
    } else if (paymentInfo.bank_account_number) {
      paymentDetails.account_number = paymentInfo.bank_account_number;
      paymentDetails.ifsc = paymentInfo.bank_ifsc || "";
      paymentDetails.account_name = paymentInfo.bank_account_name || "";
    }

    requestPayout({
      amount: numAmount,
      payment_method: paymentInfo.preferred_method || "upi",
      payment_details: paymentDetails,
    }, {
      onSuccess: () => {
        toast({
          title: "Payout requested!",
          description: "Your payout request has been submitted for processing.",
        });
        setOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canRequest}>
          <Wallet className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your preferred payment method
          </DialogDescription>
        </DialogHeader>

        {!hasPaymentInfo ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              Please add your payment information first in the Payment Info tab.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Available Balance</div>
              <div className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {availableBalance.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  max={availableBalance}
                  min={0}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-card">
              <div className="text-sm font-medium mb-1">Payment Method</div>
              <div className="text-sm text-muted-foreground">
                {paymentInfo?.preferred_method === "upi" 
                  ? `UPI: ${paymentInfo.upi_id}`
                  : `Bank: ${paymentInfo?.bank_account_name} - ${paymentInfo?.bank_account_number}`
                }
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || !hasPaymentInfo}
          >
            {isPending ? "Processing..." : "Confirm Payout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
