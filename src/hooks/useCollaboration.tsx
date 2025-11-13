import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface Collaborator {
  id: string;
  user_id: string;
  permission: "view" | "edit" | "admin";
  invited_at: string;
  accepted_at: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ActiveUser {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  cursor_position: number;
}

export function useCollaboration(articleId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    fetchCollaborators();

    const channel = supabase
      .channel(`article:${articleId}`)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: ActiveUser[] = [];
        Object.keys(state).forEach(key => {
          const presences = state[key] as any[];
          presences.forEach(presence => {
            if (presence.user_id) {
              users.push(presence as ActiveUser);
            }
          });
        });
        setActiveUsers(users);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        toast({
          title: "User joined",
          description: `${newPresences[0]?.full_name || "Someone"} joined the article`,
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        toast({
          title: "User left",
          description: `${leftPresences[0]?.full_name || "Someone"} left the article`,
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

          await channel.track({
            user_id: user.id,
            full_name: profile?.full_name,
            avatar_url: profile?.avatar_url,
            cursor_position: 0,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, user]);

  const fetchCollaborators = async () => {
    if (!articleId) return;

    const { data, error } = await supabase
      .from("article_collaborators")
      .select("*")
      .eq("article_id", articleId);

    if (error) {
      console.error("Error fetching collaborators:", error);
    } else {
      setCollaborators((data || []) as Collaborator[]);
    }
    setLoading(false);
  };

  const inviteCollaborator = async (userEmail: string, permission: "view" | "edit" | "admin") => {
    if (!articleId || !user) return;

    // For now, show a toast - email lookup would require additional backend logic
    toast({
      title: "Feature coming soon",
      description: "Email-based collaboration invites will be available soon. For now, users need their user ID.",
    });
  };

  const removeCollaborator = async (collaboratorId: string) => {
    const { error } = await supabase
      .from("article_collaborators")
      .delete()
      .eq("id", collaboratorId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Collaborator removed",
      });
      fetchCollaborators();
    }
  };

  return {
    collaborators,
    activeUsers,
    loading,
    inviteCollaborator,
    removeCollaborator,
  };
}
