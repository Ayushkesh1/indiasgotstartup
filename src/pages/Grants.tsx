import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building, ArrowRight, ShieldCheck, Coins } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";

import CategoryFilter from "@/components/CategoryFilter";
import { GRANTS_DATA } from "@/data/grants";
import { Link } from "react-router-dom";

import { CalendarClock, CalendarDays, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format, isBefore, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const GRANT_CATEGORIES = ["Grant", "Seed Funding", "Accelerator", "Incubator", "Contest"];

const Grants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState<"All" | "Closing Soon" | "Rolling" | Date>("All"); // All, Closing Soon, Rolling, or Specific Date
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, dateFilter]);
  
  const filteredGrants = GRANTS_DATA.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      grant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === "All" || 
      grant.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
      
    let matchesDate = true;
    if (dateFilter instanceof Date) {
      if (grant.deadline.includes("Rolling")) {
        matchesDate = true; // Rolling grants are always applicable
      } else {
        const grantDate = new Date(grant.deadline);
        // If the grant deadline is AFTER or ON the selected date, it's valid
        matchesDate = grantDate >= dateFilter;
      }
    } else {
      if (dateFilter === "Rolling") {
        matchesDate = grant.deadline.includes("Rolling");
      } else if (dateFilter === "Closing Soon") {
        if (grant.deadline.includes("Rolling")) {
          matchesDate = false;
        } else {
          // Assume "Closing soon" means within 30 days
          const grantDate = new Date(grant.deadline);
          matchesDate = isBefore(grantDate, addDays(new Date(), 30));
        }
      }
    }
      
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-hidden text-foreground flex flex-col">
      <Helmet>
        <title>Grants & Funding | India's Got Startup</title>
        <meta name="description" content="Discover active grants, non-dilutive funding, and credits for your startup." />
      </Helmet>

      {/* Ambient Lighting Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 w-full">
        {/* Hero Section */}
        <div className="w-full relative py-20 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase mb-6 slide-in-from-bottom-4 animate-in fade-in duration-500">
              <Coins className="w-4 h-4 mr-2 inline-block" /> Non-Dilutive Capital
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground dark:text-white mb-6 leading-tight drop-shadow-2xl slide-in-from-bottom-6 animate-in fade-in duration-700">
              Fuel Your Startup <br className="hidden md:block" />
              With <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">Zero Equity Loss</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 slide-in-from-bottom-8 animate-in fade-in duration-1000 delay-150">
              Discover active government schemes, corporate grants, and accelerator programs tailored for Indian innovators. Keep 100% of your company.
            </p>
            
            <div className="max-w-xl mx-auto relative group slide-in-from-bottom-10 animate-in fade-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative flex items-center w-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-full overflow-hidden shadow-2xl">
                <Search className="w-6 h-6 text-muted-foreground ml-6" />
                <Input 
                  type="text" 
                  placeholder="Search by keyword, sector, or agency..." 
                  className="w-full bg-transparent border-0 h-16 text-lg px-4 focus-visible:ring-0 placeholder:text-muted-foreground text-foreground dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest px-8 h-12 mr-2">
                  Search
                </Button>
              </div>
            </div>
            <div className="mt-8 flex justify-center sm:hidden slide-in-from-bottom-10 animate-in fade-in duration-1000 delay-500">
              <Button asChild className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 font-bold uppercase tracking-widest px-8 h-12 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Link to="/create-grant">
                  Post a Grant
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Grants Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-24">
          <div className="mb-10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between z-20 relative">
            <div className="w-full md:w-auto flex-1 overflow-hidden">
              <CategoryFilter
                categories={GRANT_CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                allLabel="All"
              />
            </div>
            
            <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto relative group overflow-hidden bg-neutral-900 border-border hover:border-cyan-500/50 hover:bg-neutral-800 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <CalendarDays className="w-4 h-4 mr-2 relative z-10 text-cyan-400" />
                    <span className="relative z-10 text-zinc-200">Date: <span className="font-bold ml-1 text-foreground dark:text-white">{dateFilter instanceof Date ? format(dateFilter, "MMM d, yyyy") : dateFilter}</span></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0 border-cyan-500/30 bg-neutral-900 overflow-hidden rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <CalendarUI
                    mode="single"
                    selected={dateFilter instanceof Date ? dateFilter : undefined}
                    onSelect={(day) => setDateFilter(day || "All")}
                    initialFocus
                    className="text-foreground dark:text-white bg-gradient-to-b from-neutral-900 to-neutral-950 p-3"
                    classNames={{
                      day_selected: "bg-gradient-to-r from-cyan-500 to-purple-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(34,211,238,0.5)] font-bold",
                      day_today: "bg-purple-500/20 text-purple-300 border border-purple-500/50",
                      cell: "h-9 w-9 text-center text-sm p-0 flex items-center justify-center",
                      nav_button: "border border-border hover:bg-white/10 p-1 rounded-md transition-colors"
                    }}
                  />
                  <div className="grid grid-cols-3 gap-1 p-2 border-t border-border bg-slate-50/80 dark:bg-black/40">
                    {["All", "Closing Soon", "Rolling"].map(dateOption => {
                      const isActive = dateFilter === dateOption;
                      return (
                        <button
                          key={dateOption}
                          onClick={() => setDateFilter(dateOption as "All" | "Closing Soon" | "Rolling")}
                          className={cn(
                            "relative w-full text-center px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 group overflow-hidden",
                            isActive ? "text-foreground dark:text-white bg-cyan-500/20 border border-cyan-500/50" : "text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/5 border border-transparent"
                          )}
                        >
                          <span className="relative z-10 line-clamp-1">{dateOption === "Closing Soon" ? "Soon" : dateOption}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-border pb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-cyan-400" /> Active Opportunities
              </h2>
              <p className="text-muted-foreground mt-2">Showing exactly what you need to grow your vision.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="h-10 px-6 font-bold tracking-widest uppercase bg-transparent border-border text-foreground dark:text-white hover:bg-white/10 hover:text-foreground dark:text-white rounded-full transition-colors hidden sm:flex">
                <Link to="/create-grant">Post a Grant</Link>
              </Button>
              <div className="text-sm font-semibold tracking-widest uppercase text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20">
                {filteredGrants.length} Result{filteredGrants.length !== 1 ? 's' : ''} Found
              </div>
            </div>
          </div>

          {/* Top Pagination Control */}
          <div id="grants-list" className="scroll-mt-32" />
          {filteredGrants.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl mb-6 transition-all duration-300">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">
                Page {currentPage} of {Math.ceil(filteredGrants.length / ITEMS_PER_PAGE)}
              </p>
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                      className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredGrants.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                      className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredGrants.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((grant, idx) => (
              <Link to={`/grants/${grant.id}`} key={grant.id} className="block outline-none" style={{ animationDelay: `${idx * 100}ms` }}>
                <Card className="h-full bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm border border-border hover:border-purple-500/50 transition-all duration-300 group overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 uppercase tracking-widest text-[10px]">
                        {grant.deadline}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground dark:text-white leading-tight group-hover:text-purple-300 transition-colors">
                      {grant.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-muted-foreground mt-2 gap-2 text-sm font-medium">
                      <Building className="w-4 h-4" /> {grant.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-foreground/80 text-sm leading-relaxed mb-6 line-clamp-3">
                      {grant.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {grant.tags.map(tag => (
                        <Badge key={tag} className="bg-white/5 hover:bg-white/10 text-foreground/80 border-none font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border flex items-center justify-between bg-white/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Funding Size</span>
                      <span className="text-cyan-400 font-bold text-sm">{grant.amount}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full pointer-events-none group-hover:bg-purple-500/20 group-hover:text-purple-300 text-muted-foreground group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Bottom Pagination Control */}
          {filteredGrants.length > ITEMS_PER_PAGE && (
            <div className="pt-10">
              <Pagination>
                <PaginationContent className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-xl">
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                      className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.ceil(filteredGrants.length / ITEMS_PER_PAGE))].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => { setCurrentPage(i + 1); setTimeout(() => document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        isActive={currentPage === i + 1}
                        className={`cursor-pointer rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                          currentPage === i + 1 
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-foreground dark:text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                          : 'text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredGrants.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('grants-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                      className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredGrants.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          {filteredGrants.length === 0 && (
            <div className="py-24 text-center border border-dashed border-border rounded-3xl bg-white/5 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-border">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">No matches found</h3>
              <p className="text-muted-foreground max-w-sm">We couldn't find any grants matching your exact search. Try adjusting your keywords or clearing the search.</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-6 border-border text-foreground dark:text-white hover:bg-white/10">Clear filters</Button>
            </div>
          )}
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default Grants;
