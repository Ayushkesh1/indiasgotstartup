import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { slugify, uploadEcosystemMedia } from "@/hooks/useEcosystem";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSection, TeamMemberInput, ImageUploadPreview, MultiSelectGrid } from "@/components/ecosystem/DynamicFormFields";
import { Building, MapPin, Globe, Award, Users } from "lucide-react";

const STAGES = ["Ideation", "Prototype", "MVP", "Early Traction", "Revenue", "Scaling"];
const SCHEMES = ["Startup India Seed Fund Scheme", "NIDHI PRAYAS", "NIDHI EIR", "TIDE 2.0", "MeitY Startup Hub", "Other"];

const SubmitIncubator = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    city: "",
    state: "",
    sector_focus: "",
    about: "", // short description for basic info
    
    detailedAbout: "", // what type of startups
    programs_offered: "",
    offers_mentorship: false,
    offers_funding: false,
    
    website_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    phone: "",
    address: "",
  });

  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate(`/auth?redirect=${encodeURIComponent("/incubators/submit")}`);
  }, [user, loading, navigate]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) {
      toast({ title: "Error", description: "Name is required.", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      let logo_url = null;
      let banner_url = null;
      if (logoFile) logo_url = await uploadEcosystemMedia(user.id, logoFile, "logo");
      if (coverFile) banner_url = await uploadEcosystemMedia(user.id, coverFile, "banner");

      const slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`;
      
      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        slug,
        tagline: form.tagline,
        about: form.about,
        mission: form.detailedAbout, // Using mission for detailed about
        facilities: JSON.stringify({ schemes: selectedSchemes, programs: form.programs_offered }),
        startup_stages_supported: selectedStages.join(", "),
        sector_focus: form.sector_focus,
        offers_mentorship: form.offers_mentorship,
        offers_funding: form.offers_funding,
        logo_url,
        banner_url,
        website_url: form.website_url,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        address: form.address,
        status: 'approved',
      };

      const { data: incData, error: incError } = await supabase.from('incubators').insert(payload).select().single();
      if (incError) throw incError;

      // Insert Team Members as Incubator Mentors
      if (teamMembers.length > 0) {
        const teamPayload = teamMembers.map((m, i) => ({
          incubator_id: incData.id,
          name: m.name,
          role: m.role,
          bio: m.bio,
          linkedin_url: m.linkedin_url,
          image_url: m.image_url,
          display_order: i
        }));
        await supabase.from('incubator_mentors').insert(teamPayload);
      }

      toast({ title: "Incubator Submitted!", description: "Your incubator profile is now live." });
      navigate(`/incubators/${incData.slug}`);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Helmet><title>Create Incubator Profile | India's Got Startup</title></Helmet>
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 mt-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
            <Building className="h-3.5 w-3.5" /> Incubator Directory
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Create Incubator Profile</h1>
          <p className="text-muted-foreground text-lg">List your incubator, accelerator, or co-working space.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          
          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Building className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Basic Info</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploadPreview id="cover" label="Cover Image" file={coverFile} onFileSelect={setCoverFile} />
                <ImageUploadPreview id="logo" label="Incubator Logo" file={logoFile} onFileSelect={setLogoFile} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Incubator Name <span className="text-destructive">*</span></Label>
                  <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Nexus Incubator" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">One-liner / Tagline</Label>
                  <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Empowering early-stage founders" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Hyderabad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Telangana" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="sector_focus">Sector Focus</Label>
                  <Input id="sector_focus" value={form.sector_focus} onChange={(e) => set("sector_focus", e.target.value)} placeholder="e.g. DeepTech, BioTech, Agnostic" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Short Description (Summary)</Label>
                <Textarea id="about" rows={3} value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="A brief 1-2 sentence overview for the directory card..." />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Incubator Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="detailedAbout">About the Incubator (What type of startups you support)</Label>
                <Textarea id="detailedAbout" rows={4} value={form.detailedAbout} onChange={(e) => set("detailedAbout", e.target.value)} placeholder="Detailed description of your programs, facilities, and the type of founders you look for..." />
              </div>

              <div className="space-y-3">
                <Label>Stages Supported</Label>
                <MultiSelectGrid options={STAGES} selected={selectedStages} onChange={setSelectedStages} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programs_offered">Programs Offered (Comma separated)</Label>
                <Input id="programs_offered" value={form.programs_offered} onChange={(e) => set("programs_offered", e.target.value)} placeholder="e.g. Pre-incubation, Acceleration, Seed funding" />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <Switch id="mentorship" checked={form.offers_mentorship} onCheckedChange={(v) => set("offers_mentorship", v)} />
                  <Label htmlFor="mentorship">Offers Mentorship</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="funding" checked={form.offers_funding} onCheckedChange={(v) => set("offers_funding", v)} />
                  <Label htmlFor="funding">Provides Funding Support</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@incubator.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" type="url" value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/company/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="address">Office Address / Location</Label>
                <Textarea id="address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full office address..." />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Grants & Schemes</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">Select the government grants and schemes available at your incubator.</p>
              <MultiSelectGrid options={SCHEMES} selected={selectedSchemes} onChange={setSelectedSchemes} />
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Mentors & Team Members</h2>
            </div>
            
            <TeamMemberSection members={teamMembers} onChange={setTeamMembers} />
          </Card>

          <div className="sticky bottom-4 z-10 p-4 bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ready to publish?</p>
              <p className="text-xs text-muted-foreground">Your profile will be visible in the directory.</p>
            </div>
            <Button type="submit" disabled={submitting || !form.name.trim()} size="lg" className="min-w-[150px]">
              {submitting ? "Publishing..." : "Publish Profile"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitIncubator;
