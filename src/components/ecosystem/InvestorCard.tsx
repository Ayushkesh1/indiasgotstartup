import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, BadgeCheck, TrendingUp, IndianRupee } from "lucide-react";
import type { InvestorData } from "@/data/investors";

export function InvestorCard({ investor }: { investor: InvestorData }) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-border/30">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          {investor.logo ? (
            <img src={investor.logo} alt={`${investor.name} logo`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <TrendingUp className="h-7 w-7 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-base font-semibold truncate group-hover:text-primary transition-colors">{investor.name}</h3>
            {investor.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider bg-primary/10 text-primary border-primary/20">
            {investor.type}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed flex-1">
          {investor.tagline}
        </p>

        {/* Sectors */}
        {investor.preferredSectors?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {investor.preferredSectors.slice(0, 3).map(s => (
              <Badge key={s} variant="outline" className="text-[10px] font-medium">
                {s}
              </Badge>
            ))}
            {investor.preferredSectors.length > 3 && (
              <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
                +{investor.preferredSectors.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {(investor.city || investor.state) && (
            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              <span className="truncate">{[investor.city, investor.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {(investor.ticketSizeMin || investor.ticketSizeMax) && (
            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
              <IndianRupee className="h-3.5 w-3.5 text-primary/70" />
              <span>{investor.ticketSizeMin ?? "?"} – {investor.ticketSizeMax ?? "?"}</span>
            </div>
          )}
        </div>

        {/* Stages */}
        {investor.preferredStages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {investor.preferredStages.map(stage => (
              <span key={stage} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {stage}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-5 sm:p-6 pt-0 mt-auto">
        <Button asChild className="w-full group/btn relative overflow-hidden" variant="default">
          <Link to={`/investors/${investor.slug}`}>
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
