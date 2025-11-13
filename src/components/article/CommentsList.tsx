import { useComments } from "@/hooks/useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CommentsListProps {
  articleId: string;
}

export default function CommentsList({ articleId }: CommentsListProps) {
  const { data: comments, isLoading } = useComments(articleId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments {comments && `(${comments.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommentForm articleId={articleId} />

        <Separator />

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading comments...</p>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} articleId={articleId} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
