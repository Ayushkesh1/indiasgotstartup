import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrendingArticles = (limit: number = 5) => {
  return useQuery({
    queryKey: ["trending-articles", limit],
    queryFn: async () => {
      // Get article IDs with most views in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: viewsData, error: viewsError } = await supabase
        .from("article_views" as any)
        .select("article_id")
        .gte("viewed_at", sevenDaysAgo.toISOString());

      if (viewsError) throw viewsError;

      // Count views per article
      const viewCounts = (viewsData as any[]).reduce((acc: Record<string, number>, view: any) => {
        acc[view.article_id] = (acc[view.article_id] || 0) + 1;
        return acc;
      }, {});

      // Sort by view count and get top article IDs
      const topArticleIds = Object.entries(viewCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, limit)
        .map(([id]) => id);

      if (topArticleIds.length === 0) {
        // Fallback to most recent published articles
        const { data: recentArticles, error: recentError } = await supabase
          .from("articles")
          .select(`
            *,
            profiles:author_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(limit);

        if (recentError) throw recentError;
        return recentArticles || [];
      }

      // Fetch full article data
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .in("id", topArticleIds)
        .eq("published", true);

      if (articlesError) throw articlesError;

      // Sort articles by the original view count order
      const sortedArticles = topArticleIds
        .map(id => articles?.find((a: any) => a.id === id))
        .filter(Boolean);

      return sortedArticles;
    },
  });
};
