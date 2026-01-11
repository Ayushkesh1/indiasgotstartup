import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useEngagementTrends } from "@/hooks/useCreatorAnalytics";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

export function EngagementChart() {
  const { data: trends, isLoading } = useEngagementTrends(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
          <CardDescription>Your engagement over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = (trends || []).map(trend => ({
    ...trend,
    displayDate: format(new Date(trend.date), "MMM d"),
  }));

  const totalPoints = chartData.reduce((sum, d) => sum + d.points, 0);
  const avgDaily = chartData.length > 0 ? Math.round(totalPoints / chartData.length) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Engagement Trends
            </CardTitle>
            <CardDescription>Your engagement over the last 30 days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">total points</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="points"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#pointsGradient)"
                name="Points"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown bars */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-lg font-bold text-blue-600">
              {chartData.reduce((sum, d) => sum + d.full_reads, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Full Reads</div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-lg font-bold text-green-600">
              {chartData.reduce((sum, d) => sum + d.comments, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="text-lg font-bold text-amber-600">
              {chartData.reduce((sum, d) => sum + d.bookmarks, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Bookmarks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
