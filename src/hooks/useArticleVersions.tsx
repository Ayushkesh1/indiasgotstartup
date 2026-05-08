import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ArticleVersion {
  id: string;
  article_id: string;
  version_number: number;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  created_at: string;
  created_by: string;
}

export const useArticleVersions = (articleId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["article-versions", articleId],
    queryFn: async () => {
      if (!articleId) return [];
      
      const { data, error } = await supabase
        .from("article_versions")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ArticleVersion[];
    },
    enabled: !!articleId,
  });

  const saveVersion = useMutation({
    mutationFn: async ({
      articleId,
      title,
      content,
      excerpt,
      featuredImageUrl,
      category,
      userId,
    }: {
      articleId: string;
      title: string;
      content: string;
      excerpt?: string;
      featuredImageUrl?: string;
      category?: string;
      userId: string;
    }) => {
      // Get the latest version number
      const { data: latestVersion } = await supabase
        .from("article_versions")
        .select("version_number")
        .eq("article_id", articleId)
        .order("version_number", { ascending: false })
        .limit(1)
        .single();

      const newVersionNumber = (latestVersion?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from("article_versions")
        .insert({
          article_id: articleId,
          version_number: newVersionNumber,
          title,
          content,
          excerpt,
          featured_image_url: featuredImageUrl,
          category,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-versions", articleId] });
      toast({
        title: "Version saved",
        description: "A new version has been created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving version",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const restoreVersion = useCallback(async (version: ArticleVersion) => {
    return {
      title: version.title,
      content: typeof version.content === 'string' ? version.content : JSON.stringify(version.content),
      excerpt: version.excerpt || "",
      featuredImageUrl: version.featured_image_url || "",
      category: version.category || "Tech",
    };
  }, []);

  return {
    versions,
    isLoading,
    saveVersion,
    restoreVersion,
  };
};
