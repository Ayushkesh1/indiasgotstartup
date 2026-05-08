import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCreatorPaymentInfo, useUpdatePaymentInfo } from "@/hooks/useCreatorEarnings";
import { CreditCard, Smartphone, Building2, CheckCircle } from "lucide-react";

export function PaymentInfoForm() {
  const { toast } = useToast();
  const { data: paymentInfo, isLoading } = useCreatorPaymentInfo();
  const { mutate: updatePaymentInfo, isPending } = useUpdatePaymentInfo();

  const [preferredMethod, setPreferredMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  useEffect(() => {
    if (paymentInfo) {
      setPreferredMethod(paymentInfo.preferred_method || "upi");
      setUpiId(paymentInfo.upi_id || "");
      setBankAccountNumber(paymentInfo.bank_account_number || "");
      setBankIfsc(paymentInfo.bank_ifsc || "");
      setBankAccountName(paymentInfo.bank_account_name || "");
    }
  }, [paymentInfo]);

  const handleSave = () => {
    if (preferredMethod === "upi" && !upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }

    if (preferredMethod === "bank" && (!bankAccountNumber || !bankIfsc || !bankAccountName)) {
      toast({
        title: "Bank details required",
        description: "Please fill in all bank details",
        variant: "destructive",
      });
      return;
    }

    updatePaymentInfo({
      preferred_method: preferredMethod,
      upi_id: upiId || undefined,
      bank_account_number: bankAccountNumber || undefined,
      bank_ifsc: bankIfsc || undefined,
      bank_account_name: bankAccountName || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: "Payment info saved!",
          description: "Your payment information has been updated.",
        });
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Add your payment details to receive payouts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Preferred Payment Method</Label>
          <RadioGroup 
            value={preferredMethod} 
            onValueChange={setPreferredMethod}
            className="grid grid-cols-2 gap-4"
          >
            <div className={`relative flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${preferredMethod === "upi" ? "border-primary bg-primary/5" : "hover:bg-accent"}`}>
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-5 w-5" />
                UPI
              </Label>
              {preferredMethod === "upi" && (
                <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
              )}
            </div>
            <div className={`relative flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${preferredMethod === "bank" ? "border-primary bg-primary/5" : "hover:bg-accent"}`}>
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                <Building2 className="h-5 w-5" />
                Bank Transfer
              </Label>
              {preferredMethod === "bank" && (
                <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
              )}
            </div>
          </RadioGroup>
        </div>

        {preferredMethod === "upi" && (
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Example: yourname@paytm, yourname@ybl, yourname@okicici
            </p>
          </div>
        )}

        {preferredMethod === "bank" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Holder Name</Label>
              <Input
                id="account-name"
                placeholder="As per bank records"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="Enter account number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="e.g., SBIN0001234"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Payment Info"}
        </Button>
      </CardContent>
    </Card>
  );
}
