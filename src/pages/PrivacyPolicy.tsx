import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Eye, FileText, Globe, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-indigo-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">Legal</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                Privacy Policy
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground dark:text-white prose-p:text-foreground/80 prose-strong:text-foreground dark:text-white prose-li:text-foreground/80">
                <div className="flex items-center gap-4 mb-8 not-prose">
                  <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                    <ShieldCheck className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-white mb-0">Our Privacy Commitment</h2>
                </div>

                <p className="text-lg leading-relaxed mb-12">
                  At India's Got Startup, your privacy is our top priority. We've built our platform with transparency 
                  at its core, ensuring you always know how your data is handled. This policy outlines our practices 
                  and your rights.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12 not-prose">
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <Lock className="h-8 w-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Secure by Design</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Advanced encryption and security measures to protect your personal information.</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <Eye className="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Transparency First</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Clear explanations of what data we collect and how we use it to improve your experience.</p>
                  </div>
                </div>

                <h2>1. Introduction</h2>
                <p>
                  India's Got Startup ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                  Policy explains how we collect, use, disclose, and safeguard your information when you use 
                  our platform and services.
                </p>

                <h2>2. Information We Collect</h2>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-6 mb-8 mt-4">
                  <h3>2.1 Information You Provide</h3>
                  <ul>
                    <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                    <li><strong>Content:</strong> Articles, comments, and other content you create</li>
                    <li><strong>Payment Information:</strong> Bank details or UPI IDs for creator payouts</li>
                    <li><strong>Communications:</strong> Messages you send to us or other users</li>
                  </ul>
                </div>

                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-6 mb-8">
                  <h3>2.2 Information Collected Automatically</h3>
                  <ul>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, articles read, and interactions</li>
                    <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                    <li><strong>Location Data:</strong> General location based on IP address</li>
                    <li><strong>Cookies and Tracking:</strong> As described in our Cookie Policy</li>
                  </ul>
                </div>

                <h2>3. How We Use Your Information</h2>
                <p>We use the collected information for:</p>
                <ul>
                  <li>Providing and maintaining our services</li>
                  <li>Processing your transactions and managing your account</li>
                  <li>Personalizing your experience and content recommendations</li>
                  <li>Calculating and distributing creator earnings</li>
                  <li>Sending newsletters and marketing communications (with your consent)</li>
                  <li>Analyzing usage patterns to improve our platform</li>
                  <li>Preventing fraud and ensuring platform security</li>
                  <li>Complying with legal obligations</li>
                </ul>

                <h2>4. Information Sharing</h2>
                <h3>4.1 Public Information</h3>
                <p>
                  Your profile name, bio, and published articles are publicly visible. Comments you post 
                  are visible to other users.
                </p>

                <div className="relative p-6 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl my-8">
                  <h4 className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                    <Globe className="h-4 w-4" /> Global Collaboration
                  </h4>
                  <p className="text-sm italic text-foreground/80 m-0">
                    We may share your information with service providers who assist us in operating the platform, 
                    including cloud hosting, payment processing, and analytics tools.
                  </p>
                </div>

                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These 
                  measures include:
                </p>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection</li>
                </ul>

                <h2>6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as your account is active or as needed to 
                  provide you services. We may retain certain information for longer periods for legal, 
                  business, or security purposes.
                </p>

                <h2>7. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data. You can also request 
                data portability or restrict our processing of your information.</p>
                
                <div className="grid sm:grid-cols-3 gap-4 my-8 not-prose">
                  <div className="p-4 bg-white/5 border border-border rounded-xl text-center">
                    <div className="text-foreground dark:text-white font-bold mb-1">Access</div>
                    <div className="text-xs text-muted-foreground">View your data</div>
                  </div>
                  <div className="p-4 bg-white/5 border border-border rounded-xl text-center">
                    <div className="text-foreground dark:text-white font-bold mb-1">Correction</div>
                    <div className="text-xs text-muted-foreground">Update errors</div>
                  </div>
                  <div className="p-4 bg-white/5 border border-border rounded-xl text-center">
                    <div className="text-foreground dark:text-white font-bold mb-1">Deletion</div>
                    <div className="text-xs text-muted-foreground">Remove records</div>
                  </div>
                </div>

                <p>
                  To exercise these rights, please contact us at <span className="text-indigo-400 font-bold selection:bg-indigo-500/50">connectnotyourworld@gmail.com</span> or through your account settings.
                </p>

                <h2>8. Children's Privacy</h2>
                <p>
                  Our services are not intended for individuals under the age of 13. If you become aware that 
                  a child has provided us with personal information, please contact us immediately.
                </p>

                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl my-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-amber-500 font-bold m-0 mb-1">Important Note</h4>
                      <p className="text-sm text-muted-foreground m-0">We do not knowingly collect personal information from children under 13.</p>
                    </div>
                  </div>
                </div>

                <h2>9. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than India. We 
                  ensure appropriate safeguards are in place to protect your data.
                </p>

                <h2>10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>

                <h2>11. Contact Us</h2>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-8 mt-8 not-prose">
                  <FileText className="h-10 w-10 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Questions or Concerns?</h3>
                  <p className="text-muted-foreground mb-6">If you have questions about this Privacy Policy or our data practices, please reach out to our team.</p>
                  <div className="space-y-2">
                    <p className="text-foreground dark:text-white font-semibold">Email: <a href="mailto:connectnotyourworld@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">connectnotyourworld@gmail.com</a></p>
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

export default PrivacyPolicy;

