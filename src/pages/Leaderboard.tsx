import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLeaderboard, LeaderboardMetric } from "@/hooks/useLeaderboard";
import { 
  Trophy, 
  Eye, 
  Users, 
  TrendingUp, 
  Loader2, 
  Crown, 
  Medal,
  Flame,
  Star,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [metric, setMetric] = useState<LeaderboardMetric>("views");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useLeaderboard(metric);

  const getMetricIcon = (m: LeaderboardMetric) => {
    switch (m) {
      case "views":
        return <Eye className="h-4 w-4" />;
      case "followers":
        return <Users className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getMetricLabel = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getRankDisplay = (index: number) => {
    if (index === 0) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    if (index === 1) return { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10" };
    if (index === 2) return { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10" };
    return null;
  };

  // Calculate top author stats for the hero section
  const topAuthor = leaderboard?.[0];
  const maxValue = topAuthor?.metric_value || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 md:p-12 mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Creator Leaderboard</h1>
                <p className="text-muted-foreground">Top performing authors this month</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Creators</span>
                </div>
                <p className="text-2xl font-bold">{leaderboard?.length || 0}</p>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-medium">Top {metric === "views" ? "Views" : "Followers"}</span>
                </div>
                <p className="text-2xl font-bold">{getMetricLabel(maxValue)}</p>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium">Avg Articles</span>
                </div>
                <p className="text-2xl font-bold">
                  {leaderboard?.length 
                    ? Math.round(leaderboard.reduce((a, b) => a + b.article_count, 0) / leaderboard.length)
                    : 0}
                </p>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium">This Period</span>
                </div>
                <p className="text-2xl font-bold">All Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Tabs value={metric} onValueChange={(value) => setMetric(value as LeaderboardMetric)}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="views" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Eye className="h-4 w-4" />
                Most Viewed
              </TabsTrigger>
              <TabsTrigger value="followers" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                Most Followed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {user && (
            <Button onClick={() => navigate("/write")} className="gap-2 shadow-md">
              <Sparkles className="h-4 w-4" />
              Start Creating
            </Button>
          )}
        </div>

        {/* Top 3 Podium */}
        {!isLoading && leaderboard && leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Second Place */}
            <div className="order-2 md:order-1">
              <Card 
                className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-400/30 h-full"
                onClick={() => navigate(`/author/${leaderboard[1].id}`)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-400/10 mb-4">
                    <Medal className="h-5 w-5 text-gray-400" />
                  </div>
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-gray-400/20">
                    <AvatarImage src={leaderboard[1].avatar_url || undefined} />
                    <AvatarFallback className="bg-gray-400 text-white text-xl">
                      {leaderboard[1].full_name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {leaderboard[1].full_name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {leaderboard[1].article_count} articles
                  </p>
                  <div className="text-2xl font-bold text-gray-500">
                    {getMetricLabel(leaderboard[1].metric_value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric === "views" ? "views" : "followers"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* First Place */}
            <div className="order-1 md:order-2">
              <Card 
                className="relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-yellow-500/30 bg-gradient-to-b from-yellow-500/5 to-background h-full"
                onClick={() => navigate(`/author/${leaderboard[0].id}`)}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-4">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-yellow-500/30">
                    <AvatarImage src={leaderboard[0].avatar_url || undefined} />
                    <AvatarFallback className="bg-yellow-500 text-white text-2xl">
                      {leaderboard[0].full_name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="mb-3 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    #1 Creator
                  </Badge>
                  <h3 className="font-bold text-xl mb-1 truncate">
                    {leaderboard[0].full_name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {leaderboard[0].article_count} articles
                  </p>
                  <div className="text-3xl font-bold text-yellow-600">
                    {getMetricLabel(leaderboard[0].metric_value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric === "views" ? "views" : "followers"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Third Place */}
            <div className="order-3">
              <Card 
                className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-amber-600/30 h-full"
                onClick={() => navigate(`/author/${leaderboard[2].id}`)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500" />
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600/10 mb-4">
                    <Medal className="h-5 w-5 text-amber-600" />
                  </div>
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-amber-600/20">
                    <AvatarImage src={leaderboard[2].avatar_url || undefined} />
                    <AvatarFallback className="bg-amber-600 text-white text-xl">
                      {leaderboard[2].full_name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {leaderboard[2].full_name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {leaderboard[2].article_count} articles
                  </p>
                  <div className="text-2xl font-bold text-amber-600">
                    {getMetricLabel(leaderboard[2].metric_value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric === "views" ? "views" : "followers"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
                </div>
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="divide-y divide-border">
                {leaderboard.slice(3).map((entry, index) => {
                  const actualRank = index + 4;
                  const progressPercent = (entry.metric_value / maxValue) * 100;
                  
                  return (
                    <div
                      key={entry.id}
                      onClick={() => navigate(`/author/${entry.id}`)}
                      className="flex items-center gap-4 p-5 hover:bg-accent/50 transition-colors cursor-pointer group"
                    >
                      {/* Rank */}
                      <div className="w-12 text-center">
                        <span className="text-lg font-bold text-muted-foreground">
                          {actualRank}
                        </span>
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-primary/50 transition-all">
                        <AvatarImage src={entry.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {entry.full_name?.charAt(0)?.toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {entry.full_name || "Anonymous Author"}
                          </h3>
                          {actualRank <= 10 && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Top 10
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{entry.article_count} articles</span>
                          {entry.bio && (
                            <span className="truncate hidden sm:block max-w-[200px]">
                              {entry.bio}
                            </span>
                          )}
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 hidden sm:block">
                          <Progress value={progressPercent} className="h-1" />
                        </div>
                      </div>

                      {/* Metric Value */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {getMetricLabel(entry.metric_value)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {metric === "views" ? "views" : "followers"}
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to climb the leaderboard!
                </p>
                <Button onClick={() => navigate("/write")} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start Writing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-10 text-center">
          <Card className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Ready to compete?</h3>
              <p className="text-sm text-muted-foreground">
                Start creating content and climb the ranks
              </p>
            </div>
            <Button onClick={() => navigate("/write")} className="ml-4">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}