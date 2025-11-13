import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { error } = await supabase.rpc("increment_ad_impressions", {
    ad_id: adId,
  });
  if (error) console.error("Error tracking impression:", error);
}

export async function trackAdClick(adId: string) {
  const { error } = await supabase.rpc("increment_ad_clicks", {
    ad_id: adId,
  });
  if (error) console.error("Error tracking click:", error);
}
