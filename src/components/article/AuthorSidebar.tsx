import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Twitter, Linkedin, ExternalLink, ChevronDown, User } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(true);
  const id = authorId || author.id;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                About the Author
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
          <CardContent className="pt-0">
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

              {id && (
                <FollowButton authorId={id} size="sm" className="w-full" />
              )}

              {id && (
                <Link to={`/author/${id}`} className="w-full">
                  <div className="relative inline-flex h-9 w-full overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[8px] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                    <div className="absolute inset-0 overflow-hidden rounded-full z-10">
                      <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
                    </div>
                    <Button variant="outline" size="sm" className="relative z-20 h-full w-full bg-black text-white hover:bg-neutral-900 border-none rounded-full text-[11px] uppercase tracking-widest font-bold">
                      <ExternalLink className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                      View Profile
                    </Button>
                  </div>
                </Link>
              )}

              {(author.twitter_handle || author.linkedin_url) && (
                <div className="flex gap-3 w-full justify-center">
                  {author.twitter_handle && (
                    <div className="relative inline-flex h-9 w-9 overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[8px] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                      <div className="absolute inset-0 overflow-hidden rounded-full z-10">
                        <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
                      </div>
                      <Button variant="outline" size="icon" className="relative z-20 h-full w-full bg-black text-white hover:bg-neutral-900 border-none rounded-full" onClick={() => window.open(`https://twitter.com/${author.twitter_handle}`, "_blank")}>
                        <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                      </Button>
                    </div>
                  )}
                  {author.linkedin_url && (
                    <div className="relative inline-flex h-9 w-9 overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[8px] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                      <div className="absolute inset-0 overflow-hidden rounded-full z-10">
                        <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
                      </div>
                      <Button variant="outline" size="icon" className="relative z-20 h-full w-full bg-black text-white hover:bg-neutral-900 border-none rounded-full" onClick={() => window.open(author.linkedin_url!, "_blank")}>
                        <Linkedin className="h-4 w-4 text-[#0077b5]" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AuthorSidebar;
