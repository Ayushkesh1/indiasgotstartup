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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">Help Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers, tips, and guidance for using Not Your World.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.articles} articles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {popularFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/contact" className="gap-2">
                    Contact Support <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline">
                  Browse All Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default HelpCenter;
