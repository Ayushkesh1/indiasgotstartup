import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: string;
  target_segment: string;
  sent_at: string | null;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
  created_at: string;
  updated_at: string;
}

export function useNewsletterCampaigns() {
  return useQuery({
    queryKey: ["newsletter-campaigns"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("newsletter_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NewsletterCampaign[];
    },
  });
}

export function useCreateCampaign() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: Omit<NewsletterCampaign, "id" | "sent_at" | "open_rate" | "click_rate" | "unsubscribe_rate" | "created_at" | "updated_at">) => {
      const { data, error } = await (supabase as any)
        .from("newsletter_campaigns")
        .insert(campaign)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
      toast({ title: "Success", description: "Campaign drafted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCampaign() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsletterCampaign> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from("newsletter_campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
      toast({ title: "Success", description: "Campaign updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useSendCampaign() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock metrics for prototype visualization (parsed as float because TS expects number)
      const mockOpen = parseFloat((20 + Math.random() * 40).toFixed(2));
      const mockClick = parseFloat((2 + Math.random() * 10).toFixed(2));
      const mockUnsubscribe = parseFloat((0.1 + Math.random() * 2).toFixed(2));

      const { data, error } = await (supabase as any)
        .from("newsletter_campaigns")
        .update({ 
          status: "sent", 
          sent_at: new Date().toISOString(),
          open_rate: mockOpen,
          click_rate: mockClick,
          unsubscribe_rate: mockUnsubscribe
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
      toast({ title: "Campaign Deployed", description: "The newsletter has been sent to the target segment." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteCampaign() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("newsletter_campaigns")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] });
      toast({ title: "Success", description: "Campaign deleted" });
    },
  });
}
