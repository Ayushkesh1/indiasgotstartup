import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EVENTS_DATA, AppEvent } from "@/data/events";
import { Person } from "@/data/mockPeople";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowLeft, Share2, Bookmark, CheckCircle2, Clock, Globe, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);

  const [event, setEvent] = useState<AppEvent | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participants, setParticipants] = useState<Person[]>([]);

  useEffect(() => {
    const found = EVENTS_DATA.find(e => e.id === id);
    if (found) {
      setEvent(found);
      setParticipants(found.participants || []);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  const handleRSVP = () => {
    if (!user) {
      toast.error("Please login to RSVP");
      navigate('/auth');
      return;
    }

    if (isRegistered) {
      setIsRegistered(false);
      setParticipants(prev => prev.filter(p => p.id !== user.id)); // Mock removal
      toast("RSVP Cancelled", { description: "You are no longer registered for this event." });
    } else {
      setIsRegistered(true);
      // Mock adding current user to participants
      const me: Person = {
        id: user.id,
        name: profile?.full_name || "You",
        role: "Startup",
        title: "Member",
        avatar_url: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}`,
        bio: "", location: "", followersCount: 0, followingCount: 0, connectionsCount: 0, isVerified: false, tags: []
      };
      setParticipants(prev => [me, ...prev]);
      toast.success("You're registered for this event!");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link Copied", { description: "Event link copied to clipboard." });
  };

  const isFree = event.price === "Free";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Helmet>
        <title>{event.title} | India's Got Startup</title>
      </Helmet>
      <Navbar />

      <div className="container mx-auto px-4 max-w-6xl mt-20">
        <Link to="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        {/* Hero Cover */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden mb-10 shadow-lg">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 z-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-4 py-1.5 text-sm">{event.type}</Badge>
              {isFree && <Badge variant="secondary" className="bg-white/90 hover:bg-white text-black border-none px-4 py-1.5 text-sm">Free</Badge>}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 relative">
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-12">
            
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About Event</h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>

            {/* Target Audience */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Who Should Attend</h2>
              <div className="flex flex-wrap gap-2">
                {event.targetAudience.map(aud => (
                  <Badge key={aud} variant="outline" className="text-sm py-1.5 px-4 bg-muted/50">{aud}</Badge>
                ))}
                {event.fieldOfStartup.map(field => (
                  <Badge key={field} variant="outline" className="text-sm py-1.5 px-4 border-primary/30 text-primary bg-primary/5">{field}</Badge>
                ))}
              </div>
            </section>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Agenda</h2>
                <div className="space-y-6">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-24 shrink-0 text-right">
                        <span className="text-sm font-bold text-primary">{item.time}</span>
                      </div>
                      <div className="relative pb-6 border-l-2 border-border pl-6 -mt-1.5 last:border-0 last:pb-0">
                        <div className="absolute w-3 h-3 bg-background border-2 border-primary rounded-full -left-[7px] top-1.5"></div>
                        <h4 className="text-lg font-bold">{item.title}</h4>
                        {item.description && <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map(speaker => (
                    <div key={speaker.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                      <img src={speaker.avatar_url} alt={speaker.name} className="w-16 h-16 rounded-full object-cover border border-border" />
                      <div>
                        <h4 className="font-bold">{speaker.name}</h4>
                        <p className="text-sm text-muted-foreground">{speaker.title} {speaker.company ? `at ${speaker.company}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Participant List */}
            {participants.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">People Attending</h2>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">{participants.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar_url} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-sm">{p.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{p.title} {p.company ? `@ ${p.company}` : ''}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sticky RSVP Card (Right) */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24">
              <Card className="border-border rounded-3xl overflow-hidden shadow-xl bg-card">
                <CardContent className="p-8">
                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{event.date.split("•")[0]}</p>
                        <p className="text-muted-foreground text-sm">{event.date.split("•")[1]}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                        {event.locationType === 'Online' ? <Globe className="w-6 h-6 text-cyan-500" /> : <MapPin className="w-6 h-6 text-cyan-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{event.location}</p>
                        <p className="text-muted-foreground text-sm">{event.locationType}</p>
                      </div>
                    </div>

                    {event.organizerProfile && (
                      <div className="flex gap-4 items-center pt-4 border-t border-border">
                        <img src={event.organizerProfile.avatar_url} className="w-12 h-12 rounded-full object-cover border border-border" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Hosted By</p>
                          <p className="font-bold">{event.organizerProfile.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleRSVP}
                      className={`w-full h-14 rounded-2xl text-lg font-bold transition-all ${
                        isRegistered 
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30' 
                          : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground'
                      }`}
                    >
                      {isRegistered ? (
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Going (Cancel)</span>
                      ) : (
                        `Register / RSVP ${event.price ? `(${event.price})` : ''}`
                      )}
                    </Button>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2" onClick={handleShare}>
                        <Share2 className="w-4 h-4" /> Share
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2">
                        <Bookmark className="w-4 h-4" /> Save
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
