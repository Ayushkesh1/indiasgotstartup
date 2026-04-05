import { useState } from "react";
import { Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import childrenEducationImg from "@/assets/children-education.webp";

export const NewsletterFooter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter",
        });
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
    <footer className="border-t border-border bg-card mt-12">
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
          <p>&copy; 2025 India's Got Startup. All rights reserved. | Gurugram, Haryana 122017</p>
        </div>
      </div>
    </footer>
  );
};
