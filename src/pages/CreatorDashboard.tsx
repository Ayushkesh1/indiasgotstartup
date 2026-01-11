import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Bookmark, 
  Clock, 
  Wallet,
  IndianRupee,
  HelpCircle,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreatorStats, useCreatorPayouts, useCreatorPaymentInfo } from "@/hooks/useCreatorEarnings";
import { CreatorPayoutDialog } from "@/components/creator/CreatorPayoutDialog";
import { PaymentInfoForm } from "@/components/creator/PaymentInfoForm";
import { EarningsExplanation } from "@/components/creator/EarningsExplanation";
import { format } from "date-fns";

export default function CreatorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useCreatorStats();
  const { data: payouts, isLoading: payoutsLoading } = useCreatorPayouts();
  const { data: paymentInfo } = useCreatorPaymentInfo();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const engagementBreakdown = stats ? [
    { 
      label: "Full Reads", 
      count: stats.current_month.full_reads, 
      points: stats.current_month.full_reads * 1,
      icon: BookOpen,
      pointsEach: 1,
      color: "text-blue-500"
    },
    { 
      label: "Comments", 
      count: stats.current_month.comments, 
      points: stats.current_month.comments * 3,
      icon: MessageSquare,
      pointsEach: 3,
      color: "text-green-500"
    },
    { 
      label: "Bookmarks", 
      count: stats.current_month.bookmarks, 
      points: stats.current_month.bookmarks * 2,
      icon: Bookmark,
      pointsEach: 2,
      color: "text-amber-500"
    },
    { 
      label: "Long Read Bonuses", 
      count: stats.current_month.long_read_bonuses, 
      points: stats.current_month.long_read_bonuses * 1,
      icon: Clock,
      pointsEach: 1,
      color: "text-purple-500"
    },
  ] : [];

  const progressToThreshold = stats 
    ? Math.min((stats.pending_balance / stats.min_payout_threshold) * 100, 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your engagement and earnings
            </p>
          </div>
          <EarningsExplanation />
        </div>

        {statsLoading ? (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Engagement Points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats?.current_month.engagement_points.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This month ({stats?.current_month.month_year})
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Estimated Earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ₹{stats?.current_month.estimated_earnings.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on current pool
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Last Month Payout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{stats?.last_month.final_earnings?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.last_month.month_year}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Pending Balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    ₹{stats?.pending_balance.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. ₹{stats?.min_payout_threshold} to withdraw
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payout Progress & Request */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Payout Status
                </CardTitle>
                <CardDescription>
                  Minimum threshold: ₹{stats?.min_payout_threshold}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to threshold</span>
                      <span className="font-medium">
                        ₹{stats?.pending_balance.toFixed(2)} / ₹{stats?.min_payout_threshold}
                      </span>
                    </div>
                    <Progress value={progressToThreshold} className="h-3" />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      {stats?.can_request_payout ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready for Payout
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          ₹{((stats?.min_payout_threshold || 300) - (stats?.pending_balance || 0)).toFixed(2)} more to unlock
                        </Badge>
                      )}
                    </div>
                    <CreatorPayoutDialog 
                      availableBalance={stats?.pending_balance || 0}
                      canRequest={stats?.can_request_payout || false}
                      hasPaymentInfo={!!paymentInfo}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="engagement" className="space-y-6">
              <TabsList>
                <TabsTrigger value="engagement">Engagement Breakdown</TabsTrigger>
                <TabsTrigger value="payouts">Payout History</TabsTrigger>
                <TabsTrigger value="payment">Payment Info</TabsTrigger>
              </TabsList>

              <TabsContent value="engagement">
                <Card>
                  <CardHeader>
                    <CardTitle>This Month's Engagement</CardTitle>
                    <CardDescription>
                      How readers are interacting with your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {engagementBreakdown.map((item) => (
                        <div 
                          key={item.label}
                          className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-full bg-background ${item.color}`}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold">{item.count}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.points} points ({item.pointsEach} pt each)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Pool Information</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Creator Pool</span>
                          <span className="font-medium">₹{stats?.pool_info.creator_pool.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Engagement Points (All Creators)</span>
                          <span className="font-medium">{stats?.pool_info.total_engagement_points.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Your Share</span>
                          <span className="font-medium">
                            {stats?.pool_info.total_engagement_points 
                              ? ((stats.current_month.engagement_points / stats.pool_info.total_engagement_points) * 100).toFixed(2)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payouts">
                <Card>
                  <CardHeader>
                    <CardTitle>Payout History</CardTitle>
                    <CardDescription>
                      Your payout requests and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payoutsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16" />
                        ))}
                      </div>
                    ) : payouts && payouts.length > 0 ? (
                      <div className="space-y-4">
                        {payouts.map((payout: any) => (
                          <div 
                            key={payout.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium">₹{payout.amount}</div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(payout.requested_at), "PPP")}
                              </div>
                            </div>
                            <Badge 
                              variant={
                                payout.status === "completed" ? "default" :
                                payout.status === "processing" ? "secondary" :
                                payout.status === "failed" ? "destructive" : "outline"
                              }
                            >
                              {payout.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No payout requests yet</p>
                        <p className="text-sm">
                          Request a payout when your balance reaches ₹{stats?.min_payout_threshold}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <PaymentInfoForm />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
