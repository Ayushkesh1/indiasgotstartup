import { Link } from "react-router-dom";
import { Clock, TrendingUp } from "lucide-react";
import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedSection = () => {
  const { data: articles, isLoading } = useTrendingArticles(3);

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Featured Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  const [mainArticle, ...sideArticles] = articles;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Featured Stories</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Featured Article */}
        <Link
          to={`/article/${mainArticle.slug}`}
          className="md:row-span-2 group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={mainArticle.featured_image_url || "/placeholder.svg"}
              alt={mainArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full mb-3">
              {mainArticle.category}
            </span>
            <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {mainArticle.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {mainArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{mainArticle.profiles?.full_name}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{mainArticle.reading_time} min read</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Side Featured Articles */}
        <div className="space-y-6">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group flex gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
            >
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded mb-2">
                  {article.category}
                </span>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{article.profiles?.full_name}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.reading_time} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
