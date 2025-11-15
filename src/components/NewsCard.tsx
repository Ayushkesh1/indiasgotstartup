import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  authorImage,
  readTime = "5 min read",
  articleId,
  authorId
}: NewsCardProps) => {
  const { data: articleTags } = useArticleTags(articleId || "");

  return (
    <Card className="group overflow-hidden transition-smooth hover:shadow-lg border border-border bg-card">
      <Link to={sourceUrl} className="block">
        {thumbnail && (
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-5 space-y-3">
          {authorId ? (
            <Link 
              to={`/author/${authorId}`} 
              className="flex items-center gap-2 w-fit hover:opacity-70 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={authorImage} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium">{author}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={authorImage} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium">{author}</span>
            </div>
          )}

          <h2 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 text-foreground">
            {title}
          </h2>
          
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>

          {articleTags && articleTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {articleTags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs font-normal">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs font-normal">
                {category}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime}
              </span>
            </div>
            
            {articleId && (
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <BookmarkButton articleId={articleId} variant="ghost" size="icon" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NewsCard;
