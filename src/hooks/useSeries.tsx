import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Series {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface SeriesWithArticles extends Series {
  series_articles: {
    position: number;
    articles: {
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      featured_image_url: string | null;
    };
  }[];
}

export function useUserSeries(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-series", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("article_series")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Series[];
    },
    enabled: !!userId,
  });
}

export function useSeriesById(seriesId: string) {
  return useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_series")
        .select(`
          *,
          series_articles (
            position,
            articles (
              id,
              title,
              slug,
              excerpt,
              featured_image_url
            )
          )
        `)
        .eq("id", seriesId)
        .single();

      if (error) throw error;
      return data as SeriesWithArticles;
    },
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      authorId,
    }: {
      title: string;
      description: string;
      authorId: string;
    }) => {
      const slug = title.toLowerCase().replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("article_series")
        .insert({
          title,
          description,
          author_id: authorId,
          slug,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Series;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-series", variables.authorId] });
    },
  });
}

export function useAddArticleToSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
      position,
    }: {
      seriesId: string;
      articleId: string;
      position: number;
    }) => {
      const { data, error } = await supabase
        .from("series_articles")
        .insert({
          series_id: seriesId,
          article_id: articleId,
          position,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["series", variables.seriesId] });
    },
  });
}
