import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  current_month: string;
  pool: {
    total_subscribers: number;
    total_revenue: number;
    creator_pool: number;
    platform_revenue: number;
    total_engagement_points: number;
    is_finalized: boolean;
  };
  creator_earnings: Array<{
    id: string;
    creator_id: string;
    total_engagement_points: number;
    full_reads: number;
    comments: number;
    bookmarks: number;
    estimated_earnings: number;
    final_earnings: number | null;
    is_paid: boolean;
    profiles: {
      full_name: string;
      avatar_url: string;
    };
  }>;
  pending_payouts: Array<{
    id: string;
    creator_id: string;
    amount: number;
    status: string;
    payment_method: string;
    requested_at: string;
  }>;
  total_active_subscribers: number;
}

export function useAdminRevenueStats() {
  return useQuery({
    queryKey: ["admin-revenue-stats"],
    queryFn: async () => {
      const response = await supabase.functions.invoke("calculate-creator-earnings", {
        body: { action: "get_admin_stats" },
      });

      if (response.error) throw response.error;
      return response.data.data as AdminStats;
    },
  });
}

export function useCalculateMonthlyPool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (month_year?: string) => {
      const response = await supabase.functions.invoke("calculate-creator-earnings", {
        body: { action: "calculate_monthly_pool", month_year },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue-stats"] });
    },
  });
}

export function useCalculateEngagementPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (month_year?: string) => {
      const response = await supabase.functions.invoke("calculate-creator-earnings", {
        body: { action: "calculate_engagement_points", month_year },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue-stats"] });
    },
  });
}

export function useFinalizeMonth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (month_year?: string) => {
      const response = await supabase.functions.invoke("calculate-creator-earnings", {
        body: { action: "finalize_month", month_year },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue-stats"] });
    },
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payoutId,
      status,
      transaction_id,
      notes,
    }: {
      payoutId: string;
      status: "processing" | "completed" | "failed";
      transaction_id?: string;
      notes?: string;
    }) => {
      const updates: Record<string, unknown> = {
        status,
        notes,
        updated_at: new Date().toISOString(),
      };

      if (status === "processing") {
        updates.processed_at = new Date().toISOString();
      }

      if (status === "completed") {
        updates.completed_at = new Date().toISOString();
        updates.transaction_id = transaction_id;
      }

      const { error } = await supabase
        .from("creator_payouts" as any)
        .update(updates)
        .eq("id", payoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue-stats"] });
    },
  });
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: ["all-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
