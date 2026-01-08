import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEarningsStats, useEarnings } from "@/hooks/useEarnings";
import { DollarSign, TrendingUp, Clock, CheckCircle, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isWithinInterval } from "date-fns";
import { PayoutRequestDialog } from "./earnings/PayoutRequestDialog";
import { usePayouts } from "@/hooks/usePayouts";
import { EarningsTrendChart } from "./earnings/EarningsTrendChart";
import { EarningsFilters, EarningsFilterState } from "./earnings/EarningsFilters";
import { EarningsNotifications } from "./earnings/EarningsNotifications";
import { EarningsExport } from "./earnings/EarningsExport";

export function EarningsDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useEarningsStats(user?.id);
  const { data: earnings, isLoading: earningsLoading } = useEarnings(user?.id);
  const { data: payouts } = usePayouts(user?.id);

  const [filters, setFilters] = useState<EarningsFilterState>({
    dateRange: undefined,
    status: "all",
  });

  const totalPoints = earnings?.reduce((sum, e) => sum + (e.points || 0), 0) || 0;
  const availableAmount = stats?.total || 0;

  const filteredEarnings = useMemo(() => {
    if (!earnings) return [];

    return earnings.filter((earning) => {
      // Date range filter
      if (filters.dateRange?.from) {
        const earningDate = new Date(earning.created_at);
        const from = filters.dateRange.from;
        const to = filters.dateRange.to || filters.dateRange.from;
        if (!isWithinInterval(earningDate, { start: from, end: to })) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && earning.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [earnings, filters]);

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
    <div className="space-y-8">
      {/* Stats Cards with Better Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Earnings
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              ${stats?.total.toFixed(2) || "0.00"}
            </div>
            <p className="text-sm text-muted-foreground">From article views</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Pending
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-warning mb-2">
              ${stats?.pending.toFixed(2) || "0.00"}
            </div>
            <p className="text-sm text-muted-foreground">7 days processing</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Paid Out
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-success mb-2">
              ${stats?.paid.toFixed(2) || "0.00"}
            </div>
            <p className="text-sm text-muted-foreground">Successfully sent</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Points
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Coins className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {totalPoints.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">100 pts = $1</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Trend Chart */}
      {earnings && earnings.length > 0 && (
        <EarningsTrendChart earnings={earnings} />
      )}

      {/* Payout Request - Enhanced Visual Hierarchy */}
      <Card className="border-0 bg-gradient-primary/5 border-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Cash Out Your Points</CardTitle>
              <CardDescription className="text-base mt-1">
                Convert your points to cash. Minimum payout is $10.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Available Balance
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ${availableAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {totalPoints.toLocaleString()} points available
                  </p>
                </div>
              </div>
              <PayoutRequestDialog availableAmount={availableAmount} availablePoints={totalPoints} />
            </div>
          </div>

          {payouts && payouts.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Payout Requests
              </h4>
              <div className="space-y-3">
                {payouts.slice(0, 3).map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">${Number(payout.amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payout.requested_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        payout.status === 'completed' ? 'bg-success/10 text-success' :
                        payout.status === 'pending' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {payout.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1.5" />}
                        {payout.status === 'pending' && <Clock className="h-3 w-3 mr-1.5" />}
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {payout.payment_method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Earnings - Enhanced */}
      <Card className="border-0 bg-gradient-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Earnings History</CardTitle>
                <CardDescription className="text-base mt-1">
                  {filteredEarnings.length} earnings • $0.05 per article view
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EarningsExport earnings={filteredEarnings} dateRange={filters.dateRange} />
              <EarningsNotifications />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <EarningsFilters filters={filters} onFiltersChange={setFilters} />
          
          {filteredEarnings.length > 0 ? (
            <div className="space-y-3">
              {filteredEarnings.slice(0, 10).map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base">{earning.description || earning.type}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {format(new Date(earning.created_at), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      ${Number(earning.amount).toFixed(2)}
                    </p>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      earning.status === 'paid' ? 'bg-success/10 text-success' :
                      earning.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {filters.dateRange?.from || filters.status !== "all"
                  ? "No matching earnings"
                  : "No earnings yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {filters.dateRange?.from || filters.status !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Start writing quality articles to earn money from views. Each view earns you $0.05 automatically!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
