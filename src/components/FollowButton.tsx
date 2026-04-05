import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useFollowStatus, useToggleFollow } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface FollowButtonProps {
  authorId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function FollowButton({ authorId, variant = "default", size = "default", className }: FollowButtonProps) {
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
    <button
      className={`relative inline-flex items-center justify-center font-black uppercase tracking-widest text-[#1a3c9e] transition-transform active:scale-95 group ${
        size === "sm" ? "text-[10px] px-3 py-1" : "text-xs px-5 py-1.5"
      } ${className || ""}`}
      onClick={handleClick}
      disabled={isLoading || toggleFollow.isPending}
    >
      {/* Outer Dark Blue Pixel Border Bars */}
      <div className="absolute inset-x-[2px] -inset-y-[2px] bg-[#1a3c9e] z-[-2] pointer-events-none transition-colors" />
      <div className="absolute -inset-x-[2px] inset-y-[2px] bg-[#1a3c9e] z-[-2] pointer-events-none transition-colors" />

      {/* Inner Light Blue Interactive Background Bars */}
      <div className="absolute inset-x-[2px] inset-y-[0px] bg-[#72c6ff] z-[-1] pointer-events-none group-hover:bg-[#8bd0ff] transition-colors" />
      <div className="absolute inset-x-[0px] inset-y-[2px] bg-[#72c6ff] z-[-1] pointer-events-none group-hover:bg-[#8bd0ff] transition-colors" />
      <div className="absolute inset-0 bg-[#72c6ff] z-[-1] pointer-events-none group-hover:bg-[#8bd0ff] transition-colors" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
        {isFollowing ? (
          <>
            <UserMinus className="h-3 w-3 mr-1.5 text-[#1a3c9e]" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="h-3 w-3 mr-1.5 text-[#1a3c9e]" />
            Follow Me
          </>
        )}
      </span>
    </button>
  );
}
