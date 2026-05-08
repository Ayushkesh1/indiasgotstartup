import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-role", userId],
    queryFn: async () => {
      if (!userId) return { isAdmin: false, isModerator: false, roles: [] };

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;

      const roles = data?.map((r) => r.role) || [];
      
      return {
        isAdmin: roles.includes("admin"),
        isModerator: roles.includes("moderator"),
        roles,
      };
    },
    enabled: !!userId,
  });
}
