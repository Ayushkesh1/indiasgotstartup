import { useState, useEffect } from "react";
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
import TipTapEditor from "@/components/editor/TipTapEditor";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, calculateReadingTime, extractExcerpt } from "@/utils/articleUtils";
import { ArticleCategory } from "@/hooks/useArticles";
import { Loader2, Upload, Eye, Save, Send } from "lucide-react";

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
            <h1 className="font-serif text-3xl font-bold">
              {id ? "Edit Article" : "Write New Article"}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">Save Draft</span>
              </Button>
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
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        id="featured-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                      />
                    </div>
                    {featuredImage && (
                      <Button onClick={uploadImage} disabled={uploading} variant="outline">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  {featuredImageUrl && (
                    <div className="mt-2">
                      <img
                        src={featuredImageUrl}
                        alt="Featured"
                        className="h-32 w-auto rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
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
