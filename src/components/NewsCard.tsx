import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";
import { RealtimeViewCounter } from "@/components/article/RealtimeViewCounter";
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
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] border-border bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl flex flex-col h-full hover:border-border">
      <Link to={sourceUrl} className="flex flex-col h-full">
        {thumbnail && (
          <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0 border-b border-border">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-1 space-y-4">
          <div className="flex-1 space-y-4 text-left">
            {authorId ? (
              <Link 
                to={`/author/${authorId}`} 
                className="flex items-center gap-2.5 w-fit hover:opacity-80 transition-all group/author"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={authorImage} />
                  <AvatarFallback className="text-xs bg-purple-500/10 text-purple-400 font-bold">
                    {author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-bold text-muted-foreground group-hover/author:text-purple-400 transition-colors tracking-tight">{author}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={authorImage} />
                  <AvatarFallback className="text-xs bg-muted dark:bg-zinc-800 text-muted-foreground font-bold">
                    {author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-bold text-muted-foreground tracking-tight">{author}</span>
              </div>
            )}

            <h2 className="text-lg md:text-xl font-black leading-tight text-foreground dark:text-foreground dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500 line-clamp-2">
              {title}
            </h2>
            
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed font-medium">
              {description}
            </p>

            {articleTags && articleTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {articleTags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-muted-foreground border-none px-2 py-0">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border-purple-500/20 px-2.5 py-0.5 rounded-full">
                {category}
              </Badge>
              <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-zinc-700" />
                  {readTime}
                </span>
                {articleId && (
                  <RealtimeViewCounter articleId={articleId} />
                )}
              </div>
            </div>
            
            {articleId && (
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="relative z-20">
                <BookmarkButton articleId={articleId} variant="ghost" size="icon" className="text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 rounded-full h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NewsCard;
