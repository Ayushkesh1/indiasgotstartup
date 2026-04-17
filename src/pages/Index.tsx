import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import TagFilter from "@/components/TagFilter";
import TrendingHero from "@/components/TrendingHero";
import NewsCard from "@/components/NewsCard";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import { FeaturedSection } from "@/components/FeaturedSection";
import { MediaSidebar } from "@/components/MediaSidebar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { useArticles, ArticleCategory } from "@/hooks/useArticles";
import { useArticlesByTag } from "@/hooks/useTags";
import { useFollowedAuthors } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Loader2, Heart, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PREDEFINED_CATEGORIES: ArticleCategory[] = [
  "Fintech",
  "Tech",
  "Blockchain",
  "eCommerce",
  "Government",
  "Edtech",
  "Funding",
  "Mobility",
];



const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | ArticleCategory>("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: articles, isLoading } = useArticles(selectedCategory);
  const { data: tagFilteredArticles, isLoading: isLoadingTagArticles } = useArticlesByTag(selectedTag || "");
  const { data: followedAuthorIds } = useFollowedAuthors(user?.id);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const displayArticles = selectedTag ? tagFilteredArticles : articles;
  const isLoadingArticles = selectedTag ? isLoadingTagArticles : isLoading;

  const filteredArticles = useMemo(() => {
    if (!displayArticles) return [];

    return displayArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [displayArticles, searchQuery]);

  const followedArticles = useMemo(() => {
    if (!followedAuthorIds || followedAuthorIds.length === 0) return [];

    return filteredArticles.filter((article) =>
      followedAuthorIds.includes(article.author_id)
    );
  }, [filteredArticles, followedAuthorIds]);

  return (
    <div className="bg-transparent relative selection:bg-purple-500/30 text-foreground flex flex-col items-center w-full">
      {/* Ambient Deep Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[40%] right-[20%] w-[30%] h-[300px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0" />

      <Navbar searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }} />

      <div className="w-full bg-gradient-hero border-b border-border/40 pb-6 relative flex justify-center">
        <TrendingHero />
      </div>

      <div className="w-full pt-6 pb-2 flex justify-center">
        <AdvertisementBanner />
      </div>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl animate-in fade-in duration-700 delay-150 relative z-10 mx-auto">

        {/* Dynamic Search Feedback HUD */}
        {searchQuery && (
          <div className="w-full mb-8 py-4 px-8 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl flex items-center justify-between shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-in slide-in-from-top-4 fade-in duration-500">
            <span className="text-purple-200 font-medium tracking-wide">
              Showing <strong className="text-foreground dark:text-white text-lg">{filteredArticles.length}</strong> result{filteredArticles.length !== 1 ? 's' : ''} for <strong className="text-foreground dark:text-white">"{searchQuery}"</strong>
            </span>
            <button onClick={() => setSearchQuery("")} className="text-purple-400 hover:text-foreground dark:text-white transition-colors text-sm uppercase tracking-widest font-bold flex items-center gap-2">
              <span>Clear</span>
              <span className="bg-purple-500/20 px-2 py-0.5 rounded-md text-[10px]">ESC</span>
            </button>
          </div>
        )}


        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Unified "Innovation Hub" Command Center for Filters */}
            <div className="mb-8 relative z-20">
              <div className="glass-panel rounded-2xl p-4 md:p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 w-full overflow-x-auto scrollbar-hide">
                    <CategoryFilter
                      categories={PREDEFINED_CATEGORIES}
                      selectedCategory={selectedCategory}
                      onCategoryChange={(cat) => {
                        setSelectedCategory(cat);
                        setSelectedTag(null);
                        setCurrentPage(1); // Reset pagination on category change
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
                </div>
              </div>
            </div>

            <FeaturedSection />

            {user && followedAuthorIds && followedAuthorIds.length > 0 ? (
              <Tabs defaultValue="all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <h2 id="latest-stories" className="text-2xl md:text-3xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">Latest Stories</h2>
                  <TabsList className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border p-1 rounded-full h-auto shadow-2xl">
                    <TabsTrigger value="all" className="rounded-full px-6 py-2.5 text-sm font-bold tracking-widest uppercase data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-foreground dark:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-muted-foreground transition-all duration-300">
                      <TrendingUp className="h-4 w-4 mr-2 inline-block" /> All Stories
                    </TabsTrigger>
                    <TabsTrigger value="following" className="rounded-full px-6 py-2.5 text-sm font-bold tracking-widest uppercase data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-foreground dark:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-muted-foreground transition-all duration-300">
                      <Heart className="h-4 w-4 mr-2 inline-block" /> Following ({followedArticles.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  {isLoadingArticles ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : filteredArticles && filteredArticles.length > 0 ? (
                    <div className="space-y-12">
                      {/* Top Pagination Control */}
                      {filteredArticles.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl mb-6 transition-all duration-300">
                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">
                            Page {currentPage} of {Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)}
                          </p>
                          <Pagination className="w-auto mx-0">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}

                      <div className="grid gap-6 md:grid-cols-2">
                        {filteredArticles
                          .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                          .map((article, idx) => (
                            <div key={article.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 75}ms` }}>
                              <NewsCard
                                articleId={article.id}
                                title={article.title}
                                description={article.excerpt || ""}
                                category={article.category}
                                date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                source="India Got Startup"
                                sourceUrl={`/article/${article.slug}`}
                                thumbnail={article.featured_image_url || undefined}
                                author={article.profiles?.full_name || "Anonymous"}
                                authorImage={article.profiles?.avatar_url || undefined}
                                readTime={`${article.reading_time} min read`}
                                authorId={article.author_id}
                              />
                            </div>
                          ))}
                      </div>

                      {/* Pagination Control */}
                      {filteredArticles.length > ITEMS_PER_PAGE && (
                        <div className="pt-8 border-t border-border">
                          <Pagination>
                            <PaginationContent className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-xl">
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                              
                              {[...Array(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE))].map((_, i) => (
                                <PaginationItem key={i}>
                                  <PaginationLink 
                                    onClick={() => { setCurrentPage(i + 1); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                    isActive={currentPage === i + 1}
                                    className={`cursor-pointer rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                                      currentPage === i + 1 
                                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-foreground dark:text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                      : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {i + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}

                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)] border border-purple-500/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
                        <Zap className="w-10 h-10 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-widest text-foreground dark:text-white mb-3 relative z-10">Void is Empty</h3>
                      <p className="text-muted-foreground mb-8 max-w-sm px-4 relative z-10">
                        We searched the mainframe but found zero stories. Be the pioneer and launch the first transmission.
                      </p>
                      <GradientButton onClick={() => user ? navigate("/write") : navigate("/auth")} gradientVariant="purple-blue">
                        Initiate Protocol
                      </GradientButton>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following" className="mt-0">
                  {followedArticles.length > 0 ? (
                    <div className="space-y-12">
                      {/* Top Pagination for Following */}
                      {followedArticles.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl mb-6 transition-all duration-300">
                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">
                            Page {followingPage} of {Math.ceil(followedArticles.length / ITEMS_PER_PAGE)}
                          </p>
                          <Pagination className="w-auto mx-0">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => { setFollowingPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${followingPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => { setFollowingPage(prev => Math.min(Math.ceil(followedArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${followingPage === Math.ceil(followedArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}

                      <div className="grid gap-6 md:grid-cols-2">
                        {followedArticles
                          .slice((followingPage - 1) * ITEMS_PER_PAGE, followingPage * ITEMS_PER_PAGE)
                          .map((article) => (
                            <NewsCard
                              key={article.id}
                              articleId={article.id}
                              title={article.title}
                              description={article.excerpt || ""}
                              category={article.category}
                              date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              source="India Got Startup"
                              sourceUrl={`/article/${article.slug}`}
                              thumbnail={article.featured_image_url || undefined}
                              author={article.profiles?.full_name || "Anonymous"}
                              authorImage={article.profiles?.avatar_url || undefined}
                              readTime={`${article.reading_time} min read`}
                              authorId={article.author_id}
                            />
                          ))}
                      </div>

                      {/* Following Pagination */}
                      {followedArticles.length > ITEMS_PER_PAGE && (
                        <div className="pt-8 border-t border-border">
                          <Pagination>
                            <PaginationContent className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-xl">
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => { setFollowingPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${followingPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                              
                              {[...Array(Math.ceil(followedArticles.length / ITEMS_PER_PAGE))].map((_, i) => (
                                <PaginationItem key={i}>
                                  <PaginationLink 
                                    onClick={() => { setFollowingPage(i + 1); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                    isActive={followingPage === i + 1}
                                    className={`cursor-pointer rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                                      followingPage === i + 1 
                                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-foreground dark:text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                      : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {i + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}

                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => { setFollowingPage(prev => Math.min(Math.ceil(followedArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${followingPage === Math.ceil(followedArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto glass-panel rounded-2xl">
                      <Heart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-xl font-bold mb-2">No articles yet</h3>
                      <p className="text-muted-foreground">
                        Follow authors to see their stories here. Articles from authors you follow will appear in this personalized feed.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="mt-8">
                <h2 id="latest-stories" className="text-2xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Latest Stories</h2>
                {isLoadingArticles ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : filteredArticles && filteredArticles.length > 0 ? (
                  <div className="space-y-12">
                    {/* Top Pagination for Logged Out View */}
                    {filteredArticles.length > ITEMS_PER_PAGE && (
                      <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl mb-6 transition-all duration-300">
                         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">
                          Page {currentPage} of {Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)}
                        </p>
                        <Pagination className="w-auto mx-0">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                              />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredArticles
                        .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                        .map((article, idx) => (
                          <div key={article.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 75}ms` }}>
                            <NewsCard
                              articleId={article.id}
                              title={article.title}
                              description={article.excerpt || ""}
                              category={article.category}
                              date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              source="India Got Startup"
                              sourceUrl={`/article/${article.slug}`}
                              thumbnail={article.featured_image_url || undefined}
                              author={article.profiles?.full_name || "Anonymous"}
                              authorImage={article.profiles?.avatar_url || undefined}
                              readTime={`${article.reading_time} min read`}
                              authorId={article.author_id}
                            />
                          </div>
                      ))}
                    </div>

                    {/* Pagination for Logged Out View */}
                    {filteredArticles.length > ITEMS_PER_PAGE && (
                      <div className="pt-8 border-t border-border">
                        <Pagination>
                          <PaginationContent className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-xl">
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                              />
                            </PaginationItem>
                            
                            {[...Array(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE))].map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  onClick={() => { setCurrentPage(i + 1); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                  isActive={currentPage === i + 1}
                                  className={`cursor-pointer rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                                    currentPage === i + 1 
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-foreground dark:text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                    : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/10'
                                  }`}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredArticles.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                                className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto glass-panel rounded-2xl">
                    <h3 className="text-xl font-bold mb-2">No stories yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to share your startup story! Sign in and start writing.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <MediaSidebar />
            </div>
          </div>
        </div>
      </main>
      {/* Premium Synthwave Introductory Video Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[300px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex mb-4 items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/80 border border-border backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">Platform Intro</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight text-foreground dark:text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-[#ff0080] to-cyan-400">
            Welcome to the Hub
          </h2>

          <div className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)] border border-purple-500/20 group bg-slate-100/90 dark:bg-black/60 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

            <div className="relative pt-[56.25%] w-full">
              <iframe
                src="https://www.youtube.com/embed/iqwTAzilQWg?rel=0&modestbranding=1&showinfo=0"
                title="Intro Video"
                className="absolute top-0 left-0 w-full h-full z-20"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Big Encouraging CTA Banner (Moved & Resized) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-5 bg-background/40 backdrop-blur-xl border border-border rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Aesthetic background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-[150px] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-foreground/80 max-w-4xl leading-relaxed relative z-10 transition-all flex flex-col md:flex-row items-center gap-2">
            <span>Hey <span className="text-foreground dark:text-white font-bold">{(user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Innovator")}!</span></span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 font-extrabold">
              Have something to share?
            </span>
            <span className="animate-[pulse_1s_ease-in-out_infinite] inline-block w-[3px] md:w-[4px] h-[0.8em] ml-1 align-middle bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] rounded-full"></span>
          </h2>

          <div className="flex justify-center w-full relative z-10 pt-4">
            {/* Write Article Button */}
            <GradientButton 
              onClick={() => !user ? navigate("/auth") : navigate("/write")}
              gradientVariant="gold"
              className="min-w-[200px]"
            >
              Write Article
            </GradientButton>
          </div>
        </div>
      </div>

      <NewsletterFooter />
    </div>
  );
};

export default Index;
