import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown,
  Eye, 
  BookOpen, 
  MessageSquare, 
  Bookmark,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useArticlePerformance } from "@/hooks/useCreatorAnalytics";
import { Link } from "react-router-dom";

export function ArticlePerformanceTable() {
  const { data: articles, isLoading } = useArticlePerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article Performance</CardTitle>
          <CardDescription>See how your articles are performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article Performance</CardTitle>
          <CardDescription>See how your articles are performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No published articles yet</p>
            <p className="text-sm">Start writing to see performance data here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by engagement points
  const sortedArticles = [...articles].sort((a, b) => 
    b.engagement.total_points - a.engagement.total_points
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Article Performance
          <Badge variant="secondary" className="font-normal">
            {articles.length} articles
          </Badge>
        </CardTitle>
        <CardDescription>Your top performing content by engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedArticles.slice(0, 10).map((article, index) => (
            <div 
              key={article.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/article/${article.slug}`}
                      className="font-medium text-sm truncate hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                    {article.is_boosted && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {article.boost_multiplier}x Boost
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {article.engagement.full_reads}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {article.engagement.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      {article.engagement.bookmarks}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className="font-bold text-primary">{article.engagement.total_points}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
