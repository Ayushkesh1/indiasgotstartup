import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  totalFollowers: number;
  viewsByMonth: { month: string; views: number }[];
  followerGrowth: { month: string; followers: number }[];
  topArticles: {
    id: string;
    title: string;
    views: number;
    slug: string;
  }[];
}

export function useWriterAnalytics(userId: string | undefined) {
  return useQuery({
    queryKey: ["writer-analytics", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      // Get total articles
      const { count: totalArticles } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId)
        .eq("published", true);

      // Get total followers
      const { count: totalFollowers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId);

      // Get article views from the last 6 months
      const sixMonthsAgo = subMonths(new Date(), 6);
      const { data: viewsData } = await supabase
        .from("article_views")
        .select("viewed_at, article_id, articles!inner(author_id)")
        .eq("articles.author_id", userId)
        .gte("viewed_at", sixMonthsAgo.toISOString());

      // Calculate total views
      const totalViews = viewsData?.length || 0;

      // Group views by month
      const viewsByMonth = new Map<string, number>();
      viewsData?.forEach((view) => {
        const month = format(new Date(view.viewed_at), "MMM yyyy");
        viewsByMonth.set(month, (viewsByMonth.get(month) || 0) + 1);
      });

      // Get follower growth over last 6 months
      const { data: followsData } = await supabase
        .from("follows")
        .select("created_at")
        .eq("author_id", userId)
        .gte("created_at", sixMonthsAgo.toISOString())
        .order("created_at");

      const followerGrowth = new Map<string, number>();
      let cumulativeFollowers = 0;
      followsData?.forEach((follow) => {
        const month = format(new Date(follow.created_at), "MMM yyyy");
        cumulativeFollowers++;
        followerGrowth.set(month, cumulativeFollowers);
      });

      // Get top articles
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, slug, views_count")
        .eq("author_id", userId)
        .eq("published", true)
        .order("views_count", { ascending: false })
        .limit(5);

      const topArticles = articlesData?.map((article) => ({
        id: article.id,
        title: article.title,
        views: article.views_count,
        slug: article.slug,
      })) || [];

      return {
        totalViews,
        totalArticles: totalArticles || 0,
        totalFollowers: totalFollowers || 0,
        viewsByMonth: Array.from(viewsByMonth.entries()).map(([month, views]) => ({
          month,
          views,
        })),
        followerGrowth: Array.from(followerGrowth.entries()).map(([month, followers]) => ({
          month,
          followers,
        })),
        topArticles,
      } as AnalyticsData;
    },
    enabled: !!userId,
  });
}

export function trackArticleView(articleId: string, userId: string | undefined) {
  return supabase.from("article_views").insert({
    article_id: articleId,
    viewer_id: userId || null,
  });
}
