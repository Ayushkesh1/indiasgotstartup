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

  const ShareIconBtn = ({ onClick, icon: Icon }: { onClick: () => void, icon: any }) => (
    <div className="relative inline-flex h-9 w-9 overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all opacity-80 hover:opacity-100">
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[8px] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
      <div className="absolute inset-0 overflow-hidden rounded-full z-10">
        <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
      </div>
      <Button variant="outline" size="icon" onClick={onClick} className="relative z-20 h-full w-full bg-black text-white hover:bg-neutral-900 border-none rounded-full flex items-center justify-center p-0">
        <Icon className="h-4 w-4 text-cyan-400 group-hover:text-purple-400 transition-colors" />
      </Button>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase font-black tracking-widest text-zinc-500">Share</span>
      <ShareIconBtn onClick={shareOnTwitter} icon={Twitter} />
      <ShareIconBtn onClick={shareOnLinkedIn} icon={Linkedin} />
      <ShareIconBtn onClick={shareOnFacebook} icon={Facebook} />
      <ShareIconBtn onClick={copyLink} icon={Share2} />
    </div>
  );
};

export default SocialShare;
