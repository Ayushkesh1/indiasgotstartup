import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Bookmark {
  id: string;
  user_id: string;
  article_id: string;
  is_read: boolean;
  bookmarked_at: string;
  read_at: string | null;
  articles: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string;
    reading_time: number;
    featured_image_url: string | null;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
}

export function useBookmarks(userId: string | undefined) {
  return useQuery({
    queryKey: ["bookmarks", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          *,
          articles:article_id (
            id,
            title,
            slug,
            excerpt,
            category,
            reading_time,
            featured_image_url,
            profiles:author_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("bookmarked_at", { ascending: false });

      if (error) throw error;
      return data as Bookmark[];
    },
    enabled: !!userId,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, articleId }: { userId: string; articleId: string }) => {
      // Check if bookmark exists
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("article_id", articleId)
        .maybeSingle();

      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        return { action: "removed" };
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: userId, article_id: articleId });

        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", variables.userId] });
      toast({
        title: data.action === "added" ? "Bookmark added" : "Bookmark removed",
        description: data.action === "added" 
          ? "Article saved to your reading list" 
          : "Article removed from your reading list",
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

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookmarkId, isRead }: { bookmarkId: string; isRead: boolean }) => {
      const { error } = await supabase
        .from("bookmarks")
        .update({ 
          is_read: isRead,
          read_at: isRead ? new Date().toISOString() : null 
        })
        .eq("id", bookmarkId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast({
        title: variables.isRead ? "Marked as read" : "Marked as unread",
      });
    },
  });
}
