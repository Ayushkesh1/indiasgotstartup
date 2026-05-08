import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import TagFilter from "@/components/TagFilter";
import NewsCard from "@/components/NewsCard";
import { FeaturedSection } from "@/components/FeaturedSection";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { useArticles, ArticleCategory } from "@/hooks/useArticles";
import { useArticlesByTag } from "@/hooks/useTags";
import { useFollowedAuthors } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { useCountUp } from "@/hooks/useCountUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, Loader2, Heart, ChevronRight, Search, Rocket, Users, Building2, Coins, CalendarDays, ArrowRight,
} from "lucide-react";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { dummyStartups } from "@/data/startups";
import { dummyInvestors } from "@/data/investors";
import { dummyIncubators } from "@/data/incubators";
import { GRANTS_DATA } from "@/data/grants";
import { EVENTS_DATA } from "@/data/events";

const PREDEFINED_CATEGORIES: ArticleCategory[] = [
  "Fintech", "Tech", "Blockchain", "eCommerce", "Government", "Edtech", "Funding", "Mobility",
];

const ECOSYSTEM_SECTIONS = [
  { label: "Startups", path: "/startups", icon: Rocket, count: dummyStartups.length, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Discover innovative companies" },
  { label: "Investors", path: "/investors", icon: TrendingUp, count: dummyInvestors.length, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Angels, VCs & family offices" },
  { label: "Incubators", path: "/incubators", icon: Building2, count: dummyIncubators.length, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Accelerators & incubation programs" },
  { label: "Grants", path: "/grants", icon: Coins, count: GRANTS_DATA.length, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Non-dilutive funding opportunities" },
  { label: "Events", path: "/events", icon: CalendarDays, count: EVENTS_DATA.length, color: "text-rose-500", bg: "bg-rose-500/10", desc: "Hackathons, meetups & conferences" },
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

  // Animated stat counters
  const startupCount = useCountUp({ end: 850, duration: 2000 });
  const investorCount = useCountUp({ end: 220, duration: 2200 });
  const fundingCount = useCountUp({ end: 12, duration: 2400 });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full">
      <Helmet>
        <title>India's Got Startup — Discover India's Startup Ecosystem</title>
        <meta name="description" content="India's premier startup ecosystem platform. Discover startups, connect with investors, find incubators, explore grants, and attend events." />
      </Helmet>

      <Navbar searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }} />

      {/* ═══════════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="w-full bg-gradient-hero pt-16 pb-12 sm:pt-20 sm:pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              India's Startup Ecosystem Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Discover, Connect &{" "}
              <span className="text-gradient-brand bg-[length:200%_auto] animate-gradient">Build Together</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              The definitive platform to discover startups, connect with investors, find incubators, explore grants, and stay updated with India's innovation landscape.
            </p>

            {/* Unified Search */}
            <div className="max-w-xl mx-auto relative mb-10">
              <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search startups, investors, grants..."
                  className="w-full bg-transparent h-12 pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = (e.target as HTMLInputElement).value.trim();
                      if (q) navigate(`/startups?q=${encodeURIComponent(q)}`);
                    }
                  }}
                />
                <Button size="sm" className="mr-1.5 h-9 px-5 rounded-lg font-semibold" onClick={() => navigate("/startups")}>
                  Explore
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{startupCount}+</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Startups</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{investorCount}+</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Investors</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">₹{fundingCount}K Cr+</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Funding Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. ECOSYSTEM QUICK-ACCESS GRID
          ═══════════════════════════════════════════ */}
      <section className="w-full -mt-8 relative z-20 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {ECOSYSTEM_SECTIONS.map(sec => (
              <Link
                key={sec.path}
                to={sec.path}
                className="group premium-card p-4 sm:p-5"
              >
                <div className={`h-10 w-10 rounded-xl ${sec.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <sec.icon className={`h-5 w-5 ${sec.color}`} />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-foreground">{sec.label}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-semibold tabular-nums">{sec.count}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{sec.desc}</p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. FEATURED STARTUPS
          ═══════════════════════════════════════════ */}
      <section className="w-full py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Featured Startups</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/startups")}>
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dummyStartups.slice(0, 4).map(startup => (
              <Link key={startup.id} to={`/startups/${startup.slug}`} className="group">
                <Card className="h-full p-5 premium-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {startup.logo ? (
                        <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Rocket className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{startup.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{startup.city}, {startup.state}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{startup.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {startup.sectors?.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. FEATURED INVESTORS
          ═══════════════════════════════════════════ */}
      <section className="w-full pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold">Active Investors</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/investors")}>
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dummyInvestors.slice(0, 4).map(inv => (
              <Link key={inv.id} to={`/investors/${inv.slug}`} className="group">
                <Card className="h-full p-5 premium-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {inv.logo ? (
                        <img src={inv.logo} alt={inv.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{inv.name}</h3>
                      <p className="text-xs text-muted-foreground">{inv.type}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{inv.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {inv.preferredStages?.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{s}</span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. ARTICLES SECTION
          ═══════════════════════════════════════════ */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl relative z-10 mx-auto">
        {/* Search Feedback */}
        {searchQuery && (
          <div className="w-full mb-6 py-3 px-6 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{filteredArticles.length}</strong> result{filteredArticles.length !== 1 ? 's' : ''} for <strong className="text-foreground">"{searchQuery}"</strong>
            </span>
            <button onClick={() => setSearchQuery("")} className="text-primary hover:text-primary-hover text-sm font-medium transition-colors">
              Clear
            </button>
          </div>
        )}

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="mb-8">
              <div className="glass-panel rounded-xl p-4 flex flex-col gap-4">
                <div className="flex-1 w-full overflow-x-auto scrollbar-hide">
                  <CategoryFilter
                    categories={PREDEFINED_CATEGORIES}
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => {
                      setSelectedCategory(cat);
                      setSelectedTag(null);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="pt-3 border-t border-border/40">
                  <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
                </div>
              </div>
            </div>

            <FeaturedSection />

            {/* Article Feed */}
            {user && followedAuthorIds && followedAuthorIds.length > 0 ? (
              <Tabs defaultValue="all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 id="latest-stories" className="text-xl font-bold text-foreground">Latest Stories</h2>
                  <TabsList className="bg-muted border border-border p-1 rounded-lg h-auto">
                    <TabsTrigger value="all" className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> All
                    </TabsTrigger>
                    <TabsTrigger value="following" className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Heart className="h-3.5 w-3.5 mr-1.5" /> Following ({followedArticles.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <ArticleGrid
                    articles={filteredArticles}
                    isLoading={isLoadingArticles}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    user={user}
                    navigate={navigate}
                  />
                </TabsContent>

                <TabsContent value="following" className="mt-0">
                  <ArticleGrid
                    articles={followedArticles}
                    isLoading={false}
                    currentPage={followingPage}
                    setCurrentPage={setFollowingPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    user={user}
                    navigate={navigate}
                    emptyMessage="Follow authors to see their stories here."
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="mt-8">
                <h2 id="latest-stories" className="text-xl font-bold text-foreground mb-6">Latest Stories</h2>
                <ArticleGrid
                  articles={filteredArticles}
                  isLoading={isLoadingArticles}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  user={user}
                  navigate={navigate}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Write CTA */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-12">
        <div className="text-center py-8 px-6 bg-card border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Have a story to share?
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Write about your startup journey, funding insights, or ecosystem updates.
          </p>
          <Button onClick={() => !user ? navigate("/auth") : navigate("/write")} className="px-8">
            Write an Article
          </Button>
        </div>
      </div>

      <NewsletterFooter />
    </div>
  );
};

/* ─────────────────────────────────────────────
   Extracted ArticleGrid Component
   ───────────────────────────────────────────── */
function ArticleGrid({
  articles,
  isLoading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  user,
  navigate,
  emptyMessage,
}: {
  articles: any[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (p: number | ((p: number) => number)) => void;
  itemsPerPage: number;
  user: any;
  navigate: (path: string) => void;
  emptyMessage?: string;
}) {
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card/50">
        <h3 className="text-lg font-semibold mb-2 text-foreground">{emptyMessage ? "No articles yet" : "No stories yet"}</h3>
        <p className="text-muted-foreground text-sm mb-5 max-w-sm">
          {emptyMessage || "Be the first to share your startup story."}
        </p>
        {!emptyMessage && (
          <Button variant="outline" onClick={() => user ? navigate("/write") : navigate("/auth")}>
            Start Writing
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-card border border-border p-2 rounded-xl text-sm">
          <p className="text-xs text-muted-foreground font-medium ml-3">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToStories(); }}>
              Prev
            </Button>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToStories(); }}>
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {paginatedArticles.map((article: any, idx: number) => (
          <div key={article.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
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

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-border">
          <Pagination>
            <PaginationContent className="bg-card border border-border p-1 rounded-xl">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToStories(); }}
                  className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => { setCurrentPage(i + 1); scrollToStories(); }}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer rounded-lg font-medium"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToStories(); }}
                  className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function scrollToStories() {
  setTimeout(() => document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

export default Index;
