import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";

export function useUserArticles(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-articles", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
    enabled: !!userId,
  });
}
