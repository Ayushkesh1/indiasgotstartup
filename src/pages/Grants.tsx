import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building, ArrowRight, ShieldCheck, Coins, CalendarDays } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import CategoryFilter from "@/components/CategoryFilter";
import { GRANTS_DATA } from "@/data/grants";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format, isBefore, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const GRANT_CATEGORIES = ["Grant", "Seed Funding", "Accelerator", "Incubator", "Contest"];

const Grants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState<"All" | "Closing Soon" | "Rolling" | Date>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, dateFilter]);

  const filteredGrants = GRANTS_DATA.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" ||
      grant.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());

    let matchesDate = true;
    if (dateFilter instanceof Date) {
      if (grant.deadline.includes("Rolling")) {
        matchesDate = true;
      } else {
        const grantDate = new Date(grant.deadline);
        matchesDate = grantDate >= dateFilter;
      }
    } else {
      if (dateFilter === "Rolling") {
        matchesDate = grant.deadline.includes("Rolling");
      } else if (dateFilter === "Closing Soon") {
        if (grant.deadline.includes("Rolling")) {
          matchesDate = false;
        } else {
          const grantDate = new Date(grant.deadline);
          matchesDate = isBefore(grantDate, addDays(new Date(), 30));
        }
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredGrants.length / ITEMS_PER_PAGE);
  const paginatedGrants = filteredGrants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Grants & Funding | India's Got Startup</title>
        <meta name="description" content="Discover active grants, non-dilutive funding, and credits for your startup." />
      </Helmet>

      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="w-full py-16 lg:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 max-w-[1600px] text-center">
            <Badge variant="secondary" className="mb-4 text-xs uppercase tracking-wider font-semibold">
              <Coins className="w-3.5 h-3.5 mr-1.5 inline-block" /> Non-Dilutive Capital
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Fuel Your Startup{" "}
              <span className="text-gradient-brand">Without Equity Loss</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base text-muted-foreground mb-8 leading-relaxed">
              Discover active government schemes, corporate grants, and accelerator programs tailored for Indian innovators. Keep 100% of your company.
            </p>

            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by keyword, sector, or agency..."
                  className="w-full bg-transparent border-0 h-12 pl-12 pr-4 text-base focus-visible:ring-0 placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="sm" className="mr-1.5 h-9 px-5 rounded-lg font-semibold">Search</Button>
              </div>
            </div>
            <div className="mt-6 sm:hidden">
              <Button asChild>
                <Link to="/create-grant">Post a Grant</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Grants Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] pb-20">
          {/* Filters */}
          <div className="mb-8 bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex-1 overflow-hidden">
              <CategoryFilter
                categories={GRANT_CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                allLabel="All"
              />
            </div>

            <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    Date: <span className="font-semibold">{dateFilter instanceof Date ? format(dateFilter, "MMM d, yyyy") : dateFilter}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0 rounded-xl shadow-lg border-border overflow-hidden">
                  <CalendarUI
                    mode="single"
                    selected={dateFilter instanceof Date ? dateFilter : undefined}
                    onSelect={(day) => setDateFilter(day || "All")}
                    initialFocus
                    className="bg-card p-3"
                  />
                  <div className="grid grid-cols-3 gap-1 p-2 border-t border-border bg-muted/50">
                    {["All", "Closing Soon", "Rolling"].map(dateOption => (
                      <button
                        key={dateOption}
                        onClick={() => setDateFilter(dateOption as "All" | "Closing Soon" | "Rolling")}
                        className={cn(
                          "text-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                          dateFilter === dateOption ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {dateOption === "Closing Soon" ? "Soon" : dateOption}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Header + Results */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-border pb-5">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Active Opportunities
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Showing what you need to grow your vision.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link to="/create-grant">Post a Grant</Link>
              </Button>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-md">
                {filteredGrants.length} result{filteredGrants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div id="grants-list" className="scroll-mt-24" />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedGrants.map((grant, idx) => (
              <Link to={`/grants/${grant.id}`} key={grant.id} className="block outline-none" style={{ animationDelay: `${idx * 80}ms` }}>
                <Card className="h-full bg-card border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-xs font-medium text-primary border-primary/20 bg-primary/5">
                        {grant.deadline}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {grant.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-muted-foreground mt-1.5 gap-1.5 text-sm">
                      <Building className="w-3.5 h-3.5" /> {grant.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">{grant.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {grant.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 border-t border-border flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Funding Size</span>
                      <p className="text-primary font-semibold text-sm">{grant.amount}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredGrants.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/50 flex flex-col items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-4">Try adjusting your keywords or clearing the filters.</p>
              <Button onClick={() => setSearchQuery("")} variant="outline">Clear Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-border">
              <Pagination>
                <PaginationContent className="bg-card border border-border p-1 rounded-xl">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => { setCurrentPage(i + 1); document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer rounded-lg font-medium"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default Grants;
