import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/imageCompression";

export type EcosystemEntity = "startups" | "incubators" | "investors" | "grants" | "events";

export interface ListFilters {
  search?: string;
  state?: string;
  city?: string;
  sector?: string;
  stage?: string;
  type?: string;
  status?: "approved" | "pending" | "rejected" | "all";
  isHiring?: boolean;
  ownerOnly?: boolean;
  ownerId?: string;
}

export function useEcosystemList(entity: EcosystemEntity, filters: ListFilters = {}) {
  return useQuery({
    queryKey: [entity, filters],
    queryFn: async () => {
      try {
        let q: any = (supabase as any).from(entity).select("*").order("created_at", { ascending: false });
        const status = filters.status ?? "approved";
        if (filters.ownerOnly && filters.ownerId) {
          q = q.eq("owner_id", filters.ownerId);
        } else if (status !== "all") {
          q = q.eq("status", status);
        }
        if (filters.search) q = q.ilike("name", `%${filters.search}%`);
        if (filters.state) q = q.eq("state", filters.state);
        if (filters.city) q = q.eq("city", filters.city);
        if (filters.sector) q = q.eq("sector", filters.sector);
        if (filters.stage) q = q.eq("stage", filters.stage);
        if (filters.type) q = q.eq("type", filters.type);
        if (filters.isHiring) q = q.eq("is_hiring", true);
        const { data, error } = await q.limit(200);
        if (error) {
          if (error.code === '42P01') {
            console.warn(`Table ${entity} does not exist yet.`);
            return [];
          }
          throw error;
        }

        // Filter out "test" or "demo" entries for public view
        if (status !== "all") {
          return (data || []).filter((item: any) => {
            const name = (item.name || item.title || "").toLowerCase();
            return !name.includes("test") && !name.includes("demo");
          });
        }

        return data || [];
      } catch (err) {
        console.warn(`Error fetching ${entity}:`, err);
        return [];
      }
    },
  });
}

export function useEcosystemBySlug(entity: EcosystemEntity, slug: string | undefined) {
  return useQuery({
    queryKey: [entity, "slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await (supabase as any)
        .from(entity)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useStartupTeam(startupId: string | undefined) {
  return useQuery({
    queryKey: ["startup_team", startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await (supabase as any)
        .from("startup_team")
        .select("*")
        .eq("startup_id", startupId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

export function useIncubatorPrograms(incubatorId: string | undefined) {
  return useQuery({
    queryKey: ["incubator_programs", incubatorId],
    queryFn: async () => {
      if (!incubatorId) return [];
      const { data, error } = await (supabase as any)
        .from("incubator_programs")
        .select("*")
        .eq("incubator_id", incubatorId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!incubatorId,
  });
}

export function useIncubatorMentors(incubatorId: string | undefined) {
  return useQuery({
    queryKey: ["incubator_mentors", incubatorId],
    queryFn: async () => {
      if (!incubatorId) return [];
      const { data, error } = await (supabase as any)
        .from("incubator_mentors")
        .select("*")
        .eq("incubator_id", incubatorId)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!incubatorId,
  });
}

export type ChildTable = "startup_team" | "incubator_programs" | "incubator_mentors";

export function useAddChildRow(table: ChildTable, parentKey: string, parentId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await (supabase as any).from(table).insert({ ...payload, [parentKey]: parentId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table, parentId] });
      toast({ title: "Added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteChildRow(table: ChildTable, parentId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table, parentId] });
      toast({ title: "Removed" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useCreateEntity(entity: EcosystemEntity) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await (supabase as any)
        .from(entity)
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [entity] });
      toast({ title: "Submitted!", description: "Your submission is pending admin review." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateEntity(entity: EcosystemEntity) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await (supabase as any)
        .from(entity)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [entity] });
      toast({ title: "Updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteEntity(entity: EcosystemEntity) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(entity).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [entity] });
      toast({ title: "Deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uploadEcosystemMedia(userId: string, file: File, kind: "logo" | "banner") {
  // Compress image before uploading
  const compressedFile = await compressImage(file, {
    maxSizeMB: kind === "logo" ? 0.5 : 2, // Logos need less space
    maxWidthOrHeight: kind === "logo" ? 512 : 1920,
  });

  const ext = compressedFile.name.split(".").pop() || 'jpg';
  const path = `${userId}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("ecosystem-media").upload(path, compressedFile, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("ecosystem-media").getPublicUrl(path);
  return data.publicUrl;
}
