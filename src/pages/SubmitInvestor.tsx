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
import { useAuth } from "@/hooks/useAuth";
import { slugify, uploadEcosystemMedia } from "@/hooks/useEcosystem";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSection, TeamMemberInput, ImageUploadPreview, MultiSelectGrid, OpenRolesSection, OpenRoleInput } from "@/components/ecosystem/DynamicFormFields";
import { Briefcase, MapPin, Globe, Users, Target, Building } from "lucide-react";

const STAGES = ["Ideation", "Prototype", "MVP", "Early Traction", "Revenue", "Scaling"];
const INVESTOR_TYPES = ["Angel Investor", "VC Fund", "Micro VC", "Family Office", "Corporate VC", "Accelerator Fund", "Other"];

const SubmitInvestor = () => {
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
    type: "",
    short_description: "",
    
    bio: "",
    fund_size: "",
    ticket_min: "",
    ticket_max: "",
    sectors: "",
    geography: "",
    portfolio_companies: "",
    thesis: "",
    
    website_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    phone: "",
    address: "",
  });

  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [openRoles, setOpenRoles] = useState<OpenRoleInput[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate(`/auth?redirect=${encodeURIComponent("/investors/submit")}`);
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
      
      let typeEnum = 'other';
      if (form.type) {
        if (form.type === "Angel Investor") typeEnum = "angel";
        else if (form.type === "VC Fund") typeEnum = "vc";
        else if (form.type === "Micro VC") typeEnum = "micro_vc";
        else if (form.type === "Corporate VC") typeEnum = "corporate_vc";
        else if (form.type === "Family Office") typeEnum = "family_office";
        else if (form.type === "Accelerator Fund") typeEnum = "accelerator";
      }

      // Process team member images
      const processedTeam = await Promise.all(teamMembers.map(async (m) => {
        let member_image_url = m.image_url;
        if (m.imageFile) {
          member_image_url = await uploadEcosystemMedia(user.id, m.imageFile, `investor_team_${m.id}`);
        }
        return { ...m, image_url: member_image_url, imageFile: undefined };
      }));

      // Pack extra fields into notable_investments as JSON to survive schema limitations
      const notableData = {
        short_description: form.short_description,
        fund_size: form.fund_size,
        geography: form.geography,
        portfolio_companies: form.portfolio_companies,
        thesis: form.thesis,
        address: form.address,
        team_members: processedTeam
      };

      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        slug,
        tagline: form.tagline,
        bio: form.bio,
        type: typeEnum,
        logo_url,
        banner_url,
        website_url: form.website_url,
        email: form.email,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        city: form.city,
        state: form.state,
        ticket_size_min: parseFloat(form.ticket_min) || null,
        ticket_size_max: parseFloat(form.ticket_max) || null,
        preferred_sectors: form.sectors,
        preferred_stages: selectedStages.join(", "),
        notable_investments: JSON.stringify(notableData), // Serializing extended data here
        status: 'approved',
      };

      const { data: invData, error: invError } = await supabase.from('investors').insert(payload).select().single();
      if (invError) throw invError;

      // Insert Job Postings
      if (openRoles.length > 0) {
        const jobsPayload = openRoles.map(r => ({
          owner_id: user.id,
          entity_type: 'investor',
          entity_id: invData.id,
          role_title: r.title,
          department: r.department,
          work_mode: r.work_mode,
          city: r.city,
          experience: r.experience,
          skills: r.skills,
          description: r.description,
          apply_link: r.apply_link,
          contact_email: r.apply_email,
          deadline: r.deadline ? new Date(r.deadline).toISOString() : null
        }));

        const { error: jobsError } = await supabase.from('job_postings').insert(jobsPayload);
        if (jobsError) console.error("Error inserting job postings:", jobsError);
        else toast({ title: "Hiring Notified", description: "Your job postings have been recorded and we will notify the admin." });
      }

      toast({ title: "Investor Profile Submitted!", description: "Your investor profile is now live." });
      navigate(`/investors/${invData.slug}`);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Helmet><title>Create Investor Profile | India's Got Startup</title></Helmet>
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 mt-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-2 font-semibold">
            <Target className="h-3.5 w-3.5" /> Investor Directory
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Create Investor Profile</h1>
          <p className="text-muted-foreground text-lg">List your fund or angel profile to discover the best startups.</p>
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
                <ImageUploadPreview id="logo" label="Investor/Fund Logo" file={logoFile} onFileSelect={setLogoFile} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Investor / Fund Name <span className="text-destructive">*</span></Label>
                  <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sequoia Capital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">One-liner / Tagline</Label>
                  <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Backing the bold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Maharashtra" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Investor Type</Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select investor type" /></SelectTrigger>
                    <SelectContent>
                      {INVESTOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description (Summary)</Label>
                <Textarea id="short_description" rows={3} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} placeholder="A brief 1-2 sentence overview for the directory card..." />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Investment Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">About the Investor / Fund</Label>
                <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Detailed background of your firm..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thesis">Investment Thesis</Label>
                <Textarea id="thesis" rows={3} value={form.thesis} onChange={(e) => set("thesis", e.target.value)} placeholder="What makes a startup a good fit for you?" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fund_size">Fund Size (if available)</Label>
                  <Input id="fund_size" value={form.fund_size} onChange={(e) => set("fund_size", e.target.value)} placeholder="e.g. $50M" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="geography">Geography Focus</Label>
                  <Input id="geography" value={form.geography} onChange={(e) => set("geography", e.target.value)} placeholder="e.g. Pan-India, Southeast Asia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket_min">Min Ticket Size (in ₹ or $)</Label>
                  <Input id="ticket_min" type="number" value={form.ticket_min} onChange={(e) => set("ticket_min", e.target.value)} placeholder="e.g. 5000000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket_max">Max Ticket Size (in ₹ or $)</Label>
                  <Input id="ticket_max" type="number" value={form.ticket_max} onChange={(e) => set("ticket_max", e.target.value)} placeholder="e.g. 50000000" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Stages You Invest In</Label>
                <MultiSelectGrid options={STAGES} selected={selectedStages} onChange={setSelectedStages} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectors">Sectors You Invest In (Comma separated)</Label>
                <Input id="sectors" value={form.sectors} onChange={(e) => set("sectors", e.target.value)} placeholder="e.g. SaaS, FinTech, Consumer" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Companies (Comma separated)</Label>
                <Input id="portfolio" value={form.portfolio_companies} onChange={(e) => set("portfolio_companies", e.target.value)} placeholder="e.g. Swiggy, Cred, Groww" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@fund.com" />
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
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Team Members</h2>
            </div>
            
            <TeamMemberSection members={teamMembers} onChange={setTeamMembers} />
          </Card>

          <Card className="p-6 md:p-8 shadow-sm border-border/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Hiring & Open Roles</h2>
                <p className="text-sm text-muted-foreground">Are you looking to hire talent?</p>
              </div>
            </div>
            
            <OpenRolesSection roles={openRoles} onChange={setOpenRoles} />
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

export default SubmitInvestor;
