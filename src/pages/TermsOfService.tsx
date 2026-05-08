import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, UserCheck, ShieldAlert, Cpu, Gavel } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">Legal</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Terms of Service
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Last updated: January 11, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 relative -mt-20 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
              
              <div className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground dark:text-white prose-p:text-foreground/80 prose-strong:text-foreground dark:text-white prose-li:text-foreground/80">
                <div className="flex items-center gap-4 mb-8 not-prose">
                  <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <Scale className="h-6 w-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-white mb-0">Platform Agreement</h2>
                </div>

                <p className="text-lg leading-relaxed mb-12">
                  Welcome to India's Got Startup. By using our platform, you agree to these terms. Please read them 
                  carefully to understand your rights and responsibilities as a member of our community.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12 not-prose">
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <UserCheck className="h-8 w-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">User Responsibility</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">You are responsible for your account activity and the content you share.</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <ShieldAlert className="h-8 w-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Content Standards</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">We maintain high standards for quality and respect within our community.</p>
                  </div>
                </div>

                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using India's Got Startup ("the Platform"), you accept and agree to be bound by 
                  the terms and provisions of this agreement. If you do not agree to abide by these terms, 
                  please do not use this service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                  India's Got Startup is an online publishing platform that allows users to read, write, and share 
                  articles on technology, fintech, blockchain, and related topics. We provide tools for content 
                  creation, community engagement, and monetization for creators.
                </p>

                <h2>3. User Accounts</h2>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-6 mb-8 mt-4">
                  <h3>3.1 Registration</h3>
                  <p>
                    To access certain features of the Platform, you must register for an account. You agree to 
                    provide accurate, current, and complete information during registration.
                  </p>
                  <h3>3.2 Account Security</h3>
                  <p>
                    You are responsible for safeguarding your password and for all activities that occur under 
                    your account. Notify us immediately of any unauthorized access.
                  </p>
                </div>

                <h2>4. User Content</h2>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-6 mb-8 mt-4">
                  <h3>4.1 Ownership</h3>
                  <p>
                    You retain all ownership rights to the content you create. By posting, you grant us a worldwide, 
                    royalty-free license to use and distribute your content to operate the Platform.
                  </p>
                  <h3>4.2 Content Standards</h3>
                  <p>You agree not to post content that is illegal, harmful, threatening, abusive, or infringing on intellectual property rights.</p>
                </div>

                <h2>5. Creator Program</h2>
                <div className="relative p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded-r-2xl my-8">
                  <h4 className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                    <Cpu className="h-4 w-4" /> Monetization Rules
                  </h4>
                  <p className="text-sm italic text-foreground/80 m-0">
                    Earnings are based on engagement metrics. We distribute 50% of subscription revenue to creators. 
                    Minimum payout is ₹500.
                  </p>
                </div>

                <h2>6. Intellectual Property</h2>
                <p>
                  The Platform's original content, features, and functionality are owned by India's Got Startup 
                  and protected by international copyright and trademark laws.
                </p>

                <h2>7. Prohibited Activities</h2>
                <ul>
                  <li>Using the Platform for illegal purposes</li>
                  <li>Attempting unauthorized access to system components</li>
                  <li>Interfering with platform servers or networks</li>
                  <li>Using automated scripts to harvest data</li>
                  <li>Creating fake accounts or manipulating metrics</li>
                </ul>

                <h2>8. Termination</h2>
                <p>
                  We may terminate or suspend your account immediately for breach of these Terms. Upon termination, 
                  your right to use the Platform ceases immediately.
                </p>

                <h2>9. Disclaimers</h2>
                <p>
                  The Platform is provided "AS IS" without warranties of any kind, whether express or implied.
                </p>

                <h2>10. Limitation of Liability</h2>
                <p>
                  India's Got Startup shall not be liable for any indirect, incidental, or consequential damages 
                  resulting from your use of the Platform.
                </p>

                <h2>11. Governing Law</h2>
                <p>
                  These Terms are governed by Indian law. Disputes shall be subject to the exclusive jurisdiction 
                  of the courts in Mumbai, India.
                </p>

                <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl my-8">
                  <div className="flex items-start gap-3">
                    <Gavel className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-cyan-500 font-bold m-0 mb-1">Legal Notice</h4>
                      <p className="text-sm text-muted-foreground m-0">We reserve the right to modify these terms at any time by updating this page.</p>
                    </div>
                  </div>
                </div>

                <h2>12. Contact Information</h2>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-8 mt-8 not-prose">
                  <FileText className="h-10 w-10 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Have Questions?</h3>
                  <p className="text-muted-foreground mb-6">If you have any questions about these Terms, please reach out via email or mail.</p>
                  <div className="space-y-2">
                    <p className="text-foreground dark:text-white font-semibold">Email: <a href="mailto:connectnotyourworld@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">connectnotyourworld@gmail.com</a></p>
                    <p className="text-foreground dark:text-white font-semibold">Address: Gurugram, Haryana 122017, India</p>
                  </div>
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

export default TermsOfService;

