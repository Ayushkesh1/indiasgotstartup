import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Earning {
  id: string;
  user_id: string;
  article_id: string | null;
  amount: number;
  points: number;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useEarnings(userId: string | undefined) {
  return useQuery({
    queryKey: ["earnings", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("earnings" as any)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Earning[];
    },
    enabled: !!userId,
  });
}

export function useEarningsStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["earnings-stats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("earnings" as any)
        .select("amount, status")
        .eq("user_id", userId);

      if (error) throw error;

      const total = data.reduce((sum: number, earning: any) => sum + Number(earning.amount), 0);
      const pending = data
        .filter((e: any) => e.status === "pending")
        .reduce((sum: number, earning: any) => sum + Number(earning.amount), 0);
      const paid = data
        .filter((e: any) => e.status === "paid")
        .reduce((sum: number, earning: any) => sum + Number(earning.amount), 0);

      return { total, pending, paid, count: data.length };
    },
    enabled: !!userId,
  });
}
