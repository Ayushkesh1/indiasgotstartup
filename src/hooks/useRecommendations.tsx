import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleCategory } from "@/hooks/useArticles";

export function useRecommendations(userId: string | undefined) {
  return useQuery({
    queryKey: ["recommendations", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      // Get user's reading history (bookmarked and read articles)
      const { data: readArticles } = await supabase
        .from("bookmarks")
        .select("article_id, articles:article_id(category)")
        .eq("user_id", userId)
        .eq("is_read", true);

      if (!readArticles || readArticles.length === 0) {
        // If no reading history, return trending articles
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
          .limit(6);

        if (error) throw error;
        return data as Article[];
      }

      // Count category preferences
      const categoryCount: Record<string, number> = {};
      readArticles.forEach((item: any) => {
        const category = item.articles?.category;
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      // Get top 2 categories
      const topCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([category]) => category) as ArticleCategory[];

      // Get already bookmarked article IDs
      const { data: bookmarked } = await supabase
        .from("bookmarks")
        .select("article_id")
        .eq("user_id", userId);

      const bookmarkedIds = bookmarked?.map((b) => b.article_id) || [];

      // Fetch recommendations from preferred categories
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
        .in("category", topCategories)
        .eq("published", true)
        .not("id", "in", `(${bookmarkedIds.join(",")})`)
        .order("published_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Article[];
    },
    enabled: !!userId,
  });
}
