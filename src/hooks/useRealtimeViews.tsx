import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeViews = (articleId: string) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial view count
    const fetchInitialCount = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("views_count")
        .eq("id", articleId)
        .single();

      if (!error && data) {
        setViewCount(data.views_count);
      }
      setIsLoading(false);
    };

    fetchInitialCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`article-views-${articleId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "articles",
          filter: `id=eq.${articleId}`,
        },
        (payload: any) => {
          if (payload.new?.views_count !== undefined) {
            setViewCount(payload.new.views_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  return { viewCount, isLoading };
};
