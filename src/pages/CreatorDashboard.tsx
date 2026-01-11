import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Bookmark, 
  Clock, 
  Wallet,
  IndianRupee,
  CheckCircle,
  BarChart3,
  Users,
  Sparkles,
  PenLine
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreatorStats, useCreatorPayouts, useCreatorPaymentInfo } from "@/hooks/useCreatorEarnings";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useArticlePerformance } from "@/hooks/useCreatorAnalytics";
import { CreatorPayoutDialog } from "@/components/creator/CreatorPayoutDialog";
import { PaymentInfoForm } from "@/components/creator/PaymentInfoForm";
import { EarningsExplanation } from "@/components/creator/EarningsExplanation";
import { NewCreatorTips } from "@/components/creator/NewCreatorTips";
import { PayoutProgressIndicator } from "@/components/creator/PayoutProgressIndicator";
import { ArticlePerformanceTable } from "@/components/creator/ArticlePerformanceTable";
import { EngagementChart } from "@/components/creator/EngagementChart";
import { AudienceInsightsCard } from "@/components/creator/AudienceInsightsCard";
import { BoostStatusCard } from "@/components/creator/BoostStatusCard";
import { format } from "date-fns";

export default function CreatorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useCreatorStats();
  const { data: payouts, isLoading: payoutsLoading } = useCreatorPayouts();
  const { data: paymentInfo } = useCreatorPaymentInfo();
  const { data: userArticles } = useUserArticles(user?.id);
  const { data: articlePerformance } = useArticlePerformance();

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
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Comments", 
      count: stats.current_month.comments, 
      points: stats.current_month.comments * 3,
      icon: MessageSquare,
      pointsEach: 3,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "Bookmarks", 
      count: stats.current_month.bookmarks, 
      points: stats.current_month.bookmarks * 2,
      icon: Bookmark,
      pointsEach: 2,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      label: "Long Read Bonuses", 
      count: stats.current_month.long_read_bonuses, 
      points: stats.current_month.long_read_bonuses * 1,
      icon: Clock,
      pointsEach: 1,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
  ] : [];

  const articleCount = userArticles?.length || 0;
  const boostedArticlesCount = articlePerformance?.filter(a => a.is_boosted).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Creator Dashboard
              <Badge variant="secondary" className="font-normal">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your content performance, engagement, and earnings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/writer")}>
              <PenLine className="h-4 w-4 mr-2" />
              Write Article
            </Button>
            <EarningsExplanation />
          </div>
        </div>

        {statsLoading ? (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <>
            {/* New Creator Tips - shows for users with <5 articles */}
            <NewCreatorTips articleCount={articleCount} />

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
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

              <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
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
                    Based on current engagement
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Published Articles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {articleCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {boostedArticlesCount > 0 && (
                      <span className="text-amber-600">{boostedArticlesCount} boosted</span>
                    )}
                    {boostedArticlesCount === 0 && "Total published"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
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

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="audience" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Audience</span>
                </TabsTrigger>
                <TabsTrigger value="earnings" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Earnings</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  <span className="hidden sm:inline">Payouts</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <EngagementChart />
                  <AudienceInsightsCard />
                </div>
                
                {/* Engagement Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Month's Engagement Breakdown</CardTitle>
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
                            <div className={`p-2 rounded-full ${item.bgColor} ${item.color}`}>
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ArticlePerformanceTable />
                  </div>
                  <div>
                    <BoostStatusCard 
                      boostedArticlesCount={boostedArticlesCount}
                      totalBoostPoints={0} // Would need to calculate from engagement data
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Audience Tab */}
              <TabsContent value="audience" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <AudienceInsightsCard />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        Follower Bonus System
                      </CardTitle>
                      <CardDescription>
                        Earn more when your followers engage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <div className="text-lg font-bold text-amber-600 mb-2">+50% Bonus</div>
                          <p className="text-sm text-muted-foreground">
                            When your followers read, comment, or bookmark your articles, 
                            you earn 50% extra points on that engagement.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">How it works:</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Regular read = 1 point, Follower read = 1.5 points</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Regular comment = 3 points, Follower comment = 4.5 points</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Regular bookmark = 2 points, Follower bookmark = 3 points</span>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            Build your audience to maximize earnings. Share your profile and 
                            encourage readers to follow you for updates.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Payout Progress */}
                  <PayoutProgressIndicator 
                    currentBalance={stats?.pending_balance || 0}
                    threshold={stats?.min_payout_threshold || 300}
                    canRequestPayout={stats?.can_request_payout || false}
                  />

                  {/* Last Month Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Last Month Summary</CardTitle>
                      <CardDescription>{stats?.last_month.month_year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                          <span className="text-muted-foreground">Final Earnings</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{stats?.last_month.final_earnings?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                          <span className="text-muted-foreground">Engagement Points</span>
                          <span className="text-xl font-bold">
                            {stats?.last_month.engagement_points || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Request Payout */}
                <div className="flex justify-end">
                  <CreatorPayoutDialog 
                    availableBalance={stats?.pending_balance || 0}
                    canRequest={stats?.can_request_payout || false}
                    hasPaymentInfo={!!paymentInfo}
                  />
                </div>
              </TabsContent>

              {/* Payouts/Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <PaymentInfoForm />
                  
                  {/* Payout History */}
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
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
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
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
