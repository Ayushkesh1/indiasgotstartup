import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { useAuth } from "@/hooks/useAuth";
import { useEcosystemList } from "@/hooks/useEcosystem";
import { useArticles } from "@/hooks/useArticles";
import NewsCard from "@/components/NewsCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  TrendingUp, Search, Rocket, Building2, Coins, CalendarDays, 
  ArrowRight, Users, Briefcase, Network, MessageCircle
} from "lucide-react";

import { dummyStartups } from "@/data/startups";
import { dummyInvestors } from "@/data/investors";
import { dummyIncubators } from "@/data/incubators";
import { GRANTS_DATA } from "@/data/grants";
import { EVENTS_DATA } from "@/data/events";
import { StartupCard } from "@/components/ecosystem/StartupCard";
import { InvestorCard } from "@/components/ecosystem/InvestorCard";

const ECOSYSTEM_SECTIONS = [
  { label: "Startups", path: "/startups", icon: Rocket, count: dummyStartups.length, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Discover innovative companies" },
  { label: "Investors", path: "/investors", icon: TrendingUp, count: dummyInvestors.length, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Angels, VCs & family offices" },
  { label: "Incubators", path: "/incubators", icon: Building2, count: dummyIncubators.length, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Accelerators & incubation" },
  { label: "Grants", path: "/grants", icon: Coins, count: GRANTS_DATA.length, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Non-dilutive funding" },
  { label: "Network", path: "/profile", icon: Network, count: "New", color: "text-rose-500", bg: "bg-rose-500/10", desc: "Connect with founders" },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Fetch db items to check what user owns
  const { data: dbStartups } = useEcosystemList("startups");
  const { data: dbIncubators } = useEcosystemList("incubators");
  const { data: dbInvestors } = useEcosystemList("investors");

  const [hasStartup, setHasStartup] = useState(false);
  const [hasIncubator, setHasIncubator] = useState(false);
  const [hasInvestor, setHasInvestor] = useState(false);

  useEffect(() => {
    if (user) {
      if (dbStartups?.some(s => s.owner_id === user.id)) setHasStartup(true);
      if (dbIncubators?.some(i => i.owner_id === user.id)) setHasIncubator(true);
      if (dbInvestors?.some(i => i.owner_id === user.id)) setHasInvestor(true);
    }
  }, [user, dbStartups, dbIncubators, dbInvestors]);

  const { data: articles } = useArticles();

  // Combine data for sliders
  const mergedStartups = useMemo(() => {
    const db = (dbStartups || []).map(s => ({
      id: s.id, slug: s.slug, name: s.name, shortDescription: s.tagline || s.description,
      city: s.city, state: s.state, sector: s.sector, logo: s.logo_url
    }));
    return [...db, ...dummyStartups].slice(0, 10);
  }, [dbStartups]);

  const mergedInvestors = useMemo(() => {
    const db = (dbInvestors || []).map(i => ({
      id: i.id, slug: i.slug, name: i.name, tagline: i.tagline,
      type: i.type, city: i.city, state: i.state, logo: i.logo_url,
      ticketSizeMin: i.ticket_size_min ? `₹${(i.ticket_size_min/10000000).toFixed(1)}Cr` : null,
      ticketSizeMax: i.ticket_size_max ? `₹${(i.ticket_size_max/10000000).toFixed(1)}Cr` : null,
      isVerified: true
    }));
    return [...db, ...dummyInvestors].slice(0, 10);
  }, [dbInvestors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/startups?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full overflow-x-hidden">
      <Helmet>
        <title>India's Got Startup — Premium Startup Ecosystem</title>
        <meta name="description" content="India's premier startup ecosystem platform. Discover startups, connect with investors, find incubators, explore grants, and expand your network." />
      </Helmet>

      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* ═══════════════════════════════════════════
          1. PREMIUM HERO & SEARCH
          ═══════════════════════════════════════════ */}
      <section className="w-full pt-28 pb-20 relative bg-gradient-to-b from-primary/5 via-background to-background flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            The Premium Network
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            India's Startup Ecosystem,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Curated & Connected.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover rising startups, connect with active investors, apply for top incubators, and hire the best talent across India.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full relative mt-10">
            <div className="relative flex items-center bg-card border border-border/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
              <Search className="absolute left-5 h-6 w-6 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for startups, investors, sectors, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent h-16 pl-14 pr-32 text-lg outline-none placeholder:text-muted-foreground/70"
              />
              <div className="absolute right-2">
                <Button type="submit" size="lg" className="h-12 px-8 rounded-xl font-semibold text-base shadow-md">
                  Explore
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. ECOSYSTEM NAVIGATION CARDS
          ═══════════════════════════════════════════ */}
      <section className="w-full relative z-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {ECOSYSTEM_SECTIONS.map(sec => (
              <Link
                key={sec.path}
                to={sec.path}
                className="group bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={`h-14 w-14 rounded-2xl ${sec.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <sec.icon className={`h-7 w-7 ${sec.color}`} />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{sec.label}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{sec.desc}</p>
                <div className="mt-auto flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  Explore <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. LATEST STORIES
          ═══════════════════════════════════════════ */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-muted/10 border-t border-border/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Stories</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/articles")}>
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles?.slice(0, 8).map((article) => (
              <NewsCard
                key={article.id}
                articleId={article.id}
                title={article.title}
                description={article.excerpt || ""}
                category={article.category}
                date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                source="India's Got Startup"
                sourceUrl={`/article/${article.slug}`}
                thumbnail={article.featured_image_url || undefined}
                author={article.profiles?.full_name || "Editorial Team"}
                authorId={article.author_id}
                authorImage={article.profiles?.avatar_url || undefined}
                readTime={`${article.reading_time || 5} min read`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. FEATURED STARTUPS CAROUSEL
          ═══════════════════════════════════════════ */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight">Featured Startups</h2>
              </div>
              <p className="text-muted-foreground text-lg">Discover the fastest-growing companies in the ecosystem.</p>
            </div>
            <Button variant="outline" size="lg" className="hidden sm:flex" onClick={() => navigate("/startups")}>
              View All Directory <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {mergedStartups.map((startup: any, index) => (
                <CarouselItem key={startup.id || index} className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="h-full">
                    <StartupCard startup={startup as any} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-end gap-2 mt-8">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-12 w-12 bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors" />
              <CarouselNext className="relative right-0 top-0 translate-y-0 h-12 w-12 bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors" />
            </div>
          </Carousel>
          <Button variant="outline" className="w-full mt-6 sm:hidden" onClick={() => navigate("/startups")}>
            View All Startups
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. ACTIVE INVESTORS CAROUSEL
          ═══════════════════════════════════════════ */}
      <section className="w-full py-12 bg-muted/10 border-t border-border/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                <h2 className="text-3xl font-bold tracking-tight">Active Investors</h2>
              </div>
              <p className="text-muted-foreground text-lg">Firms and angels actively deploying capital.</p>
            </div>
            <Button variant="outline" size="lg" className="hidden sm:flex" onClick={() => navigate("/investors")}>
              View All Investors <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {mergedInvestors.map((inv: any, index) => (
                <CarouselItem key={inv.id || index} className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="h-full">
                    <InvestorCard investor={inv as any} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-end gap-2 mt-8">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-12 w-12 bg-card border-border hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors" />
              <CarouselNext className="relative right-0 top-0 translate-y-0 h-12 w-12 bg-card border-border hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors" />
            </div>
          </Carousel>
          <Button variant="outline" className="w-full mt-6 sm:hidden" onClick={() => navigate("/investors")}>
            View All Investors
          </Button>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default Index;
