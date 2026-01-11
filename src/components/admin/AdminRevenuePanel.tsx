import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  IndianRupee, 
  Users, 
  TrendingUp, 
  PieChart, 
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAdminRevenueStats, 
  useCalculateMonthlyPool, 
  useCalculateEngagementPoints, 
  useFinalizeMonth,
  useProcessPayout
} from "@/hooks/useAdminRevenue";
import { format } from "date-fns";

export function AdminRevenuePanel() {
  const { toast } = useToast();
  const { data: stats, isLoading, refetch } = useAdminRevenueStats();
  const { mutate: calculatePool, isPending: calculatingPool } = useCalculateMonthlyPool();
  const { mutate: calculatePoints, isPending: calculatingPoints } = useCalculateEngagementPoints();
  const { mutate: finalizeMonth, isPending: finalizing } = useFinalizeMonth();
  const { mutate: processPayout, isPending: processingPayout } = useProcessPayout();

  const handleCalculatePool = () => {
    calculatePool(undefined, {
      onSuccess: () => {
        toast({ title: "Pool calculated successfully" });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleCalculatePoints = () => {
    calculatePoints(undefined, {
      onSuccess: () => {
        toast({ title: "Engagement points calculated" });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleFinalizeMonth = () => {
    if (!confirm("Are you sure you want to finalize this month? This will lock in creator earnings.")) {
      return;
    }
    finalizeMonth(undefined, {
      onSuccess: () => {
        toast({ title: "Month finalized successfully" });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleProcessPayout = (payoutId: string, status: "processing" | "completed" | "failed") => {
    processPayout({ payoutId, status }, {
      onSuccess: () => {
        toast({ title: `Payout ${status}` });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const pool = stats?.pool;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_active_subscribers || 0}</div>
            <p className="text-xs text-muted-foreground">@ ₹100/month each</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Total Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{pool?.total_revenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.current_month}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-green-600" />
              Creator Pool (60%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{pool?.creator_pool?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">For creators</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Platform Revenue (40%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ₹{pool?.platform_revenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Platform share</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Actions</CardTitle>
          <CardDescription>
            Calculate and finalize monthly earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handleCalculatePool}
              disabled={calculatingPool}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${calculatingPool ? 'animate-spin' : ''}`} />
              Calculate Pool
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCalculatePoints}
              disabled={calculatingPoints}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${calculatingPoints ? 'animate-spin' : ''}`} />
              Calculate Engagement
            </Button>
            <Button 
              onClick={handleFinalizeMonth}
              disabled={finalizing || pool?.is_finalized}
              variant={pool?.is_finalized ? "secondary" : "default"}
            >
              {pool?.is_finalized ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Month Finalized
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalize Month
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Total engagement points this month: <strong>{pool?.total_engagement_points?.toLocaleString() || 0}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Creator Earnings Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Earnings - {stats?.current_month}</CardTitle>
          <CardDescription>
            Engagement-based earnings distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.creator_earnings && stats.creator_earnings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Reads</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Bookmarks</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.creator_earnings.map((earning: any, index: number) => (
                  <TableRow key={earning.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={earning.profiles?.avatar_url} />
                          <AvatarFallback>
                            {earning.profiles?.full_name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {earning.profiles?.full_name || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {earning.total_engagement_points?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{earning.full_reads}</TableCell>
                    <TableCell className="text-right">{earning.comments}</TableCell>
                    <TableCell className="text-right">{earning.bookmarks}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₹{(earning.final_earnings || earning.estimated_earnings)?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={earning.is_paid ? "default" : "secondary"}>
                        {earning.is_paid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No creator earnings data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Payouts */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payout Requests</CardTitle>
          <CardDescription>
            Process creator payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.pending_payouts && stats.pending_payouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.pending_payouts.map((payout: any) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.creator_id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-semibold">₹{payout.amount}</TableCell>
                    <TableCell className="uppercase">{payout.payment_method}</TableCell>
                    <TableCell>
                      {format(new Date(payout.requested_at), "PPp")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleProcessPayout(payout.id, "processing")}
                          disabled={processingPayout}
                        >
                          Process
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleProcessPayout(payout.id, "completed")}
                          disabled={processingPayout}
                        >
                          Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleProcessPayout(payout.id, "failed")}
                          disabled={processingPayout}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pending payout requests</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
