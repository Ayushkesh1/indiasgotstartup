import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";

export interface SearchFilters {
  query: string;
  category?: string;
  authorId?: string;
  tagSlug?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "newest" | "oldest" | "most_viewed" | "most_popular";
}

export function useAdvancedSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ["advanced-search", filters],
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
        .eq("published", true);

      // Text search
      if (filters.query) {
        query = query.or(
          `title.ilike.%${filters.query}%,excerpt.ilike.%${filters.query}%`
        );
      }

      // Category filter
      if (filters.category && filters.category !== "All") {
        query = query.eq("category", filters.category as any);
      }

      // Author filter
      if (filters.authorId) {
        query = query.eq("author_id", filters.authorId);
      }

      // Date range filter
      if (filters.startDate) {
        query = query.gte("published_at", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("published_at", filters.endDate);
      }

      // Sorting
      switch (filters.sortBy) {
        case "oldest":
          query = query.order("published_at", { ascending: true });
          break;
        case "most_viewed":
          query = query.order("views_count", { ascending: false });
          break;
        case "most_popular":
          query = query.order("views_count", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("published_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // If tag filter is applied, filter client-side
      let results = data as Article[];

      if (filters.tagSlug) {
        const { data: tagData } = await supabase
          .from("article_tags")
          .select("article_id, tags!inner(slug)")
          .eq("tags.slug", filters.tagSlug);

        const articleIdsWithTag = new Set(tagData?.map((t) => t.article_id));
        results = results.filter((article) => articleIdsWithTag.has(article.id));
      }

      return results;
    },
  });
}
