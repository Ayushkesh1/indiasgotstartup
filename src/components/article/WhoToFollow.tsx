import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import FollowButton from "@/components/FollowButton";

interface SuggestedAuthor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  article_count: number;
}

interface WhoToFollowProps {
  currentAuthorId?: string;
  currentUserId?: string;
}

export const WhoToFollow = ({ currentAuthorId, currentUserId }: WhoToFollowProps) => {
  const { data: suggestedAuthors, isLoading } = useQuery({
    queryKey: ["suggested-authors", currentAuthorId, currentUserId],
    queryFn: async () => {
      // Get authors with most articles, excluding current author and current user
      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("author_id")
        .eq("published", true);

      if (articlesError) throw articlesError;

      // Count articles per author
      const authorCounts: Record<string, number> = {};
      articlesData?.forEach(article => {
        authorCounts[article.author_id] = (authorCounts[article.author_id] || 0) + 1;
      });

      // Get top authors by article count
      const sortedAuthors = Object.entries(authorCounts)
        .filter(([id]) => id !== currentAuthorId && id !== currentUserId)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      if (sortedAuthors.length === 0) return [];

      // Get author profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, bio")
        .in("id", sortedAuthors);

      if (profilesError) throw profilesError;

      // Combine with article counts
      return profiles?.map(profile => ({
        ...profile,
        article_count: authorCounts[profile.id] || 0
      })).sort((a, b) => b.article_count - a.article_count) || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!suggestedAuthors || suggestedAuthors.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedAuthors.map((author) => (
          <div key={author.id} className="flex items-center gap-3">
            <Link to={`/author/${author.id}`}>
              <Avatar className="h-10 w-10 hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={author.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {author.full_name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link 
                to={`/author/${author.id}`}
                className="font-medium text-sm hover:text-primary transition-colors truncate block"
              >
                {author.full_name || "Anonymous"}
              </Link>
              <p className="text-xs text-muted-foreground">
                {author.article_count} article{author.article_count !== 1 ? "s" : ""}
              </p>
            </div>
            <FollowButton authorId={author.id} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
