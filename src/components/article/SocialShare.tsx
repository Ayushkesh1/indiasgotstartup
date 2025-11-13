import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url: string;
}

const SocialShare = ({ title, url }: SocialShareProps) => {
  const { toast } = useToast();

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, "_blank", "width=550,height=420");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=550,height=420");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Article link copied to clipboard",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button variant="outline" size="sm" onClick={shareOnTwitter}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={shareOnFacebook}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
