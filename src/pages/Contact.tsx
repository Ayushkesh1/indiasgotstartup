import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  MapPin, 
  MessageSquare,
  Building,
  HelpCircle,
  Megaphone,
  ArrowRight,
  Send,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";
import { useState } from "react";

const Contact = () => {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    inquiry: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful submission
    setIsSuccessOpen(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      inquiry: "",
      message: ""
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "For general inquiries",
      contact: "connectnotyourworld@gmail.com",
      color: "blue"
    },
    {
      icon: Mail,
      title: "Support",
      description: "For support requests",
      contact: "notyourworld0@gmail.com",
      color: "indigo"
    },
    {
      icon: MapPin,
      title: "Our Location",
      description: "We're based in",
      contact: "Gurugram, Haryana, India",
      color: "purple"
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "advertising", label: "Advertising" },
    { value: "partnership", label: "Partnership" },
    { value: "press", label: "Press & Media" },
    { value: "creator", label: "Creator Program" },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-blue-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[30%] left-[20%] w-[30%] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 flex items-center justify-center min-h-[45vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-neutral-950/80 to-neutral-950 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <Badge className="mb-6 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/50 px-4 py-1.5 text-sm uppercase tracking-widest font-black">Get In Touch</Badge>
              <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] tracking-tight">
                We'd Love to <br /> Hear From You
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
                Have a question, feedback, or just want to say hello? 
                Our team is ready to collaborate and innovate with you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 relative -mt-32 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid sm:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-${method.color}-500 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500`} />
                  <Card className="relative h-full text-center bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl border-border group-hover:border-border transition-all duration-300 rounded-[2rem] overflow-hidden shadow-2xl">
                    <CardContent className="pt-10 pb-10 px-6">
                      <div className={`w-16 h-16 rounded-2xl bg-${method.color}-500/20 border border-${method.color}-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <method.icon className={`h-8 w-8 text-${method.color}-400 group-hover:text-${method.color}-300`} />
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-foreground dark:text-foreground dark:text-white group-hover:text-foreground/80 dark:group-hover:text-zinc-200 transition-colors tracking-tight">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-widest">{method.description}</p>
                      <p className="text-base font-bold text-foreground dark:text-zinc-200 break-all bg-muted dark:bg-white/5 py-3 px-4 rounded-xl inline-block border border-border transition-all group-hover:bg-muted/80 dark:group-hover:bg-white/10 group-hover:border-border">{method.contact}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-5 gap-16">
              {/* Form Section */}
              <div className="lg:col-span-3">
                <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl border border-border rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden h-full flex flex-col group/form">
                  {/* Form decor */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50 group-hover/form:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center gap-6 mb-12">
                    <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30 shadow-lg">
                      <MessageSquare className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-foreground dark:text-foreground dark:text-white tracking-tight">Send Us a Message</h2>
                      <p className="text-muted-foreground font-medium">We usually respond within 24 hours.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase px-1">First Name</Label>
                        <Input 
                          id="firstName" 
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John" 
                          className="h-14 bg-muted/50 dark:bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-blue-500/50 text-foreground dark:text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-700 rounded-2xl transition-all hover:border-border" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase px-1">Last Name</Label>
                        <Input 
                          id="lastName" 
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe" 
                          className="h-14 bg-muted/50 dark:bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-blue-500/50 text-foreground dark:text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-700 rounded-2xl transition-all hover:border-border" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase px-1">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="h-14 bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-blue-500/50 text-foreground dark:text-white placeholder:text-zinc-700 rounded-2xl transition-all hover:border-border" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="inquiry" className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase px-1">Inquiry Type</Label>
                      <Select 
                        required
                        value={formData.inquiry}
                        onValueChange={(value) => setFormData({ ...formData, inquiry: value })}
                      >
                        <SelectTrigger className="h-14 bg-muted/50 dark:bg-slate-50/80 dark:bg-black/40 border-border focus:ring-blue-500/50 text-foreground dark:text-foreground dark:text-white rounded-2xl transition-all hover:border-border">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card dark:bg-neutral-900 border-border text-foreground dark:text-foreground dark:text-white rounded-2xl p-2 backdrop-blur-xl">
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="h-11 rounded-xl focus:bg-blue-500/20 focus:text-blue-100 cursor-pointer transition-colors mb-1 last:mb-0">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3 flex-1 flex flex-col">
                      <Label htmlFor="message" className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase px-1">How can we help?</Label>
                      <Textarea 
                        id="message" 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us everything..."
                        className="flex-1 min-h-[160px] bg-muted/50 dark:bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-blue-500/50 text-foreground dark:text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-700 rounded-3xl resize-none transition-all hover:border-border px-6 py-5 leading-relaxed"
                      />
                    </div>
                    <GradientButton type="submit" className="h-16 text-xl font-bold rounded-2xl group active:scale-95 transition-all">
                      Send Message <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </GradientButton>
                  </form>
                </div>
              </div>

              {/* Quick Links & Side Info */}
              <div className="lg:col-span-2 space-y-8">
                {[
                  { icon: HelpCircle, title: "Need Help?", desc: "Check our Help Center for answers to frequently asked questions.", link: "/help-center", btnText: "Visit Help Center", color: "blue" },
                  { icon: Megaphone, title: "Advertising", desc: "Interested in advertising with us? Learn about our premium options.", link: "/advertise", btnText: "View Media Kit", color: "purple" },
                  { icon: Building, title: "Careers", desc: "Want to join our team? Check out our open positions and perks.", link: "/careers", btnText: "Explore Roles", color: "pink" }
                ].map((item, idx) => (
                  <div key={idx} className="group p-8 bg-white/5 border border-border rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/10 hover:border-border">
                    <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-${item.color}-500/5 rounded-full blur-[40px] group-hover:bg-${item.color}-500/10 transition-all duration-500`} />
                    <div className="flex items-start gap-6 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <item.icon className={`h-7 w-7 text-${item.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-foreground dark:text-foreground dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-100 transition-colors tracking-tight">{item.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                          {item.desc}
                        </p>
                        <Button variant="outline" size="sm" asChild className="h-10 px-6 bg-muted/50 dark:bg-white/5 border-border text-foreground dark:text-foreground dark:text-white hover:bg-muted dark:hover:bg-white hover:text-foreground dark:hover:text-black rounded-xl transition-all font-bold">
                          <Link to={item.link}>{item.btnText}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Location Card */}
                <div className="bg-card dark:bg-neutral-900 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative group/loc">
                  <div className="aspect-[21/9] bg-blue-500/10 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse" />
                    <MapPin className="h-12 w-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover/loc:scale-125 transition-transform duration-700" />
                  </div>
                  <div className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-2xl font-black text-foreground dark:text-foreground dark:text-white tracking-tight">Gurugram Lab</h3>
                    </div>
                    <div className="space-y-6">
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                        Sector 44, Gurugram <br />
                        Haryana 122017, India
                      </p>
                      <div className="h-px w-full bg-white/5" />
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-sm text-foreground font-bold select-all">connectnotyourworld@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <NewsletterFooter />

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Message Sent!"
        message="Thank you for reaching out. Our team has received your inquiry and will get back to you within 24 hours."
      />
    </div>
  );
};

export default Contact;

