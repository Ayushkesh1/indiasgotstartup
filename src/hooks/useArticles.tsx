import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ArticleCategory = 
  | "Fintech"
  | "Tech"
  | "Blockchain"
  | "eCommerce"
  | "Government"
  | "Edtech"
  | "Funding"
  | "Mobility";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  category: ArticleCategory;
  reading_time: number;
  featured_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  views_count: number;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export function useArticles(category?: string | ArticleCategory) {
  return useQuery({
    queryKey: ["articles", category],
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
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (category && category !== "All") {
        query = query.eq("category", category as ArticleCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Article[];
    },
  });
}
