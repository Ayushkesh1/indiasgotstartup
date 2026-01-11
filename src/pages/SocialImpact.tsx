import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  GraduationCap, 
  BookOpen, 
  Users,
  Target,
  TrendingUp,
  Globe,
  Laptop,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const SocialImpact = () => {
  const stats = [
    { value: "₹25L+", label: "Donated So Far", icon: Heart },
    { value: "5,000+", label: "Students Supported", icon: GraduationCap },
    { value: "50+", label: "Partner Schools", icon: BookOpen },
    { value: "12", label: "States Reached", icon: Globe },
  ];

  const initiatives = [
    {
      title: "Digital Learning Centers",
      description: "We've established computer labs in rural schools, providing students access to technology and online learning resources.",
      impact: "2,500 students gained computer access",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    },
    {
      title: "Scholarship Program",
      description: "Annual scholarships for meritorious students from underprivileged backgrounds to pursue higher education in technology fields.",
      impact: "150 scholarships awarded",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    },
    {
      title: "Content for Education",
      description: "Curated educational content from our platform made freely available to schools and educational institutions.",
      impact: "1,000+ articles made free for education",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    },
  ];

  const partners = [
    "Teach For India",
    "Pratham Education Foundation",
    "Room to Read",
    "Akshaya Patra",
    "Smile Foundation",
    "Nanhi Kali",
  ];

  const goals = [
    { goal: "Support 10,000 students by 2027", progress: 50 },
    { goal: "Establish 100 digital learning centers", progress: 50 },
    { goal: "Provide 500 scholarships", progress: 30 },
    { goal: "Reach all 28 states of India", progress: 43 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <Badge className="mb-4" variant="secondary">Social Impact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              2% For Education
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We believe in giving back. That's why we contribute 2% of all our earnings 
              to support underprivileged students across India in accessing quality education.
            </p>
            <Button size="lg" className="gap-2">
              Join Our Mission <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card/50 backdrop-blur border-border/50">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Not Your World, we believe that access to education should not be determined by 
                  circumstances of birth. Every child deserves the opportunity to learn, grow, and 
                  achieve their potential.
                </p>
                <p>
                  That's why we've made a commitment that goes beyond just business. From every rupee 
                  we earn—whether from subscriptions, advertising, or other revenue—2% goes directly 
                  to supporting educational initiatives for underprivileged students.
                </p>
                <p>
                  This isn't charity; it's our responsibility. As a platform built on knowledge sharing, 
                  we understand the transformative power of education. We're here to ensure that power 
                  reaches those who need it most.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Target className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Our Promise</h3>
                      <p className="text-sm text-muted-foreground">
                        2% of all revenue is donated to education NGOs, with full transparency 
                        on how funds are used.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Growing Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        As our platform grows, so does our contribution. More readers and creators 
                        mean more support for education.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Our Initiatives</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We focus on three key areas to maximize our educational impact.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={initiative.image} 
                    alt={initiative.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{initiative.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{initiative.description}</p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" />
                    {initiative.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Progress */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">Our Goals</h2>
          <p className="text-center text-muted-foreground mb-12">
            Tracking our progress towards meaningful impact.
          </p>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{goal.goal}</span>
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Our Partners</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We work with established NGOs to ensure our contributions create maximum impact.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-sm">{partner}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How You Can Help */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Read & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Every article you read and share contributes to our revenue, which means more 
                  support for education.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Write Content</h3>
                <p className="text-sm text-muted-foreground">
                  Become a creator and help grow the platform. Your content helps us reach more 
                  readers and generate more funds.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Subscribe</h3>
                <p className="text-sm text-muted-foreground">
                  A premium subscription not only gives you benefits but also increases our 
                  contribution to education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Together, We Can Make a Difference</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of readers and creators who are not just consuming content, 
            but actively contributing to a better future for underprivileged students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/auth">Join Now</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/contact">Partner With Us</a>
            </Button>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default SocialImpact;
