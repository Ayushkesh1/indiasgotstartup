import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BadgeCheck, Mail, Linkedin, Globe, Building2, Twitter, Instagram, Phone, MapPin, Map, CheckCircle2 } from "lucide-react";
import { dummyIncubators } from "@/data/incubators";

const IncubatorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const i = dummyIncubators.find((inc) => inc.slug === slug);

  if (!i) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="container p-8 text-center mt-20">
          <p className="text-muted-foreground mb-4">Incubator not found.</p>
          <Button asChild><Link to="/incubators"><ArrowLeft className="h-4 w-4 mr-2" />Back to Directory</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{i.name} | India's Got Startup</title>
        <meta name="description" content={i.shortDescription} />
      </Helmet>
      <Navbar />
      
      <main>
        {/* 1. Hero Section */}
        <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-primary/20 via-background to-background overflow-hidden border-b border-border/50">
          {i.coverImage && <img src={i.coverImage} alt={`${i.name} cover`} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="-mt-16 sm:-mt-24 relative z-10 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                {i.logo ? <img src={i.logo} alt={i.name} className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-muted-foreground" />}
              </div>
              <div className="flex-1 pt-2 sm:pt-28">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{i.name}</h1>
                  <BadgeCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{[i.city, i.state].filter(Boolean).join(", ")}</span>
                </div>
                {i.sectors && i.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {i.sectors.map((sector) => (
                      <Badge key={sector} variant="secondary" className="font-medium">{sector}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {i.website && (
                    <Button asChild size="sm">
                      <a href={i.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4 mr-2" />Visit Website</a>
                    </Button>
                  )}
                  {i.socials?.linkedin && (
                    <Button asChild size="sm" variant="outline">
                      <a href={i.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a>
                    </Button>
                  )}
                  {i.socials?.twitter && (
                    <Button asChild size="sm" variant="outline" size="icon">
                      <a href={i.socials.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {i.socials?.email && (
                    <Button asChild size="sm" variant="outline" size="icon">
                      <a href={`mailto:${i.socials.email}`}><Mail className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 2. About Section */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold mb-4">About the Incubator</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line mb-6">
                  {i.about}
                </p>
                {i.programDescription && (
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                    <h3 className="font-semibold mb-2">Program Overview</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{i.programDescription}</p>
                  </div>
                )}
              </section>

              {/* 3. Investment / Funding Stage Section */}
              {i.investmentStages && i.investmentStages.length > 0 && (
                <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4">Supported Stages & Focus</h2>
                  <div className="flex flex-wrap gap-2">
                    {i.investmentStages.map((stage) => (
                      <Badge key={stage} variant="outline" className="px-3 py-1.5 text-sm bg-background border-primary/20 text-foreground">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* 4. Grants / Funding Available Section */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Grants & Funding</h2>
                  <Badge variant={i.applicationStatus === 'Open' ? 'default' : 'secondary'} className={i.applicationStatus === 'Open' ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                    Applications: {i.applicationStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <StatItem label="Grant Available" value={i.grantAvailable ? "Yes" : "No"} />
                  {i.grantAmount && <StatItem label="Funding Amount" value={i.grantAmount} />}
                  {i.equityRequirement && <StatItem label="Equity Requirement" value={i.equityRequirement} />}
                  {i.deadline && <StatItem label="Application Deadline" value={i.deadline} />}
                </div>

                {i.eligibility && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Eligibility Criteria</h3>
                    <p className="text-foreground/90 bg-muted/20 p-4 rounded-xl border border-border/40">{i.eligibility}</p>
                  </div>
                )}

                {i.badges && i.badges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlights</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {i.badges.map((badge) => (
                        <div key={badge} className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/50 rounded-xl text-center gap-2 transition-colors hover:bg-muted/40">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                          <span className="text-xs font-medium">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 5. Team Members Section */}
              {i.teamMembers && i.teamMembers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {i.teamMembers.map((member) => (
                      <Card key={member.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-5 flex items-start gap-4">
                          <img src={member.image_url} alt={member.name} className="h-16 w-16 rounded-full object-cover border-2 border-muted" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{member.name}</h3>
                            <p className="text-xs text-primary font-medium mb-1 truncate">{member.designation}</p>
                            <p className="text-xs text-muted-foreground mb-3 truncate">{member.location}</p>
                            <div className="flex gap-2">
                              {member.linkedin_url && (
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="h-3.5 w-3.5" /></a>
                                </Button>
                              )}
                              {member.email && (
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                  <a href={`mailto:${member.email}`}><Mail className="h-3.5 w-3.5" /></a>
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
              {/* 6. Contact / Address Section */}
              <Card className="border-border/50 overflow-hidden sticky top-24">
                <div className="bg-muted p-4 border-b border-border/50 flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Location & Contact</h3>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Address</h4>
                    <p className="text-sm text-foreground/90">{i.address}</p>
                  </div>
                  {(i.phone || i.socials?.email) && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contact Details</h4>
                      <ul className="space-y-2">
                        {i.phone && (
                          <li className="flex items-center gap-2 text-sm text-foreground/90">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {i.phone}
                          </li>
                        )}
                        {i.socials?.email && (
                          <li className="flex items-center gap-2 text-sm text-foreground/90">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${i.socials.email}`} className="hover:text-primary transition-colors">{i.socials.email}</a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Map Placeholder */}
                  <div className="w-full h-40 bg-muted/50 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-8 w-8 opacity-50" />
                    <span className="text-xs font-medium">Map View</span>
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
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export default IncubatorProfile;
