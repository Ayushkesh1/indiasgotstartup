import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Advertisement } from "@/hooks/useAdvertisements";

interface AdFormProps {
  userId: string;
  ad?: Advertisement;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const AdForm = ({ userId, ad, onSubmit, isSubmitting }: AdFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(ad?.title || "");
  const [description, setDescription] = useState(ad?.description || "");
  const [linkUrl, setLinkUrl] = useState(ad?.link_url || "");
  const [bidAmount, setBidAmount] = useState(ad?.bid_amount.toString() || "");
  const [isActive, setIsActive] = useState(ad?.is_active || false);
  const [startDate, setStartDate] = useState(ad?.start_date?.split("T")[0] || "");
  const [endDate, setEndDate] = useState(ad?.end_date?.split("T")[0] || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(ad?.image_url || "");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Image uploaded",
        description: "Your ad image has been uploaded successfully",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !linkUrl || !bidAmount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let finalImageUrl = imageUrl;
    if (imageFile) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    if (!finalImageUrl) {
      toast({
        title: "Image required",
        description: "Please upload an ad image",
        variant: "destructive",
      });
      return;
    }

    const data = {
      user_id: userId,
      title,
      description: description || undefined,
      image_url: finalImageUrl,
      link_url: linkUrl,
      bid_amount: parseFloat(bidAmount),
      is_active: isActive,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{ad ? "Edit Advertisement" : "Create New Advertisement"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ad title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your ad"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="link">Link URL *</Label>
            <Input
              id="link"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="bid">Bid Amount (₹) *</Label>
            <Input
              id="bid"
              type="number"
              step="0.01"
              min="0"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Higher bids get more visibility
            </p>
          </div>

          <div>
            <Label htmlFor="image">Ad Image *</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              {imageFile && !imageUrl && (
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  variant="outline"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Ad preview"
                  className="h-32 w-auto rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Label htmlFor="active">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Ad is currently active" : "Ad is currently inactive"}
              </p>
            </div>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {ad ? "Update Advertisement" : "Create Advertisement"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default AdForm;
