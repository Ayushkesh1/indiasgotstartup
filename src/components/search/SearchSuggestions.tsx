import React from "react";
import { Link } from "react-router-dom";
import { Search, Users, Rocket, TrendingUp, Building2, Calendar, Coins, FileText, ArrowRight, Loader2 } from "lucide-react";
import { UniversalSearchResult, SearchResultType } from "@/hooks/useUniversalSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SearchSuggestionsProps {
  results: Record<SearchResultType, UniversalSearchResult[]> | undefined;
  isLoading: boolean;
  onSelect: () => void;
  query: string;
}

const TYPE_CONFIG: Record<SearchResultType, { icon: any; color: string; label: string; linkPrefix: string }> = {
  people: { icon: Users, color: "text-blue-500", label: "People", linkPrefix: "/user/" },
  startup: { icon: Rocket, color: "text-orange-500", label: "Startups", linkPrefix: "/startups/" },
  investor: { icon: TrendingUp, color: "text-emerald-500", label: "Investors", linkPrefix: "/investors/" },
  incubator: { icon: Building2, color: "text-purple-500", label: "Incubators", linkPrefix: "/incubators/" },
  event: { icon: Calendar, color: "text-pink-500", label: "Events", linkPrefix: "/events/" },
  grant: { icon: Coins, color: "text-amber-500", label: "Grants", linkPrefix: "/grants/" },
  article: { icon: FileText, color: "text-indigo-500", label: "Stories", linkPrefix: "/article/" },
};

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ results, isLoading, onSelect, query }) => {
  const hasResults = results && Object.values(results).some((arr) => arr.length > 0);

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground font-medium">Searching across the platform...</p>
      </div>
    );
  }

  if (!hasResults && query.length >= 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-8 text-center z-50 animate-in fade-in zoom-in duration-200">
        <p className="text-muted-foreground font-medium mb-1">No matches found for "{query}"</p>
        <p className="text-xs text-muted-foreground/60">Try searching for people, startups, or events.</p>
      </div>
    );
  }

  if (!hasResults) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card/98 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <ScrollArea className="max-h-[min(70vh,500px)]">
        <div className="p-2 space-y-4">
          {(Object.keys(results) as SearchResultType[]).map((type) => {
            const items = results[type];
            if (items.length === 0) return null;

            const config = TYPE_CONFIG[type];
            const Icon = config.icon;

            return (
              <div key={type} className="space-y-1">
                <div className="px-3 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Icon className={`h-3 w-3 ${config.color}`} />
                    {config.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1.5 opacity-50">{items.length}</Badge>
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={`${config.linkPrefix}${item.slug || item.id}`}
                      onClick={onSelect}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted shrink-0 overflow-hidden flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">{item.title.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.title}</h4>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-3 bg-muted/30 border-t border-border mt-2">
          <Link 
            to={`/search?q=${encodeURIComponent(query)}`} 
            onClick={onSelect}
            className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all"
          >
            View all search results <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
};
