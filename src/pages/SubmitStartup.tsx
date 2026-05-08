import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { slugify, uploadEcosystemMedia } from "@/hooks/useEcosystem";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSection, TeamMemberInput, OpenRolesSection, OpenRoleInput, ImageUploadPreview } from "@/components/ecosystem/DynamicFormFields";
import { Rocket, Building2, Users, Briefcase, Globe, MapPin } from "lucide-react";

const STAGES = ["Ideation", "Prototype", "MVP", "Early Traction", "Revenue", "Scaling"];

const SubmitStartup = () => {
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
    sector: "",
    stage: "",
    description: "", // short description
    
    about: "", // what they do
    problemSolved: "",
    solution: "", // product details
    
    website_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    email: "",
    phone: "",
    address: "",
    map_link: "",
    
    is_hiring: false,
  });

  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [openRoles, setOpenRoles] = useState<OpenRoleInput[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate(`/auth?redirect=${encodeURIComponent("/startups/submit")}`);
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
      // 1. Upload Images
      let logo_url = null;
      let banner_url = null;
      if (logoFile) logo_url = await uploadEcosystemMedia(user.id, logoFile, "logo");
      if (coverFile) banner_url = await uploadEcosystemMedia(user.id, coverFile, "banner");

      const slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`;
      
      // We will pack open roles and about inside the standard fields as there's no open_roles table.
      // We can serialize open_roles into the 'solution' or a custom text block. We will just use problem_statement / solution.
      
      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        slug,
        tagline: form.tagline,
        description: form.description,
        problem_statement: form.problemSolved,
        solution: form.about + "\n\n### Open Roles:\n" + JSON.stringify(openRoles), // Pack open roles
        logo_url,
        banner_url,
        website_url: form.website_url,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        instagram_url: form.instagram_url,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        sector: form.sector,
        stage: form.stage.toLowerCase().replace(/ /g, '_'),
        is_hiring: form.is_hiring,
        status: 'approved', // Auto approve for demo purposes
      };

      // 2. Insert Startup
      const { data: startupData, error: startupError } = await supabase
        .from('startups')
        .insert(payload)
        .select()
        .single();

      if (startupError) throw startupError;

      // 3. Insert Team Members
      if (teamMembers.length > 0) {
        const teamPayload = teamMembers.map((m, i) => ({
          startup_id: startupData.id,
          name: m.name,
          role: m.role,
          bio: m.bio,
          linkedin_url: m.linkedin_url,
          email: m.email,
          image_url: m.image_url, // For real usage, we should upload their images too
          display_order: i
        }));

        const { error: teamError } = await supabase.from('startup_team').insert(teamPayload);
        if (teamError) console.error("Error inserting team:", teamError);
      }

      toast({ title: "Startup Submitted!", description: "Your startup profile is now live." });
      navigate(`/startups/${startupData.slug}`);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Helmet><title>Create Startup Profile | India's Got Startup</title></Helmet>
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 mt-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
            <Rocket className="h-3.5 w-3.5" /> Startup Directory
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Create Startup Profile</h1>
          <p className="text-muted-foreground text-lg">Showcase your startup to investors, candidates, and the ecosystem.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Basic Info</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploadPreview id="cover" label="Cover Image" file={coverFile} onFileSelect={setCoverFile} />
                <ImageUploadPreview id="logo" label="Startup Logo" file={logoFile} onFileSelect={setLogoFile} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Startup Name <span className="text-destructive">*</span></Label>
                  <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">One-liner / Tagline</Label>
                  <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Revolutionizing AI for everyone" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector / Industry</Label>
                  <Input id="sector" value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="e.g. FinTech, AI, SaaS" />
                </div>
                <div className="space-y-2">
                  <Label>Startup Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Bangalore" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Karnataka" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description (Summary)</Label>
                <Textarea id="description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="A brief 1-2 sentence overview for the directory card..." />
              </div>
            </div>
          </Card>

          {/* Section 2: Detailed Profile */}
          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Detailed Profile</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about">About the Startup (What you do)</Label>
                <Textarea id="about" rows={5} value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="Explain what your startup does in detail..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemSolved">Problem you are solving</Label>
                <Textarea id="problemSolved" rows={4} value={form.problemSolved} onChange={(e) => set("problemSolved", e.target.value)} placeholder="What market gap or problem are you addressing?" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@startup.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" type="url" value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/company/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" type="url" value={form.twitter_url} onChange={(e) => set("twitter_url", e.target.value)} placeholder="https://twitter.com/..." />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="address">Office Address</Label>
                <Textarea id="address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full office address..." />
              </div>
            </div>
          </Card>

          {/* Section 3: Hiring */}
          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Careers & Hiring</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/50">
                <div>
                  <h4 className="font-semibold text-foreground">Are you currently hiring?</h4>
                  <p className="text-sm text-muted-foreground">Turn this on to display open roles on your profile.</p>
                </div>
                <Switch checked={form.is_hiring} onCheckedChange={(v) => set("is_hiring", v)} />
              </div>
              
              {form.is_hiring && (
                <div className="animate-in fade-in slide-in-from-top-4">
                  <OpenRolesSection roles={openRoles} onChange={setOpenRoles} />
                </div>
              )}
            </div>
          </Card>

          {/* Section 4: Team Members */}
          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Team Members</h2>
            </div>
            
            <TeamMemberSection members={teamMembers} onChange={setTeamMembers} />
          </Card>

          {/* Submit Action */}
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

export default SubmitStartup;
