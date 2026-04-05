import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useFollowerCount, useFollowingCount } from "@/hooks/useFollows";
import Navbar from "@/components/Navbar";
import { MediaSidebar } from "@/components/MediaSidebar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import FollowButton from "@/components/FollowButton";
import NewsCard from "@/components/NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Users, Twitter, Linkedin, ShieldCheck, Building, ArrowRight, Activity, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRANTS_DATA } from "@/data/grants";

const AuthorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile(id);
  const { data: articles, isLoading: articlesLoading } = useUserArticles(id);
  const { data: followerCount } = useFollowerCount(id);
  const { data: followingCount } = useFollowingCount(id);

  // Redirect to own profile if viewing your own author page
  useEffect(() => {
    if (user?.id === id) {
      navigate("/profile");
    }
  }, [user, id, navigate]);

  // Simulate Affiliated Grants (Randomly picking 2 based on author ID to make it deterministic but static)
  const simulatedGrants = useMemo(() => {
    if (!id || GRANTS_DATA.length === 0) return [];
    // Pseudo-random deterministic choice based on the length of ID string
    const seed1 = id.length % GRANTS_DATA.length;
    const seed2 = (id.length * 2) % GRANTS_DATA.length;
    return [GRANTS_DATA[seed1], GRANTS_DATA[seed2]].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Unique
  }, [id]);

  if (profileLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 max-w-lg mx-auto shadow-[0_0_50px_rgba(168,85,247,0.15)]">
            <h1 className="text-4xl font-black mb-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Void Entity</h1>
            <p className="text-zinc-400 mb-8 px-4">
              The author profile you're looking for doesn't exist or has fragmented across the mainframe.
            </p>
            <Button onClick={() => navigate("/")} className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest px-8 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Back to Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const publishedArticles = articles?.filter((a) => a.published) || [];

  return (
    <div className="min-h-screen bg-neutral-950 relative selection:bg-purple-500/30 overflow-hidden text-zinc-100 flex flex-col">
      {/* Ambient Lighting Background */}
      <div className="fixed top-[0%] left-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8 max-w-7xl animate-in fade-in duration-700 relative z-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            
            {/* Redesigned Glassmorphic Profile Header */}
            <div className="relative group rounded-[2.5rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-50 pointer-events-none" />
              
              <div className="p-6 md:p-10 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full blur-[20px] opacity-40 animate-pulse" />
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-neutral-900 shadow-2xl relative z-10">
                    <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-black">
                      {profile.full_name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {profile.full_name || "Anonymous Author"}
                      </h1>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-semibold tracking-widest uppercase text-zinc-400">
                        <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-default">
                          <Users className="w-4 h-4 text-cyan-500" /> {followerCount || 0} Followers
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                        <span className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-default">
                          <Activity className="w-4 h-4 text-purple-500" /> {followingCount || 0} Following
                        </span>
                      </div>
                    </div>
                    {user?.id !== id && (
                      <FollowButton authorId={id!} size="lg" className="rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-white text-black hover:bg-zinc-200" />
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-zinc-300 leading-relaxed text-base md:text-lg max-w-2xl mt-4">
                      {profile.bio}
                    </p>
                  )}

                  {/* Social Handles */}
                  {(profile.twitter_handle || profile.linkedin_url) && (
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10 w-full justify-center md:justify-start">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mr-2">Connect:</span>
                      {profile.twitter_handle && (
                        <a
                          href={`https://twitter.com/${profile.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:shadow-[0_0_15px_rgba(29,161,242,0.3)] transition-all duration-300"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#0077b5] hover:border-[#0077b5]/50 hover:shadow-[0_0_15px_rgba(0,119,181,0.3)] transition-all duration-300"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Extra Feature: Sticky Tabbed Navigation */}
            <Tabs defaultValue="articles" className="w-full">
              <div className="sticky top-[72px] z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 py-4 mb-8 translate-y-[-1px]">
                <TabsList className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-1 rounded-full h-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <TabsTrigger value="articles" className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold tracking-widest uppercase data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-zinc-400 transition-all duration-300">
                    <FileText className="h-4 w-4 mr-2 inline-block" /> Articles <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-full text-[10px]">{publishedArticles.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="grants" className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold tracking-widest uppercase data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-zinc-400 transition-all duration-300">
                    <Award className="h-4 w-4 mr-2 inline-block" /> Affiliations
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Articles Content */}
              <TabsContent value="articles" className="mt-0 outline-none">
                {publishedArticles.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {publishedArticles.map((article, idx) => (
                      <div key={article.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 150}ms` }}>
                        <NewsCard
                          articleId={article.id}
                          title={article.title}
                          description={article.excerpt || ""}
                          category={article.category}
                          date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          source="India Got Startup"
                          sourceUrl={`/article/${article.slug}`}
                          thumbnail={article.featured_image_url || undefined}
                          author={profile.full_name || "Anonymous"}
                          authorImage={profile.avatar_url || undefined}
                          readTime={`${article.reading_time} min read`}
                          authorId={id}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <FileText className="h-12 w-12 text-zinc-600 mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-3">Blank Canvas</h3>
                    <p className="text-zinc-400 mb-8 px-4">
                      This visionary hasn't published any transmissions to the mainframe yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Simulated Grants Content */}
              <TabsContent value="grants" className="mt-0 outline-none">
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-[2rem] p-8 mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-48 h-48" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2 relative z-10 flex items-center gap-3">
                    <Award className="w-8 h-8 text-purple-400" /> Active Affiliations
                  </h3>
                  <p className="text-zinc-400 max-w-lg relative z-10">Programs and grants this innovator is currently associated with or has successfully acquired.</p>
                </div>
                
                {simulatedGrants.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {simulatedGrants.map((grant, idx) => (
                      <Link to={`/grants/${grant.id}`} key={grant.id} className="block outline-none" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="h-full bg-neutral-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300 group overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.2)] animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 uppercase tracking-widest text-[10px]">
                              {grant.deadline}
                            </Badge>
                          </div>
                          <h4 className="text-xl font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors mb-2">
                            {grant.title}
                          </h4>
                          <p className="flex items-center text-zinc-400 mb-6 gap-2 text-sm font-medium">
                            <Building className="w-4 h-4" /> {grant.organization}
                          </p>
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Funding Size</span>
                              <span className="text-cyan-400 font-bold text-sm">{grant.amount}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full pointer-events-none group-hover:bg-cyan-500/20 group-hover:text-cyan-300 text-zinc-400 group-hover:translate-x-1 transition-transform">
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem]">
                    <ShieldCheck className="h-10 w-10 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No active affiliations</h3>
                    <p className="text-zinc-500 max-w-xs">No known grant programs or accelerators associated with this profile.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="sticky top-24">
              <MediaSidebar />
            </div>
          </div>

        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default AuthorProfile;
