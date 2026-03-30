import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users,
  Heart,
  Laptop,
  Coffee,
  Plane,
  GraduationCap,
  ArrowRight
} from "lucide-react";

const Careers = () => {
  const benefits = [
    { icon: Laptop, title: "Remote First", description: "Work from anywhere in the world" },
    { icon: Heart, title: "Health Benefits", description: "Comprehensive health insurance" },
    { icon: GraduationCap, title: "Learning Budget", description: "₹50,000/year for courses" },
    { icon: Plane, title: "Unlimited PTO", description: "Take time off when you need it" },
    { icon: Coffee, title: "Team Offsites", description: "Quarterly team gatherings" },
    { icon: Users, title: "Diverse Team", description: "Inclusive and welcoming culture" },
  ];

  const positions = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote (India)",
      type: "Full-time",
      description: "Build and maintain our React-based platform serving millions of readers.",
    },
    {
      title: "Content Strategist",
      department: "Editorial",
      location: "Mumbai, India",
      type: "Full-time",
      description: "Shape our content strategy and help creators produce engaging articles.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote (India)",
      type: "Full-time",
      description: "Design intuitive experiences for our reading and writing platforms.",
    },
    {
      title: "Community Manager",
      department: "Community",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Build and nurture our creator community across India.",
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote (India)",
      type: "Full-time",
      description: "Derive insights from user data to improve our platform.",
    },
    {
      title: "Marketing Intern",
      department: "Marketing",
      location: "Remote (India)",
      type: "Internship",
      description: "Assist with marketing campaigns and social media management.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">We're Hiring</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build the Future of Media with Us
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join a passionate team that's redefining how stories are told and shared. 
              We're looking for curious minds who want to make an impact.
            </p>
            <Button size="lg" className="gap-2">
              View Open Positions <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why Join India's Got Startup?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We believe great work happens when people feel supported, challenged, and valued.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find your next opportunity and help us shape the future of digital publishing.
          </p>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{position.title}</h3>
                        <Badge variant="secondary">{position.department}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{position.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button className="gap-2">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We're a remote-first company that values autonomy, transparency, and continuous learning. 
                  Our team spans across India and beyond, united by a shared passion for great content.
                </p>
                <p>
                  We believe in hiring people who are curious, kind, and committed to doing their best work. 
                  We don't micromanage—we trust you to manage your time and deliver results.
                </p>
                <p>
                  Every voice matters here. Whether you're an intern or a senior leader, your ideas 
                  are welcome and valued. We encourage experimentation and learn from failures.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
              <div className="aspect-square rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 mt-8" />
              <div className="aspect-square rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5" />
              <div className="aspect-square rounded-xl bg-gradient-to-br from-muted to-muted/50 mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and tell us how you can contribute.
          </p>
          <Button size="lg" variant="outline">
            Send General Application
          </Button>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default Careers;
