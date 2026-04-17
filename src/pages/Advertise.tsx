import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { useState } from "react";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";

const Advertise = () => {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessOpen(true);
  };

  const stats = [
    { value: "10M+", label: "Monthly Impressions" },
    { value: "50K+", label: "Active Readers" },
    { value: "8 min", label: "Avg. Read Time" },
    { value: "70%", label: "Return Visitors" },
  ];

  const adFormats = [
    {
      title: "Display Ads",
      description: "Premium banner placements across our high-traffic pages",
      features: ["Homepage placement", "Article sidebars", "Category pages", "Mobile optimized"],
      price: "Starting at ₹25,000/month",
    },
    {
      title: "Sponsored Content",
      description: "Native articles written by our editorial team featuring your brand",
      features: ["Full article feature", "Social promotion", "Newsletter inclusion", "Permanent placement"],
      price: "Starting at ₹75,000/article",
    },
    {
      title: "Newsletter Sponsorship",
      description: "Reach our engaged subscriber base directly in their inbox",
      features: ["50K+ subscribers", "High open rates", "Dedicated section", "Weekly availability"],
      price: "Starting at ₹15,000/send",
    },
  ];

  const audienceStats = [
    { label: "Technology Professionals", percentage: 45 },
    { label: "Founders & Entrepreneurs", percentage: 25 },
    { label: "Finance & Banking", percentage: 15 },
    { label: "Students & Academics", percentage: 15 },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-orange-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[0%] left-[10%] w-[50%] h-[500px] bg-orange-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[50vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">Advertising</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                Reach India's Tech-Savvy Audience
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 font-medium mb-12">
                Connect with millions of engaged readers who are passionate about technology, 
                fintech, and innovation. Our audience is ready to discover your brand.
              </p>
              <Button asChild className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-foreground dark:text-white border-0 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 rounded-xl">
                <a href="#contact" className="gap-3">
                  Get Started <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border shadow-[0_0_30px_rgba(249,115,22,0.05)] rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 inline-block drop-shadow-sm">{stat.value}</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Advertise */}
        <section className="py-24 relative bg-slate-50/80 dark:bg-black/40 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 border-l-4 border-orange-500 pl-4 text-foreground dark:text-white uppercase tracking-wider">Why Advertise With Us?</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300">
                      <Target className="h-6 w-6 text-orange-400 group-hover:text-orange-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-orange-200 transition-colors">Targeted Reach</h3>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">
                        Our audience consists of tech professionals, entrepreneurs, and decision-makers actively seeking innovative solutions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                      <BarChart3 className="h-6 w-6 text-pink-400 group-hover:text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-pink-200 transition-colors">High Engagement</h3>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">
                        With an average read time of 8 minutes, our readers are deeply engaged with our content and your ads.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                      <TrendingUp className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-purple-200 transition-colors">Measurable Results</h3>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">
                        Full transparency with detailed analytics, impression tracking, and click-through reporting.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
                      <Users className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-cyan-200 transition-colors">Quality Audience</h3>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">
                        70% of our readers return monthly, indicating a loyal and invested audience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-orange-500/20 transition-colors duration-700" />
                <h3 className="text-2xl font-bold text-foreground dark:text-white mb-8 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent inline-block">Audience Demographics</h3>
                <div className="space-y-6">
                  {audienceStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground/80">
                        <span>{stat.label}</span>
                        <span className="text-purple-400">{stat.percentage}%</span>
                      </div>
                      <div className="h-3 bg-background rounded-full overflow-hidden border border-border relative">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Formats */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-4 text-foreground dark:text-white uppercase tracking-widest">Advertising Options</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
              Choose the format that best fits your marketing goals and budget.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {adFormats.map((format, index) => (
                <div key={index} className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col">
                  <div className="p-8 pb-0">
                    <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3 group-hover:text-orange-300 transition-colors">{format.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed min-h-[60px]">{format.description}</p>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <ul className="space-y-4 mb-8 flex-1">
                      {format.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                          <CheckCircle className="h-5 w-5 text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)] flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-6 border-t border-border text-center">
                      <div className="text-lg font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">{format.price}</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-24 relative overflow-hidden bg-slate-50/80 dark:bg-black/40 border-t border-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[400px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-4 text-foreground dark:text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Get in Touch</h2>
            <p className="text-center text-foreground/80 mb-12 text-lg">
              Ready to reach our audience? Fill out the form and our advertising team will contact you.
            </p>
            <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl border border-border p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Form decor */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-foreground/80 font-semibold tracking-wide text-xs uppercase px-1">Full Name</Label>
                    <Input id="name" placeholder="Your name" className="h-12 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 text-foreground dark:text-white placeholder:text-zinc-600 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-foreground/80 font-semibold tracking-wide text-xs uppercase px-1">Company</Label>
                    <Input id="company" placeholder="Company name" className="h-12 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 text-foreground dark:text-white placeholder:text-zinc-600 rounded-xl" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-foreground/80 font-semibold tracking-wide text-xs uppercase px-1">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" className="h-12 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 text-foreground dark:text-white placeholder:text-zinc-600 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-foreground/80 font-semibold tracking-wide text-xs uppercase px-1">Monthly Budget</Label>
                    <Input id="budget" placeholder="e.g., ₹50,000 - ₹1,00,000" className="h-12 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 text-foreground dark:text-white placeholder:text-zinc-600 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-foreground/80 font-semibold tracking-wide text-xs uppercase px-1">Tell us about your campaign</Label>
                  <Textarea 
                    id="message" 
                    placeholder="What are your advertising goals? What products/services would you like to promote?"
                    rows={5}
                    className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 text-foreground dark:text-white placeholder:text-zinc-600 rounded-xl resize-none"
                  />
                </div>
                <Button type="submit" className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200 gap-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                  <Mail className="h-5 w-5" />
                  Submit Inquiry
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <NewsletterFooter />

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Application Received!"
        message="Thank you for your interest in advertising with us. Our team will review your application and get back to you shortly."
      />
    </div>
  );
};

export default Advertise;
