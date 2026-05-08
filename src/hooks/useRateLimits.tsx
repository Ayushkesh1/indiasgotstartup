import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RateLimit {
  function_name: string;
  request_count: number;
  window_start: string;
}

interface RateLimitInfo {
  functionName: string;
  used: number;
  limit: number;
  remaining: number;
  resetTime: Date;
  percentageUsed: number;
}

const RATE_LIMITS: Record<string, number> = {
  "profile-assistant": 10,
  "translate-article": 5,
};

export function useRateLimits(userId: string | undefined) {
  return useQuery({
    queryKey: ["rate-limits", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("function_rate_limits")
        .select("*")
        .eq("user_id", userId)
        .gte("window_start", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const rateLimits: RateLimitInfo[] = Object.keys(RATE_LIMITS).map((functionName) => {
        const record = data?.find(
          (r: RateLimit) => r.function_name === functionName
        );
        
        const limit = RATE_LIMITS[functionName];
        const used = record?.request_count || 0;
        const remaining = Math.max(0, limit - used);
        const resetTime = record?.window_start 
          ? new Date(new Date(record.window_start).getTime() + 60 * 60 * 1000)
          : new Date(Date.now() + 60 * 60 * 1000);
        const percentageUsed = (used / limit) * 100;

        return {
          functionName,
          used,
          limit,
          remaining,
          resetTime,
          percentageUsed,
        };
      });

      return rateLimits;
    },
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute
  });
}
