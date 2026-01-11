import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, ExternalLink } from "lucide-react";
import FollowButton from "@/components/FollowButton";

interface AuthorProfile {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  twitter_handle?: string | null;
  linkedin_url?: string | null;
}

interface AuthorSidebarProps {
  author: AuthorProfile;
  authorId?: string;
}

const AuthorSidebar = ({ author, authorId }: AuthorSidebarProps) => {
  const id = authorId || author.id;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Link to={id ? `/author/${id}` : "#"}>
            <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={author.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {author.full_name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <Link 
              to={id ? `/author/${id}` : "#"}
              className="hover:text-primary transition-colors"
            >
              <h3 className="font-semibold">
                {author.full_name || "Anonymous"}
              </h3>
            </Link>
            {author.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {author.bio}
              </p>
            )}
          </div>

          {/* Follow Button */}
          {id && (
            <FollowButton authorId={id} size="sm" className="w-full" />
          )}

          {/* View Profile Link */}
          {id && (
            <Link to={`/author/${id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </Link>
          )}

          {(author.twitter_handle || author.linkedin_url) && (
            <div className="flex gap-2 w-full">
              {author.twitter_handle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/${author.twitter_handle}`,
                      "_blank"
                    )
                  }
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              )}
              {author.linkedin_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(author.linkedin_url!, "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorSidebar;
