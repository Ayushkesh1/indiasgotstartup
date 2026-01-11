import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  responded_at: string | null;
  response_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useContactQueries() {
  return useQuery({
    queryKey: ["contact-queries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_queries")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ContactQuery[];
    },
  });
}

export function useSubmitContactQuery() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (query: { name: string; email: string; subject?: string; message: string }) => {
      const { data, error } = await supabase
        .from("contact_queries")
        .insert(query)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "We'll get back to you soon!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateContactQuery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContactQuery> & { id: string }) => {
      const { data, error } = await supabase
        .from("contact_queries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      toast({ title: "Success", description: "Query updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteContactQuery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_queries")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      toast({ title: "Success", description: "Query deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
