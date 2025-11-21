import { Link } from "react-router-dom";
import { Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleCategory } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleRecommendationsProps {
  currentArticleId: string;
  category: ArticleCategory;
  authorId: string;
}

export const ArticleRecommendations = ({
  currentArticleId,
  category,
  authorId,
}: ArticleRecommendationsProps) => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations", currentArticleId, category],
    queryFn: async () => {
      // Get user's reading history if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      let readCategories: ArticleCategory[] = [category];
      
      if (user) {
        // Get categories from user's reading progress
        const { data: progressData } = await supabase
          .from("reading_progress")
          .select("article_id")
          .eq("user_id", user.id)
          .limit(10);

        if (progressData && progressData.length > 0) {
          const articleIds = progressData.map(p => p.article_id);
          const { data: articlesData } = await supabase
            .from("articles")
            .select("category")
            .in("id", articleIds);
          
          if (articlesData) {
            const categories = articlesData.map(a => a.category as ArticleCategory);
            readCategories = [...new Set([category, ...categories])];
          }
        }
      }

      // Fetch recommendations based on categories and exclude current article
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq("published", true)
        .in("category", readCategories)
        .neq("id", currentArticleId)
        .order("views_count", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data as Article[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">You Might Also Like</h3>
      </div>
      <div className="space-y-4">
        {recommendations.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="flex gap-4 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
          >
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
              <img
                src={article.featured_image_url || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded mb-1">
                {article.category}
              </span>
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{article.profiles?.full_name}</span>
                <span>•</span>
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
  );
};
