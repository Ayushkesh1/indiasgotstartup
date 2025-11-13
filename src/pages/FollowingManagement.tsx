import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToggleFollow } from "@/hooks/useFollows";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserMinus, Users } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FollowedAuthor {
  id: string;
  author_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export default function FollowingManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toggleFollow = useToggleFollow();

  const { data: followedAuthors, isLoading } = useQuery({
    queryKey: ["following", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("follows")
        .select(`
          id,
          author_id,
          profiles!follows_author_id_fkey (
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq("follower_id", user.id);

      if (error) throw error;
      return data as FollowedAuthor[];
    },
    enabled: !!user?.id,
  });

  const handleUnfollow = (authorId: string) => {
    if (!user?.id) return;

    toggleFollow.mutate(
      {
        authorId,
        userId: user.id,
        isFollowing: true,
      },
      {
        onSuccess: () => {
          toast.success("Unfollowed successfully");
        },
        onError: () => {
          toast.error("Failed to unfollow");
        },
      }
    );
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Following ({followedAuthors?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : followedAuthors && followedAuthors.length > 0 ? (
              <div className="space-y-4">
                {followedAuthors.map((follow) => (
                  <div
                    key={follow.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => navigate(`/author/${follow.author_id}`)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={follow.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {follow.profiles.full_name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {follow.profiles.full_name || "Anonymous"}
                        </h3>
                        {follow.profiles.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {follow.profiles.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(follow.author_id)}
                      disabled={toggleFollow.isPending}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You're not following any authors yet
                </p>
                <Button onClick={() => navigate("/")}>Discover Authors</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
