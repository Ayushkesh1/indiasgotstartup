import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWriterAnalytics } from "@/hooks/useAnalytics";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, Eye, FileText, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: analytics, isLoading } = useWriterAnalytics(user?.id);

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your content performance and audience growth</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Last 6 months</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">Published</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Followers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalFollowers}</div>
                  <p className="text-xs text-muted-foreground">Total followers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalArticles > 0
                      ? Math.round(analytics.totalViews / analytics.totalArticles)
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Per article</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Views Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.viewsByMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.viewsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No view data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Follower Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Follower Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.followerGrowth.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.followerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="followers"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No follower data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topArticles.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topArticles.map((article, index) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                        onClick={() => navigate(`/article/${article.slug}`)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} views
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Article
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No published articles yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
}
