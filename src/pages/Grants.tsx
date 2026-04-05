import React, { useState } from "react";
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

const GRANT_CATEGORIES = ["Grant", "Seed Funding", "Accelerator", "Incubation", "Contest"];

const Grants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredGrants = GRANTS_DATA.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      grant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === "All" || 
      grant.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-950 relative selection:bg-purple-500/30 overflow-hidden text-zinc-100 flex flex-col">
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl slide-in-from-bottom-6 animate-in fade-in duration-700">
              Fuel Your Startup <br className="hidden md:block" />
              With <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">Zero Equity Loss</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 slide-in-from-bottom-8 animate-in fade-in duration-1000 delay-150">
              Discover active government schemes, corporate grants, and accelerator programs tailored for Indian innovators. Keep 100% of your company.
            </p>
            
            <div className="max-w-xl mx-auto relative group slide-in-from-bottom-10 animate-in fade-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative flex items-center w-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden shadow-2xl">
                <Search className="w-6 h-6 text-zinc-400 ml-6" />
                <Input 
                  type="text" 
                  placeholder="Search by keyword, sector, or agency..." 
                  className="w-full bg-transparent border-0 h-16 text-lg px-4 focus-visible:ring-0 placeholder:text-zinc-500 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest px-8 h-12 mr-2">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grants Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-24">
          <div className="mb-10 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <CategoryFilter
              categories={GRANT_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              allLabel="All"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-cyan-400" /> Active Opportunities
              </h2>
              <p className="text-zinc-400 mt-2">Showing exactly what you need to grow your vision.</p>
            </div>
            <div className="text-sm font-semibold tracking-widest uppercase text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20">
              {filteredGrants.length} Result{filteredGrants.length !== 1 ? 's' : ''} Found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrants.map((grant, idx) => (
              <Link to={`/grants/${grant.id}`} key={grant.id} className="block outline-none" style={{ animationDelay: `${idx * 100}ms` }}>
                <Card className="h-full bg-neutral-900/40 backdrop-blur-sm border border-white/5 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 uppercase tracking-widest text-[10px]">
                        {grant.deadline}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors">
                      {grant.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-zinc-400 mt-2 gap-2 text-sm font-medium">
                      <Building className="w-4 h-4" /> {grant.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {grant.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {grant.tags.map(tag => (
                        <Badge key={tag} className="bg-white/5 hover:bg-white/10 text-zinc-300 border-none font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-white/5 flex items-center justify-between bg-white/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Funding Size</span>
                      <span className="text-cyan-400 font-bold text-sm">{grant.amount}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full pointer-events-none group-hover:bg-purple-500/20 group-hover:text-purple-300 text-zinc-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          {filteredGrants.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                <Search className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
              <p className="text-zinc-400 max-w-sm">We couldn't find any grants matching your exact search. Try adjusting your keywords or clearing the search.</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-6 border-white/10 text-white hover:bg-white/10">Clear filters</Button>
            </div>
          )}
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default Grants;
