import { useState } from "react";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  BookOpen, 
  PenLine, 
  User, 
  CreditCard,
  Shield,
  MessageCircle,
  ExternalLink
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      articles: 12,
    },
    {
      icon: PenLine,
      title: "Writing & Publishing",
      description: "Create and share your content",
      articles: 18,
    },
    {
      icon: User,
      title: "Account & Profile",
      description: "Manage your account settings",
      articles: 15,
    },
    {
      icon: CreditCard,
      title: "Payments & Earnings",
      description: "Understand our creator payment system",
      articles: 10,
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Keep your account secure",
      articles: 8,
    },
    {
      icon: MessageCircle,
      title: "Community Guidelines",
      description: "Our rules and policies",
      articles: 6,
    },
  ];

  const popularFAQs = [
    {
      question: "How do I create an account?",
      answer: "Creating an account is easy! Click the 'Sign Up' button in the top navigation, enter your email address, create a password, and verify your email. You can also sign up using your Google account for faster registration.",
    },
    {
      question: "How do I publish my first article?",
      answer: "After logging in, click 'Write' in the navigation bar. This opens our rich text editor where you can compose your article. Add a title, write your content, select a category, and optionally add a featured image. When you're ready, click 'Publish' to share it with the world.",
    },
    {
      question: "How does the Creator Program work?",
      answer: "Our Creator Program allows writers to earn money based on engagement with their content. You earn points from views, comments, and bookmarks. At the end of each month, we distribute 50% of our subscription revenue to creators based on their share of total engagement points.",
    },
    {
      question: "When and how do I get paid?",
      answer: "Payments are processed at the beginning of each month for the previous month's earnings. You need a minimum balance of ₹500 to request a payout. We support UPI and bank transfers. Set up your payment details in the Creator Dashboard under 'Payout Settings'.",
    },
    {
      question: "How can I edit or delete my article?",
      answer: "Go to your Profile and click on 'My Articles'. Find the article you want to modify and click the edit (pencil) icon. Make your changes and save. To delete, click the delete icon and confirm. Note that deleted articles cannot be recovered.",
    },
    {
      question: "Can I schedule articles for future publication?",
      answer: "Currently, we support saving drafts but not scheduled publishing. Save your article as a draft and manually publish it when you're ready. Scheduled publishing is on our roadmap for future updates.",
    },
    {
      question: "How do I report inappropriate content?",
      answer: "On any article, click the three-dot menu and select 'Report'. Choose a reason for your report and provide additional details if needed. Our moderation team reviews all reports within 24 hours.",
    },
    {
      question: "How can I increase my article visibility?",
      answer: "Write quality content with engaging titles and clear structure. Use relevant tags, add a compelling featured image, and share on social media. Consistent publishing and engaging with comments also helps build your audience.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-emerald-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-violet-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-background dark:via-neutral-950 to-background/20 dark:to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">Help Center</Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              How Can We Help You?
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-medium mb-10">
              Find answers, tips, and guidance for using India's Got Startup.
            </p>
            
            {/* Search */}
            <div className="relative w-full max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-md opacity-30 group-focus-within:opacity-60 transition-opacity duration-300" />
              <div className="relative flex items-center bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl">
                <Search className="absolute left-6 h-6 w-6 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help..."
                  className="pl-14 h-14 bg-transparent border-none text-lg text-foreground dark:text-foreground dark:text-white placeholder:text-muted-foreground focus-visible:ring-0 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative z-20 -mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-muted/90 dark:bg-neutral-800/90 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group cursor-pointer hover:-translate-y-2">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300">
                    <category.icon className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground dark:text-foreground dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {category.description}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full inline-block border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                      {category.articles} articles
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular FAQs */}
      <section className="py-24 relative bg-muted/30 dark:bg-slate-50/80 dark:bg-black/40 border-y border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <h2 className="text-4xl font-black mb-12 text-center text-foreground dark:text-foreground dark:text-white uppercase tracking-widest">Frequently Asked Questions</h2>
          <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl border border-border rounded-3xl p-6 md:p-10 shadow-2xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {popularFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border bg-muted/50 dark:bg-slate-50/80 dark:bg-black/40 rounded-xl px-2">
                  <AccordionTrigger className="text-left font-bold text-lg text-foreground dark:text-foreground dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 hover:no-underline py-4 px-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 text-base leading-relaxed px-2 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <div className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500" />
            <div className="py-16 text-center px-4">
              <h2 className="text-4xl font-black mb-6 text-foreground dark:text-foreground dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Still Need Help?</h2>
              <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Can't find what you're looking for? Our dedicated support team is available 24/7 to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild className="h-14 px-10 text-lg font-bold bg-zinc-900 dark:bg-white text-foreground dark:text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-3 border-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 rounded-xl hover:-translate-y-1">
                  <a href="/contact">
                    Contact Support <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" className="h-14 px-10 text-lg font-bold bg-muted dark:bg-neutral-900 border-border hover:bg-muted-foreground/10 dark:hover:bg-neutral-800 transition-all rounded-xl hover:-translate-y-1 duration-300">
                  Browse All Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default HelpCenter;
