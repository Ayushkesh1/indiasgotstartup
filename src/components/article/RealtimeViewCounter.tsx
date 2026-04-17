import { Eye, TrendingUp } from "lucide-react";
import { useRealtimeViews } from "@/hooks/useRealtimeViews";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface RealtimeViewCounterProps {
  articleId: string;
  showTrendingBadge?: boolean;
}

export const RealtimeViewCounter = ({ 
  articleId, 
  showTrendingBadge = false 
}: RealtimeViewCounterProps) => {
  const { viewCount, isLoading } = useRealtimeViews(articleId);
  const [previousCount, setPreviousCount] = useState(viewCount);
  const [isTrending, setIsTrending] = useState(false);

  useEffect(() => {
    if (viewCount > previousCount) {
      setIsTrending(true);
      const timer = setTimeout(() => setIsTrending(false), 3000);
      setPreviousCount(viewCount);
      return () => clearTimeout(timer);
    }
  }, [viewCount, previousCount]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 text-sm transition-colors ${
        isTrending ? 'text-primary font-medium' : 'text-slate-700 dark:text-muted-foreground font-semibold'
      }`}>
        <Eye className={`h-4 w-4 ${isTrending ? 'animate-pulse' : ''}`} />
        <span>{viewCount.toLocaleString()} views</span>
      </div>
      {showTrendingBadge && isTrending && (
        <Badge variant="default" className="gap-1 animate-in fade-in zoom-in">
          <TrendingUp className="h-3 w-3" />
          Trending
        </Badge>
      )}
    </div>
  );
};
