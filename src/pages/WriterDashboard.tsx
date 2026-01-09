import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TipTapEditor from "@/components/editor/TipTapEditor";
import TagSelector from "@/components/article/TagSelector";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, calculateReadingTime, extractExcerpt } from "@/utils/articleUtils";
import { ArticleCategory } from "@/hooks/useArticles";
import { Loader2, Upload, Eye, Save, Send, ArrowLeft, Clock, X, ImagePlus } from "lucide-react";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("Tech");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!user || !title || !id) return;

    setIsSaving(true);
    try {
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);
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
  }, [user, title, content, category, excerpt, featuredImageUrl, id]);

  // Set up auto-save on content changes
  useEffect(() => {
    if (!id || !title) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

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
        setMetaDescription(data.excerpt || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const uploadImage = async () => {
    if (!featuredImage || !user) return null;

    setUploading(true);
    try {
      const fileExt = featuredImage.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("article-images")
        .upload(filePath, featuredImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      setFeaturedImageUrl(publicUrl);
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
      const readingTime = calculateReadingTime(content);
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
          .insert([articleData])
          .select()
          .single();

        if (error) throw error;
        if (data) navigate(`/write/${data.id}`);
      }

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
      const readingTime = calculateReadingTime(content);
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
          .insert([articleData]);

        if (error) throw error;
      }

      toast({
        title: "Published!",
        description: "Your article has been published successfully",
      });
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-serif text-3xl font-bold">
                  {id ? "Edit Article" : "Write New Article"}
                </h1>
                {id && lastSaved && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {isSaving ? "Saving..." : `Last saved ${lastSaved.toLocaleTimeString()}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">Save Draft</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!title || !content}>
                    <Eye className="h-4 w-4" />
                    <span className="ml-2">Preview</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Article Preview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {(featuredImage || featuredImageUrl) && (
                      <img
                        src={featuredImage ? URL.createObjectURL(featuredImage) : featuredImageUrl}
                        alt="Featured"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <span className="text-sm text-primary font-medium">{category}</span>
                      <h1 className="text-3xl font-bold mt-2">{title || "Untitled Article"}</h1>
                      <p className="text-muted-foreground mt-2">
                        {excerpt || extractExcerpt(content) || "No excerpt available"}
                      </p>
                    </div>
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={publishArticle} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-2">Publish</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ArticleCategory)}>
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

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description (auto-generated if empty)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="featured-image">Featured Image</Label>
                  <div 
                    className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('featured-image')?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-primary');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-primary');
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        setFeaturedImage(file);
                      }
                    }}
                  >
                    {featuredImage || featuredImageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={featuredImage ? URL.createObjectURL(featuredImage) : featuredImageUrl}
                          alt="Featured preview"
                          className="max-h-48 rounded-lg mx-auto"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedImage(null);
                            setFeaturedImageUrl("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click or drag & drop to upload an image
                        </p>
                      </div>
                    )}
                    <Input
                      id="featured-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  {featuredImage && !featuredImageUrl && (
                    <Button 
                      onClick={uploadImage} 
                      disabled={uploading} 
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Image
                    </Button>
                  )}
                </div>

                {id && <TagSelector articleId={id} selectedTags={[]} onTagsChange={() => {}} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
              </CardHeader>
              <CardContent>
                <TipTapEditor content={content} onChange={setContent} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
