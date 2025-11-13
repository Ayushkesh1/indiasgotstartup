import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks, useMarkAsRead, Bookmark } from "@/hooks/useBookmarks";
import { useCollections, useCreateCollection } from "@/hooks/useCollections";
import { useRecommendations } from "@/hooks/useRecommendations";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, BookMarked, Clock, Check, Download, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const unreadBookmarks = bookmarks?.filter((b) => !b.is_read) || [];
  const readBookmarks = bookmarks?.filter((b) => b.is_read) || [];

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

  const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/article/${bookmark.articles.slug}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{bookmark.articles.category}</Badge>
              {bookmark.is_read && (
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" /> Read
                </Badge>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold line-clamp-2">
              {bookmark.articles.title}
            </h3>
            {bookmark.articles.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bookmark.articles.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {bookmark.articles.reading_time} min
              </span>
              <span>
                Saved {new Date(bookmark.bookmarked_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">Reading Lists</h1>
              <p className="text-muted-foreground">
                Manage your saved articles and reading collections
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saved Articles</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookmarks?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {unreadBookmarks.length} unread
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Collections</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collections?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Organized reading lists
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readBookmarks.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed articles
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({bookmarks?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadBookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({readBookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {bookmarks && bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start saving articles to build your reading list
                  </p>
                  <Button onClick={() => navigate("/")}>Browse Articles</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4 mt-6">
              {unreadBookmarks.length > 0 ? (
                unreadBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">All caught up!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4 mt-6">
              {readBookmarks.length > 0 ? (
                readBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles read yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl font-bold">Recommended For You</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/article/${article.slug}`)}
                  >
                    {article.featured_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <h3 className="font-serif text-lg font-bold line-clamp-2">
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
        </div>
      </div>
    </div>
  );
};

export default ReadingLists;
