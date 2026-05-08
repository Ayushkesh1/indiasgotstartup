import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, BadgeCheck, Building2 } from "lucide-react";
import type { IncubatorData } from "@/data/incubators";

export function IncubatorCard({ incubator }: { incubator: IncubatorData }) {
  return (
    <Card className="group flex flex-col overflow-hidden border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] transition-all">
      <div className="flex items-start gap-3 p-4 border-b border-border/50">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {incubator.logo ? (
            <img src={incubator.logo} alt={`${incubator.name} logo`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Building2 className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{incubator.name}</h3>
            {/* Assume all dummy incubators are verified for now */}
            <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {[incubator.city, incubator.state].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {incubator.investmentStages?.[0] && (
            <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider">
              {incubator.investmentStages[0]}
            </Badge>
          )}
          {incubator.grantAvailable && (
            <Badge className="text-[10px] uppercase font-semibold tracking-wider bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20">
              Grant Available
            </Badge>
          )}
        </div>
        
        {incubator.sectors?.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            <span className="font-medium text-foreground/80">Sectors:</span> {incubator.sectors.join(", ")}
          </p>
        )}
        
        <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
          {incubator.shortDescription}
        </p>
      </div>
      
      <div className="flex gap-2 p-3 border-t border-border/50 bg-muted/20">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/incubators/${incubator.slug}`}>View More</Link>
        </Button>
      </div>
    </Card>
  );
}
