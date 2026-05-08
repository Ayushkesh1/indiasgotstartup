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
    <div className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[50vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">About Us</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Empowering Voices, Sharing Knowledge
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 font-medium mb-12">
                India's Got Startup is more than just a publishing platform. We're a community of thinkers, 
                innovators, and storytellers dedicated to exploring how technology shapes our world.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border shadow-[0_0_30px_rgba(168,85,247,0.05)] rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2 inline-block">{stat.value}</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 border-l-4 border-cyan-500 pl-4 text-foreground dark:text-white">Our Story</h2>
                <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
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
                  <p className="relative pl-6 border-l-2 border-purple-500/50 italic text-zinc-200 bg-purple-500/5 py-4 pr-4 rounded-r-xl">
                    Today, we're proud to host thousands of articles covering everything from blockchain 
                    innovations to fintech disruptions, from government tech initiatives to the latest 
                    in edtech solutions.
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                <div className="aspect-video rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/80 border border-border flex items-center justify-center relative shadow-2xl backdrop-blur-sm z-10">
                  <Sparkles className="h-24 w-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-slate-50/80 dark:bg-black/40 border-y border-border relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-16 text-foreground dark:text-white tracking-widest uppercase">What Drives Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border p-8 rounded-2xl hover:border-purple-500/50 hover:bg-muted/80 dark:bg-neutral-800/80 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                    <value.icon className="h-8 w-8 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-white group-hover:text-purple-200 transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-4 text-foreground dark:text-white tracking-widest uppercase">Meet Our Team</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
              Our diverse team brings together expertise in technology, journalism, and community building.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="overflow-hidden group rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-border shadow-xl hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-6 text-center bg-gradient-to-t from-black/80 to-transparent relative z-20 -mt-16 pt-12">
                    <h3 className="font-bold text-xl text-foreground dark:text-white drop-shadow-md mb-1">{member.name}</h3>
                    <p className="text-sm font-semibold text-cyan-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Impact Banner */}
        <section className="py-16 bg-neutral-900 border-y border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/80 dark:bg-black/40 p-8 rounded-3xl border border-border shadow-[0_0_30px_rgba(168,85,247,0.1)] backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                  <Heart className="h-8 w-8 text-foreground dark:text-white fill-white/20" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">2% For Education</h3>
                  <p className="text-foreground/80 text-lg">We consistently contribute 2% of our earnings to support student education worldwide</p>
                </div>
              </div>
              <Button asChild className="h-14 px-8 text-base font-bold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-foreground dark:text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 rounded-xl whitespace-nowrap">
                <Link to="/social-impact" className="gap-3">
                  Learn More <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-5xl font-black mb-6 text-foreground dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Join Our Community</h2>
            <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Whether you're a reader seeking quality content or a creator ready to share your voice, 
              there's a place for you at India's Got Startup.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 duration-300">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-10 text-lg font-bold bg-neutral-900 text-foreground dark:text-white border-border hover:bg-neutral-800 hover:text-foreground dark:text-white transition-all rounded-xl hover:scale-105 active:scale-95 duration-300">
                <Link to="/creator-program">Become a Creator</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default AboutUs;
