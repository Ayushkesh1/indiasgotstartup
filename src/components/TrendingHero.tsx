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
      <div className="relative w-full bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Trending Now</h2>
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
    <div className="relative w-full bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary">
              {currentArticle.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">{currentArticle.title}</h1>
            <p className="text-base text-muted-foreground line-clamp-3 leading-7">{currentArticle.excerpt}</p>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate(`/article/${currentArticle.slug}`)} size="lg">
                Read Article
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevArticle} className="h-10 w-10">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextArticle} className="h-10 w-10">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"
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
                className="rounded-lg w-full h-[350px] md:h-[400px] object-cover shadow-lg"
              />
            ) : (
              <div className="rounded-lg bg-muted w-full h-[350px] md:h-[400px] flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingHero;
