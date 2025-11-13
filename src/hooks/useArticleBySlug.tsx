import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url,
            bio,
            twitter_handle,
            linkedin_url
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Article not found");

      return data as Article;
    },
    enabled: !!slug,
  });
}

export async function incrementArticleViews(articleId: string) {
  const { data: currentArticle } = await supabase
    .from("articles")
    .select("views_count")
    .eq("id", articleId)
    .single();

  if (currentArticle) {
    const { error } = await supabase
      .from("articles")
      .update({ views_count: currentArticle.views_count + 1 })
      .eq("id", articleId);

    if (error) console.error("Error incrementing views:", error);
  }
}
