import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserEntity(userId: string | undefined, entityTable: "startups" | "incubators" | "investors") {
  return useQuery({
    queryKey: ["user_entity", userId, entityTable],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from(entityTable)
        .select("slug")
        .eq("owner_id", userId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error(`Error checking user ${entityTable}:`, error);
        return null;
      }
      return data;
    },
    enabled: !!userId,
  });
}
