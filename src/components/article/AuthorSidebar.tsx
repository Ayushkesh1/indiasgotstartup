import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin } from "lucide-react";

interface AuthorProfile {
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  twitter_handle?: string | null;
  linkedin_url?: string | null;
}

interface AuthorSidebarProps {
  author: AuthorProfile;
}

const AuthorSidebar = ({ author }: AuthorSidebarProps) => {
  return (
    <Card className="sticky top-20">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={author.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {author.full_name?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-lg">
              {author.full_name || "Anonymous"}
            </h3>
            {author.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {author.bio}
              </p>
            )}
          </div>

          {(author.twitter_handle || author.linkedin_url) && (
            <div className="flex gap-2 w-full">
              {author.twitter_handle && (
                <Button
                  variant="outline"
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
                  variant="outline"
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
