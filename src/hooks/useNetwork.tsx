import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useConnections = (userId?: string) => {
  return useQuery({
    queryKey: ['connections', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('connections')
        .select('*, sender:profiles!connections_sender_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useSendConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const { data, error } = await supabase
        .from('connections')
        .insert({ sender_id: senderId, receiver_id: receiverId, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connections', variables.senderId] });
      queryClient.invalidateQueries({ queryKey: ['connections', variables.receiverId] });
    }
  });
};

export const useUpdateConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    }
  });
};

export const useMessages = (userId1?: string, userId2?: string) => {
  return useQuery({
    queryKey: ['messages', userId1, userId2],
    queryFn: async () => {
      if (!userId1 || !userId2) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId1 && !!userId2,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ sender_id: senderId, receiver_id: receiverId, content })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.senderId, variables.receiverId] });
    }
  });
};
