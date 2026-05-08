import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleCategory } from "@/hooks/useArticles";

export function useRelatedArticles(category: ArticleCategory, currentArticleId: string) {
  return useQuery({
    queryKey: ["related-articles", category, currentArticleId],
    queryFn: async () => {
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
        .eq("category", category)
        .eq("published", true)
        .neq("id", currentArticleId)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Article[];
    },
  });
}
