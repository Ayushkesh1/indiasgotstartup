import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Advertisement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string;
  bid_amount: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export function useAdvertisements() {
  return useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("is_active", true)
        .order("bid_amount", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Advertisement[];
    },
  });
}

export async function trackAdImpression(adId: string) {
  const { data: currentAd } = await supabase
    .from("advertisements")
    .select("impressions")
    .eq("id", adId)
    .single();

  if (currentAd) {
    const { error } = await supabase
      .from("advertisements")
      .update({ impressions: currentAd.impressions + 1 })
      .eq("id", adId);

    if (error) console.error("Error tracking impression:", error);
  }
}

export async function trackAdClick(adId: string) {
  const { data: currentAd } = await supabase
    .from("advertisements")
    .select("clicks")
    .eq("id", adId)
    .single();

  if (currentAd) {
    const { error } = await supabase
      .from("advertisements")
      .update({ clicks: currentAd.clicks + 1 })
      .eq("id", adId);

    if (error) console.error("Error tracking click:", error);
  }
}

export function useUserAdvertisements(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-advertisements", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Advertisement[];
    },
    enabled: !!userId,
  });
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ad: {
      user_id: string;
      title: string;
      description?: string;
      image_url: string;
      link_url: string;
      bid_amount: number;
      is_active?: boolean;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from("advertisements")
        .insert(ad)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-advertisements", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({
        title: "Advertisement created",
        description: "Your ad has been created successfully",
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

export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Advertisement> }) => {
      const { data, error } = await supabase
        .from("advertisements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({
        title: "Advertisement updated",
        description: "Your ad has been updated successfully",
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

export function useDeleteAdvertisement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("advertisements").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({
        title: "Advertisement deleted",
        description: "Your ad has been deleted successfully",
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
