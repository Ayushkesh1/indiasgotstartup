import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAddComment } from "@/hooks/useComments";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CommentFormProps {
  articleId: string;
  parentCommentId?: string | null;
  onSuccess?: () => void;
  placeholder?: string;
  buttonText?: string;
}

export default function CommentForm({
  articleId,
  parentCommentId,
  onSuccess,
  placeholder = "Write a comment...",
  buttonText = "Post Comment",
}: CommentFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to comment");
      navigate("/auth");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    addComment.mutate(
      {
        articleId,
        userId: user.id,
        content: content.trim(),
        parentCommentId,
      },
      {
        onSuccess: () => {
          setContent("");
          toast.success("Comment posted!");
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to post comment");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        disabled={addComment.isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={addComment.isPending || !content.trim()}>
          {addComment.isPending ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
