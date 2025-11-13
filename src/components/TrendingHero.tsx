import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TrendingHero() {
  const { data: trendingArticles, isLoading } = useTrendingArticles(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (isLoading || !trendingArticles || trendingArticles.length === 0) {
    return null;
  }

  const currentArticle = trendingArticles[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? trendingArticles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === trendingArticles.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
        {/* Trending Badge */}
        <div className="flex items-center gap-2 mb-6 animate-pulse">
          <Flame className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-primary tracking-wider">
            TRENDING ON INDIA GOT STARTUP
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <Badge className="text-xs px-3 py-1">{currentArticle.category}</Badge>
            
            <h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight cursor-pointer hover:text-primary/80 transition-colors"
              onClick={() => navigate(`/article/${currentArticle.slug}`)}
            >
              {currentArticle.title}
            </h1>
            
            {currentArticle.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {currentArticle.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate(`/article/${currentArticle.slug}`)}
                className="gap-2 rounded-full"
              >
                Read Story
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {currentArticle.reading_time} min read
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-2 pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {trendingArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-border/80"
                    )}
                    aria-label={`Go to article ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {currentArticle.featured_image_url && (
            <div 
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => navigate(`/article/${currentArticle.slug}`)}
            >
              <img
                src={currentArticle.featured_image_url}
                alt={currentArticle.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Trending Indicator */}
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Trending
              </div>
            </div>
          )}
        </div>

        {/* Quick Preview Thumbnails */}
        <div className="hidden lg:flex gap-4 mt-8 overflow-x-auto pb-2">
          {trendingArticles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 relative w-32 h-20 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-border"
              )}
            >
              {article.featured_image_url ? (
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
              )}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
