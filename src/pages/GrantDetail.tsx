import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { GRANTS_DATA } from "@/data/grants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, Calendar, DollarSign, Bookmark, BookmarkCheck, 
  ArrowLeft, CheckCircle2, Globe, ExternalLink, Zap
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

const AnimatedMatchScore = ({ score }: { score: number }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500; // 1.5s
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrentScore(end);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto my-6">
      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 120 120">
        <circle
          className="text-white/10"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-3xl font-black text-white drop-shadow-md">{currentScore}%</span>
        <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Match</span>
      </div>
    </div>
  );
};

const GrantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  const grant = GRANTS_DATA.find(g => g.id === Number(id));
  
  // Find similar grants based on shared tags (exclude current)
  const similarGrants = GRANTS_DATA.filter(g => 
    g.id !== grant?.id && g.tags.some(tag => grant?.tags.includes(tag))
  ).slice(0, 3);

  // Scroll to top when changing ID
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSaved(false); // Reset save state for demo purposes
  }, [id]);

  if (!grant) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Grant Not Found</h2>
        <Button onClick={() => navigate("/grants")}>Back to Grants</Button>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Grant saved to your dashboard!");
    } else {
      toast.info("Grant removed from saved items.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 relative selection:bg-purple-500/30 overflow-hidden text-zinc-100 flex flex-col">
      <Helmet>
        <title>{grant.title} | India's Got Startup</title>
      </Helmet>

      {/* Ambient Lighting Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        {/* Back Link */}
        <button 
          onClick={() => navigate("/grants")}
          className="flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all grants
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Section */}
            <div className="border-b border-white/10 pb-8 relative">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs uppercase tracking-widest rounded-full">
                  {grant.deadline}
                </Badge>
                {grant.tags.map(tag => (
                  <Badge key={tag} className="bg-white/5 text-zinc-300 border-none px-3 py-1 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                  {grant.title}
                </h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSave}
                  className={`rounded-full shrink-0 h-12 w-12 border ${isSaved ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 text-zinc-400 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20">
                  <DollarSign className="w-5 h-5" />
                  Funding: {grant.amount}
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 opacity-70" />
                  {grant.organization}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 opacity-70" />
                  {grant.deadline}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-white mb-4">About this Grant</h3>
              <p className="text-zinc-300 text-lg leading-relaxed">{grant.description}</p>
            </div>

            {/* Eligibility */}
            <div className="bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-purple-400" /> Eligibility Criteria
              </h3>
              <ul className="space-y-4">
                {grant.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expertise Expected */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-400" /> Field of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {grant.fieldOfExpertise.map(field => (
                  <Badge key={field} className="bg-zinc-800 border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium rounded-lg">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Apply Button Container */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-sm text-zinc-500 text-center md:text-left">
                Redirects to the official application portal. Make sure you meet all criteria.
              </div>
              <a 
                href={grant.applyUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto"
              >
                <Button className="w-full h-14 px-8 text-base font-bold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 group">
                  Apply Online <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
            </div>
            
          </div>

          {/* Right Column: Side Panel */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* AI Match Score Component */}
            <Card className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Profile Match</h3>
                <p className="text-sm text-zinc-400 px-4">Based on your startup's sector, stage, and location.</p>
                <AnimatedMatchScore score={grant.matchScore || 85} />
                <div className="text-xs font-medium text-cyan-300 bg-cyan-500/10 py-2 px-4 rounded-full inline-block border border-cyan-500/20">
                  Excellent fit for your stage
                </div>
              </CardContent>
            </Card>

            {/* Similar Grants */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 px-1">Similar Grants</h3>
              <div className="space-y-4">
                {similarGrants.map(smGrant => (
                  <Link to={`/grants/${smGrant.id}`} key={smGrant.id} className="block outline-none">
                    <Card className="bg-neutral-900/30 border border-white/5 hover:border-white/20 hover:bg-neutral-900/50 transition-all group">
                      <CardContent className="p-4 flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:rotate-6 transition-transform">
                          <Globe className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                            {smGrant.title}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                            {smGrant.organization}
                          </p>
                          <div className="text-xs font-bold text-cyan-400 mt-2">
                            {smGrant.amount}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default GrantDetail;
