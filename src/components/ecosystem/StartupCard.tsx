import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Startup } from "@/data/startups";

interface Props {
  startup: Startup;
}

export function StartupCard({ startup }: Props) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
      <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-border/30">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          {startup.logo ? (
            <img src={startup.logo} alt={`${startup.name} logo`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">{startup.name?.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">{startup.name}</h3>
          {startup.sector && (
            <Badge variant="secondary" className="mt-1 font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              {startup.sector}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-5 sm:p-6 flex flex-col">
        <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed flex-1">
          {startup.shortDescription}
        </p>
        
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-medium">
          {(startup.city || startup.state) && (
            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              <span className="truncate">{[startup.city, startup.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 sm:p-6 pt-0 mt-auto">
        <Button asChild className="w-full group/btn relative overflow-hidden" variant="default">
          <Link to={`/startups/${startup.slug}`}>
            <span className="relative z-10 flex items-center justify-center font-semibold">
              View Profile
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </span>
          </Link>
        </Button>
      </div>
    </Card>
  );
}
