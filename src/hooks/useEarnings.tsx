import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Earning {
  id: string;
  user_id: string;
  type: "ad_revenue" | "subscription" | "sponsorship" | "affiliate";
  amount: number;
  description: string | null;
  article_id: string | null;
  status: "pending" | "approved" | "paid";
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: string;
  user_id: string;
  amount: number;
  payment_method: "bank_transfer" | "paypal" | "stripe" | "crypto";
  transaction_id: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  requested_at: string;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useEarnings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["earnings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("earnings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Earning[];
    },
    enabled: !!user,
  });
}

export function useEarningsSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["earnings-summary", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("earnings")
        .select("type, amount, status")
        .eq("user_id", user.id);

      if (error) throw error;

      const earnings = data as Earning[];
      
      const summary = {
        total: 0,
        pending: 0,
        approved: 0,
        paid: 0,
        byType: {
          ad_revenue: 0,
          subscription: 0,
          sponsorship: 0,
          affiliate: 0,
        },
      };

      earnings.forEach((earning) => {
        const amount = Number(earning.amount);
        summary.total += amount;
        
        if (earning.status === "pending") summary.pending += amount;
        if (earning.status === "approved") summary.approved += amount;
        if (earning.status === "paid") summary.paid += amount;
        
        summary.byType[earning.type] += amount;
      });

      return summary;
    },
    enabled: !!user,
  });
}

export function usePayouts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payouts", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return data as Payout[];
    },
    enabled: !!user,
  });
}

export function useRequestPayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      payment_method,
    }: {
      amount: number;
      payment_method: "bank_transfer" | "paypal" | "stripe" | "crypto";
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("payouts")
        .insert({
          user_id: user.id,
          amount,
          payment_method,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast({
        title: "Payout requested",
        description: "Your payout request has been submitted successfully",
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
