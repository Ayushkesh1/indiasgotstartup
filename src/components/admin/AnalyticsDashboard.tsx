import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Activity, DollarSign, TrendingUp, TrendingDown, 
  Target, Star, AlertTriangle, ArrowUpRight, Heart, MessageSquare, Zap
} from "lucide-react";

export function AnalyticsDashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7d");
  const [category, setCategory] = useState("all");

  // Simulated Advanced KPI Values based on filters
  const mockKPIs = useMemo(() => {
    const multiplier = timeRange === "today" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const catMultiplier = category === "all" ? 1.0 : 0.4; // random subset
    
    return {
      activeUsers: Math.floor(1240 * multiplier * catMultiplier),
      activeUsersDelta: "+12%",
      returningRatio: timeRange === "today" ? "42% Returning" : "68% Returning",
      returningDelta: "+5.2%",
      avgEngagement: timeRange === "today" ? "2.4m" : "3.1m",
      engDelta: "+1.1m",
      arppu: `₹${(195.40 * catMultiplier).toFixed(2)}`,
      arppuDelta: "+₹12.15"
    };
  }, [timeRange, category]);

  // Simulated Content Intelligence
  const topArticles = [
    { id: 1, title: "The Future of Indian SaaS Post-2025", author: "Aman Gupta", views: "14.2k", engagement: "94%", trend: "up" },
    { id: 2, title: "Bootstrap or VC? The Ultimate Guide", author: "Priya Sharma", views: "11.1k", engagement: "88%", trend: "up" },
    { id: 3, title: "Decoding the New DPIIT Guidelines", author: "Tech Desk", views: "9.8k", engagement: "85%", trend: "up" },
  ];

  const worstArticles = [
    { id: 4, title: "Generic Startup Advice #104", author: "Guest Writer", views: "142", engagement: "12%", issues: "High Bounce Rate" },
    { id: 5, title: "Why I Wake Up At 4AM", author: "Daily Hustler", views: "305", engagement: "18%", issues: "Low Read Time" },
  ];

  // Simulated Creator Insights
  const topCreators = [
    { name: "Aman Gupta", type: "Tech Expert", earnings: "₹92,240.50", articles: 12 },
    { name: "Priya Sharma", type: "FinTech Analyst", earnings: "₹48,980.00", articles: 8 },
    { name: "Rahul Verma", type: "Investor", earnings: "₹35,850.25", articles: 4 },
  ];

  // Action Handlers
  const handleAction = (action: string, target: string) => {
    toast({
      title: "Action Executed",
      description: `Successfully triggered [${action}] on: ${target}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Global Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 border border-border rounded-2xl p-4 shadow-xl gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-cyan-500"/> Command Center</h2>
          <p className="text-sm text-muted-foreground">Filter parameters instantly apply to all downstream intelligence metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Horizon:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-black/50 border-border h-9">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Sector:</span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px] bg-black/50 border-border h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. Expanded KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-foreground dark:text-white">{mockKPIs.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-cyan-400 mt-2 flex items-center font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {mockKPIs.activeUsersDelta} vs previous
            </p>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">User Retention</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-black text-foreground dark:text-white">{mockKPIs.returningRatio}</div>
            <p className="text-xs text-purple-400 mt-2 flex items-center font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {mockKPIs.returningDelta} growth
            </p>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Avg Read Time</CardTitle>
            <Zap className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-foreground dark:text-white">{mockKPIs.avgEngagement}</div>
            <p className="text-xs text-amber-400 mt-2 flex items-center font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {mockKPIs.engDelta} avg session
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">ARPPU</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-foreground dark:text-white">{mockKPIs.arppu}</div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {mockKPIs.arppuDelta} vs previous
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Content Intelligence & Action Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" /> Top Performing Content</CardTitle>
            <CardDescription>Highest engaging articles commanding attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topArticles.map((article, i) => (
              <div key={article.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/70 dark:bg-zinc-900/60 rounded-xl border border-border hover:border-cyan-500/30 transition-colors gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-cyan-500">#{i + 1}</span>
                    <h4 className="font-bold text-foreground dark:text-white truncate">{article.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>By {article.author}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400"/> {article.engagement}</span>
                    <span className="font-mono text-cyan-400">{article.views} views</span>
                  </p>
                </div>
                
                {/* Action Layer */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0 opacity-80 hover:opacity-100 transition-opacity">
                   <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-foreground dark:text-white h-8 px-2 text-xs" onClick={() => handleAction("Feature Frontpage", article.title)}>
                     <Star className="w-3 h-3 mr-1" /> Feature
                   </Button>
                   <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-foreground dark:text-white h-8 px-2 text-xs" onClick={() => handleAction("Push Notification", article.title)}>
                     <Zap className="w-3 h-3 mr-1" /> Promote
                   </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Worst Performers */}
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> Content Under Review</CardTitle>
            <CardDescription>Poorly performing articles requiring administrative triage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {worstArticles.map((article) => (
              <div key={article.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-950/20 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground dark:text-white truncate mb-1">{article.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>By {article.author}</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500"/> {article.issues}</span>
                    <span className="font-mono text-muted-foreground">{article.views} views</span>
                  </p>
                </div>
                
                {/* Action Layer */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                   <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-foreground dark:text-white h-8 px-2 text-xs" onClick={() => handleAction("Flag / Unpublish", article.title)}>
                     <AlertTriangle className="w-3 h-3 mr-1" /> Flag
                   </Button>
                   <Button size="sm" variant="outline" className="border-zinc-500/30 text-muted-foreground hover:bg-zinc-800 hover:text-foreground dark:text-white h-8 px-2 text-xs" onClick={() => handleAction("Send Feedback Email", article.title)}>
                     <MessageSquare className="w-3 h-3 mr-1" /> Feedback
                   </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Creator Insights */}
      <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" /> Creator Insights</CardTitle>
          <CardDescription>Top earners and highest retaining authors on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCreators.map((creator, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-zinc-900/40 p-5 rounded-2xl border border-border relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Badge variant="outline" className="text-[10px] font-black uppercase text-amber-500 border-amber-500/30">Top {idx + 1}</Badge>
                </div>
                <h4 className="text-lg font-bold text-foreground dark:text-white mb-1 group-hover:text-cyan-400 transition-colors">{creator.name}</h4>
                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4">{creator.type}</p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Revenue Generated</span>
                    <span className="text-emerald-400 font-black">{creator.earnings}</span>
                  </div>
                  <div className="flex flex-col border-l border-border pl-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Articles</span>
                    <span className="text-foreground dark:text-white font-black">{creator.articles}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Visual Data Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Engagement Trend</CardTitle>
            <CardDescription>Daily comments and shares tracked.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-end justify-between px-6 pb-6 gap-2">
            {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
               <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                  <div className="w-full bg-cyan-500/80 rounded-t-sm hover:bg-cyan-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded text-foreground dark:text-white whitespace-nowrap transition-opacity">
                       {h * 12} Engagements
                     </div>
                  </div>
               </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Traffic Surge Index</CardTitle>
            <CardDescription>Overall views pacing against previous period.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-end justify-between px-6 pb-6 gap-2">
            {[60, 50, 40, 80, 100, 95, 110].map((h, i) => (
               <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                  <div className="w-full bg-purple-500/80 rounded-t-sm hover:bg-purple-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded text-foreground dark:text-white whitespace-nowrap transition-opacity">
                       {(h * 1.5).toFixed(1)}k Views
                     </div>
                  </div>
               </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
