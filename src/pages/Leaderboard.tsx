import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLeaderboard, LeaderboardMetric } from "@/hooks/useLeaderboard";
import { Trophy, Eye, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [metric, setMetric] = useState<LeaderboardMetric>("views");
  const navigate = useNavigate();

  const { data: leaderboard, isLoading } = useLeaderboard(metric);

  const getMetricIcon = () => {
    switch (metric) {
      case "views":
        return <Eye className="h-5 w-5" />;
      case "earnings":
        return <DollarSign className="h-5 w-5" />;
      case "followers":
        return <Users className="h-5 w-5" />;
    }
  };

  const getMetricLabel = (value: number) => {
    switch (metric) {
      case "views":
        return `${value.toLocaleString()} views`;
      case "earnings":
        return `$${value.toFixed(2)}`;
      case "followers":
        return `${value} followers`;
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-white mb-6 shadow-lg">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-semibold">Top Authors</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the most successful authors on our platform. Rankings based on article views, earnings, and community engagement.
          </p>
        </div>

        {/* Metrics Tabs */}
        <Tabs value={metric} onValueChange={(value) => setMetric(value as LeaderboardMetric)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="views" className="gap-2">
              <Eye className="h-4 w-4" />
              Views
            </TabsTrigger>
            <TabsTrigger value="earnings" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="followers" className="gap-2">
              <Users className="h-4 w-4" />
              Followers
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard */}
        <Card className="border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getMetricIcon()}
              Top 50 Authors by {metric === "views" ? "Views" : metric === "earnings" ? "Earnings" : "Followers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    onClick={() => navigate(`/author/${entry.id}`)}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      index < 3
                        ? "bg-gradient-primary/10 hover:bg-gradient-primary/20 border-2 border-primary/20"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="text-2xl font-bold w-12 text-center">
                      {getRankBadge(index)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entry.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {entry.full_name?.charAt(0)?.toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {entry.full_name || "Anonymous Author"}
                        </h3>
                        {index < 3 && (
                          <Badge variant="default" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Top {index + 1}
                          </Badge>
                        )}
                      </div>
                      {entry.bio && (
                        <p className="text-sm text-muted-foreground truncate">
                          {entry.bio}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.article_count} articles published
                      </p>
                    </div>

                    {/* Metric Value */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {getMetricLabel(entry.metric_value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No leaderboard data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 border-0 bg-gradient-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to join the leaderboard?</h2>
            <p className="mb-6">
              Start writing quality articles, engage with the community, and watch your rankings climb!
            </p>
            <button
              onClick={() => navigate("/write")}
              className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Start Writing
            </button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
