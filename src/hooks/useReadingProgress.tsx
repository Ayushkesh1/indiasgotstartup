import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash-es";

export interface ReadingProgress {
  id: string;
  user_id: string;
  article_id: string;
  scroll_position: number;
  progress_percentage: number;
  last_read_at: string;
}

export function useReadingProgress(articleId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["reading-progress", articleId, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("article_id", articleId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as ReadingProgress | null;
    },
    enabled: !!userId,
  });
}

export function useSaveReadingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      articleId,
      scrollPosition,
      progressPercentage,
    }: {
      userId: string;
      articleId: string;
      scrollPosition: number;
      progressPercentage: number;
    }) => {
      const { data, error } = await supabase
        .from("reading_progress")
        .upsert(
          {
            user_id: userId,
            article_id: articleId,
            scroll_position: scrollPosition,
            progress_percentage: progressPercentage,
            last_read_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,article_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reading-progress", variables.articleId, variables.userId],
      });
    },
  });
}

export function useTrackReadingProgress(
  articleId: string,
  userId: string | undefined,
  enabled: boolean = true
) {
  const saveProgress = useSaveReadingProgress();

  const debouncedSave = useCallback(
    debounce((scrollPos: number, progress: number) => {
      if (userId && enabled) {
        saveProgress.mutate({
          userId,
          articleId,
          scrollPosition: scrollPos,
          progressPercentage: progress,
        });
      }
    }, 2000),
    [userId, articleId, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);

      debouncedSave(scrollTop, progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      debouncedSave.cancel();
    };
  }, [enabled, debouncedSave]);
}
