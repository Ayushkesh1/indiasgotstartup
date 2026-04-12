import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JoinMissionDialog } from "@/components/JoinMissionDialog";
import { GradientButton } from "@/components/ui/gradient-button";
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
  CheckCircle,
  Sparkles
} from "lucide-react";

const SocialImpact = () => {
  const [isJoinMissionOpen, setIsJoinMissionOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stats = [
    { value: "₹10K+", label: "Donated So Far", icon: Heart, color: "pink" },
    { value: "5", label: "Students Supported", icon: GraduationCap, color: "blue" },
    { value: "1", label: "Partner Schools", icon: BookOpen, color: "purple" },
    { value: "1", label: "States Reached", icon: Globe, color: "emerald" },
  ];

  const initiatives = [
    {
      title: "Digital Learning Centers",
      description: "We've established computer labs in rural schools, providing students access to technology and online learning resources.",
      impact: "2,500 students gained computer access",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      accent: "blue"
    },
    {
      title: "Scholarship Program",
      description: "Annual scholarships for meritorious students from underprivileged backgrounds to pursue higher education in technology fields.",
      impact: "150 scholarships awarded",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      accent: "purple"
    },
    {
      title: "AI Skill Development",
      description: "Empowering the next generation with advanced artificial intelligence and machine learning training for future-ready careers.",
      impact: "500+ aspiring developers trained",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
      accent: "pink"
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

  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[40%] left-[20%] w-[30%] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 flex items-center justify-center min-h-[60vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-neutral-950/50 to-neutral-950 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-8 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Heart className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/50 px-4 py-1.5 text-sm uppercase tracking-widest font-bold">
                Social Impact
              </Badge>
              <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-tight">
                2% For Education
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed mb-12 max-w-3xl">
                We believe in giving back. That's why we contribute <span className="text-emerald-400 font-black italic">2%</span> of all our earnings
                to support underprivileged students across India in accessing quality education.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <GradientButton onClick={() => setIsJoinMissionOpen(true)} className="h-14 px-10 text-lg group">
                  Join Our Mission <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
        
        <JoinMissionDialog open={isJoinMissionOpen} onOpenChange={setIsJoinMissionOpen} />

        {/* Stats Grid */}
        <section className="py-8 relative z-20 -mt-16 mb-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-${stat.color}-500 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500`} />
                  <Card className="relative h-full text-center bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border-border group-hover:border-border transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl">
                    <CardContent className="pt-8 pb-8 px-4">
                      <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/20 flex items-center justify-center mx-auto mb-5 border border-${stat.color}-500/30 group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon className={`h-7 w-7 text-${stat.color}-400`} />
                      </div>
                      <div className="text-4xl font-black text-foreground dark:text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold group-hover:text-foreground/80 transition-colors">{stat.label}</div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container mx-auto px-4 max-w-6xl relative">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Empowering the Future</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground dark:text-white mb-8 tracking-tight">Our Commitment</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
                  <p>
                    At India's Got Startup, we believe that access to education should not be determined by
                    circumstances of birth. Every child deserves the opportunity to learn, grow, and
                    achieve their potential.
                  </p>
                  <p className="border-l-4 border-emerald-500/50 pl-6 py-2 bg-emerald-500/5 rounded-r-2xl">
                    That's why we've made a commitment that goes beyond just business: <span className="text-foreground dark:text-white">2% of everything we earn</span> goes directly to supporting educational initiatives.
                  </p>
                  <p>
                    This isn't charity; it's our responsibility. As a platform built on knowledge sharing,
                    we understand the transformative power of education.
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="group p-8 bg-white/5 border border-border rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/10">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                      <Target className="h-10 w-10 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground dark:text-white mb-3">Our Promise</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        2% of all revenue is donated to education NGOs, with full transparency on how funds are used to change lives.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group p-8 bg-white/5 border border-border rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/10">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                      <TrendingUp className="h-10 w-10 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground dark:text-white mb-3">Growing Impact</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        As our community grows, so does our contribution. Every reader and creator adds to the wave of educational support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="inline-block relative mb-4">
              <h2 className="text-4xl md:text-5xl font-black text-foreground dark:text-white relative z-10">Our Initiatives</h2>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-emerald-500/20 -rotate-1 z-0" />
            </div>
            <div className="flex justify-center mb-12">
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 uppercase tracking-widest font-black bg-purple-500/10 px-4 py-1 animate-pulse">
                Expanding Every Month
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              We focus on three key pillars to maximize our educational impact across rural India.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {initiatives.map((initiative, index) => (
                <div key={index} className="group relative flex flex-col h-full bg-white/70 dark:bg-zinc-900/40 border border-border rounded-[2rem] overflow-hidden hover:border-border transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute bottom-4 left-4 z-20`}>
                      <Badge className={`bg-${initiative.accent}-500 text-foreground dark:text-white border-none shadow-lg px-3 py-1`}>
                        {initiative.impact.split(' ')[0]} {initiative.impact.split(' ')[1]}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 text-left">
                    <h3 className="text-2xl font-black text-foreground dark:text-white mb-4 group-hover:text-emerald-400 transition-colors">{initiative.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 font-medium flex-1">{initiative.description}</p>
                    <div className={`flex items-center gap-2 text-sm font-bold text-${initiative.accent}-400`}>
                      <CheckCircle className="h-5 w-5" />
                      {initiative.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Networking */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-white/5 backdrop-blur-3xl border border-border rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-black text-foreground dark:text-white mb-4 tracking-tight">Impact Partners</h2>
                <div className="flex justify-center mb-8">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest text-xs px-4">NGO Network</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto font-medium">
                  We work with established NGOs to ensure our contributions create maximum impact in the communities we serve.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {partners.map((partner, index) => (
                    <div key={index} className="group p-6 bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl flex flex-col items-center justify-center transition-all hover:bg-slate-100/90 dark:bg-black/60 hover:border-emerald-500/30 hover:scale-105 active:scale-95 cursor-default">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Users className="h-6 w-6 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="font-bold text-xs text-muted-foreground group-hover:text-foreground dark:text-white transition-colors">{partner}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How You Can Help Section */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-5xl font-black text-foreground dark:text-white mb-16 text-center tracking-tight">How You Can Help</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Read & Share", icon: BookOpen, color: "emerald", desc: "Every article you read and share contributes to our revenue, meaning more support for schools." },
                { title: "Write Content", icon: Laptop, color: "blue", desc: "Become a creator. Your stories help us reach more readers and generate more impact funds." },
                { title: "Support US", icon: Heart, color: "pink", desc: "A premium subscription directly increases our contribution pool for underprivileged students." }
              ].map((item, idx) => (
                <div key={idx} className="p-10 bg-white/70 dark:bg-zinc-900/60 border border-border rounded-[2.5rem] hover:bg-neutral-900 transition-colors hover:border-border group">
                  <div className={`w-20 h-20 rounded-3xl bg-${item.color}-500/20 flex items-center justify-center mx-auto mb-8 border border-${item.color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className={`h-10 w-10 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground dark:text-white mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground group-hover:text-muted-foreground transition-colors leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-background z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full z-0" />
          
          <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950 border border-border rounded-[3.5rem] p-12 md:p-24 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
              
              <h2 className="text-5xl md:text-6xl font-black text-foreground dark:text-white mb-8 tracking-tighter">Together, We Can <br /> <span className="text-emerald-400">Make a Difference</span></h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Join our community of readers and creators who are not just consuming content,
                but actively contributing to a better future for underprivileged students.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <GradientButton asChild className="h-16 px-12 text-lg font-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <a href="/auth">Join Our Movement</a>
                </GradientButton>
                <GradientButton gradientVariant="emerald-teal" asChild className="h-16 px-12 text-lg font-black">
                  <a href="/contact">Partner With Us</a>
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default SocialImpact;

