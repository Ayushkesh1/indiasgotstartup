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

const Advertise = () => {
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">Advertising</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Reach India's Tech-Savvy Audience
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with millions of engaged readers who are passionate about technology, 
              fintech, and innovation. Our audience is ready to discover your brand.
            </p>
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card/50 backdrop-blur border-border/50">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Advertise With Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Targeted Reach</h3>
                    <p className="text-muted-foreground text-sm">
                      Our audience consists of tech professionals, entrepreneurs, and decision-makers actively seeking innovative solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">High Engagement</h3>
                    <p className="text-muted-foreground text-sm">
                      With an average read time of 8 minutes, our readers are deeply engaged with our content and your ads.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Measurable Results</h3>
                    <p className="text-muted-foreground text-sm">
                      Full transparency with detailed analytics, impression tracking, and click-through reporting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Quality Audience</h3>
                    <p className="text-muted-foreground text-sm">
                      70% of our readers return monthly, indicating a loyal and invested audience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceStats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stat.label}</span>
                      <span className="text-muted-foreground">{stat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Advertising Options</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the format that best fits your marketing goals and budget.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {adFormats.map((format, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{format.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{format.description}</p>
                  <ul className="space-y-2 mb-6">
                    {format.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-semibold text-primary">{format.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4">Get in Touch</h2>
          <p className="text-center text-muted-foreground mb-12">
            Ready to reach our audience? Fill out the form and our advertising team will contact you.
          </p>
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Company name" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Monthly Budget</Label>
                    <Input id="budget" placeholder="e.g., ₹50,000 - ₹1,00,000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about your campaign</Label>
                  <Textarea 
                    id="message" 
                    placeholder="What are your advertising goals? What products/services would you like to promote?"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default Advertise;
