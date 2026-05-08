import { Card } from "@/components/ui/card";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";
import { Link } from "react-router-dom";
import { useArticleTags } from "@/hooks/useTags";

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  sourceUrl: string;
  thumbnail?: string;
  author?: string;
  authorImage?: string;
  readTime?: string;
  articleId?: string;
  authorId?: string;
}

const NewsCard = ({ 
  title, 
  description, 
  category, 
  date, 
  source, 
  sourceUrl, 
  thumbnail,
  author = "Editorial Team",
  readTime = "5 min read",
  articleId,
  authorId
}: NewsCardProps) => {
  const { data: articleTags } = useArticleTags(articleId || "");

  return (
    <Card className="group overflow-hidden transition-all duration-200 border border-border bg-card hover:bg-muted/20 flex flex-col h-full rounded-xl hover:border-border/80 shadow-sm hover:shadow-md">
      <Link to={sourceUrl} className="flex flex-col h-full">
        {thumbnail && (
          <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden shrink-0 border-b border-border/50">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-4 flex flex-col flex-1">
          {/* Top Meta: Category & Time */}
          <div className="flex items-center gap-2 mb-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="text-primary">{category}</span>
            <span className="text-border">•</span>
            <span>{readTime}</span>
          </div>

          <h2 className="text-[15px] sm:text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {title}
          </h2>
          
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {description}
          </p>

          {/* Tags */}
          {articleTags && articleTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 mt-auto">
              {articleTags.slice(0, 2).map((tag) => (
                <span key={tag.id} className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className={`mt-auto pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium ${!(articleTags && articleTags.length > 0) ? "pt-4" : ""}`}>
            <div className="flex items-center gap-2">
              {authorId ? (
                <Link to={`/author/${authorId}`} className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                  {author}
                </Link>
              ) : (
                <span>{author}</span>
              )}
              <span className="text-border">•</span>
              <span>{date}</span>
            </div>
            
            <div className="flex items-center">
              {articleId && (
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="relative z-20">
                  <BookmarkButton articleId={articleId} variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NewsCard;
