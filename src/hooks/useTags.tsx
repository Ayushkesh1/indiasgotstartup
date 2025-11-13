import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ArticleTag {
  id: string;
  article_id: string;
  tag_id: string;
  tags: Tag;
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Tag[];
    },
  });
}

export function useArticleTags(articleId: string) {
  return useQuery({
    queryKey: ["article-tags", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_tags")
        .select("*, tags(*)")
        .eq("article_id", articleId);

      if (error) throw error;
      return data as ArticleTag[];
    },
    enabled: !!articleId,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("tags")
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useAddTagToArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      tagId,
    }: {
      articleId: string;
      tagId: string;
    }) => {
      const { data, error } = await supabase
        .from("article_tags")
        .insert({ article_id: articleId, tag_id: tagId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article-tags", variables.articleId] });
    },
  });
}

export function useRemoveTagFromArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      tagId,
    }: {
      articleId: string;
      tagId: string;
    }) => {
      const { error } = await supabase
        .from("article_tags")
        .delete()
        .eq("article_id", articleId)
        .eq("tag_id", tagId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article-tags", variables.articleId] });
    },
  });
}

export function useArticlesByTag(tagSlug: string) {
  return useQuery({
    queryKey: ["articles-by-tag", tagSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_tags")
        .select(`
          articles!inner(
            *,
            profiles:author_id (
              full_name,
              avatar_url,
              bio
            )
          ),
          tags!inner(slug)
        `)
        .eq("tags.slug", tagSlug)
        .eq("articles.published", true);

      if (error) throw error;
      return data.map((item: any) => item.articles);
    },
    enabled: !!tagSlug,
  });
}
