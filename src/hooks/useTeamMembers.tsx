import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  display_order: number;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

interface AdminActivity {
  id: string;
  team_member_id: string;
  action_description: string;
  affected_module: string;
  created_at: string;
  team_member: { name: string; image_url: string | null } | null;
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });
}

export function useCreateTeamMember() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: Omit<TeamMember, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("team_members")
        .insert(member)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Success", description: "Team member added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateTeamMember() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMember> & { id: string }) => {
      const { data, error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Success", description: "Team member updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteTeamMember() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Success", description: "Team member deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useAdminActivityLog() {
  return useQuery({
    queryKey: ["admin-activities"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("admin_activity_log")
        .select("*, team_member:team_members(name, image_url)")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AdminActivity[];
    },
  });
}

export function useLogAdminActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: { team_member_id: string; action_description: string; affected_module: string }) => {
      const { data, error } = await (supabase as any)
        .from("admin_activity_log")
        .insert(activity)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
    }
  });
}
