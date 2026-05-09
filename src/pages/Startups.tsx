import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Search, Plus, ChevronLeft, ChevronRight, Rocket, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { StartupCard } from "@/components/ecosystem/StartupCard";
import { dummyStartups } from "@/data/startups";
import { useEcosystemList } from "@/hooks/useEcosystem";

const ITEMS_PER_PAGE = 50;

const Startups = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: dbStartups, isLoading } = useEcosystemList("startups");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [state, setState] = useState("all");
  const [sector, setSector] = useState("all");
  const [page, setPage] = useState(1);

  // Merge dummy and DB data
  const allStartups = useMemo(() => {
    const mappedDbStartups = (dbStartups || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.description || s.tagline || "",
      city: s.city || "",
      state: s.state || "",
      sector: s.sector || "",
      logo: s.logo_url || null,
      teamMembers: [] // We don't fetch team on list page
    }));
    
    // Combine and deduplicate by slug
    const combined = [...mappedDbStartups, ...dummyStartups];
    const unique = Array.from(new Map(combined.map(item => [item.slug, item])).values());
    return unique;
  }, [dbStartups]);

  // Extract unique values for filters
  const cities = useMemo(() => Array.from(new Set(allStartups.map(s => s.city).filter(Boolean))).sort(), [allStartups]);
  const states = useMemo(() => Array.from(new Set(allStartups.map(s => s.state).filter(Boolean))).sort(), [allStartups]);
  const sectors = useMemo(() => [
    "SaaS", "AI", "AgriTech", "HealthTech", "FinTech", "EdTech", "D2C", 
    "ClimateTech", "DeepTech", "Social Impact", "Hardware", "Web3", 
    "Consumer Tech", "Other"
  ], []);

  // Filter logic
  const filteredStartups = useMemo(() => {
    return allStartups.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = !search || 
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        (s.shortDescription && s.shortDescription.toLowerCase().includes(q));

      const matchesCity = city === "all" || s.city === city;
      const matchesState = state === "all" || s.state === state;
      const matchesSector = sector === "all" || (sector === "Other" ? !sectors.slice(0, -1).includes(s.sector) : s.sector === sector);

      return matchesSearch && matchesCity && matchesState && matchesSector;
    });
  }, [search, city, state, sector, sectors, allStartups]);

  const totalPages = Math.ceil(filteredStartups.length / ITEMS_PER_PAGE);
  const paginatedStartups = filteredStartups.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useMemo(() => setPage(1), [search, city, state, sector]);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button 
          key={i} 
          variant={page === i ? "default" : "outline"} 
          size="sm" 
          onClick={() => setPage(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers}
        </div>
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Discover Indian Startups | India's Got Startup</title>
        <meta name="description" content="Browse and discover thousands of Indian startups across sectors, stages, and cities. Find founders, follow companies, and explore the ecosystem." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Startup Database
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Discover Indian Startups</h1>
            <p className="text-muted-foreground">Search across sectors, stages, and cities — built by India's startup community.</p>
          </div>
          <Button onClick={() => navigate(user ? "/startups/submit" : "/auth")} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Startup
          </Button>
        </header>

        <div className="bg-card border border-border/50 rounded-xl p-4 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by startup name, city, sector, or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 text-base bg-background"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredStartups.length}</span> startups
          </p>
          {totalPages > 1 && <PaginationControls />}
        </div>

        <section>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedStartups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedStartups.map(s => <StartupCard key={s.id || s.slug} startup={s as any} />)}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/50 rounded-xl bg-card/30">
              <Rocket className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No startups found</h3>
              <p className="text-muted-foreground mb-6">Try changing your filters to find what you're looking for.</p>
              <Button variant="outline" onClick={() => { setSearch(""); setCity("all"); setState("all"); setSector("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {paginatedStartups.length > 0 && totalPages > 1 && (
          <div className="mt-8 pt-8 border-t border-border/50">
            <PaginationControls />
          </div>
        )}
      </main>
      
    </div>
  );
};

export default Startups;
