import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const TrendingHero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: articles, isLoading } = useTrendingArticles(5);

  if (isLoading) {
    return (
      <div className="relative w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex] as any;

  const nextArticle = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-primary/20 rounded-full text-sm font-medium text-primary">
              {currentArticle.category}
            </div>
            <h1 className="text-4xl font-bold leading-tight">{currentArticle.title}</h1>
            <p className="text-lg text-muted-foreground line-clamp-3">{currentArticle.excerpt}</p>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate(`/article/${currentArticle.slug}`)}>
                Read Article
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevArticle}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextArticle}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative">
            {currentArticle.featured_image_url ? (
              <img
                src={currentArticle.featured_image_url}
                alt={currentArticle.title}
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            ) : (
              <div className="rounded-2xl bg-muted w-full h-[400px] flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Trending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingHero;
