import { Link } from "react-router-dom";
import { Hash, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const TrendingTopics = () => {
  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      // Get article_tags with counts
      const { data: tagCounts, error: countError } = await supabase
        .from("article_tags")
        .select("tag_id");

      if (countError) throw countError;

      // Count occurrences
      const counts: Record<string, number> = {};
      tagCounts?.forEach(t => {
        counts[t.tag_id] = (counts[t.tag_id] || 0) + 1;
      });

      // Get top tag IDs
      const topTagIds = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([id]) => id);

      if (topTagIds.length === 0) return [];

      // Fetch tag details
      const { data: tags, error: tagsError } = await supabase
        .from("tags")
        .select("id, name, slug")
        .in("id", topTagIds);

      if (tagsError) throw tagsError;

      // Combine with counts and sort
      return tags?.map(tag => ({
        ...tag,
        count: counts[tag.id] || 0
      })).sort((a, b) => b.count - a.count) || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trendingTags || trendingTags.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link key={tag.id} to={`/?tag=${tag.slug}`}>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
