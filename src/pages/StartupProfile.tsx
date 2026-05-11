import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Globe, Linkedin, Twitter, Instagram, Youtube, Mail, Phone, Map, Briefcase, Loader2 } from "lucide-react";

import { useEcosystemBySlug, useStartupTeam } from "@/hooks/useEcosystem";
import { GET_STAGE_LABEL } from "@/constants/ecosystem";

const StartupProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: dbStartup, isLoading } = useEcosystemBySlug("startups", slug);
  const { data: dbTeam } = useStartupTeam(dbStartup?.id);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  // Fallback map
  let s: any = null;

  if (dbStartup) {
    let openRoles = [];
    let about = dbStartup.about || dbStartup.description || "";
    // Check if open roles are packed in solution
    const solutionText = dbStartup.solution || "";
    if (solutionText.includes("### Open Roles:")) {
      const parts = solutionText.split("### Open Roles:");
      try {
        openRoles = JSON.parse(parts[1].trim());
      } catch (e) {}
    }

    s = {
      name: dbStartup.name,
      slug: dbStartup.slug,
      shortDescription: dbStartup.tagline || dbStartup.description,
      about: about,
      problemSolved: dbStartup.problem_statement,
      productExplanation: solutionText.split("### Open Roles:")[0].trim(),
      coverImage: dbStartup.banner_url,
      logo: dbStartup.logo_url,
      city: dbStartup.city,
      state: dbStartup.state,
      sector: dbStartup.sector,
      currentStage: dbStartup.stage ? GET_STAGE_LABEL(dbStartup.stage) : "",
      website: dbStartup.website_url,
      email: dbStartup.email,
      phone: dbStartup.phone,
      address: dbStartup.address,
      hiringStatus: dbStartup.is_hiring ? 'Yes' : 'No',
      openRolesList: openRoles,
      socials: {
        linkedin: dbStartup.linkedin_url,
        twitter: dbStartup.twitter_url,
        instagram: dbStartup.instagram_url,
      },
      teamMembers: dbTeam || []
    };
  }

  if (!s) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8 text-center mt-20">
          <p className="text-muted-foreground mb-4">Startup not found.</p>
          <Button asChild><Link to="/startups"><ArrowLeft className="h-4 w-4 mr-2" />Back to startups</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{s.name} | India's Got Startup</title>
        <meta name="description" content={s.shortDescription} />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative h-56 sm:h-72 lg:h-80 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden border-b border-border/50">
          {s.coverImage && <img src={s.coverImage} alt={`${s.name} cover`} className="absolute inset-0 w-full h-full object-cover opacity-70" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="-mt-16 sm:-mt-24 relative z-10 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                {s.logo ? <img src={s.logo} alt={`${s.name} logo`} className="h-full w-full object-cover" /> : <span className="text-4xl font-bold">{s.name.charAt(0)}</span>}
              </div>
              <div className="flex-1 pt-2 sm:pt-28">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{s.name}</h1>
                  {s.currentStage && <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 capitalize">{s.currentStage}</Badge>}
                </div>
                <p className="text-lg text-muted-foreground mb-3">{s.shortDescription}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{[s.city, s.state].filter(Boolean).join(", ")}</span>
                  </div>
                  {s.sector && (
                    <Badge variant="outline" className="font-medium bg-background">{s.sector}</Badge>
                  )}
                </div>
                
                {/* Website & Social Media Links */}
                <div className="flex flex-wrap gap-3">
                  {s.website && (
                    <Button asChild size="sm">
                      <a href={s.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4 mr-2" />Website</a>
                    </Button>
                  )}
                  {s.socials?.linkedin && (
                    <Button asChild size="sm" variant="outline">
                      <a href={s.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a>
                    </Button>
                  )}
                  {s.socials?.twitter && (
                    <Button asChild variant="outline" size="icon">
                      <a href={s.socials.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {s.socials?.instagram && (
                    <Button asChild variant="outline" size="icon">
                      <a href={s.socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {s.socials?.youtube && (
                    <Button asChild variant="outline" size="icon">
                      <a href={s.socials.youtube} target="_blank" rel="noopener noreferrer"><Youtube className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">About {s.name}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">What we do</h3>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{s.about}</p>
                  </div>
                  {s.problemSolved && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">The Problem</h3>
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{s.problemSolved}</p>
                    </div>
                  )}
                  {s.productExplanation && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Our Solution</h3>
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{s.productExplanation}</p>
                    </div>
                  )}
                  {s.targetCustomers && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Target Customers</h3>
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{s.targetCustomers}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Hiring Section */}
              {s.hiringStatus !== 'Not disclosed' && s.hiringStatus !== 'No' && (
                <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Careers & Hiring</h2>
                    <Badge variant={s.hiringStatus === 'Yes' ? 'default' : 'secondary'} className={s.hiringStatus === 'Yes' ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                      Hiring: {s.hiringStatus}
                    </Badge>
                  </div>
                  
                  {s.hiringStatus === 'Yes' && (
                    <div className="mt-6 space-y-4">
                      {s.openRolesList && s.openRolesList.length > 0 ? (
                        <div className="space-y-4">
                          {s.openRolesList.map((role: any, idx: number) => (
                            <div key={idx} className="p-4 bg-background border border-border/50 rounded-lg">
                              <h4 className="font-semibold text-primary">{role.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{role.department} • {role.location}</p>
                              <p className="text-sm">{role.description}</p>
                              {role.apply_link && (
                                <Button asChild size="sm" className="mt-3" variant="outline">
                                  <a href={role.apply_link.includes('@') ? `mailto:${role.apply_link}` : role.apply_link} target="_blank" rel="noopener noreferrer">Apply Now</a>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : s.openRoles && s.openRoles.length > 0 ? (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Open Roles</h3>
                          <div className="flex flex-wrap gap-2">
                            {s.openRoles.map((role: string) => (
                              <Badge key={role} variant="outline" className="px-3 py-1.5 bg-background border-border/50 text-foreground">
                                <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary/70" /> {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="pt-4 flex gap-3">
                        {s.applyLink && (
                          <Button asChild>
                            <a href={s.applyLink} target="_blank" rel="noopener noreferrer">View All Openings</a>
                          </Button>
                        )}
                        {s.email && !s.openRolesList && (
                          <Button asChild variant="outline">
                            <a href={`mailto:${s.email}`}>Email Resume</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Team Members Section */}
              {s.teamMembers && s.teamMembers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Team</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {s.teamMembers.map((member: any) => (
                      <Card key={member.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <CardContent className="p-5 flex items-start gap-4">
                          <img src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} alt={member.name} className="h-16 w-16 rounded-full object-cover border-2 border-muted" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base truncate">{member.name}</h3>
                            <p className="text-xs text-primary font-medium mb-1 truncate">{member.role || member.designation}</p>
                            {member.city && <p className="text-xs text-muted-foreground mb-2 truncate">{member.city}</p>}
                            {member.bio && <p className="text-xs text-foreground/80 mb-3 line-clamp-2">{member.bio}</p>}
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
              {/* Contact Section */}
              <Card className="border-border/50 shadow-sm overflow-hidden sticky top-24">
                <div className="bg-muted p-4 border-b border-border/50 flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Contact & Location</h3>
                </div>
                <CardContent className="p-6 space-y-6">
                  {(s.address || s.city || s.state) && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Office Address</h4>
                      <p className="text-sm text-foreground/90">{s.address || [s.city, s.state].filter(Boolean).join(", ")}</p>
                    </div>
                  )}
                  
                  {(s.phone || s.email || s.socials?.email) && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Get in touch</h4>
                      <ul className="space-y-3">
                        {s.phone && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`tel:${s.phone}`} className="hover:text-primary transition-colors">{s.phone}</a>
                          </li>
                        )}
                        {(s.email || s.socials?.email) && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`mailto:${s.email || s.socials?.email}`} className="hover:text-primary transition-colors break-all">{s.email || s.socials?.email}</a>
                          </li>
                        )}
                        {s.website && (
                          <li className="flex items-center gap-3 text-sm text-foreground/90">
                            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={s.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors line-clamp-1">{s.website.replace(/^https?:\/\//, '')}</a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Map Placeholder */}
                  <div className="w-full h-48 bg-muted/50 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/20 z-0"></div>
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

export default StartupProfile;
