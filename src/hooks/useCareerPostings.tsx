import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CareerPosting {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string;
  requirements: string | null;
  salary_range: string | null;
  is_active: boolean;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface JobApplication {
  id: string;
  career_posting_id: string | null;
  applicant_name: string;
  applicant_email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  career_posting?: CareerPosting;
}

export function useCareerPostings() {
  return useQuery({
    queryKey: ["career-postings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("career_postings")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CareerPosting[];
    },
  });
}

export function useCreateCareerPosting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (posting: Omit<CareerPosting, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("career_postings")
        .insert(posting)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-postings"] });
      toast({ title: "Success", description: "Job posting created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCareerPosting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CareerPosting> & { id: string }) => {
      const { data, error } = await supabase
        .from("career_postings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-postings"] });
      toast({ title: "Success", description: "Job posting updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteCareerPosting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("career_postings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-postings"] });
      toast({ title: "Success", description: "Job posting deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useJobApplications() {
  return useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*, career_posting:career_postings(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as JobApplication[];
    },
  });
}

export function useUpdateJobApplication() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobApplication> & { id: string }) => {
      const { data, error } = await supabase
        .from("job_applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      toast({ title: "Success", description: "Application updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
