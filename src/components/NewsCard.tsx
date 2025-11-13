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
    <Card className="group border-0 shadow-none bg-transparent overflow-hidden transition-smooth hover:opacity-80 cursor-pointer">
      <Link to={sourceUrl} className="block">
        {thumbnail && (
          <div className="relative w-full aspect-[2/1] mb-4 overflow-hidden rounded-sm">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="space-y-3">
          {authorId ? (
            <Link 
              to={`/author/${authorId}`} 
              className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorImage} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium">{author}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorImage} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium">{author}</span>
            </div>
          )}

          <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight line-clamp-2 text-foreground group-hover:text-foreground/80">
            {title}
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2 leading-relaxed">
            {description}
          </p>

          {articleTags && articleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {articleTags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                {category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime}
              </span>
              <span>{date}</span>
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
