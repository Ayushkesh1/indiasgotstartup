import { useState } from "react";
import { usePartners, useCreatePartner, useUpdatePartner, useDeletePartner } from "@/hooks/usePartners";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ExternalLink, Handshake, Target, MousePointerClick, HeartHandshake, IndianRupee } from "lucide-react";

export function PartnersManagement() {
  const { data: partners, isLoading } = usePartners();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    description: "",
    website_url: "",
    partnership_type: "Sponsor",
    is_active: true,
    display_order: 0,
    revenue_generated: 0,
    active_campaigns: 0,
    clicks: 0,
    conversions: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      logo_url: "",
      description: "",
      website_url: "",
      partnership_type: "Sponsor",
      is_active: true,
      display_order: 0,
      revenue_generated: 0,
      active_campaigns: 0,
      clicks: 0,
      conversions: 0,
    });
    setEditingPartner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) {
      await updatePartner.mutateAsync({ id: editingPartner.id, ...formData });
    } else {
      await createPartner.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (partner: any) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || "",
      logo_url: partner.logo_url || "",
      description: partner.description || "",
      website_url: partner.website_url || "",
      partnership_type: partner.partnership_type || "Sponsor",
      is_active: partner.is_active ?? true,
      display_order: partner.display_order || 0,
      revenue_generated: partner.revenue_generated || 0,
      active_campaigns: partner.active_campaigns || 0,
      clicks: partner.clicks || 0,
      conversions: partner.conversions || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePartner.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
            <Handshake className="h-8 w-8 text-primary" />
            Partners Management
          </h2>
          <p className="text-muted-foreground mt-1">Manage sponsors, hiring loops, and campaign ROI.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 rounded-xl px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl glass-card border-primary/20 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {editingPartner ? "Edit Partner Data" : "Onboard New Partner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-primary/20 pb-2 flex items-center gap-2">
                    <HeartHandshake className="h-5 w-5 text-primary" /> Core Details
                  </h3>
                  <div className="space-y-2">
                    <Label>Partner Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Partnership Type</Label>
                    <Select value={formData.partnership_type} onValueChange={(v) => setFormData({ ...formData, partnership_type: v })}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sponsor">Sponsor</SelectItem>
                        <SelectItem value="Hiring Partner">Hiring Partner</SelectItem>
                        <SelectItem value="Media Partner">Media Partner</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-primary/20 pb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> Campaign & ROI
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Revenue Generated (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={formData.revenue_generated}
                          onChange={(e) => setFormData({ ...formData, revenue_generated: parseFloat(e.target.value) || 0 })}
                          className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Active Campaigns</Label>
                      <Input
                        type="number"
                        value={formData.active_campaigns}
                        onChange={(e) => setFormData({ ...formData, active_campaigns: parseInt(e.target.value) || 0 })}
                        className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Clicks</Label>
                      <Input
                        type="number"
                        value={formData.clicks}
                        onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
                        className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conversions</Label>
                      <Input
                        type="number"
                        value={formData.conversions}
                        onChange={(e) => setFormData({ ...formData, conversions: parseInt(e.target.value) || 0 })}
                        className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Description / Notes</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-xl bg-background/30 border border-primary/10">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label className="font-semibold text-primary">Active Partner</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Display Order (Priority)</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-background/50 border-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
                <Button type="button" variant="outline" className="rounded-xl border-primary/30 hover:bg-primary/10" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                  {editingPartner ? "Update Partner" : "Commit Partner Profile"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span>Partner Directory & Performance ({partners?.length || 0})</span>
            <div className="flex gap-4 mt-2 sm:mt-0 text-sm font-normal text-muted-foreground">
              <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4 text-green-500" /> Total Rev: ₹{partners?.reduce((acc, p) => acc + (p.revenue_generated || 0), 0).toLocaleString()}</span>
              <span className="flex items-center gap-1"><Target className="h-4 w-4 text-blue-500" /> Campaigns: {partners?.reduce((acc, p) => acc + (p.active_campaigns || 0), 0)}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-background/40">
              <TableRow className="border-primary/10 hover:bg-transparent">
                <TableHead className="pl-6">Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners?.map((partner) => (
                <TableRow key={partner.id} className="border-primary/10 hover:bg-primary/5 transition-colors group">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-background/50 rounded-lg flex items-center justify-center border border-primary/20 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.1)] group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-shadow">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="h-full w-full object-cover" />
                        ) : (
                          <Handshake className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground/90">{partner.name}</div>
                        {partner.website_url && (
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 mt-0.5">
                            Visit Site <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                      {partner.partnership_type || "Partner"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{partner.active_campaigns || 0}</span>
                      <span className="text-xs text-muted-foreground">active</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-green-500">
                        <IndianRupee className="h-3 w-3" /> {(partner.revenue_generated || 0).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <MousePointerClick className="h-3 w-3" /> {partner.clicks || 0} Clicks | {partner.conversions || 0} Conv.
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${partner.is_active ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-muted/50 text-muted-foreground border border-muted"}`}>
                      {partner.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/20 hover:text-primary rounded-lg transition-colors" onClick={() => handleEdit(partner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors" onClick={() => setDeleteId(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!partners || partners.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Handshake className="h-12 w-12 text-primary/30" />
                      <p>No partners onboarded yet.</p>
                      <Button variant="outline" className="mt-2 border-primary/30" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Partner
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Sever Partnership?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently remove the partner profile and all associated ROI tracking data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20 hover:bg-background/80">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
