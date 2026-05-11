import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useUniversalSearch, SearchResultType } from "@/hooks/useUniversalSearch";
import { Search as SearchIcon, Users, Rocket, TrendingUp, Building2, Calendar, Coins, FileText, ArrowRight, Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAdminSession } from "@/hooks/useAdminSession";

const TYPE_CONFIG: Record<SearchResultType, { icon: any; color: string; label: string; linkPrefix: string; description: string }> = {
  people: { icon: Users, color: "text-blue-500", label: "People", linkPrefix: "/user/", description: "Networking and professionals" },
  startup: { icon: Rocket, color: "text-orange-500", label: "Startups", linkPrefix: "/startups/", description: "Innovators and companies" },
  investor: { icon: TrendingUp, color: "text-emerald-500", label: "Investors", linkPrefix: "/investors/", description: "VCs and Angels" },
  incubator: { icon: Building2, color: "text-purple-500", label: "Incubators", linkPrefix: "/incubators/", description: "Launchpads and support" },
  event: { icon: Calendar, color: "text-pink-500", label: "Events", linkPrefix: "/events/", description: "Networking and webinars" },
  grant: { icon: Coins, color: "text-amber-500", label: "Grants", linkPrefix: "/grants/", description: "Funding and opportunities" },
  article: { icon: FileText, color: "text-indigo-500", label: "Stories", linkPrefix: "/article/", description: "News and insights" },
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { isAuthenticated: isAdmin } = useAdminSession();
  const navigate = useNavigate();

  const { data: results, isLoading } = useUniversalSearch(q, 20);

  const totalResults = results ? Object.values(results).reduce((acc, curr) => acc + curr.length, 0) : 0;

  const trendingSearches = ["Fintech", "Healthtech", "AI", "SaaS", "Grants 2024", "Mumbai Startups"];

  const ResultCard = ({ item }: { item: any }) => {
    const config = TYPE_CONFIG[item.type as SearchResultType];
    const Icon = config.icon;
    
    return (
      <Link 
        to={`${config.linkPrefix}${item.slug || item.id}`}
        className="group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
      >
        <div className="h-14 w-14 rounded-xl bg-muted shrink-0 overflow-hidden flex items-center justify-center border border-border/50 group-hover:border-primary/20 transition-colors relative">
          {item.image ? (
            <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <span className="text-xl font-bold text-muted-foreground">{item.title.charAt(0)}</span>
          )}
          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center shadow-sm`}>
            <Icon className={`h-3 w-3 ${config.color}`} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{item.title}</h3>
          </div>
          {item.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.subtitle}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold py-0.5 px-2 bg-muted/30">
              {config.label}
            </Badge>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.preventDefault();
                  // For now, redirect to the public profile where they can edit or use admin dashboard
                  // Ideally we'd have direct admin edit links here
                  navigate(`/admin?tab=ecosystem&search=${encodeURIComponent(item.title)}`);
                }}
              >
                Manage in Admin
              </Button>
            )}
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full overflow-x-hidden">
      <Helmet>
        <title>Search Results for "{q}" | India's Got Startup</title>
      </Helmet>
      
      <Navbar searchQuery={query} onSearchChange={setQuery} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <SearchIcon className="h-3 w-3" /> Unified Search
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
                Discovery Engine
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Displaying {totalResults} matches for "<span className="text-foreground font-bold">{q}</span>" across our entire ecosystem.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-border/50 shadow-sm">
                <Filter className="h-4 w-4 mr-2" /> Advanced Filters
              </Button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="relative h-20 w-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <SearchIcon className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing the ecosystem...</h2>
            <p className="text-muted-foreground">Scanning startups, people, events and more.</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="py-24 px-6 rounded-3xl bg-card border border-dashed border-border text-center max-w-3xl mx-auto">
            <div className="h-20 w-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-6">
              <X className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No direct matches found</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We couldn't find anything matching "{q}". Try adjusting your search or explore trending topics below.
            </p>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trending Searches</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingSearches.map(term => (
                  <Button 
                    key={term} 
                    variant="outline" 
                    className="rounded-full border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    asChild
                  >
                    <Link to={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between gap-4 mb-8 border-b border-border overflow-x-auto no-scrollbar pb-1">
              <TabsList className="bg-transparent h-auto p-0 gap-2">
                <TabsTrigger 
                  value="all" 
                  className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold transition-all"
                >
                  All Results <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none">{totalResults}</Badge>
                </TabsTrigger>
                {(Object.keys(TYPE_CONFIG) as SearchResultType[]).map(type => {
                  const count = results?.[type]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <TabsTrigger 
                      key={type}
                      value={type} 
                      className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold transition-all"
                    >
                      {TYPE_CONFIG[type].label} <Badge variant="secondary" className="ml-2 bg-muted border-none">{count}</Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(results || {}) as SearchResultType[]).flatMap(type => 
                  results?.[type].map(item => <ResultCard key={`${type}-${item.id}`} item={item} />)
                )}
              </div>
            </TabsContent>

            {(Object.keys(TYPE_CONFIG) as SearchResultType[]).map(type => (
              <TabsContent key={type} value={type} className="mt-0">
                <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = TYPE_CONFIG[type].icon;
                      return <Icon className={`h-6 w-6 ${TYPE_CONFIG[type].color}`} />;
                    })()}
                    <h2 className="text-xl font-bold">{TYPE_CONFIG[type].label}</h2>
                  </div>
                  <p className="text-muted-foreground">{TYPE_CONFIG[type].description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results?.[type].map(item => <ResultCard key={item.id} item={item} />)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Search;
