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
    <div className="min-h-screen bg-background relative selection:bg-cyan-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-cyan-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[50vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">We're Hiring</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                Build the Future of Media with Us
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 font-medium mb-12">
                Join a passionate team that's redefining how stories are told and shared. 
                We're looking for curious minds who want to make an impact.
              </p>
              <Button asChild className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-foreground dark:text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 rounded-xl">
                <a href="#positions" className="gap-3">
                  View Open Positions <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-4 text-foreground dark:text-white tracking-widest uppercase">Why Join India's Got Startup?</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg hover:text-foreground/80 transition-colors">
              We believe great work happens when people feel supported, challenged, and valued.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border p-6 rounded-2xl hover:border-cyan-500/50 hover:bg-muted/80 dark:bg-neutral-800/80 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
                      <benefit.icon className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-cyan-200 transition-colors">{benefit.title}</h3>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-24 bg-slate-50/80 dark:bg-black/40 border-y border-border relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-4xl font-black text-center mb-4 text-foreground dark:text-white tracking-widest uppercase">Open Positions</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
              Find your next opportunity and help us shape the future of digital publishing.
            </p>
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={index} className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8 hover:border-purple-500/50 hover:bg-muted/80 dark:bg-neutral-800/80 transition-all duration-300 shadow-xl group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-foreground dark:text-white group-hover:text-purple-300 transition-colors">{position.title}</h3>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-semibold">{position.department}</Badge>
                      </div>
                      <p className="text-foreground/80 mb-5 text-lg">{position.description}</p>
                      <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-border group-hover:border-border transition-colors">
                          <MapPin className="h-4 w-4 text-pink-400" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-border group-hover:border-border transition-colors">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button className="h-12 w-full md:w-auto px-8 font-bold bg-white text-black hover:bg-zinc-200 gap-3 border-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] group-hover:-translate-y-1 transition-all duration-300 rounded-xl">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 border-l-4 border-pink-500 pl-4 text-foreground dark:text-white">Our Culture</h2>
                <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
                  <p>
                    We're a remote-first company that values autonomy, transparency, and continuous learning. 
                    Our team spans across India and beyond, united by a shared passion for great content.
                  </p>
                  <p>
                    We believe in hiring people who are curious, kind, and committed to doing their best work. 
                    We don't micromanage—we trust you to manage your time and deliver results.
                  </p>
                  <p className="relative pl-6 border-l-2 border-cyan-500/50 italic text-zinc-200 bg-cyan-500/5 py-4 pr-4 rounded-r-xl">
                    Every voice matters here. Whether you're an intern or a senior leader, your ideas 
                    are welcome and valued. We encourage experimentation and learn from failures.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-105 transition-transform duration-500" />
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] mt-8 hover:scale-105 transition-transform duration-500" />
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-500/30 to-pink-500/10 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:scale-105 transition-transform duration-500" />
                <div className="aspect-square rounded-2xl bg-muted/80 dark:bg-neutral-800/80 border border-border mt-8 backdrop-blur-sm hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden bg-slate-50/80 dark:bg-black/40 border-t border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-neutral-950 to-neutral-950 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
            <h2 className="text-5xl font-black mb-6 text-foreground dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Don't See the Right Role?</h2>
            <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              We're always looking for talented people. Send us your resume and tell us how you can contribute.
            </p>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-neutral-900 text-foreground dark:text-white border-border hover:bg-neutral-800 hover:text-foreground dark:text-white transition-all rounded-xl hover:scale-105 active:scale-95 duration-300">
              Send General Application
            </Button>
          </div>
        </section>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default Careers;
