import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToggleFollow } from "@/hooks/useFollows";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserMinus, Users, Loader2, Newspaper } from "lucide-react";
import { toast } from "sonner";
import NewsCard from "@/components/NewsCard";

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

  // Get articles from followed authors
  const authorIds = followedAuthors?.map((f) => f.author_id) || [];
  
  const { data: feedArticles, isLoading: isFeedLoading } = useQuery({
    queryKey: ["following-feed", authorIds],
    queryFn: async () => {
      if (authorIds.length === 0) return [];

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          category,
          reading_time,
          views_count,
          published_at,
          author_id,
          profiles!articles_author_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .in("author_id", authorIds)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: authorIds.length > 0,
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
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="feed" className="gap-2">
              <Newspaper className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="authors" className="gap-2">
              <Users className="h-4 w-4" />
              Authors ({followedAuthors?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <Card>
              <CardHeader>
                <CardTitle>Latest from Authors You Follow</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading || isFeedLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : feedArticles && feedArticles.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {feedArticles.map((article) => (
                      <NewsCard
                        key={article.id}
                        title={article.title}
                        description={article.excerpt || ""}
                        category={article.category}
                        thumbnail={article.featured_image_url || "/placeholder.svg"}
                        readTime={`${article.reading_time} min read`}
                        date={new Date(article.published_at || "").toLocaleDateString()}
                        source={(article.profiles as any)?.full_name || "Anonymous"}
                        author={(article.profiles as any)?.full_name || "Anonymous"}
                        authorImage={(article.profiles as any)?.avatar_url}
                        authorId={article.author_id}
                        sourceUrl={`/article/${article.slug}`}
                        articleId={article.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {followedAuthors?.length === 0
                        ? "Follow some authors to see their latest articles here"
                        : "No articles yet from authors you follow"}
                    </p>
                    <Button onClick={() => navigate("/")}>Discover Authors</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authors">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
