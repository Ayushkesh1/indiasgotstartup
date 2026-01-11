import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface CreatorStats {
  current_month: {
    month_year: string;
    engagement_points: number;
    full_reads: number;
    comments: number;
    bookmarks: number;
    long_read_bonuses: number;
    estimated_earnings: number;
  };
  last_month: {
    month_year: string;
    final_earnings: number;
    engagement_points: number;
  };
  pending_balance: number;
  can_request_payout: boolean;
  min_payout_threshold: number;
  pool_info: {
    creator_pool: number;
    total_engagement_points: number;
  };
}

export function useCreatorStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creator-stats", user?.id],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await supabase.functions.invoke("calculate-creator-earnings", {
        body: { action: "get_creator_stats" },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.error) throw response.error;
      return response.data.data as CreatorStats;
    },
    enabled: !!user,
  });
}

export function useTrackEngagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      event_type,
      article_id,
      reading_time,
    }: {
      event_type: "full_read" | "comment" | "bookmark" | "long_read_bonus";
      article_id: string;
      reading_time?: number;
    }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        console.log("No auth token, skipping engagement tracking");
        return null;
      }

      const response = await supabase.functions.invoke("track-engagement", {
        body: { event_type, article_id, reading_time },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] });
    },
  });
}

interface CreatorPaymentInfo {
  id: string;
  creator_id: string;
  upi_id: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_account_name: string | null;
  preferred_method: string | null;
  created_at: string;
  updated_at: string;
}

export function useCreatorPaymentInfo() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creator-payment-info", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      const { data, error } = await supabase
        .from("creator_payment_info" as any)
        .select("*")
        .eq("creator_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as CreatorPaymentInfo | null;
    },
    enabled: !!user,
  });
}

export function useUpdatePaymentInfo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (info: {
      upi_id?: string;
      bank_account_number?: string;
      bank_ifsc?: string;
      bank_account_name?: string;
      preferred_method: string;
    }) => {
      if (!user) throw new Error("User required");

      const { error } = await supabase
        .from("creator_payment_info" as any)
        .upsert({
          creator_id: user.id,
          ...info,
          updated_at: new Date().toISOString(),
        }, { onConflict: "creator_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-payment-info"] });
    },
  });
}

export function useRequestCreatorPayout() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      amount,
      payment_method,
      payment_details,
    }: {
      amount: number;
      payment_method: string;
      payment_details: Record<string, string>;
    }) => {
      if (!user) throw new Error("User required");

      const { error } = await supabase
        .from("creator_payouts" as any)
        .insert({
          creator_id: user.id,
          amount,
          payment_method,
          payment_details,
          status: "pending",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] });
      queryClient.invalidateQueries({ queryKey: ["creator-payouts"] });
    },
  });
}

export function useCreatorPayouts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creator-payouts", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      const { data, error } = await supabase
        .from("creator_payouts" as any)
        .select("*")
        .eq("creator_id", user.id)
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User required");

      const { data, error } = await supabase
        .from("subscriptions" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
