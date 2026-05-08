import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, Eye } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const TrendingHero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localViews, setLocalViews] = useState<Record<string, number>>({});
  const { data: articles, isLoading } = useTrendingArticles(5);

  useEffect(() => {
    const saved = localStorage.getItem('viralArticleViews');
    if (saved) {
      try { setLocalViews(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles, currentIndex]);

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

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIndex] as any;

  const handleRead = () => {
    // Generate a robust pseudo-random stable view count to start from if missing
    const baseViews = (currentArticle.title.length * 123) % 10000 + 4000;
    const updatedViews = (localViews[currentArticle.id] || baseViews) + 1;
    const newRecord = { ...localViews, [currentArticle.id]: updatedViews };
    setLocalViews(newRecord);
    localStorage.setItem('viralArticleViews', JSON.stringify(newRecord));
    navigate(`/article/${currentArticle.slug}`);
  };

  const nextArticle = () => setCurrentIndex((prev) => (prev + 1) % articles.length);
  const prevArticle = () => setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);

  return (
    <div className="relative w-full bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="flex flex-col h-[350px] md:h-[450px] justify-between py-2">
            <div key={`content-${currentIndex}`} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                  {currentArticle.category}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-zinc-950/80 border border-border rounded-full text-xs font-extrabold text-slate-800 dark:text-zinc-100/80 shadow-xl backdrop-blur-md">
                  <Eye className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>{(localViews[currentArticle.id] || ((currentArticle.title.length * 123) % 10000 + 4000)).toLocaleString()} Views</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-foreground dark:text-white tracking-tight drop-shadow-lg">{currentArticle.title}</h1>
              <p className="text-base md:text-lg text-muted-foreground line-clamp-3 leading-relaxed drop-shadow-md">{currentArticle.excerpt}</p>
            </div>
            
            <div className="space-y-6 mt-6 shrink-0">
              <div className="flex items-center gap-4">
                <Button onClick={handleRead} size="lg" className="h-12 px-8 rounded-full font-bold shadow-xl hover:shadow-primary/25 transition-all text-sm uppercase tracking-widest bg-primary hover:bg-primary/90">
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
              <div className="flex gap-2">
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
          </div>

          {/* Featured Image */}
          <div key={`image-${currentIndex}`} className="relative animate-in fade-in slide-in-from-right-8 duration-700">
            {currentArticle.featured_image_url ? (
              <div className="relative group rounded-[2rem] w-full h-[350px] md:h-[450px] bg-zinc-900 border border-border shadow-2xl p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-[2rem] pointer-events-none" />
                <img
                  src={currentArticle.featured_image_url}
                  alt={currentArticle.title}
                  className="rounded-2xl w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out relative z-0"
                />
              </div>
            ) : (
              <div className="rounded-[2rem] bg-zinc-900 border border-border w-full h-[350px] md:h-[450px] flex items-center justify-center shadow-2xl">
                <TrendingUp className="h-20 w-20 text-foreground dark:text-white/10" />
              </div>
            )}
            <div className="absolute top-6 right-6 z-20 bg-primary/90 backdrop-blur-md text-foreground dark:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] animate-bounce">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingHero;
