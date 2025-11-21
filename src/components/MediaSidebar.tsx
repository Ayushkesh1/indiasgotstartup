import { Link } from "react-router-dom";
import { TrendingUp, Users, Clock } from "lucide-react";
import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MediaSidebar = () => {
  const { data: trendingArticles, isLoading: trendingLoading } = useTrendingArticles(5);
  const { data: allArticles, isLoading: articlesLoading } = useArticles();

  // Get unique featured authors
  const featuredAuthors = allArticles
    ?.filter((article, index, self) => 
      index === self.findIndex(a => a.author_id === article.author_id)
    )
    .slice(0, 4) || [];

  // Get trending topics (categories with most articles)
  const trendingTopics = allArticles
    ?.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topTopics = Object.entries(trendingTopics || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <aside className="space-y-8">
      {/* Trending Topics */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTopics.map(([topic, count]) => (
            <Link
              key={topic}
              to={`/?category=${topic}`}
              className="px-3 py-1.5 text-sm rounded-full border border-border hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {topic} ({count})
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-bold mb-4 text-foreground">Popular Stories</h3>
        {trendingLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trendingArticles?.map((article, index) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="flex gap-3 group"
              >
                <span className="text-2xl font-bold text-muted-foreground/30 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.reading_time} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Authors */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Featured Authors</h3>
        </div>
        {articlesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {featuredAuthors.map((article) => (
              <Link
                key={article.author_id}
                to={`/author/${article.author_id}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={article.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {article.profiles?.full_name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {article.profiles?.full_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {article.profiles?.bio || "Writer"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
