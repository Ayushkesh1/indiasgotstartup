import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAddComment } from "@/hooks/useComments";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters")
});

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

    // Validate input
    const result = commentSchema.safeParse({ content });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">
            Markdown supported
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1 text-xs">
                  <p>**bold** *italic* [link](url)</p>
                  <p>`code` ```code block```</p>
                  <p>- list item</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] resize-none font-mono text-sm"
          disabled={addComment.isPending}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={addComment.isPending || !content.trim()}>
          {addComment.isPending ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
