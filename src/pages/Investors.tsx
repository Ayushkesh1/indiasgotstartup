import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { InvestorCard } from "@/components/ecosystem/InvestorCard";
import { dummyInvestors } from "@/data/investors";

const ITEMS_PER_PAGE = 50;

const INVESTOR_TYPES = ["Angel", "Micro-VC", "VC Fund", "Family Office", "Corporate VC", "Accelerator Fund"];
const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth"];

const Investors = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [state, setState] = useState("all");
  const [type, setType] = useState("all");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);

  // Extract unique values for filters
  const cities = useMemo(() => Array.from(new Set(dummyInvestors.map(i => i.city).filter(Boolean))).sort(), []);
  const states = useMemo(() => Array.from(new Set(dummyInvestors.map(i => i.state).filter(Boolean))).sort(), []);

  // Filter logic
  const filteredInvestors = useMemo(() => {
    return dummyInvestors.filter(inv => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        inv.name.toLowerCase().includes(q) ||
        inv.city.toLowerCase().includes(q) ||
        inv.state.toLowerCase().includes(q) ||
        inv.type.toLowerCase().includes(q) ||
        (inv.tagline && inv.tagline.toLowerCase().includes(q)) ||
        (inv.about && inv.about.toLowerCase().includes(q)) ||
        (inv.preferredSectors && inv.preferredSectors.some(s => s.toLowerCase().includes(q))) ||
        (inv.notableInvestments && inv.notableInvestments.some(ni => ni.toLowerCase().includes(q)));

      const matchesCity = city === "all" || inv.city === city;
      const matchesState = state === "all" || inv.state === state;
      const matchesType = type === "all" || inv.type === type;
      const matchesStage = stage === "all" || (inv.preferredStages && inv.preferredStages.includes(stage));

      return matchesSearch && matchesCity && matchesState && matchesType && matchesStage;
    });
  }, [search, city, state, type, stage]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE);
  const paginatedInvestors = filteredInvestors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => setPage(1), [search, city, state, type, stage]);

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
        <title>Discover Investors Backing India | India's Got Startup</title>
        <meta name="description" content="Find angels, micro-VCs, and venture capital firms investing in Indian startups. Filter by stage, sector, city, and ticket size." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> Investor Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Investors Backing India</h1>
            <p className="text-muted-foreground">Angels, VCs, and family offices — filter by type, stage, sector, and city.</p>
          </div>
          <Button onClick={() => navigate(user ? "/investors/submit" : "/auth")} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Submit Investor
          </Button>
        </header>

        {/* Search & Filters */}
        <div className="bg-card border border-border/50 rounded-xl p-4 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, sector, portfolio company, city, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 text-base bg-background"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Investor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {INVESTOR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Preferred Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top Pagination */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredInvestors.length}</span> investors
          </p>
          {totalPages > 1 && <PaginationControls />}
        </div>

        {/* Grid */}
        <section>
          {paginatedInvestors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedInvestors.map(inv => <InvestorCard key={inv.id} investor={inv} />)}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/50 rounded-xl bg-card/30">
              <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No investors found</h3>
              <p className="text-muted-foreground mb-6">Try changing your filters to find what you're looking for.</p>
              <Button variant="outline" onClick={() => { setSearch(""); setCity("all"); setState("all"); setType("all"); setStage("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Bottom Pagination */}
        {paginatedInvestors.length > 0 && totalPages > 1 && (
          <div className="mt-8 pt-8 border-t border-border/50">
            <PaginationControls />
          </div>
        )}
      </main>
    </div>
  );
};

export default Investors;
