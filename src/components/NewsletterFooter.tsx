import { useState } from "react";
import { Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import childrenEducationImg from "@/assets/children-education.webp";
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
    <footer className="w-full border-t border-border bg-card mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {/* Social Impact Banner with Image */}
        <Link 
          to="/social-impact" 
          className="block mb-8 group"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
              <div className="w-full md:w-48 h-24 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={childrenEducationImg} 
                  alt="Children education initiative" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-foreground">2% For Education</h3>
                <p className="text-sm text-muted-foreground">
                  We contribute 2% of our earnings to support student education across India
                </p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                Learn More
              </Button>
            </div>
          </div>
        </Link>

        {/* Newsletter Section - Compact */}
        <div className="max-w-xl mx-auto text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest stories delivered to your inbox
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "..." : "Subscribe"}
            </Button>
          </form>

          {/* WhatsApp Community CTA */}
          <div className="mt-8 flex justify-center">
            <a 
              href="https://chat.whatsapp.com/GmdzPRouLZ4KzDcny12oPY?mode=gi_t" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900 border border-border text-foreground dark:text-white font-semibold transition-all duration-300 hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5 text-muted-foreground group-hover:text-foreground dark:text-white transition-colors">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Join the community</span>
            </a>
          </div>
        </div>

        {/* Footer Links - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Categories</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/?category=Tech" className="hover:text-foreground transition-colors">Technology</Link></li>
              <li><Link to="/?category=Fintech" className="hover:text-foreground transition-colors">Fintech</Link></li>
              <li><Link to="/?category=Blockchain" className="hover:text-foreground transition-colors">Blockchain</Link></li>
              <li><Link to="/?category=Funding" className="hover:text-foreground transition-colors">Funding</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Company</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/advertise" className="hover:text-foreground transition-colors">Advertise</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Resources</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/help-center" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Follow Us</h4>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-all hover:translate-x-1 hover:text-sky-500 w-fit" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-all hover:translate-x-1 hover:text-blue-700 w-fit" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-all hover:translate-x-1 hover:text-blue-600 w-fit" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-all hover:translate-x-1 hover:text-pink-500 w-fit" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; 2025 India's Got Startup. All rights reserved.</p>
        </div>
      </div>

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Subscribed!"
        message="You've been successfully subscribed to our newsletter. Get ready for the latest startup stories right in your inbox."
      />
    </footer>
  );
};
