import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Plus, ChevronLeft, ChevronRight, Loader2, Edit3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { IncubatorCard } from "@/components/ecosystem/IncubatorCard";
import { useEcosystemList } from "@/hooks/useEcosystem";
import { useUserEntity } from "@/hooks/useUserEntity";

const ITEMS_PER_PAGE = 50;

const Incubators = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userEntity } = useUserEntity(user?.id, "incubators");
  
  const { data: dbIncubators, isLoading } = useEcosystemList("incubators");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [state, setState] = useState("all");
  const [sector, setSector] = useState("all");
  const [page, setPage] = useState(1);

  // Use DB data
  const allIncubators = useMemo(() => {
    const mappedDbIncubators = (dbIncubators || []).map((i: any) => {
      let grantAvailable = false;
      try {
        const facilities = JSON.parse(i.facilities || "{}");
        if (facilities.schemes && facilities.schemes.length > 0) grantAvailable = true;
      } catch (e) {}

      return {
        id: i.id,
        name: i.name,
        slug: i.slug,
        shortDescription: i.about || i.tagline || "",
        city: i.city || "",
        state: i.state || "",
        sectors: i.sector_focus ? i.sector_focus.split(",").map((s: string) => s.trim()) : [],
        logo: i.logo_url || null,
        investmentStages: i.startup_stages_supported ? i.startup_stages_supported.split(",").map((s: string) => s.trim()) : [],
        grantAvailable,
        programs: [],
        mentors: []
      };
    });
    
    return mappedDbIncubators;
  }, [dbIncubators]);

  // Extract unique values for filters
  const cities = useMemo(() => Array.from(new Set(allIncubators.map(i => i.city).filter(Boolean))).sort(), [allIncubators]);
  const states = useMemo(() => Array.from(new Set(allIncubators.map(i => i.state).filter(Boolean))).sort(), [allIncubators]);
  const sectors = useMemo(() => {
    const allSectors = allIncubators.flatMap(i => i.sectors || []);
    return Array.from(new Set(allSectors)).sort();
  }, [allIncubators]);

  // Filter logic
  const filteredIncubators = useMemo(() => {
    return allIncubators.filter(i => {
      const q = search.toLowerCase();
      const matchesSearch = !search || 
        i.name.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q) ||
        (i.sectors && i.sectors.some((s: string) => s.toLowerCase().includes(q))) ||
        (i.shortDescription && i.shortDescription.toLowerCase().includes(q));

      const matchesCity = city === "all" || i.city === city;
      const matchesState = state === "all" || i.state === state;
      const matchesSector = sector === "all" || (i.sectors && i.sectors.includes(sector));

      return matchesSearch && matchesCity && matchesState && matchesSector;
    });
  }, [search, city, state, sector, allIncubators]);

  const totalPages = Math.ceil(filteredIncubators.length / ITEMS_PER_PAGE);
  const paginatedIncubators = filteredIncubators.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useMemo(() => setPage(1), [search, city, state, sector]);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <span className="text-sm font-medium mx-2">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Explore Incubators Across India | India's Got Startup</title>
        <meta name="description" content="Find incubators, accelerators, and startup support programs across India." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
              <Building2 className="h-3.5 w-3.5" /> Incubator Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Explore Incubators</h1>
            <p className="text-muted-foreground">Find the right launchpad for your startup with our comprehensive directory.</p>
          </div>
          {userEntity ? (
            <Button onClick={() => navigate(`/incubators/${userEntity.slug}`)} variant="outline" className="gap-2 shrink-0 border-primary/20 text-primary hover:bg-primary/10">
              <Edit3 className="h-4 w-4" /> Edit Incubator
            </Button>
          ) : (
            <Button onClick={() => navigate(user ? "/incubators/submit" : "/auth")} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add Incubator
            </Button>
          )}
        </header>

        <div className="bg-card border border-border/50 rounded-xl p-4 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name, city, sector, or keywords..." 
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
            Showing <span className="font-semibold text-foreground">{filteredIncubators.length}</span> incubators
          </p>
          {totalPages > 1 && <PaginationControls />}
        </div>

        <section>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedIncubators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedIncubators.map(i => <IncubatorCard key={i.id || i.slug} incubator={i as any} />)}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/50 rounded-xl bg-card/30">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No incubators found</h3>
              <p className="text-muted-foreground mb-6">Try changing your search or filters to find what you're looking for.</p>
              <Button variant="outline" onClick={() => { setSearch(""); setCity("all"); setState("all"); setSector("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {paginatedIncubators.length > 0 && totalPages > 1 && (
          <div className="mt-8 pt-8 border-t border-border/50">
            <PaginationControls />
          </div>
        )}
      </main>
      
    </div>
  );
};

export default Incubators;
