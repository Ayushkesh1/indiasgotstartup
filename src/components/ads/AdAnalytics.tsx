import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Advertisement } from "@/hooks/useAdvertisements";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, MousePointer, Eye, DollarSign } from "lucide-react";

interface AdAnalyticsProps {
  ads: Advertisement[];
}

const AdAnalytics = ({ ads }: AdAnalyticsProps) => {
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalSpend = ads.reduce((sum, ad) => sum + ad.bid_amount, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const avgCpc = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : "0.00";

  const activeAds = ads.filter((ad) => ad.is_active).length;
  const inactiveAds = ads.length - activeAds;

  const statusData = [
    { name: "Active", value: activeAds, color: "hsl(var(--primary))" },
    { name: "Inactive", value: inactiveAds, color: "hsl(var(--muted))" },
  ];

  const performanceData = ads.slice(0, 5).map((ad) => ({
    name: ad.title.substring(0, 20) + (ad.title.length > 20 ? "..." : ""),
    impressions: ad.impressions,
    clicks: ad.clicks,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {ads.length} ads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              CTR: {ctr}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg CPC: ₹{avgCpc}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ad Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: "12px" }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Impressions"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Ad List */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ads.map((ad) => {
              const adCtr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00";
              const adCpc = ad.clicks > 0 ? (ad.bid_amount / ad.clicks).toFixed(2) : "0.00";

              return (
                <div
                  key={ad.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{ad.title}</h4>
                        <Badge variant={ad.is_active ? "default" : "secondary"}>
                          {ad.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bid: ₹{ad.bid_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-8 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                      <p className="text-muted-foreground">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{adCtr}%</p>
                      <p className="text-muted-foreground">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">₹{adCpc}</p>
                      <p className="text-muted-foreground">CPC</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdAnalytics;
