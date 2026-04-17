import { useState } from "react";
import { Mail, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionSuccessDialog } from "./SubmissionSuccessDialog";

export const SidebarNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccessOpen(true);
        setEmail("");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-border bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl p-8 relative overflow-hidden group shadow-2xl transition-all hover:bg-white/70 dark:bg-zinc-900/60">
      {/* Aesthetic Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Mail className="h-6 w-6 text-purple-400" />
        </div>
        
        <h3 className="text-2xl font-black text-foreground dark:text-white mb-2 tracking-tight flex items-center gap-2">
          Join Inner Circle <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
        </h3>
        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
          Stay ahead of the curve. Get exclusive startup insights and venture news delivered to your portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-purple-500/50 text-foreground dark:text-white placeholder:text-zinc-700 rounded-xl transition-all hover:border-border pl-4"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-foreground dark:text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95 group/btn"
            disabled={isLoading}
          >
            {isLoading ? "Synchronizing..." : (
              <>
                Subscribe <Send className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <p className="text-[10px] text-zinc-600 mt-6 text-center font-bold tracking-widest uppercase">
          Zero Spam • High Frequency Intel
        </p>
      </div>

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Subscribed!"
        message="You've gained access to the inner circle. Expect high-frequency startup intel soon."
      />
    </div>
  );
};
