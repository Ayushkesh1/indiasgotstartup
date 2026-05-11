import { useState } from "react";
import { Search, Edit3, LogOut, User, BookMarked, TrendingUp, ArrowLeft, Users, Share2, Twitter, Linkedin, Facebook, Shield, Trophy, Wallet, Sparkles, Settings, Calendar, FileText, Menu, X, PlusCircle, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useProfile } from "@/hooks/useProfile";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useTheme } from "@/components/ThemeProvider";
import { useUniversalSearch } from "@/hooks/useUniversalSearch";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { useRef, useEffect } from "react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const NAV_LINKS = [
  { label: "Startups", path: "/startups" },
  { label: "Incubators", path: "/incubators" },
  { label: "Investors", path: "/investors" },
  { label: "Grants", path: "/grants" },
  { label: "Events", path: "/events" },
  { label: "People", path: "/people" },
];

const Navbar = ({ searchQuery = "", onSearchChange = () => {} }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { data: roleData } = useUserRole(user?.id);
  const { data: profile } = useProfile(user?.id);
  const { isAuthenticated: isAdminSession } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Local search state to ensure Navbar search works even without props
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const { data: searchResults, isLoading: isSearching } = useUniversalSearch(localSearchQuery);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show admin link if user has admin role OR is logged in via admin session
  const showAdminLink = roleData?.isAdmin || isAdminSession;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Check out India's Got Startup";
    
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

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localSearchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setLocalSearchQuery(val);
    onSearchChange(val);
    if (val.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-1.5">
            {location.pathname !== "/" && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-brand font-bold text-lg tracking-tight text-foreground">
                India's Got Startup
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search startups, investors, people, events..."
                className="w-full pl-10 bg-muted/50 border-border/50 h-9 rounded-lg focus:bg-background transition-colors"
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => localSearchQuery.length >= 2 && setShowSuggestions(true)}
                onKeyDown={handleSearchSubmit}
              />
              {showSuggestions && (
                <SearchSuggestions 
                  results={searchResults} 
                  isLoading={isSearching} 
                  query={localSearchQuery}
                  onSelect={() => setShowSuggestions(false)} 
                />
              )}
            </div>
          </div>

          {/* Right: Nav Links + Actions */}
          <div className="flex items-center gap-1">
            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5 mr-2">
              {NAV_LINKS.map(link => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium h-8 px-3 ${
                    isActive(link.path)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </div>



            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-1"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-border/60">
                <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer text-sm">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer text-sm">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer text-sm">
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer text-sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      className="gap-1.5 h-8 text-sm hidden sm:flex"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Create
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/60">
                    <DropdownMenuItem onClick={() => navigate("/write")} className="cursor-pointer">
                      <Edit3 className="mr-2 h-4 w-4" /> Write Article
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/events/create")} className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" /> Create Event
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/grants/create")} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" /> Create Grant
                    </DropdownMenuItem>
                    
                    {(profile?.primary_role === 'startup' || isAdminSession) && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" /> Add Startup Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" /> Create Hiring Post
                        </DropdownMenuItem>
                      </>
                    )}

                    {(profile?.primary_role === 'incubator' || isAdminSession) && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <TrendingUp className="mr-2 h-4 w-4" /> Add Incubator Program
                        </DropdownMenuItem>
                      </>
                    )}

                    {(profile?.primary_role === 'investor' || profile?.primary_role === 'investor_vc' || isAdminSession) && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <TrendingUp className="mr-2 h-4 w-4" /> Add Investment Thesis
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" /> Portfolio Update
                        </DropdownMenuItem>
                      </>
                    )}

                    {(profile?.primary_role === 'expert' || isAdminSession) && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <Sparkles className="mr-2 h-4 w-4" /> Add Service
                        </DropdownMenuItem>
                      </>
                    )}

                    {(profile?.primary_role === 'creator' || isAdminSession) && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                          <Sparkles className="mr-2 h-4 w-4" /> Creator Program Post
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 ml-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-border/60">
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/creator-program")} className="cursor-pointer">
                      <Sparkles className="mr-2 h-4 w-4" /> Creator Program
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/creator-dashboard")} className="cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" /> Creator Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/subscription")} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/reading-lists")} className="cursor-pointer">
                      <BookMarked className="mr-2 h-4 w-4" /> Reading Lists
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/following")} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" /> Following
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/leaderboard")} className="cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/ads")} className="cursor-pointer">
                      <TrendingUp className="mr-2 h-4 w-4" /> Manage Ads
                    </DropdownMenuItem>
                    {showAdminLink && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" /> Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                size="sm" 
                className="h-8 ml-1"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search startups, people..."
              className="w-full pl-10 bg-muted/50 border-border/50 h-9 rounded-lg"
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            {showSuggestions && (
              <SearchSuggestions 
                results={searchResults} 
                isLoading={isSearching} 
                query={localSearchQuery}
                onSelect={() => setShowSuggestions(false)} 
              />
            )}
          </div>
        </div>

        {/* Mobile nav links */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-border/40 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  className={`justify-start text-sm font-medium ${
                    isActive(link.path)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                >
                  {link.label}
                </Button>
              ))}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-sm font-medium text-muted-foreground hover:text-foreground sm:hidden"
                  onClick={() => { navigate("/write"); setMobileMenuOpen(false); }}
                >
                  <Edit3 className="h-3.5 w-3.5 mr-2" /> Write Article
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
