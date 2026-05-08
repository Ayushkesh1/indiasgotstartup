import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFollows(authorId: string | undefined) {
  return useQuery({
    queryKey: ["follows", authorId],
    queryFn: async () => {
      if (!authorId) throw new Error("Author ID required");
      
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("author_id", authorId);

      if (error) throw error;
      return data;
    },
    enabled: !!authorId,
  });
}

export function useFollowStatus(authorId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ["follow-status", authorId, userId],
    queryFn: async () => {
      if (!authorId || !userId) return false;
      
      const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("author_id", authorId)
        .eq("follower_id", userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!authorId && !!userId,
  });
}

export function useFollowerCount(authorId: string | undefined) {
  return useQuery({
    queryKey: ["follower-count", authorId],
    queryFn: async () => {
      if (!authorId) throw new Error("Author ID required");
      
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("author_id", authorId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!authorId,
  });
}

export function useFollowingCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["following-count", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}

export function useFollowedAuthors(userId: string | undefined) {
  return useQuery({
    queryKey: ["followed-authors", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      const { data, error } = await supabase
        .from("follows")
        .select("author_id")
        .eq("follower_id", userId);

      if (error) throw error;
      return data.map(f => f.author_id);
    },
    enabled: !!userId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ authorId, userId, isFollowing }: { 
      authorId: string; 
      userId: string; 
      isFollowing: boolean;
    }) => {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("author_id", authorId)
          .eq("follower_id", userId);

        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({ author_id: authorId, follower_id: userId });

        if (error) throw error;
      }
      return !isFollowing;
    },
    onSuccess: (newStatus, { authorId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", authorId, userId] });
      queryClient.invalidateQueries({ queryKey: ["follower-count", authorId] });
      queryClient.invalidateQueries({ queryKey: ["following-count", userId] });
      queryClient.invalidateQueries({ queryKey: ["followed-authors", userId] });
      
      toast({
        title: newStatus ? "Following" : "Unfollowed",
        description: newStatus 
          ? "You'll now see articles from this author in your feed" 
          : "You've unfollowed this author",
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
}
