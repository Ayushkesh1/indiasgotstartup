import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks, useMarkAsRead, Bookmark } from "@/hooks/useBookmarks";
import { useCollections, useCreateCollection } from "@/hooks/useCollections";
import { useRecommendations } from "@/hooks/useRecommendations";
import { BookmarkCollections } from "@/components/bookmarks/BookmarkCollections";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  BookMarked, 
  Clock, 
  Check, 
  Download, 
  Plus, 
  Sparkles,
  BookOpen,
  Library,
  FolderOpen,
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Eye,
  Calendar,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ReadingLists = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarks(user?.id);
  const { data: collections } = useCollections(user?.id);
  const { data: recommendations } = useRecommendations(user?.id);
  const markAsRead = useMarkAsRead();
  const createCollection = useCreateCollection();

  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const unreadBookmarks = bookmarks?.filter((b) => !b.is_read) || [];
  const readBookmarks = bookmarks?.filter((b) => b.is_read) || [];

  // Filter bookmarks by search query
  const filteredBookmarks = bookmarks?.filter(b => 
    b.articles.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.articles.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const readingProgress = bookmarks?.length 
    ? Math.round((readBookmarks.length / bookmarks.length) * 100)
    : 0;

  const handleMarkAsRead = (bookmarkId: string, currentStatus: boolean) => {
    markAsRead.mutate({ bookmarkId, isRead: !currentStatus });
  };

  const handleExport = () => {
    if (!bookmarks) return;

    const exportData = bookmarks.map((bookmark) => ({
      title: bookmark.articles.title,
      url: `${window.location.origin}/article/${bookmark.articles.slug}`,
      category: bookmark.articles.category,
      bookmarked_at: bookmark.bookmarked_at,
      is_read: bookmark.is_read,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reading-list.json";
    a.click();

    toast({
      title: "Export successful",
      description: "Your reading list has been exported",
    });
  };

  const handleCreateCollection = () => {
    if (!user || !collectionName.trim()) return;

    createCollection.mutate(
      {
        user_id: user.id,
        name: collectionName,
        description: collectionDescription || undefined,
      },
      {
        onSuccess: () => {
          setCollectionName("");
          setCollectionDescription("");
          setDialogOpen(false);
        },
      }
    );
  };

  const BookmarkCardList = ({ bookmark }: { bookmark: Bookmark }) => (
    <div
      className="group flex items-start gap-4 p-4 rounded-xl bg-card hover:bg-accent/50 border border-transparent hover:border-border transition-all cursor-pointer"
      onClick={() => navigate(`/article/${bookmark.articles.slug}`)}
    >
      {/* Featured Image */}
      {bookmark.articles.featured_image_url ? (
        <img
          src={bookmark.articles.featured_image_url}
          alt={bookmark.articles.title}
          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {bookmark.articles.category}
          </Badge>
          {bookmark.is_read && (
            <Badge className="bg-success/10 text-success border-success/20 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Read
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {bookmark.articles.title}
        </h3>
        {bookmark.articles.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {bookmark.articles.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {bookmark.articles.reading_time} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Saved {new Date(bookmark.bookmarked_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleMarkAsRead(bookmark.id, bookmark.is_read);
          }}
        >
          {bookmark.is_read ? (
            <><Circle className="h-4 w-4 mr-1" /> Unread</>
          ) : (
            <><Check className="h-4 w-4 mr-1" /> Read</>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FolderOpen className="h-4 w-4 mr-2" />
              Add to Collection
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const BookmarkCardGrid = ({ bookmark }: { bookmark: Bookmark }) => (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
      onClick={() => navigate(`/article/${bookmark.articles.slug}`)}
    >
      {bookmark.articles.featured_image_url ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={bookmark.articles.featured_image_url}
            alt={bookmark.articles.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {bookmark.articles.category}
          </Badge>
          {bookmark.is_read && (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
        </div>
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {bookmark.articles.title}
        </h3>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {bookmark.articles.reading_time} min
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAsRead(bookmark.id, bookmark.is_read);
            }}
          >
            {bookmark.is_read ? "Mark Unread" : "Mark Read"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (authLoading || bookmarksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
                <Library className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Library</h1>
                <p className="text-muted-foreground">
                  {bookmarks?.length || 0} saved articles • {readBookmarks.length} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-md">
                    <Plus className="h-4 w-4" />
                    New Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Collection Name</Label>
                      <Input
                        id="name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        placeholder="e.g., Must Read, Startup Guides"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={collectionDescription}
                        onChange={(e) => setCollectionDescription(e.target.value)}
                        placeholder="Describe your collection..."
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleCreateCollection}
                      disabled={!collectionName.trim() || createCollection.isPending}
                      className="w-full"
                    >
                      Create Collection
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">Total</Badge>
                </div>
                <p className="text-3xl font-bold">{bookmarks?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Saved Articles</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="h-5 w-5 text-warning" />
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                </div>
                <p className="text-3xl font-bold">{unreadBookmarks.length}</p>
                <p className="text-sm text-muted-foreground">To Read</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <Badge variant="secondary" className="text-xs">Done</Badge>
                </div>
                <p className="text-3xl font-bold">{readBookmarks.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">Organized</Badge>
                </div>
                <p className="text-3xl font-bold">{collections?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Collections</p>
              </CardContent>
            </Card>
          </div>

          {/* Reading Progress */}
          {bookmarks && bookmarks.length > 0 && (
            <Card className="mb-8 bg-gradient-to-r from-primary/5 via-background to-accent/5 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Reading Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {readingProgress}% of your library completed
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{readBookmarks.length}</span>
                    <span className="text-muted-foreground">/{bookmarks.length}</span>
                  </div>
                </div>
                <Progress value={readingProgress} className="h-3" />
              </CardContent>
            </Card>
          )}

          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-muted/50 p-1 mb-6">
              <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-background">
                <BookMarked className="h-4 w-4" />
                All ({bookmarks?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-2 data-[state=active]:bg-background">
                <Circle className="h-4 w-4" />
                Unread ({unreadBookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="read" className="gap-2 data-[state=active]:bg-background">
                <CheckCircle2 className="h-4 w-4" />
                Read ({readBookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {filteredBookmarks && filteredBookmarks.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-2">
                    {filteredBookmarks.map((bookmark) => (
                      <BookmarkCardList key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookmarks.map((bookmark) => (
                      <BookmarkCardGrid key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <BookMarked className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved articles</h3>
                  <p className="text-muted-foreground mb-6">
                    Start saving articles to build your reading library
                  </p>
                  <Button onClick={() => navigate("/")} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Browse Articles
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread">
              {unreadBookmarks.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-2">
                    {unreadBookmarks.map((bookmark) => (
                      <BookmarkCardList key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unreadBookmarks.map((bookmark) => (
                      <BookmarkCardGrid key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-success/5 rounded-2xl border border-success/20">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You have read all your saved articles
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="read">
              {readBookmarks.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-2">
                    {readBookmarks.map((bookmark) => (
                      <BookmarkCardList key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {readBookmarks.map((bookmark) => (
                      <BookmarkCardGrid key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Eye className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No completed articles</h3>
                  <p className="text-muted-foreground">
                    Mark articles as read when you finish them
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Recommended For You</h2>
                    <p className="text-sm text-muted-foreground">Based on your reading history</p>
                  </div>
                </div>
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.slice(0, 3).map((article) => (
                  <Card
                    key={article.id}
                    className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                    onClick={() => navigate(`/article/${article.slug}`)}
                  >
                    {article.featured_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          <div className="mt-12">
            <BookmarkCollections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingLists;