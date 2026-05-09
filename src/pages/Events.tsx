import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { EVENTS_DATA, AppEvent } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Zap, ExternalLink, Filter, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { EventCard } from "@/components/ecosystem/EventCard";

const Events = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const allTypes = useMemo(() => Array.from(new Set(EVENTS_DATA.map(e => e.type))), []);
  const allLocations = useMemo(() => Array.from(new Set(EVENTS_DATA.map(e => e.locationType))), []);
  const allAudiences = useMemo(() => Array.from(new Set(EVENTS_DATA.flatMap(e => e.targetAudience))), []);
  const allFields = useMemo(() => Array.from(new Set(EVENTS_DATA.flatMap(e => e.fieldOfStartup))), []);

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) return false;
      if (selectedLocations.length > 0 && !selectedLocations.includes(event.locationType)) return false;
      if (selectedTargetAudiences.length > 0 && !selectedTargetAudiences.some(aud => event.targetAudience.includes(aud))) return false;
      if (selectedFields.length > 0 && !selectedFields.some(field => event.fieldOfStartup.includes(field))) return false;
      return true;
    });
  }, [selectedTypes, selectedLocations, selectedTargetAudiences, selectedFields]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => { setCurrentPage(1); }, [selectedTypes, selectedLocations, selectedTargetAudiences, selectedFields]);

  const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setState(state.includes(value) ? state.filter(item => item !== value) : [...state, value]);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]); setSelectedLocations([]); setSelectedTargetAudiences([]); setSelectedFields([]);
  };

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Startup Events & Hackathons | India's Got Startup</title>
        <meta name="description" content="Discover upcoming hackathons, tech conferences, and networking events for Indian startups." />
      </Helmet>

      <Navbar />

      {/* Page Header */}
      <header className="pt-12 pb-8 text-center container mx-auto px-4 max-w-[1600px]">
        <Badge variant="secondary" className="mb-4 text-xs uppercase tracking-wider font-semibold">
          Startup Ecosystem
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          Discover, Connect, Innovate
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed mb-6">
          Discover hand-picked startup events, exclusive founder mixers, investor office hours, and deep-tech hackathons. Your ecosystem, curated.
        </p>
        <Link to="/create-event">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> Host an Event
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Filters
                </h2>
                {(selectedTypes.length > 0 || selectedLocations.length > 0 || selectedTargetAudiences.length > 0 || selectedFields.length > 0) && (
                  <button onClick={clearAllFilters} className="text-xs text-primary hover:underline font-medium">Clear All</button>
                )}
              </div>

              {/* Event Type */}
              <div className="mb-6">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Event Type</h3>
                <div className="flex flex-col gap-1.5">
                  {allTypes.map(type => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group text-sm">
                      <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)} className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5" />
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-6">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Target Audience</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allAudiences.map(aud => (
                    <Badge
                      key={aud} variant="outline"
                      className={`cursor-pointer text-xs py-0.5 transition-colors ${selectedTargetAudiences.includes(aud) ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => toggleFilter(selectedTargetAudiences, setSelectedTargetAudiences, aud)}
                    >
                      {aud}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="mb-6">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Industry</h3>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                  {allFields.map(field => (
                    <label key={field} className="flex items-center gap-2.5 cursor-pointer group text-sm">
                      <input type="checkbox" checked={selectedFields.includes(field)} onChange={() => toggleFilter(selectedFields, setSelectedFields, field)} className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5" />
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Format */}
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Format</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allLocations.map(loc => (
                    <Badge
                      key={loc} variant="outline"
                      className={`cursor-pointer text-xs py-0.5 transition-colors ${selectedLocations.includes(loc) ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
              <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-md">{filteredEvents.length} results</span>
            </div>

            <div id="events-list" className="scroll-mt-24" />

            {paginatedEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedEvents.map((event, idx) => (
                  <div key={event.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${idx * 80}ms` }}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card/50">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-4">Try expanding your filters to discover more events.</p>
                <Button onClick={clearAllFilters} variant="outline">Reset Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-border">
                <Pagination>
                  <PaginationContent className="bg-card border border-border p-1 rounded-xl">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => { setCurrentPage(i + 1); document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer rounded-lg font-medium"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default Events;
