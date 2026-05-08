import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useCollections(userId: string | undefined) {
  return useQuery({
    queryKey: ["collections", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Collection[];
    },
    enabled: !!userId,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collection: { 
      user_id: string; 
      name: string; 
      description?: string;
      is_public?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("collections")
        .insert(collection)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections", variables.user_id] });
      toast({
        title: "Collection created",
        description: "Your new reading list has been created",
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

export function useAddToCollection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ collectionId, bookmarkId }: { collectionId: string; bookmarkId: string }) => {
      const { error } = await supabase
        .from("collection_items")
        .insert({ collection_id: collectionId, bookmark_id: bookmarkId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection-items"] });
      toast({
        title: "Added to collection",
      });
    },
  });
}

export function useCollectionItems(collectionId: string | undefined) {
  return useQuery({
    queryKey: ["collection-items", collectionId],
    queryFn: async () => {
      if (!collectionId) throw new Error("Collection ID required");

      const { data, error } = await supabase
        .from("collection_items")
        .select(`
          *,
          bookmarks:bookmark_id (
            *,
            articles:article_id (
              id,
              title,
              slug,
              excerpt,
              category,
              reading_time,
              featured_image_url,
              profiles:author_id (
                full_name,
                avatar_url
              )
            )
          )
        `)
        .eq("collection_id", collectionId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!collectionId,
  });
}
