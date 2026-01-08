import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { format, subDays, subWeeks, subMonths, startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Earning } from "@/hooks/useEarnings";

interface EarningsTrendChartProps {
  earnings: Earning[];
}

type TimeRange = "7d" | "30d" | "90d";

export function EarningsTrendChart({ earnings }: EarningsTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const chartData = useMemo(() => {
    if (!earnings || earnings.length === 0) return [];

    const now = new Date();
    let startDate: Date;
    let groupBy: "day" | "week" | "month";

    switch (timeRange) {
      case "7d":
        startDate = subDays(now, 7);
        groupBy = "day";
        break;
      case "30d":
        startDate = subDays(now, 30);
        groupBy = "day";
        break;
      case "90d":
        startDate = subMonths(now, 3);
        groupBy = "week";
        break;
      default:
        startDate = subDays(now, 30);
        groupBy = "day";
    }

    // Filter earnings within the time range
    const filteredEarnings = earnings.filter(
      (e) => new Date(e.created_at) >= startDate
    );

    // Group earnings by period
    const grouped = new Map<string, number>();

    filteredEarnings.forEach((earning) => {
      const date = new Date(earning.created_at);
      let key: string;

      if (groupBy === "day") {
        key = format(startOfDay(date), "yyyy-MM-dd");
      } else if (groupBy === "week") {
        key = format(startOfWeek(date), "yyyy-MM-dd");
      } else {
        key = format(startOfMonth(date), "yyyy-MM");
      }

      grouped.set(key, (grouped.get(key) || 0) + Number(earning.amount));
    });

    // Generate all periods in range
    const periods: { date: string; amount: number; label: string }[] = [];
    let currentDate = startDate;

    while (currentDate <= now) {
      let key: string;
      let label: string;

      if (groupBy === "day") {
        key = format(startOfDay(currentDate), "yyyy-MM-dd");
        label = format(currentDate, "MMM dd");
        currentDate = subDays(currentDate, -1);
      } else if (groupBy === "week") {
        key = format(startOfWeek(currentDate), "yyyy-MM-dd");
        label = format(currentDate, "MMM dd");
        currentDate = subWeeks(currentDate, -1);
      } else {
        key = format(startOfMonth(currentDate), "yyyy-MM");
        label = format(currentDate, "MMM yyyy");
        currentDate = subMonths(currentDate, -1);
      }

      periods.push({
        date: key,
        amount: grouped.get(key) || 0,
        label,
      });
    }

    return periods;
  }, [earnings, timeRange]);

  const totalInPeriod = chartData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Card className="border-0 bg-gradient-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Earnings Trend</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ${totalInPeriod.toFixed(2)} total in this period
              </p>
            </div>
          </div>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList className="grid grid-cols-3 w-[200px]">
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-lg font-bold text-primary">
                            ${Number(payload[0].value).toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No earnings data available for this period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
