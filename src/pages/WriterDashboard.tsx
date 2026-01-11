import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TipTapEditor from "@/components/editor/TipTapEditor";
import TagSelector from "@/components/article/TagSelector";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, calculateReadingTime, extractExcerpt } from "@/utils/articleUtils";
import { ArticleCategory } from "@/hooks/useArticles";
import { useProfile } from "@/hooks/useProfile";
import { 
  Loader2, 
  Upload, 
  Eye, 
  Save, 
  Send, 
  ArrowLeft, 
  Clock, 
  X, 
  ImagePlus,
  MoreHorizontal,
  Settings2,
  Bell,
  ChevronDown,
  Check
} from "lucide-react";

const CATEGORIES: ArticleCategory[] = [
  "Fintech",
  "Tech",
  "Blockchain",
  "eCommerce",
  "Government",
  "Edtech",
  "Funding",
  "Mobility",
];

const WriterDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("Tech");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPublishSettings, setShowPublishSettings] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const readingTime = calculateReadingTime(content);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!user || !title || !id) return;

    setIsSaving(true);
    try {
      const slug = generateSlug(title);
      const autoExcerpt = excerpt || extractExcerpt(content);

      const articleData = {
        title,
        content,
        category,
        excerpt: autoExcerpt,
        featured_image_url: featuredImageUrl,
        reading_time: readingTime,
        author_id: user.id,
        published: false,
      };

      const { error } = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", id);

      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, title, content, category, excerpt, featuredImageUrl, id, readingTime]);

  // Set up auto-save on content changes
  useEffect(() => {
    if (!id || !title) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, category, excerpt, autoSave, id]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      loadArticle(id);
    }
  }, [id, user]);

  const loadArticle = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .eq("author_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTitle(data.title);
        setContent(typeof data.content === 'string' ? data.content : JSON.stringify(data.content));
        setCategory(data.category);
        setExcerpt(data.excerpt || "");
        setFeaturedImageUrl(data.featured_image_url || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file?: File) => {
    const imageToUpload = file || featuredImage;
    if (!imageToUpload || !user) return null;

    setUploading(true);
    try {
      const fileExt = imageToUpload.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(fileName, imageToUpload);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);

      setFeaturedImageUrl(publicUrl);
      setFeaturedImage(null);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveDraft = async () => {
    if (!user || !title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const slug = generateSlug(title);
      const autoExcerpt = excerpt || extractExcerpt(content);

      const articleData = {
        title,
        slug: id ? undefined : slug,
        content,
        category,
        excerpt: autoExcerpt,
        featured_image_url: imageUrl,
        reading_time: readingTime,
        author_id: user.id,
        published: false,
      };

      if (id) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("articles")
          .insert([{ ...articleData, slug }])
          .select()
          .single();

        if (error) throw error;
        if (data) navigate(`/write/${data.id}`, { replace: true });
      }

      setLastSaved(new Date());
      toast({
        title: "Draft saved",
        description: "Your article has been saved as a draft",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const publishArticle = async () => {
    if (!user || !title || !content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const slug = generateSlug(title);
      const autoExcerpt = excerpt || extractExcerpt(content);

      const articleData = {
        title,
        slug: id ? undefined : slug,
        content,
        category,
        excerpt: autoExcerpt,
        featured_image_url: imageUrl,
        reading_time: readingTime,
        author_id: user.id,
        published: true,
        published_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([{ ...articleData, slug }]);

        if (error) throw error;
      }

      toast({
        title: "Published!",
        description: "Your article has been published successfully",
      });
      setShowPublishSettings(false);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="font-medium text-muted-foreground">
                {id ? "Draft" : "New Story"}
              </span>
              {lastSaved && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3" />
                      Saved
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Reading time indicator */}
              <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>

              <Button 
                variant="outline" 
                size="sm"
                onClick={saveDraft} 
                disabled={loading || !title}
              >
                Save Draft
              </Button>

              <Sheet open={showPublishSettings} onOpenChange={setShowPublishSettings}>
                <SheetTrigger asChild>
                  <Button 
                    size="sm" 
                    disabled={!title || !content}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Publish
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Story Preview</SheetTitle>
                    <SheetDescription>
                      Review your story settings before publishing
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Featured Image */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Featured Image
                      </label>
                      <div 
                        className="relative border-2 border-dashed border-border rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                        onClick={() => document.getElementById('sheet-featured-image')?.click()}
                      >
                        {featuredImageUrl ? (
                          <>
                            <img
                              src={featuredImageUrl}
                              alt="Featured"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFeaturedImageUrl("");
                                setFeaturedImage(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            {uploading ? (
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            ) : (
                              <>
                                <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Add a cover image
                                </p>
                              </>
                            )}
                          </div>
                        )}
                        <input
                          id="sheet-featured-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadImage(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Title Preview */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title
                      </label>
                      <p className="text-lg font-semibold">{title || "Untitled"}</p>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Subtitle / Excerpt
                      </label>
                      <Textarea
                        placeholder="Write a brief description..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This appears in article previews and search results
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <Select 
                        value={category} 
                        onValueChange={(value) => setCategory(value as ArticleCategory)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    {id && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tags
                        </label>
                        <TagSelector 
                          articleId={id} 
                          selectedTags={[]} 
                          onTagsChange={() => {}} 
                        />
                      </div>
                    )}

                    {/* Publish Button */}
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={publishArticle}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Publish Now
                        </>
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        {featuredImageUrl && (
                          <img
                            src={featuredImageUrl}
                            alt="Featured"
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <Badge>{category}</Badge>
                          <h1 className="text-3xl font-bold mt-3">{title || "Untitled"}</h1>
                          {excerpt && (
                            <p className="text-lg text-muted-foreground mt-2">{excerpt}</p>
                          )}
                        </div>
                        <div 
                          className="prose prose-lg dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem onClick={saveDraft} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => navigate("/")}
                  >
                    Discard Changes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Featured Image - Medium-style Hero */}
        <div className="mb-8">
          {featuredImageUrl ? (
            <div className="relative group">
              <img
                src={featuredImageUrl}
                alt="Featured"
                className="w-full aspect-[2/1] object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('hero-image-input')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setFeaturedImageUrl("");
                    setFeaturedImage(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="relative border-2 border-dashed border-border rounded-xl aspect-[3/1] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all group"
              onClick={() => document.getElementById('hero-image-input')?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-3">
                    <ImagePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Add a cover image
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Recommended: 1600×800 or higher
                  </p>
                </>
              )}
            </div>
          )}
          <input
            id="hero-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadImage(file);
              }
            }}
          />
        </div>

        {/* Title Input - Medium-style */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl md:text-5xl font-serif font-bold border-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 mb-4"
        />

        {/* Subtitle / Excerpt - Optional */}
        <input
          type="text"
          placeholder="Add a subtitle..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full text-xl text-muted-foreground border-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 mb-8"
        />

        {/* Rich Text Editor */}
        <TipTapEditor 
          content={content} 
          onChange={setContent}
          placeholder="Tell your story..."
        />
      </main>
    </div>
  );
};

export default WriterDashboard;
