import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { EVENTS_DATA, AppEvent } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Zap, ExternalLink, Filter, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Events = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Collect unique values for filters
  const allTypes = useMemo(() => Array.from(new Set(EVENTS_DATA.map(e => e.type))), []);
  const allLocations = useMemo(() => Array.from(new Set(EVENTS_DATA.map(e => e.locationType))), []);
  const allAudiences = useMemo(() => Array.from(new Set(EVENTS_DATA.flatMap(e => e.targetAudience))), []);
  const allFields = useMemo(() => Array.from(new Set(EVENTS_DATA.flatMap(e => e.fieldOfStartup))), []);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) return false;
      if (selectedLocations.length > 0 && !selectedLocations.includes(event.locationType)) return false;
      
      // For arrays, if ANY of the selected targets match ANY of the event's targets
      if (selectedTargetAudiences.length > 0 && !selectedTargetAudiences.some(aud => event.targetAudience.includes(aud))) return false;
      if (selectedFields.length > 0 && !selectedFields.some(field => event.fieldOfStartup.includes(field))) return false;
      
      return true;
    });
  }, [selectedTypes, selectedLocations, selectedTargetAudiences, selectedFields]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes, selectedLocations, selectedTargetAudiences, selectedFields]);

  const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedTargetAudiences([]);
    setSelectedFields([]);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-hidden text-foreground flex flex-col">
      {/* Ambient Lighting Background */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-cyan-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />

      {/* Page Header */}
      <header className="relative z-10 pt-16 pb-12 text-center container mx-auto px-4">
        <Badge className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 uppercase tracking-widest text-xs border-cyan-500/20 mb-6 py-1 px-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Startup Ecosystem
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400">
          Discover Connect Innovate
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          Explore upcoming hackathons, tech seminars, and networking events. Find your next co-founder, pitch to investors, and level up your startup journey.
        </p>
        <Link to="/create-event">
          <Button className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-foreground dark:text-white font-black tracking-widest uppercase rounded-full px-10 py-6 text-sm shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)] transition-all duration-300 hover:-translate-y-1 group">
            <PlusCircle className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
            Host an Event
          </Button>
        </Link>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10 flex-1 w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="sticky top-24 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-3xl border border-border rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                 <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 group cursor-pointer" onClick={clearAllFilters}>
                   <Filter className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" /> Filters
                 </h2>
                 {(selectedTypes.length > 0 || selectedLocations.length > 0 || selectedTargetAudiences.length > 0 || selectedFields.length > 0) && (
                   <span onClick={clearAllFilters} className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition-colors uppercase tracking-widest font-bold">Clear All</span>
                 )}
               </div>

               {/* Event Type Filter */}
               <div className="mb-8">
                 <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Event Type</h3>
                 <div className="flex flex-col gap-2">
                   {allTypes.map(type => (
                     <label key={type} className="flex items-center gap-3 group cursor-pointer">
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'border-zinc-700 bg-black/50 group-hover:border-purple-400'}`}>
                         {selectedTypes.includes(type) && <div className="w-2 h-2 bg-white rounded-sm" />}
                       </div>
                       <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)} />
                       <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground dark:text-white transition-colors">{type}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Expected Audience Filter */}
               <div className="mb-8">
                 <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Target Audience</h3>
                 <div className="flex flex-wrap gap-2">
                   {allAudiences.map(aud => (
                     <Badge 
                        key={aud} 
                        variant="outline" 
                        className={`cursor-pointer transition-all duration-300 text-xs py-1 ${selectedTargetAudiences.includes(aud) ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-transparent text-muted-foreground border-border hover:border-border'}`}
                        onClick={() => toggleFilter(selectedTargetAudiences, setSelectedTargetAudiences, aud)}
                     >
                       {aud}
                     </Badge>
                   ))}
                 </div>
               </div>

               {/* Sector Filter */}
               <div className="mb-8">
                 <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Industry / Field</h3>
                 <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                   {allFields.map(field => (
                     <label key={field} className="flex items-center gap-3 group cursor-pointer">
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFields.includes(field) ? 'bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-zinc-700 bg-black/50 group-hover:border-amber-400'}`}>
                         {selectedFields.includes(field) && <div className="w-2 h-2 bg-black rounded-sm" />}
                       </div>
                       <input type="checkbox" className="hidden" checked={selectedFields.includes(field)} onChange={() => toggleFilter(selectedFields, setSelectedFields, field)} />
                       <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground dark:text-white transition-colors">{field}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Location Filter */}
               <div>
                 <h3 className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Format / Location</h3>
                 <div className="flex flex-wrap gap-2">
                   {allLocations.map(loc => (
                     <Badge 
                        key={loc} 
                        variant="outline" 
                        className={`cursor-pointer transition-all duration-300 text-xs py-1 ${selectedLocations.includes(loc) ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-transparent text-muted-foreground border-border hover:border-border'}`}
                        onClick={() => toggleFilter(selectedLocations, setSelectedLocations, loc)}
                     >
                       {loc}
                     </Badge>
                   ))}
                 </div>
               </div>
            </div>
          </aside>

          {/* Events Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <h2 className="text-2xl font-black text-foreground dark:text-white uppercase tracking-widest">Upcoming Events</h2>
              <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase bg-zinc-900 px-3 py-1 rounded-full border border-border">{filteredEvents.length} Results</span>
            </div>

            {/* Top Pagination Control */}
            <div id="events-list" className="scroll-mt-32" />
            {filteredEvents.length > ITEMS_PER_PAGE && (
              <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl mb-6 transition-all duration-300">
                 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">
                  Page {currentPage} of {Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)}
                </p>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredEvents.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((event, idx) => (
                  <div key={event.id} className="animate-in fade-in slide-in-from-bottom-12 fill-mode-both duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="h-full group relative bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden flex flex-col hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(168,85,247,0.2)] hover:-translate-y-1">
                      
                      {/* Image Header */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-slate-50/80 dark:bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-purple-600/90 hover:bg-purple-600 text-foreground dark:text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1 relative z-20 -mt-6">
                        <div className="bg-zinc-900 rounded-xl p-3 border border-border flex items-center justify-between mb-4 shadow-xl">
                          <div className="flex items-center gap-2 text-cyan-400">
                            <Calendar className="w-4 h-4" />
                            <span className="font-bold text-sm tracking-wide">{event.date}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors">
                          {event.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="space-y-3 mb-6">
                           <div className="flex items-center gap-2 text-sm text-foreground/80">
                             <MapPin className="w-4 h-4 text-amber-500" />
                             <span className="font-medium">{event.location} <span className="text-muted-foreground">({event.locationType})</span></span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-foreground/80">
                             <Users className="w-4 h-4 text-purple-400" />
                             <span className="font-medium line-clamp-1">{event.targetAudience.join(", ")}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-foreground/80">
                             <Zap className="w-4 h-4 text-cyan-400" />
                             <span className="font-medium line-clamp-1">Sectors: {event.fieldOfStartup.join(", ")}</span>
                           </div>
                        </div>

                        {/* Register Block */}
                        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Hosted By</span>
                            <span className="text-foreground dark:text-white font-semibold text-sm">{event.organizer}</span>
                          </div>
                          <Button 
                            className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold uppercase tracking-widest text-xs px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
                            onClick={() => window.open(event.registrationLink, '_blank')}
                          >
                            Register <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <Calendar className="h-16 w-16 text-zinc-700 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-foreground dark:text-white mb-3">No Events Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Expand your filters to discover more possibilities and opportunities across the network.
                </p>
                <Button onClick={clearAllFilters} variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-full font-bold uppercase tracking-widest">
                  Reset Filters
                </Button>
              </div>
            )}
            
            {/* Bottom Pagination Control */}
            {filteredEvents.length > ITEMS_PER_PAGE && (
              <div className="pt-10">
                <Pagination>
                  <PaginationContent className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-xl">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); setTimeout(() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.ceil(filteredEvents.length / ITEMS_PER_PAGE))].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => { setCurrentPage(i + 1); setTimeout(() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
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
                        onClick={() => { setCurrentPage(prev => Math.min(Math.ceil(filteredEvents.length / ITEMS_PER_PAGE), prev + 1)); setTimeout(() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        className={`cursor-pointer transition-all hover:bg-white/5 active:scale-95 ${currentPage === Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default Events;
