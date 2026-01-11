import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MoreFromAuthorProps {
  authorId: string;
  authorName: string | null;
  currentArticleId: string;
}

export const MoreFromAuthor = ({
  authorId,
  authorName,
  currentArticleId,
}: MoreFromAuthorProps) => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["more-from-author", authorId, currentArticleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          featured_image_url,
          reading_time,
          published_at
        `)
        .eq("author_id", authorId)
        .eq("published", true)
        .neq("id", currentArticleId)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!authorId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">More from Author</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          More from {authorName || "this author"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="flex gap-3 group hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors"
          >
            {article.featured_image_url && (
              <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={article.featured_image_url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{article.reading_time} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
