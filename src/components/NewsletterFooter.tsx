import { useState } from "react";
import { Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { SubmissionSuccessDialog } from "./SubmissionSuccessDialog";

export const NewsletterFooter = () => {
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
    <footer className="w-full border-t border-border bg-background mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Socials */}
          <div className="md:col-span-1 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block font-bold text-lg text-foreground tracking-tight mb-4 hover:opacity-80 transition-opacity">
                India's Got Startup
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The definitive platform to discover and connect with India's startup ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="font-semibold mb-4 text-sm text-foreground">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/startups" className="hover:text-foreground transition-colors">Startups</Link></li>
                <li><Link to="/investors" className="hover:text-foreground transition-colors">Investors</Link></li>
                <li><Link to="/incubators" className="hover:text-foreground transition-colors">Incubators</Link></li>
                <li><Link to="/grants" className="hover:text-foreground transition-colors">Grants</Link></li>
                <li><Link to="/events" className="hover:text-foreground transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm text-foreground">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/advertise" className="hover:text-foreground transition-colors">Advertise</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms & Privacy</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest ecosystem stories and updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card h-9"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} India's Got Startup. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Subscribed"
        message="You've successfully subscribed to our newsletter."
      />
    </footer>
  );
};

