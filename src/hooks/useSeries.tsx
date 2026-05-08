import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface SeriesWithArticles extends Series {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    position: number;
    published: boolean;
  }>;
}

export function useUserSeries(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-series", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("article_series")
        .select(`
          *,
          series_articles(
            position,
            articles(id, title, slug, published)
          )
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to match SeriesWithArticles interface
      return (data || []).map((series: any) => ({
        ...series,
        articles: (series.series_articles || []).map((sa: any) => ({
          ...sa.articles,
          position: sa.position,
        })),
      })) as SeriesWithArticles[];
    },
    enabled: !!userId,
  });
}

export function useSeriesById(seriesId: string | undefined) {
  return useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      if (!seriesId) throw new Error("Series ID required");

      const { data, error } = await supabase
        .from("article_series")
        .select(`
          *,
          series_articles(
            position,
            articles(id, title, slug, excerpt, published, reading_time, featured_image_url)
          )
        `)
        .eq("id", seriesId)
        .single();

      if (error) throw error;
      
      // Transform data to match SeriesWithArticles interface
      return {
        ...data,
        articles: (data.series_articles || []).map((sa: any) => ({
          ...sa.articles,
          position: sa.position,
        })),
      } as SeriesWithArticles;
    },
    enabled: !!seriesId,
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      authorId,
    }: {
      title: string;
      description?: string;
      authorId: string;
    }) => {
      const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

      const { data, error } = await supabase
        .from("article_series")
        .insert({
          title,
          slug,
          description,
          author_id: authorId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { authorId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-series", authorId] });
      toast({
        title: "Series created",
        description: "Your new series has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      seriesId,
      title,
      description,
    }: {
      seriesId: string;
      title?: string;
      description?: string;
    }) => {
      const updates: any = {};
      if (title) {
        updates.title = title;
        updates.slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      }
      if (description !== undefined) updates.description = description;

      const { error } = await supabase
        .from("article_series")
        .update(updates)
        .eq("id", seriesId);

      if (error) throw error;
    },
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast({
        title: "Series updated",
        description: "Your series has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (seriesId: string) => {
      const { error } = await supabase
        .from("article_series")
        .delete()
        .eq("id", seriesId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast({
        title: "Series deleted",
        description: "Your series has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAddArticleToSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      const { error } = await supabase.from("series_articles").insert({
        series_id: seriesId,
        article_id: articleId,
        position,
      });

      if (error) throw error;
    },
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast({
        title: "Article added",
        description: "Article has been added to the series",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRemoveArticleFromSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
    }: {
      seriesId: string;
      articleId: string;
    }) => {
      const { error } = await supabase
        .from("series_articles")
        .delete()
        .eq("series_id", seriesId)
        .eq("article_id", articleId);

      if (error) throw error;
    },
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast({
        title: "Article removed",
        description: "Article has been removed from the series",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSeriesOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      seriesId,
      articles,
    }: {
      seriesId: string;
      articles: Array<{ articleId: string; position: number }>;
    }) => {
      const updates = articles.map((item) =>
        supabase
          .from("series_articles")
          .update({ position: item.position })
          .eq("series_id", seriesId)
          .eq("article_id", item.articleId)
      );

      await Promise.all(updates);
    },
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
      toast({
        title: "Order updated",
        description: "Article order has been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
