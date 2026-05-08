import { Article } from "@/hooks/useArticles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  const navigate = useNavigate();

  if (articles.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-16">
      <h2 className="font-serif text-3xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            {article.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <Badge variant="outline">{article.category}</Badge>
              <h3 className="font-serif text-lg font-bold line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={article.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {article.profiles?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {article.profiles?.full_name || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {article.reading_time} min
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
