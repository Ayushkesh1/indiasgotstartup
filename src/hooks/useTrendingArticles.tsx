import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";
import { subDays } from "date-fns";

export function useTrendingArticles(limit: number = 5) {
  return useQuery({
    queryKey: ["trending-articles", limit],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      // Get articles with views in the last 7 days
      const { data: recentViews } = await supabase
        .from("article_views")
        .select("article_id")
        .gte("viewed_at", sevenDaysAgo);

      // Count views per article
      const viewCounts = new Map<string, number>();
      recentViews?.forEach((view) => {
        viewCounts.set(view.article_id, (viewCounts.get(view.article_id) || 0) + 1);
      });

      // Get top article IDs
      const sortedArticles = Array.from(viewCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([articleId]) => articleId);

      if (sortedArticles.length === 0) {
        // Fallback to most viewed articles overall
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            profiles:author_id (
              full_name,
              avatar_url,
              bio
            )
          `)
          .eq("published", true)
          .order("views_count", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data as Article[];
      }

      // Fetch full article data
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url,
            bio
          )
        `)
        .in("id", sortedArticles)
        .eq("published", true);

      if (error) throw error;

      // Sort by the order we determined from view counts
      const sortedData = sortedArticles
        .map((id) => data?.find((article) => article.id === id))
        .filter(Boolean) as Article[];

      return sortedData;
    },
  });
}
