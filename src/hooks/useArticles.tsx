import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  category: string;
  reading_time: number;
  featured_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export function useArticles(category?: string) {
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
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Article[];
    },
  });
}
