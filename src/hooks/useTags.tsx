import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags" as any)
        .select("*")
        .order("name");

      if (error) throw error;
      return ((data || []) as any) as Tag[];
    },
  });
};

export const useArticleTags = (articleId: string) => {
  return useQuery({
    queryKey: ["article-tags", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_tags" as any)
        .select(`
          *,
          tags:tag_id (
            id,
            name,
            slug
          )
        `)
        .eq("article_id", articleId);

      if (error) throw error;
      return (data as any[]).map((item: any) => item.tags).filter(Boolean) as Tag[];
    },
    enabled: !!articleId,
  });
};

export const useArticlesByTag = (tagSlug: string) => {
  return useQuery({
    queryKey: ["articles-by-tag", tagSlug],
    queryFn: async () => {
      // First get the tag
      const { data: tag, error: tagError } = await supabase
        .from("tags" as any)
        .select("id")
        .eq("slug", tagSlug)
        .single();

      if (tagError) throw tagError;

      // Then get article IDs with this tag
      const { data: articleTags, error: articleTagsError } = await supabase
        .from("article_tags" as any)
        .select("article_id")
        .eq("tag_id", (tag as any).id);

      if (articleTagsError) throw articleTagsError;

      const articleIds = (articleTags as any[]).map((at: any) => at.article_id);

      if (articleIds.length === 0) return [];

      // Finally get the full articles
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
        .in("id", articleIds)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (articlesError) throw articlesError;
      return articles;
    },
    enabled: !!tagSlug,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("tags" as any)
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({
        title: "Tag created",
        description: "The tag has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddTagToArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, tagId }: { articleId: string; tagId: string }) => {
      const { data, error } = await supabase
        .from("article_tags" as any)
        .insert({ article_id: articleId, tag_id: tagId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article-tags", variables.articleId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveTagFromArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, tagId }: { articleId: string; tagId: string }) => {
      const { error } = await supabase
        .from("article_tags" as any)
        .delete()
        .eq("article_id", articleId)
        .eq("tag_id", tagId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article-tags", variables.articleId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
