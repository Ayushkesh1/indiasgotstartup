import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment, useDeleteComment } from "@/hooks/useComments";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./CommentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  articleId: string;
}

export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const deleteComment = useDeleteComment();

  const isOwner = user?.id === comment.user_id;

  const handleDelete = () => {
    deleteComment.mutate(
      { commentId: comment.id, articleId },
      {
        onSuccess: () => {
          toast.success("Comment deleted");
        },
        onError: () => {
          toast.error("Failed to delete comment");
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.profiles.avatar_url || undefined} />
          <AvatarFallback>
            {comment.profiles.full_name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {comment.profiles.full_name || "Anonymous"}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Reply
          </Button>

          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                articleId={articleId}
                parentCommentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
                buttonText="Post Reply"
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-6 mt-4 space-y-4 border-l-2 border-border pl-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} articleId={articleId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
