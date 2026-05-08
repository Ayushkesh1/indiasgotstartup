import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  IndianRupee,
  Sparkles,
  Crown,
  Shield,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const plans = {
  creator: {
    id: "creator",
    name: "Creator Pro",
    price: 100,
    period: "month",
    description: "Monetize your content and grow faster",
    icon: Sparkles,
    color: "text-amber-500",
    features: [
      "Earn from reader engagement",
      "Access to creator pool earnings",
      "Priority in recommendations",
      "Boost articles for visibility",
      "+50% bonus from follower engagement",
    ],
  },
  premium: {
    id: "premium",
    name: "Creator Elite",
    price: 500,
    period: "month",
    description: "Maximum visibility and earnings potential",
    icon: Crown,
    color: "text-purple-500",
    features: [
      "2x earnings multiplier",
      "Featured placement on homepage",
      "Unlimited article boosts",
      "Custom creator badge",
      "Monthly strategy call",
    ],
  },
};

export default function CreatorCheckout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const planId = searchParams.get("plan") as "creator" | "premium";
  const plan = plans[planId];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/creator-program");
    }
  }, [user, authLoading, navigate]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Button onClick={() => navigate("/creator-program")}>
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    // Payment integration will be added here
    // For now, show a placeholder message
    setTimeout(() => {
      setIsProcessing(false);
      // This is where payment flow will happen
    }, 1000);
  };

  const PlanIcon = plan.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/creator-program")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                    <PlanIcon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <Separator />

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{(plan.price * 0.18).toFixed(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(plan.price * 1.18).toFixed(0)}/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Secure Payment
                </CardTitle>
                <CardDescription>
                  Your payment information is encrypted and secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Payment Method
                  </Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="grid gap-3"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Credit / Debit Card</div>
                          <div className="text-sm text-muted-foreground">
                            Visa, Mastercard, Rupay
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <IndianRupee className="h-5 w-5" />
                        <div>
                          <div className="font-medium">UPI</div>
                          <div className="text-sm text-muted-foreground">
                            Google Pay, PhonePe, Paytm
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Shield className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Net Banking</div>
                          <div className="text-sm text-muted-foreground">
                            All major banks supported
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Notice */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-600 mb-1">
                        Payment Integration Coming Soon
                      </p>
                      <p className="text-muted-foreground">
                        We're setting up secure payment processing. You'll be able to 
                        subscribe with your preferred payment method shortly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to our Terms of Service and Privacy Policy. 
                  Your subscription will auto-renew monthly. You can cancel anytime from 
                  your account settings.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      Subscribe for ₹{(plan.price * 1.18).toFixed(0)}/month
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL encryption</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
