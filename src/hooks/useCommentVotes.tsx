import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommentVoteCount(commentId: string) {
  return useQuery({
    queryKey: ["comment-vote-count", commentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment_votes")
        .select("id", { count: "exact", head: false })
        .eq("comment_id", commentId);

      if (error) throw error;
      return data.length;
    },
  });
}

export function useUserCommentVote(commentId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["user-comment-vote", commentId, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("comment_votes")
        .select("id")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useToggleCommentVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      userId,
      hasVoted,
    }: {
      commentId: string;
      userId: string;
      hasVoted: boolean;
    }) => {
      if (hasVoted) {
        const { error } = await supabase
          .from("comment_votes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("comment_votes")
          .insert({ comment_id: commentId, user_id: userId });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comment-vote-count", variables.commentId] });
      queryClient.invalidateQueries({ queryKey: ["user-comment-vote", variables.commentId, variables.userId] });
    },
  });
}
