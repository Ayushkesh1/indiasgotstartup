import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEarningsStats, useEarnings } from "@/hooks/useEarnings";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function EarningsDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useEarningsStats(user?.id);
  const { data: earnings, isLoading: earningsLoading } = useEarnings(user?.id);

  if (statsLoading || earningsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ${stats?.total.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Automated from article views</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              ${stats?.pending.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Out</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              ${stats?.paid.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Earnings */}
      <Card className="border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Earnings
          </CardTitle>
          <CardDescription>
            Automatically calculated based on your article views ($0.05 per view)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {earnings && earnings.length > 0 ? (
            <div className="space-y-3">
              {earnings.slice(0, 10).map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{earning.description || earning.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(earning.created_at), "PPp")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ${Number(earning.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{earning.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No earnings yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start writing articles to earn money from views!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
