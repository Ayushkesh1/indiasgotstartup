import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Wallet, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEarnings, useEarningsSummary, usePayouts, useRequestPayout } from "@/hooks/useEarnings";
import { format } from "date-fns";

export default function RewardsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "paypal" | "stripe" | "crypto">("paypal");
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);

  const { data: earnings, isLoading: earningsLoading } = useEarnings();
  const { data: summary, isLoading: summaryLoading } = useEarningsSummary();
  const { data: payouts, isLoading: payoutsLoading } = usePayouts();
  const requestPayout = useRequestPayout();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    requestPayout.mutate(
      { amount, payment_method: paymentMethod },
      {
        onSuccess: () => {
          setPayoutAmount("");
          setIsPayoutDialogOpen(false);
        },
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-success text-success-foreground";
      case "approved":
      case "processing":
        return "bg-accent text-accent-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ad_revenue":
        return "📊";
      case "subscription":
        return "⭐";
      case "sponsorship":
        return "🤝";
      case "affiliate":
        return "🔗";
      default:
        return "💰";
    }
  };

  const minimumPayout = 50;
  const availableBalance = summary ? summary.approved : 0;

  return (
    <div className="min-h-screen gradient-subtle">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Rewards Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Track your earnings and manage payouts</p>
          </div>
          <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-glow">
                <Wallet className="h-5 w-5" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Minimum payout amount: ${minimumPayout}. Available balance: ${availableBalance.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    min={minimumPayout}
                    max={availableBalance}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleRequestPayout}
                  disabled={
                    requestPayout.isPending ||
                    !payoutAmount ||
                    parseFloat(payoutAmount) < minimumPayout ||
                    parseFloat(payoutAmount) > availableBalance
                  }
                  className="w-full"
                >
                  {requestPayout.isPending ? "Processing..." : "Submit Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-8 bg-muted rounded w-32" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="gradient-card hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Earnings
                </CardDescription>
                <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                  ${summary?.total.toFixed(2) || "0.00"}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Pending
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-muted-foreground">
                  ${summary?.pending.toFixed(2) || "0.00"}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  Approved
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-accent">
                  ${summary?.approved.toFixed(2) || "0.00"}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-success" />
                  Paid Out
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-success">
                  ${summary?.paid.toFixed(2) || "0.00"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Earnings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>Your earnings by category</CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(summary?.byType || {}).map(([type, amount]) => {
                  const percentage = summary?.total ? (amount / summary.total) * 100 : 0;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTypeIcon(type)}</span>
                          <span className="font-medium capitalize">
                            {type.replace("_", " ")}
                          </span>
                        </div>
                        <span className="font-bold text-lg">${amount.toFixed(2)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your latest earnings transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {earningsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-12 w-12 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-48" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            ) : earnings && earnings.length > 0 ? (
              <div className="space-y-4">
                {earnings.slice(0, 10).map((earning) => (
                  <div
                    key={earning.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getTypeIcon(earning.type)}</div>
                      <div>
                        <p className="font-medium capitalize">
                          {earning.type.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(earning.created_at), "MMM dd, yyyy")}
                        </p>
                        {earning.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {earning.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(earning.status)}>
                        {earning.status}
                      </Badge>
                      <p className="font-bold text-lg">${Number(earning.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No earnings yet</p>
                <Button
                  variant="link"
                  onClick={() => navigate("/monetization")}
                  className="mt-2"
                >
                  Learn how to earn <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Your payout requests and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {payoutsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-48" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            ) : payouts && payouts.length > 0 ? (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <Wallet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium capitalize">
                          {payout.payment_method.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requested: {format(new Date(payout.requested_at), "MMM dd, yyyy")}
                        </p>
                        {payout.completed_at && (
                          <p className="text-sm text-muted-foreground">
                            Completed: {format(new Date(payout.completed_at), "MMM dd, yyyy")}
                          </p>
                        )}
                        {payout.transaction_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {payout.transaction_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                      <p className="font-bold text-lg">${Number(payout.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payout history yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Request your first payout when you have at least ${minimumPayout} available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
