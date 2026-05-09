import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  twitter_handle: string | null;
  linkedin_url: string | null;
  primary_role: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      // Use select(*) to avoid "column does not exist" crashes if schema is out of sync
      let profileData = null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      } else {
        // Fallback to profiles_public view if profiles fails
        const { data: pubData, error: pubError } = await supabase
          .from("profiles_public")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (pubError) throw pubError;
        profileData = pubData;
      }

      if (!profileData) return null;

      // If primary_role is missing from the database schema, fallback to JWT metadata
      if (profileData.primary_role === undefined) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === userId) {
          profileData.primary_role = session.user.user_metadata?.primary_role || 'normal';
        } else {
          profileData.primary_role = 'normal';
        }
      }

      return profileData as Profile;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
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

export function useAllProfiles() {
  return useQuery({
    queryKey: ["profiles_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles_public")
        .select("id, full_name, bio, avatar_url, username")
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
}
