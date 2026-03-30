import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Lightbulb, 
  Globe, 
  Heart, 
  Award,
  ArrowRight,
  Sparkles
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { value: "50K+", label: "Active Readers" },
    { value: "2K+", label: "Published Articles" },
    { value: "500+", label: "Content Creators" },
    { value: "10M+", label: "Monthly Views" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To democratize access to quality tech journalism and empower voices from around the world to share insights on technology, fintech, and innovation.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "To become the world's most trusted platform for independent tech journalism, where every story matters and every creator thrives.",
    },
    {
      icon: Globe,
      title: "Our Reach",
      description: "We serve readers across 150+ countries, breaking down barriers to access quality content about technology and its impact on society.",
    },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      name: "Arjun Mehta",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      name: "Sneha Patel",
      role: "Head of Content",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
      name: "Rahul Verma",
      role: "Community Lead",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Empowering Voices, Sharing Knowledge
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              India's Got Startup is more than just a publishing platform. We're a community of thinkers, 
              innovators, and storytellers dedicated to exploring how technology shapes our world.
            </p>
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

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2023, India's Got Startup began with a simple observation: the best insights 
                  about technology often come from those closest to the action—developers, entrepreneurs, 
                  researchers, and everyday innovators.
                </p>
                <p>
                  We built a platform where these voices could be heard, where quality content rises 
                  through engagement rather than algorithms, and where creators are fairly compensated 
                  for their contributions.
                </p>
                <p>
                  Today, we're proud to host thousands of articles covering everything from blockchain 
                  innovations to fintech disruptions, from government tech initiatives to the latest 
                  in edtech solutions.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="h-24 w-24 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our diverse team brings together expertise in technology, journalism, and community building.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">2% For Education</h3>
                <p className="text-muted-foreground">We contribute 2% of our earnings to support student education</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/social-impact" className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a reader seeking quality content or a creator ready to share your voice, 
            there's a place for you at India's Got Startup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/creator-program">Become a Creator</Link>
            </Button>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default AboutUs;
