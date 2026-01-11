import { Search, Edit3, LogOut, User, BookMarked, TrendingUp, ArrowLeft, Users, DollarSign, Share2, Twitter, Linkedin, Facebook, Shield, Trophy, Wallet, Sparkles, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useProfile } from "@/hooks/useProfile";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { data: roleData } = useUserRole(user?.id);
  const { data: profile } = useProfile(user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleBack = () => {
    // Check if there's actually history to go back to within our app
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If no history or first page, go to home
      navigate("/");
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Check out Not Your World";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            {location.pathname !== "/" && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-brand font-bold text-xl tracking-tight text-foreground">
                Not Your World
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stories..."
                className="w-full pl-10 bg-muted border-0 h-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary-hover h-9"
                  onClick={() => navigate("/write")}
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/creator-program")}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Creator Program
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/creator-dashboard")}>
                      <Wallet className="mr-2 h-4 w-4" />
                      Creator Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/subscription")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/reading-lists")}>
                      <BookMarked className="mr-2 h-4 w-4" />
                      Reading Lists
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/following")}>
                      <Users className="mr-2 h-4 w-4" />
                      Following
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/leaderboard")}>
                      <Trophy className="mr-2 h-4 w-4" />
                      Leaderboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/ads")}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Manage Ads
                    </DropdownMenuItem>
                    {roleData?.isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Our story
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary-hover rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stories..."
              className="w-full pl-10 bg-background border-border rounded-full"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
