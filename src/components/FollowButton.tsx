import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useFollowStatus, useToggleFollow } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface FollowButtonProps {
  authorId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function FollowButton({ authorId, variant = "default", size = "default" }: FollowButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: isFollowing, isLoading } = useFollowStatus(authorId, user?.id);
  const toggleFollow = useToggleFollow();

  // Don't show follow button for own profile
  if (user?.id === authorId) {
    return null;
  }

  const handleClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    toggleFollow.mutate({
      authorId,
      userId: user.id,
      isFollowing: isFollowing || false,
    });
  };

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading || toggleFollow.isPending}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
