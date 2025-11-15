import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Comment {
  id: string;
  article_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  is_owner: boolean;
  replies?: Comment[];
}

export function useComments(articleId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments_public")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Organize comments into a tree structure
      const commentsMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach((comment: any) => {
        commentsMap.set(comment.id, { ...comment, replies: [] });
      });

      data.forEach((comment: any) => {
        const commentWithReplies = commentsMap.get(comment.id)!;
        if (comment.parent_comment_id) {
          const parent = commentsMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      return rootComments;
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("comments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `article_id=eq.${articleId}`,
        },
        () => {
          // Refetch comments when any change occurs
          queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, queryClient]);

  return query;
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      userId,
      content,
      parentCommentId,
    }: {
      articleId: string;
      userId: string;
      content: string;
      parentCommentId?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          article_id: articleId,
          user_id: userId,
          content,
          parent_comment_id: parentCommentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.articleId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, articleId }: { commentId: string; articleId: string }) => {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.articleId] });
    },
  });
}
