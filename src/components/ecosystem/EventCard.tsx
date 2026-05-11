import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { AppEvent } from "@/data/events";
import { Link } from "react-router-dom";

export function EventCard({ event }: { event: AppEvent }) {
  const attendeeCount = event.participants?.length || 0;
  const isFree = event.price === "Free";

  return (
    <Link to={`/events/${event.id}`} className="block h-full">
      <div className="h-full group bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 font-semibold shadow-md">{event.type}</Badge>
            {isFree && <Badge variant="secondary" className="bg-white/90 text-black border-none px-3 py-1 font-semibold shadow-md">Free</Badge>}
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
            <div className="flex -space-x-2">
              {event.participants?.slice(0, 3).map((p, i) => (
                <img key={i} src={p.avatar_url} alt={p.name} className="w-8 h-8 rounded-full border-2 border-black object-cover" />
              ))}
              {attendeeCount > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-black bg-muted flex items-center justify-center text-[10px] font-bold">
                  +{attendeeCount - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-2 text-primary text-sm font-bold tracking-wide">
              <span>{event.date.split("•")[0]}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {event.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">{event.description}</p>

          <div className="space-y-2 mb-6 text-sm mt-auto">
            <div className="flex items-center gap-2 text-foreground/80 font-medium">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{event.location} <span className="text-muted-foreground font-normal">({event.locationType})</span></span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80 font-medium">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">Hosted by {event.organizer}</span>
            </div>
          </div>

          <div className="pt-5 border-t border-border flex items-center justify-between mt-auto">
            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {attendeeCount} attending
            </span>
            <Button
              className="gap-2 font-bold rounded-full px-6 transition-all duration-300"
            >
              RSVP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
