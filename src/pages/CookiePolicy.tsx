import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cookie, Shield, Info, Settings, MousePointer2, ExternalLink } from "lucide-react";

const CookiePolicy = () => {
  const cookies = [
    {
      name: "session_id",
      purpose: "Authentication and session management",
      duration: "Session",
      type: "Essential",
      color: "blue"
    },
    {
      name: "user_preferences",
      purpose: "Store user preferences (theme, language)",
      duration: "1 year",
      type: "Functional",
      color: "purple"
    },
    {
      name: "analytics_id",
      purpose: "Track usage patterns for platform improvement",
      duration: "2 years",
      type: "Analytics",
      color: "emerald"
    },
    {
      name: "ad_tracking",
      purpose: "Measure advertising effectiveness",
      duration: "90 days",
      type: "Advertising",
      color: "pink"
    },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-pink-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-pink-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 pb-32 flex items-center justify-center min-h-[40vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-neutral-950 to-neutral-950/20 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <Badge className="mb-6 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/50 px-4 py-1.5 text-sm uppercase tracking-widest">Legal</Badge>
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                Cookie Policy
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
              
              <div className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground dark:text-white prose-p:text-foreground/80 prose-strong:text-foreground dark:text-white prose-li:text-foreground/80">
                <div className="flex items-center gap-4 mb-8 not-prose">
                  <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
                    <Cookie className="h-6 w-6 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-white mb-0">Understanding Our Cookies</h2>
                </div>

                <p className="text-lg leading-relaxed mb-12">
                  At India's Got Startup, we use cookies and similar technologies to enhance your browsing experience, 
                  personalize content, and analyze our traffic. This policy explains how we use these tools and 
                  your choices regarding them.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12 not-prose">
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <Shield className="h-8 w-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Safe & Transparent</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">We only use cookies that are necessary for functionality or that improve your personal experience.</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-border rounded-2xl hover:bg-white/10 transition-colors group">
                    <Settings className="h-8 w-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Total Control</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">You have the power to manage or disable cookies through your browser settings at any time.</p>
                  </div>
                </div>

                <h2>1. What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you 
                  visit a website. They are widely used to make websites work more efficiently and provide 
                  information to website owners.
                </p>
                <div className="relative p-6 bg-pink-500/5 border-l-4 border-pink-500 rounded-r-2xl my-8 italic text-sm text-foreground/80">
                  Shared storage, pixels, and web beacons are included in our definition of "cookies" throughout this policy.
                </div>

                <h2>2. How We Use Cookies</h2>
                <p>We use cookies for several critical purposes:</p>
                <ul>
                  <li><strong>Essential:</strong> Core functionality like authentication and security</li>
                  <li><strong>Functional:</strong> Remembering your theme, language, and layout settings</li>
                  <li><strong>Analytics:</strong> Understanding usage patterns to build a better platform</li>
                  <li><strong>Advertising:</strong> Delivering relevant stories and measuring effectiveness</li>
                </ul>

                <h2>3. Categories of Cookies</h2>
                <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose text-sm">
                  <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-5">
                    <h4 className="text-foreground dark:text-white font-bold mb-2 flex items-center gap-2 italic underline decoration-pink-500/50 underline-offset-4 decoration-2">Essential</h4>
                    <p className="text-muted-foreground m-0">Required for the platform to function. Cannot be disabled.</p>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-5">
                    <h4 className="text-foreground dark:text-white font-bold mb-2 flex items-center gap-2 italic underline decoration-purple-500/50 underline-offset-4 decoration-2">Functional</h4>
                    <p className="text-muted-foreground m-0">Enhance your experience with saved preferences and UI choices.</p>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-5">
                    <h4 className="text-foreground dark:text-white font-bold mb-2 flex items-center gap-2 italic underline decoration-emerald-500/50 underline-offset-4 decoration-2">Analytics</h4>
                    <p className="text-muted-foreground m-0">Anonymously collect data to help us improve features and content.</p>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-5">
                    <h4 className="text-foreground dark:text-white font-bold mb-2 flex items-center gap-2 italic underline decoration-indigo-500/50 underline-offset-4 decoration-2">Advertising</h4>
                    <p className="text-muted-foreground m-0">Help us show you content and news you'll actually care about.</p>
                  </div>
                </div>

                <h2>4. Detailed Cookie Inventory</h2>
                <p>Here are the specific cookies we currently use on our platform:</p>
                
                <div className="not-prose mt-8 mb-12 overflow-hidden rounded-2xl border border-border bg-slate-50/80 dark:bg-black/40">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-foreground/80 font-bold uppercase tracking-wider text-xs py-5">Cookie Name</TableHead>
                        <TableHead className="text-foreground/80 font-bold uppercase tracking-wider text-xs py-5">Purpose</TableHead>
                        <TableHead className="text-foreground/80 font-bold uppercase tracking-wider text-xs py-5">Duration</TableHead>
                        <TableHead className="text-foreground/80 font-bold uppercase tracking-wider text-xs py-5">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cookies.map((cookie, index) => (
                        <TableRow key={index} className="border-border hover:bg-white/5 transition-colors group">
                          <TableCell className="font-mono text-sm text-pink-400 py-6">{cookie.name}</TableCell>
                          <TableCell className="text-foreground/80 text-sm py-6">{cookie.purpose}</TableCell>
                          <TableCell className="text-muted-foreground text-sm py-6">{cookie.duration}</TableCell>
                          <TableCell className="py-6">
                            <Badge className={`bg-${cookie.color}-500/10 text-${cookie.color}-400 border-${cookie.color}-500/30 group-hover:border-${cookie.color}-500/60 transition-colors uppercase text-[10px] tracking-widest px-2 py-0.5`}>
                              {cookie.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <h2>5. Third-Party Integration</h2>
                <p>
                  Some features on our platform are powered by third-party services which may set their own 
                  cookies. These include:
                </p>
                <ul className="not-prose space-y-4 mb-12">
                  <li className="flex items-center gap-4 p-4 bg-white/5 border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">G</div>
                    <div>
                      <div className="text-foreground dark:text-white font-bold">Google Analytics</div>
                      <div className="text-xs text-muted-foreground">Advanced traffic analysis and user behavior metrics</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white/5 border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-500">S</div>
                    <div>
                      <div className="text-foreground dark:text-white font-bold">Supabase</div>
                      <div className="text-xs text-muted-foreground">Secure authentication and real-time database management</div>
                    </div>
                  </li>
                </ul>

                <h2>6. Managing Your Preferences</h2>
                <p>Most browsers provide granular control over cookies. You can block or delete cookies through 
                the following settings:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 not-prose">
                  {['Chrome', 'Firefox', 'Safari', 'Edge'].map(browser => (
                    <div key={browser} className="p-4 bg-slate-50/80 dark:bg-black/40 border border-border rounded-xl text-center group cursor-pointer hover:border-pink-500/30 transition-all hover:-translate-y-1">
                      <div className="text-foreground dark:text-white font-bold mb-1 text-sm">{browser}</div>
                      <div className="text-[10px] text-muted-foreground group-hover:text-pink-400 transition-colors flex items-center justify-center gap-1 uppercase tracking-tighter">
                        Settings <ExternalLink className="h-2 w-2" />
                      </div>
                    </div>
                  ))}
                </div>

                <h2>7. Critical Information</h2>
                <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl my-12 relative overflow-hidden not-prose">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                  <div className="flex items-start gap-4 relative z-10">
                    <Info className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground dark:text-white font-bold text-lg mb-2 italic">Impact of Disabling Cookies</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed m-0">
                        Disabling cookies may prevent certain features from working correctly, such as staying logged in or 
                        maintaining your dark mode preference. Essential security cookies cannot be disabled.
                      </p>
                    </div>
                  </div>
                </div>

                <h2>8. Contact & Updates</h2>
                <p>
                  We may refresh this policy to reflect platform updates or legal changes. All updates will be 
                  noted here with a new "Last updated" date.
                </p>
                <div className="bg-slate-50/80 dark:bg-black/40 border border-border rounded-2xl p-8 mt-12 not-prose text-center">
                  <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MousePointer2 className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-4">Cookie Questions?</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Reach out to our privacy team for any clarifications about our technology stack.</p>
                  <a 
                    href="mailto:connectnotyourworld@gmail.com" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                  >
                    Contact Privacy Team
                  </a>
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

export default CookiePolicy;

