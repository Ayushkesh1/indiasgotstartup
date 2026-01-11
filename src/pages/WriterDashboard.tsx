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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TipTapEditor from "@/components/editor/TipTapEditor";
import TagSelector from "@/components/article/TagSelector";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, calculateReadingTime, extractExcerpt } from "@/utils/articleUtils";
import { ArticleCategory } from "@/hooks/useArticles";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";
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
  Check,
  Cloud,
  CloudOff,
  Sparkles,
  PenLine,
  BookOpen,
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const readingTime = calculateReadingTime(content);

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return null;
    return formatDistanceToNow(lastSaved, { addSuffix: true });
  };

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
        setHasUnsavedChanges(false);
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

    setHasUnsavedChanges(true);

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

  const manualSave = async () => {
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
      setHasUnsavedChanges(false);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate("/")}
                      className="rounded-full hover:bg-accent"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Back to Home</TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full">
                    <PenLine className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">
                      {id ? "Editing" : "New Story"}
                    </span>
                  </div>

                  {/* Auto-save Status */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isSaving ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <span className="text-primary">Saving...</span>
                      </div>
                    ) : lastSaved ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default ${hasUnsavedChanges ? 'bg-warning/10' : 'bg-success/10'}`}>
                            {hasUnsavedChanges ? (
                              <>
                                <CloudOff className="h-3 w-3 text-warning" />
                                <span className="text-warning">Unsaved changes</span>
                              </>
                            ) : (
                              <>
                                <Cloud className="h-3 w-3 text-success" />
                                <span className="text-success">Saved {getLastSavedText()}</span>
                              </>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {hasUnsavedChanges 
                            ? "Changes will auto-save in a few seconds" 
                            : `Last saved ${getLastSavedText()}`
                          }
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Reading time */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{readingTime} min read</span>
                </div>

                {/* Manual Save Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={manualSave} 
                      disabled={loading || !title}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save draft manually</TooltipContent>
                </Tooltip>

                {/* Publish Button */}
                <Sheet open={showPublishSettings} onOpenChange={setShowPublishSettings}>
                  <SheetTrigger asChild>
                    <Button 
                      size="sm" 
                      disabled={!title || !content}
                      className="gap-2 bg-primary hover:bg-primary/90 shadow-md"
                    >
                      <Sparkles className="h-4 w-4" />
                      Publish
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Ready to publish?</SheetTitle>
                      <SheetDescription>
                        Add the finishing touches to your story
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      {/* Featured Image */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Cover Image
                        </label>
                        <div 
                          className="relative border-2 border-dashed border-border rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                          onClick={() => document.getElementById('sheet-featured-image')?.click()}
                        >
                          {featuredImageUrl ? (
                            <>
                              <img
                                src={featuredImageUrl}
                                alt="Featured"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="sm">
                                  Change
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFeaturedImageUrl("");
                                    setFeaturedImage(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
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

                {/* More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                    <DropdownMenuItem onClick={manualSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => navigate("/")}
                    >
                      Discard Changes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Avatar className="h-9 w-9 ring-2 ring-border">
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-10">
          {/* Featured Image - Enhanced Hero Section */}
          <div className="mb-10">
            {featuredImageUrl ? (
              <div className="relative group rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-full aspect-[21/9] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-sm font-medium">Cover Image</div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => document.getElementById('hero-image-input')?.click()}
                      className="shadow-lg"
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
                      className="shadow-lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="relative border-2 border-dashed border-border/60 rounded-2xl aspect-[21/9] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group bg-muted/30"
                onClick={() => document.getElementById('hero-image-input')?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading your image...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors mb-4">
                      <ImagePlus className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Add a stunning cover image
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Drag and drop or click to upload • Recommended: 2100×900
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

          {/* Title & Subtitle Section */}
          <div className="mb-8 space-y-4">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Tell your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl md:text-5xl lg:text-6xl font-serif font-bold border-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 leading-tight"
            />

            {/* Subtitle / Excerpt */}
            <input
              type="text"
              placeholder="Add a subtitle to hook your readers..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-xl md:text-2xl text-muted-foreground border-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 leading-relaxed"
            />

            {/* Divider */}
            <div className="pt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="prose-editor-wrapper">
            <TipTapEditor 
              content={content} 
              onChange={setContent}
              placeholder="Write your story here... Start with a compelling opening that draws readers in."
            />
          </div>

          {/* Writing Tips Footer */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
              <span>•</span>
              <span>Press Ctrl+/ for keyboard shortcuts</span>
              <span>•</span>
              <span>Drag & drop images to add them</span>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default WriterDashboard;
