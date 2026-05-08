import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserGrowth() {
  return useQuery({
    queryKey: ["admin-user-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyData = data.reduce((acc: any, profile) => {
        const month = new Date(profile.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        users: count,
      }));
    },
  });
}

export function useArticleViewsTrend() {
  return useQuery({
    queryKey: ["admin-article-views-trend"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_views")
        .select("viewed_at")
        .order("viewed_at", { ascending: true });

      if (error) throw error;

      // Group by day for last 30 days
      const dailyData = data.reduce((acc: any, view) => {
        const date = new Date(view.viewed_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(dailyData).slice(-30).map(([date, views]) => ({
        date,
        views,
      }));
    },
  });
}

export function useEngagementMetrics() {
  return useQuery({
    queryKey: ["admin-engagement-metrics"],
    queryFn: async () => {
      // Get comment counts
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("created_at");

      if (commentsError) throw commentsError;

      // Get bookmark counts
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from("bookmarks")
        .select("bookmarked_at");

      if (bookmarksError) throw bookmarksError;

      // Group by week
      const weeklyData: any = {};
      
      comments?.forEach((comment) => {
        const week = new Date(comment.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        if (!weeklyData[week]) weeklyData[week] = { week, comments: 0, bookmarks: 0 };
        weeklyData[week].comments += 1;
      });

      bookmarks?.forEach((bookmark) => {
        const week = new Date(bookmark.bookmarked_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        if (!weeklyData[week]) weeklyData[week] = { week, comments: 0, bookmarks: 0 };
        weeklyData[week].bookmarks += 1;
      });

      return Object.values(weeklyData).slice(-12);
    },
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["admin-platform-stats"],
    queryFn: async () => {
      const [usersResult, articlesResult, viewsResult, earningsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("article_views").select("id", { count: "exact", head: true }),
        supabase.from("earnings").select("amount"),
      ]);

      const totalEarnings = earningsResult.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      return {
        totalUsers: usersResult.count || 0,
        totalArticles: articlesResult.count || 0,
        totalViews: viewsResult.count || 0,
        totalEarnings,
      };
    },
  });
}
