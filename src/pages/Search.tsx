import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { mockPeople } from "@/data/mockPeople";
import { dummyStartups } from "@/data/startups";
import { dummyInvestors } from "@/data/investors";
import { dummyIncubators } from "@/data/incubators";
import { GRANTS_DATA } from "@/data/grants";
import { EVENTS_DATA } from "@/data/events";
import { useArticles } from "@/hooks/useArticles";
import { Search as SearchIcon, Users, Rocket, TrendingUp, Building2, Calendar, Coins, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const [query, setQuery] = useState(q);
  
  const { data: articles } = useArticles();

  const results = useMemo(() => {
    if (!q) return { people: [], startups: [], investors: [], incubators: [], events: [], grants: [], articles: [] };
    
    return {
      people: mockPeople.filter(p => p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)),
      startups: dummyStartups.filter(s => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)),
      investors: dummyInvestors.filter(i => i.name.toLowerCase().includes(q) || i.tagline.toLowerCase().includes(q)),
      incubators: dummyIncubators.filter(i => i.name.toLowerCase().includes(q) || i.shortDescription.toLowerCase().includes(q)),
      events: EVENTS_DATA.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
      grants: GRANTS_DATA.filter(g => g.title.toLowerCase().includes(q) || g.provider.toLowerCase().includes(q)),
      articles: (articles || []).filter(a => a.title.toLowerCase().includes(q) || (a.excerpt && a.excerpt.toLowerCase().includes(q)))
    };
  }, [q, articles]);

  const totalResults = Object.values(results).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full overflow-x-hidden">
      <Helmet>
        <title>Search Results for "{q}" | India's Got Startup</title>
      </Helmet>
      
      <Navbar searchQuery={query} onSearchChange={setQuery} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Search Results</h1>
          <p className="text-muted-foreground text-lg">Found {totalResults} results for "<span className="text-foreground font-medium">{q}</span>"</p>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">Try adjusting your search terms or exploring our directories.</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* People */}
            {results.people.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> People</h2>
                  <Link to="/people" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View Directory <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.people.slice(0, 3).map(p => (
                    <Link to={`/user/${p.id}`} key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                      <img src={p.avatar_url} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{p.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Startups */}
            {results.startups.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Rocket className="h-5 w-5 text-blue-500" /> Startups</h2>
                  <Link to="/startups" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View Directory <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.startups.slice(0, 3).map((s: any) => (
                    <Link to={`/startups/${s.slug}`} key={s.id} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl overflow-hidden shrink-0">
                        {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{s.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{s.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Stories */}
            {results.articles.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-amber-500" /> Stories</h2>
                  <Link to="/articles" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">All Stories <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.articles.slice(0, 3).map((a: any) => (
                    <Link to={`/article/${a.slug}`} key={a.id} className="flex flex-col gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                      <h3 className="font-bold line-clamp-2">{a.title}</h3>
                      {a.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
