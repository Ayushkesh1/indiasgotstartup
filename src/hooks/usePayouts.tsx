import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Payout {
  id: string;
  user_id: string;
  amount: number;
  points_redeemed: number;
  payment_method: string;
  status: string;
  requested_at: string;
  completed_at: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function usePayouts(userId: string | undefined) {
  return useQuery({
    queryKey: ["payouts", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Payout[];
    },
    enabled: !!userId,
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      amount,
      pointsRedeemed,
      paymentMethod,
    }: {
      userId: string;
      amount: number;
      pointsRedeemed: number;
      paymentMethod: string;
    }) => {
      const { error } = await supabase.from("payouts").insert({
        user_id: userId,
        amount,
        points_redeemed: pointsRedeemed,
        payment_method: paymentMethod,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["payouts", userId] });
      queryClient.invalidateQueries({ queryKey: ["earnings", userId] });
      toast({
        title: "Payout requested",
        description: "Your payout request has been submitted for review",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
