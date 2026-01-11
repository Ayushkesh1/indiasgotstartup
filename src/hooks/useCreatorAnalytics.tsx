import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { startOfMonth, endOfMonth, subMonths, format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";

interface ArticlePerformance {
  id: string;
  title: string;
  slug: string;
  views_count: number;
  published_at: string;
  is_boosted: boolean;
  boost_multiplier: number;
  engagement: {
    full_reads: number;
    comments: number;
    bookmarks: number;
    total_points: number;
  };
}

interface EngagementTrend {
  date: string;
  points: number;
  full_reads: number;
  comments: number;
  bookmarks: number;
}

interface AudienceInsight {
  total_followers: number;
  follower_engagement_rate: number;
  top_performing_category: string;
  avg_reading_time: number;
}

export function useArticlePerformance() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["article-performance", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      // Get user's articles
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("id, title, slug, views_count, published_at, is_boosted, boost_multiplier")
        .eq("author_id", user.id)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(20);

      if (articlesError) throw articlesError;

      // Get engagement data for these articles
      const articleIds = articles?.map(a => a.id) || [];
      
      if (articleIds.length === 0) {
        return [] as ArticlePerformance[];
      }

      const { data: engagementData, error: engagementError } = await supabase
        .from("engagement_events")
        .select("article_id, event_type, points")
        .in("article_id", articleIds);

      if (engagementError) throw engagementError;

      // Aggregate engagement by article
      const engagementByArticle: Record<string, { full_reads: number; comments: number; bookmarks: number; total_points: number }> = {};
      
      for (const event of engagementData || []) {
        if (!engagementByArticle[event.article_id]) {
          engagementByArticle[event.article_id] = { full_reads: 0, comments: 0, bookmarks: 0, total_points: 0 };
        }
        engagementByArticle[event.article_id].total_points += event.points;
        switch (event.event_type) {
          case 'full_read':
            engagementByArticle[event.article_id].full_reads += 1;
            break;
          case 'comment':
            engagementByArticle[event.article_id].comments += 1;
            break;
          case 'bookmark':
            engagementByArticle[event.article_id].bookmarks += 1;
            break;
        }
      }

      return (articles || []).map(article => ({
        ...article,
        engagement: engagementByArticle[article.id] || { full_reads: 0, comments: 0, bookmarks: 0, total_points: 0 }
      })) as ArticlePerformance[];
    },
    enabled: !!user,
  });
}

export function useEngagementTrends(days: number = 30) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["engagement-trends", user?.id, days],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      const endDate = new Date();
      const startDate = subMonths(endDate, 1);

      const { data: events, error } = await supabase
        .from("engagement_events")
        .select("created_at, event_type, points")
        .eq("creator_id", user.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const trendsByDate: Record<string, EngagementTrend> = {};
      
      // Initialize all days
      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      for (const day of allDays) {
        const dateKey = format(day, "yyyy-MM-dd");
        trendsByDate[dateKey] = {
          date: dateKey,
          points: 0,
          full_reads: 0,
          comments: 0,
          bookmarks: 0,
        };
      }

      // Populate with actual data
      for (const event of events || []) {
        const dateKey = format(new Date(event.created_at), "yyyy-MM-dd");
        if (trendsByDate[dateKey]) {
          trendsByDate[dateKey].points += event.points;
          switch (event.event_type) {
            case 'full_read':
              trendsByDate[dateKey].full_reads += 1;
              break;
            case 'comment':
              trendsByDate[dateKey].comments += 1;
              break;
            case 'bookmark':
              trendsByDate[dateKey].bookmarks += 1;
              break;
          }
        }
      }

      return Object.values(trendsByDate);
    },
    enabled: !!user,
  });
}

export function useAudienceInsights() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["audience-insights", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      // Get follower count
      const { data: followers, error: followersError } = await supabase
        .from("follows")
        .select("id")
        .eq("author_id", user.id);

      if (followersError) throw followersError;

      // Get follower engagement rate
      const { data: followerEngagements } = await supabase
        .from("engagement_events")
        .select("id, is_follower_engagement")
        .eq("creator_id", user.id);

      const totalEngagements = followerEngagements?.length || 0;
      const followerEngagementCount = followerEngagements?.filter(e => e.is_follower_engagement).length || 0;
      const followerEngagementRate = totalEngagements > 0 ? (followerEngagementCount / totalEngagements) * 100 : 0;

      // Get top performing category
      const { data: articles } = await supabase
        .from("articles")
        .select("id, category")
        .eq("author_id", user.id)
        .eq("published", true);

      const categoryCount: Record<string, number> = {};
      for (const article of articles || []) {
        categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
      }
      
      const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

      return {
        total_followers: followers?.length || 0,
        follower_engagement_rate: Math.round(followerEngagementRate),
        top_performing_category: topCategory?.[0] || "N/A",
        avg_reading_time: 0, // Would need reading_progress data
      } as AudienceInsight;
    },
    enabled: !!user,
  });
}

export function useWeeklyComparison() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["weekly-comparison", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      const now = new Date();
      const thisWeekStart = startOfWeek(now);
      const thisWeekEnd = endOfWeek(now);
      const lastWeekStart = startOfWeek(subMonths(now, 0.25)); // ~1 week ago
      const lastWeekEnd = endOfWeek(subMonths(now, 0.25));

      // This week's engagement
      const { data: thisWeekData } = await supabase
        .from("engagement_events")
        .select("points")
        .eq("creator_id", user.id)
        .gte("created_at", thisWeekStart.toISOString())
        .lte("created_at", thisWeekEnd.toISOString());

      // Last week's engagement
      const { data: lastWeekData } = await supabase
        .from("engagement_events")
        .select("points")
        .eq("creator_id", user.id)
        .gte("created_at", lastWeekStart.toISOString())
        .lte("created_at", lastWeekEnd.toISOString());

      const thisWeekPoints = (thisWeekData || []).reduce((sum, e) => sum + e.points, 0);
      const lastWeekPoints = (lastWeekData || []).reduce((sum, e) => sum + e.points, 0);
      
      const percentChange = lastWeekPoints > 0 
        ? ((thisWeekPoints - lastWeekPoints) / lastWeekPoints) * 100 
        : thisWeekPoints > 0 ? 100 : 0;

      return {
        thisWeek: thisWeekPoints,
        lastWeek: lastWeekPoints,
        percentChange: Math.round(percentChange),
        trend: percentChange >= 0 ? 'up' : 'down',
      };
    },
    enabled: !!user,
  });
}
