import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, BadgeCheck, Mail, Linkedin, Globe, Twitter,
  Phone, MapPin, Map, TrendingUp, IndianRupee, Briefcase, CheckCircle2
} from "lucide-react";
import { dummyInvestors } from "@/data/investors";

const InvestorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const inv = dummyInvestors.find(i => i.slug === slug);

  if (!inv) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8 text-center mt-20">
          <p className="text-muted-foreground mb-4">Investor not found.</p>
          <Button asChild><Link to="/investors"><ArrowLeft className="h-4 w-4 mr-2" />Back to Investors</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{inv.name} | India's Got Startup</title>
        <meta name="description" content={inv.tagline || inv.about?.slice(0, 155) || inv.name} />
      </Helmet>
      <Navbar />

      <main>
        {/* 1. Hero Cover */}
        <div className="relative h-56 sm:h-72 lg:h-80 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden border-b border-border/50">
          {inv.coverImage && (
            <img src={inv.coverImage} alt={`${inv.name} cover`} className="absolute inset-0 w-full h-full object-cover opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="-mt-16 sm:-mt-24 relative z-10 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                {inv.logo ? (
                  <img src={inv.logo} alt={`${inv.name} logo`} className="h-full w-full object-cover" />
                ) : (
                  <TrendingUp className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              {/* Title block */}
              <div className="flex-1 pt-2 sm:pt-28">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{inv.name}</h1>
                  {inv.isVerified && <BadgeCheck className="h-7 w-7 text-primary" />}
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {inv.type}
                  </Badge>
                  {inv.openToDeals && (
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      ✓ Open to Deals
                    </span>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mb-4">{inv.tagline}</p>

                {/* Location */}
                {(inv.city || inv.state) && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{[inv.city, inv.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}

                {/* Social / Website Links */}
                <div className="flex flex-wrap gap-3">
                  {inv.website && (
                    <Button asChild size="sm">
                      <a href={inv.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />Website
                      </a>
                    </Button>
                  )}
                  {inv.socials?.linkedin && (
                    <Button asChild size="sm" variant="outline">
                      <a href={inv.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />LinkedIn
                      </a>
                    </Button>
                  )}
                  {inv.socials?.twitter && (
                    <Button asChild size="sm" variant="outline" size="icon">
                      <a href={inv.socials.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {inv.email && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${inv.email}`}>
                        <Mail className="h-4 w-4 mr-2" />Contact
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Quick Stats Bar */}
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <StatItem label="Investor Type" value={inv.type} />
              <StatItem label="Portfolio Size" value={inv.portfolioCount ? `${inv.portfolioCount}+ companies` : "—"} />
              <StatItem label="AUM / Fund Size" value={inv.aum ?? "—"} />
              <StatItem label="Ticket Size" value={(inv.ticketSizeMin || inv.ticketSizeMax) ? `${inv.ticketSizeMin ?? "?"} – ${inv.ticketSizeMax ?? "?"}` : "—"} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left / Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* 3. About Section */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">About {inv.name}</h2>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line mb-6">{inv.about}</p>
                {inv.investmentThesis && (
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                    <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Investment Thesis</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{inv.investmentThesis}</p>
                  </div>
                )}
              </section>

              {/* 4. Preferred Sectors & Stages */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Investment Focus</h2>
                <div className="space-y-5">
                  {inv.preferredSectors?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferred Sectors</h3>
                      <div className="flex flex-wrap gap-2">
                        {inv.preferredSectors.map(s => (
                          <Badge key={s} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {inv.preferredStages?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferred Stages</h3>
                      <div className="flex flex-wrap gap-2">
                        {inv.preferredStages.map(stage => (
                          <span key={stage} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 5. Notable Investments */}
              {inv.notableInvestments && inv.notableInvestments.length > 0 && (
                <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Notable Investments</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {inv.notableInvestments.map(company => (
                      <div key={company} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                        <Briefcase className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{company}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 6. Badges / Highlights */}
              {inv.badges && inv.badges.length > 0 && (
                <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Highlights</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {inv.badges.map(badge => (
                      <div key={badge} className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/50 rounded-xl text-center gap-2 hover:bg-muted/40 transition-colors">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <span className="text-xs font-medium">{badge}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 7. Team Members */}
              {inv.teamMembers && inv.teamMembers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Team</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {inv.teamMembers.map(member => (
                      <Card key={member.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <CardContent className="p-5 flex items-start gap-4">
                          <img
                            src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                            alt={member.name}
                            className="h-16 w-16 rounded-full object-cover border-2 border-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base truncate">{member.name}</h3>
                            <p className="text-xs text-primary font-medium mb-1 truncate">{member.designation}</p>
                            {member.location && <p className="text-xs text-muted-foreground mb-2 truncate">{member.location}</p>}
                            {member.bio && <p className="text-xs text-foreground/80 mb-3 line-clamp-2">{member.bio}</p>}
                            <div className="flex gap-2">
                              {member.linkedin_url && (
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="h-3.5 w-3.5" />
                                  </a>
                                </Button>
                              )}
                              {member.email && (
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                  <a href={`mailto:${member.email}`}>
                                    <Mail className="h-3.5 w-3.5" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar / Right Column */}
            <div className="space-y-6">
              {/* 8. Investment Terms */}
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="bg-muted p-4 border-b border-border/50 flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Investment Terms</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ticket Size</p>
                    <p className="font-medium text-foreground">
                      {(inv.ticketSizeMin || inv.ticketSizeMax)
                        ? `${inv.ticketSizeMin ?? "?"} – ${inv.ticketSizeMax ?? "?"}`
                        : "Not disclosed"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">AUM / Fund Size</p>
                    <p className="font-medium text-foreground">{inv.aum ?? "Not disclosed"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Portfolio Companies</p>
                    <p className="font-medium text-foreground">{inv.portfolioCount ? `${inv.portfolioCount}+` : "Not disclosed"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Open to Deals</p>
                    <p className={`font-semibold ${inv.openToDeals ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {inv.openToDeals ? "✓ Yes" : "Currently closed"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 9. Contact & Location */}
              <Card className="border-border/50 shadow-sm overflow-hidden sticky top-24">
                <div className="bg-muted p-4 border-b border-border/50 flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Contact & Location</h3>
                </div>
                <CardContent className="p-6 space-y-6">
                  {inv.address && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Office Address</h4>
                      <p className="text-sm text-foreground/90">{inv.address}</p>
                    </div>
                  )}

                  {(inv.phone || inv.email || inv.socials?.email) && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Get in Touch</h4>
                      <ul className="space-y-3">
                        {inv.phone && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`tel:${inv.phone}`} className="hover:text-primary transition-colors">{inv.phone}</a>
                          </li>
                        )}
                        {(inv.email || inv.socials?.email) && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`mailto:${inv.email || inv.socials?.email}`} className="hover:text-primary transition-colors break-all">
                              {inv.email || inv.socials?.email}
                            </a>
                          </li>
                        )}
                        {inv.website && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={inv.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors line-clamp-1">
                              {inv.website.replace(/^https?:\/\//, '')}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Map Placeholder */}
                  <div className="w-full h-48 bg-muted/50 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/20 z-0" />
                    <MapPin className="h-8 w-8 opacity-50 z-10 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium z-10">Map View</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="font-semibold text-foreground capitalize">{value}</p>
  </div>
);

export default InvestorProfile;
