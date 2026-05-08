import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import { useTrackEngagement } from "@/hooks/useCreatorEarnings";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const BookmarkButton = ({ articleId, variant = "ghost", size = "default", className }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toggleBookmark = useToggleBookmark();
  const { mutate: trackEngagement } = useTrackEngagement();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .maybeSingle();

      setIsBookmarked(!!data);
      setLoading(false);
    };

    checkBookmark();
  }, [user?.id, articleId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    toggleBookmark.mutate(
      { userId: user.id, articleId },
      {
        onSuccess: () => {
          // Track bookmark engagement (only when adding, not removing)
          if (!isBookmarked) {
            trackEngagement({ event_type: "bookmark", article_id: articleId });
          }
          setIsBookmarked(!isBookmarked);
        },
      }
    );
  };

  if (loading) return null;

  return (
    <div className={`relative inline-flex h-10 w-10 overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all ${!isBookmarked ? 'opacity-80 hover:opacity-100' : ''} ${className || ''}`}>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[8px] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
      <div className="absolute inset-0 overflow-hidden rounded-full z-10">
        <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={toggleBookmark.isPending}
        className="relative z-20 h-full w-full bg-black text-foreground dark:text-white hover:bg-neutral-900 border-none rounded-full flex items-center justify-center p-0"
      >
        <Bookmark
          className={`h-4 w-4 ${isBookmarked ? "fill-purple-400 text-purple-400" : "text-cyan-400 group-hover:text-purple-400"} transition-colors`}
        />
      </Button>
    </div>
  );
};

export default BookmarkButton;
