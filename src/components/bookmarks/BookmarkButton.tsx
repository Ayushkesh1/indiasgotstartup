import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const BookmarkButton = ({ articleId, variant = "ghost", size = "default" }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toggleBookmark = useToggleBookmark();
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
          setIsBookmarked(!isBookmarked);
        },
      }
    );
  };

  if (loading) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={toggleBookmark.isPending}
    >
      <Bookmark
        className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
      />
    </Button>
  );
};

export default BookmarkButton;
