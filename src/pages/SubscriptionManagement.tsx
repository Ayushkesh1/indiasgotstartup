import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle, 
  Sparkles, 
  Crown,
  BookOpen,
  Calendar,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useCreatorEarnings";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  expires_at: string;
  payment_method: string | null;
  cancelled_at: string | null;
}

const planDetails = {
  basic: {
    name: "Basic Creator",
    price: 0,
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Publish unlimited articles",
      "Basic analytics dashboard",
      "Community access",
    ],
  },
  creator: {
    name: "Creator Pro",
    price: 100,
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    features: [
      "Earn from reader engagement",
      "Access to creator pool earnings",
      "Priority in recommendations",
      "Boost articles for visibility",
      "+50% bonus from follower engagement",
    ],
  },
  premium: {
    name: "Creator Elite",
    price: 500,
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "2x earnings multiplier",
      "Featured placement on homepage",
      "Unlimited article boosts",
      "Custom creator badge",
      "Monthly strategy call",
    ],
  },
};

export default function SubscriptionManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscription();
  const [isCancelling, setIsCancelling] = useState(false);

  const subscription = subscriptionData as unknown as Subscription | null;
  const isSubscribed = subscription?.status === "active";
  const isCancelled = !!subscription?.cancelled_at;

  // Determine current plan based on subscription
  const getCurrentPlan = (): "basic" | "creator" | "premium" => {
    if (!isSubscribed) return "basic";
    // In a real app, you'd have plan_id in the subscription
    // For now, we'll assume any active subscription is "creator"
    return "creator";
  };

  const currentPlanId = getCurrentPlan();
  const currentPlan = planDetails[currentPlanId as keyof typeof planDetails];
  const CurrentPlanIcon = currentPlan.icon;

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    // In a real implementation, this would call an API to cancel the subscription
    // For now, we'll simulate the action
    setTimeout(() => {
      setIsCancelling(false);
      // Show success message or update state
    }, 1500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth?redirect=/subscription");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your creator subscription and billing
          </p>
        </div>

        {subscriptionLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${currentPlan.bgColor} flex items-center justify-center`}>
                      <CurrentPlanIcon className={`h-6 w-6 ${currentPlan.color}`} />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {currentPlan.name}
                        {isSubscribed && !isCancelled && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            Active
                          </Badge>
                        )}
                        {isCancelled && (
                          <Badge variant="destructive">
                            Cancelling
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {currentPlan.price === 0 
                          ? "Free forever" 
                          : `₹${currentPlan.price}/month`}
                      </CardDescription>
                    </div>
                  </div>
                  {!isSubscribed && (
                    <Button onClick={() => navigate("/creator-program")}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Your Benefits</h4>
                    <ul className="space-y-2">
                      {currentPlan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {isSubscribed && subscription && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>Billing Cycle</span>
                        </div>
                        <div className="font-medium">
                          {format(new Date(subscription.started_at), "MMM d, yyyy")} - {format(new Date(subscription.expires_at), "MMM d, yyyy")}
                        </div>
                      </div>
                      
                      {subscription.payment_method && (
                        <div className="p-4 rounded-lg bg-muted">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Payment Method</span>
                          </div>
                          <div className="font-medium capitalize">
                            {subscription.payment_method}
                          </div>
                        </div>
                      )}

                      {isCancelled && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-destructive">Subscription Cancelled</p>
                              <p className="text-sm text-muted-foreground">
                                Your subscription will end on {format(new Date(subscription.expires_at), "MMM d, yyyy")}. 
                                You'll continue to have access until then.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan Comparison / Upgrade Options */}
            {isSubscribed && !isCancelled && currentPlanId !== "premium" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5" />
                    Upgrade Your Plan
                  </CardTitle>
                  <CardDescription>
                    Unlock more features and increase your earning potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${planDetails.premium.bgColor} flex items-center justify-center`}>
                        <Crown className={`h-6 w-6 ${planDetails.premium.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{planDetails.premium.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₹{planDetails.premium.price}/month • 2x earnings multiplier
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate("/creator-program/checkout?plan=premium")}>
                      Upgrade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Actions */}
            {isSubscribed && !isCancelled && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Update Payment Method</h4>
                      <p className="text-sm text-muted-foreground">
                        Change your card or payment details
                      </p>
                    </div>
                    <Button variant="outline">
                      Update
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20">
                    <div>
                      <h4 className="font-medium text-destructive">Cancel Subscription</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll lose access to creator earnings at the end of your billing period
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isCancelling}>
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your {currentPlan.name} subscription? 
                            You'll continue to have access until the end of your current billing period, 
                            but you won't be able to earn from engagement after that.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleCancelSubscription}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Not Subscribed CTA */}
            {!isSubscribed && (
              <Card className="bg-gradient-to-br from-primary/5 to-amber-500/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center max-w-md mx-auto">
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Start Earning from Your Content
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join the Creator Program to monetize your articles and earn from reader engagement.
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => navigate("/creator-program")}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Explore Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past payments and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Billing history will appear here</p>
                    <p className="text-sm">Your invoices will be available after your first payment</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No billing history</p>
                    <p className="text-sm">Subscribe to a plan to see your billing history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
