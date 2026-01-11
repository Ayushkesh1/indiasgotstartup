import { useState } from "react";
import { Link } from "react-router-dom";
import { Hash, TrendingUp, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const TrendingTopics = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      const { data: tagCounts, error: countError } = await supabase
        .from("article_tags")
        .select("tag_id");

      if (countError) throw countError;

      const counts: Record<string, number> = {};
      tagCounts?.forEach(t => {
        counts[t.tag_id] = (counts[t.tag_id] || 0) + 1;
      });

      const topTagIds = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([id]) => id);

      if (topTagIds.length === 0) return [];

      const { data: tags, error: tagsError } = await supabase
        .from("tags")
        .select("id, name, slug")
        .in("id", topTagIds);

      if (tagsError) throw tagsError;

      return tags?.map(tag => ({
        ...tag,
        count: counts[tag.id] || 0
      })).sort((a, b) => b.count - a.count) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="text-sm font-medium">Trending Topics</div>
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Topics
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
          <CardContent className="pt-0">
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
