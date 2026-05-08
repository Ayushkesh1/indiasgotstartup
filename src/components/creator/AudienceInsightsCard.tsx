import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Heart, 
  FolderOpen, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { useAudienceInsights, useWeeklyComparison } from "@/hooks/useCreatorAnalytics";
import { cn } from "@/lib/utils";

export function AudienceInsightsCard() {
  const { data: insights, isLoading: insightsLoading } = useAudienceInsights();
  const { data: weeklyComparison, isLoading: weeklyLoading } = useWeeklyComparison();

  if (insightsLoading || weeklyLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>Understand your readers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Total Followers",
      value: insights?.total_followers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Follower Engagement",
      value: `${insights?.follower_engagement_rate || 0}%`,
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "of engagement from followers",
    },
    {
      label: "Top Category",
      value: insights?.top_performing_category || "N/A",
      icon: FolderOpen,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Weekly Trend",
      value: weeklyComparison?.thisWeek || 0,
      change: weeklyComparison?.percentChange || 0,
      icon: weeklyComparison?.trend === 'up' ? TrendingUp : TrendingDown,
      color: weeklyComparison?.trend === 'up' ? "text-green-500" : "text-red-500",
      bgColor: weeklyComparison?.trend === 'up' ? "bg-green-500/10" : "bg-red-500/10",
      description: "points this week",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Audience Insights
        </CardTitle>
        <CardDescription>Understand your readers and their engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-2 rounded-full", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                {stat.change !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      stat.change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stat.change >= 0 ? "+" : ""}{stat.change}%
                  </Badge>
                )}
              </div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Follower Bonus Explainer */}
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Follower Bonus Active</p>
              <p className="text-xs text-muted-foreground">
                You earn 50% extra points when your followers engage with your content. 
                Build your audience to maximize earnings!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
