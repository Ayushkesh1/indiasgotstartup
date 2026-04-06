import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleCategory } from "./useArticles";

export function useAdminArticles(category?: string | ArticleCategory) {
  return useQuery({
    queryKey: ["admin_articles", category],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url,
            bio
          )
        `)
        .order("created_at", { ascending: false }); // Drafts might not have published_at

      if (category && category !== "All") {
        query = query.eq("category", category as ArticleCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Article[];
    },
  });
}
