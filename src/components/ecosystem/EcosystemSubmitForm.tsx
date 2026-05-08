import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useCreateEntity, slugify, uploadEcosystemMedia, type EcosystemEntity } from "@/hooks/useEcosystem";
import { useToast } from "@/hooks/use-toast";

interface Props {
  entity: EcosystemEntity;
  title: string;
  redirectBase: string;
}

export function EcosystemSubmitForm({ entity, title, redirectBase }: Props) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const create = useCreateEntity(entity);
  const [params] = useSearchParams();
  const [form, setForm] = useState<any>({
    name: "",
    tagline: "",
    description: "",
    website_url: "",
    email: "",
    city: "",
    state: "",
    sector: "",
    stage: "",
    type: "",
    is_hiring: false,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate(`/auth?redirect=${encodeURIComponent(`/${redirectBase}/submit`)}`);
  }, [user, loading, navigate, redirectBase]);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    setSubmitting(true);
    try {
      let logo_url: string | undefined;
      if (logoFile) logo_url = await uploadEcosystemMedia(user.id, logoFile, "logo");
      const slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`;
      const payload: any = {
        owner_id: user.id,
        name: form.name.trim(),
        slug,
        tagline: form.tagline || null,
        description: entity === "startups" ? form.description || null : undefined,
        about: entity === "incubators" ? form.description || null : undefined,
        bio: entity === "investors" ? form.description || null : undefined,
        website_url: form.website_url || null,
        email: form.email || null,
        city: form.city || null,
        state: form.state || null,
        logo_url: logo_url || null,
      };
      if (entity === "startups") {
        if (form.sector) payload.sector = form.sector;
        if (form.stage) payload.stage = form.stage;
        payload.is_hiring = !!form.is_hiring;
      }
      if (entity === "incubators") {
        if (form.sector) payload.sector_focus = form.sector;
        if (form.type) payload.type = form.type;
      }
      if (entity === "investors") {
        if (form.type) payload.type = form.type;
      }
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      const created = await create.mutateAsync(payload);
      toast({ title: "Submitted for review", description: "An admin will verify your listing shortly." });
      navigate(`/${redirectBase}/${created.slug}`);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>{title}</title></Helmet>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">Listings go live after admin approval.</p>
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="One-line description" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website_url">Website</Label>
                <Input id="website_url" type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
              </div>
              <div>
                <Label htmlFor="email">Contact email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              {entity !== "investors" && (
                <div>
                  <Label htmlFor="sector">{entity === "startups" ? "Sector" : "Sector focus"}</Label>
                  <Input id="sector" value={form.sector} onChange={(e) => set("sector", e.target.value)} />
                </div>
              )}
              {entity === "startups" && (
                <div>
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {["idea","pre_seed","seed","series_a","series_b","series_c","growth"].map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {entity === "incubators" && (
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["university","government","private","corporate","accelerator","csr"].map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {entity === "investors" && (
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["angel","vc","micro_vc","corporate_vc","family_office","accelerator"].map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="logo">Logo (optional)</Label>
              <Input id="logo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            {entity === "startups" && (
              <div className="flex items-center gap-3">
                <Switch id="hiring" checked={form.is_hiring} onCheckedChange={(v) => set("is_hiring", v)} />
                <Label htmlFor="hiring">Currently hiring</Label>
              </div>
            )}
            <Button type="submit" disabled={submitting || !form.name.trim()} className="w-full">
              {submitting ? "Submitting..." : "Submit for review"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default EcosystemSubmitForm;
