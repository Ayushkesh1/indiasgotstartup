import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNewsletterSubscriptions } from "@/hooks/useNewsletterSubscriptions";
import { useNewsletterCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, useSendCampaign, NewsletterCampaign } from "@/hooks/useNewsletterCampaigns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Search, Download, Trash2, CheckCircle2, XCircle, Mail, Send, Activity, Users, Plus, Pencil, BarChart } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsletterManagement() {
  const { data: subscriptions, isLoading: subsLoading, toggleStatus, deleteSubscription } = useNewsletterSubscriptions();
  const { data: campaigns, isLoading: campaignsLoading } = useNewsletterCampaigns();
  
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const sendCampaign = useSendCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
  const [deleteCampId, setDeleteCampId] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<NewsletterCampaign | null>(null);

  const [campaignData, setCampaignData] = useState({
    subject: "",
    content: "",
    target_segment: "all",
  });

  // Subs Filtering
  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter === "all" ? true :
                           segmentFilter === "active" ? sub.is_active :
                           !sub.is_active;
    return matchesSearch && matchesSegment;
  });

  const activeCount = subscriptions?.filter((s) => s.is_active).length || 0;
  const totalCount = subscriptions?.length || 0;

  const handleExport = () => {
    if (!filteredSubscriptions) return;
    const csv = [
      ["Email", "Status", "Subscribed At"],
      ...filteredSubscriptions.map((sub) => [
        sub.email,
        sub.is_active ? "Active" : "Inactive",
        new Date(sub.subscribed_at).toLocaleString(),
      ]),
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-${segmentFilter}-${Date.now()}.csv`;
    a.click();
  };

  const resetCampaignForm = () => {
    setCampaignData({ subject: "", content: "", target_segment: "all" });
    setEditingCampaign(null);
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      await updateCampaign.mutateAsync({ id: editingCampaign.id, ...campaignData });
    } else {
      await createCampaign.mutateAsync({ ...campaignData, status: "draft" });
    }
    setIsDialogOpen(false);
    resetCampaignForm();
  };

  if (subsLoading || campaignsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          Transmission Matrix
        </h2>
        <p className="text-muted-foreground mt-1">Manage audience segments and deploy newsletter campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground/90">{totalCount}</div>
              <p className="text-sm font-medium tracking-wide uppercase text-primary">Total Subscribers</p>
            </div>
            <Users className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>
        <Card className="glass-card border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-500">{activeCount}</div>
              <p className="text-sm font-medium tracking-wide uppercase text-green-400">Active Audience</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500/40" />
          </CardContent>
        </Card>
        <Card className="glass-card border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-destructive">{totalCount - activeCount}</div>
              <p className="text-sm font-medium tracking-wide uppercase text-destructive/80">Dormant</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive/40" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <TabsList className="bg-background/50 border border-primary/20 p-1">
            <TabsTrigger value="campaigns" className="gap-2 data-[state=active]:bg-primary/20 py-2.5">
              <Send className="h-4 w-4" /> Operations (Campaigns)
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2 data-[state=active]:bg-primary/20 py-2.5">
              <Users className="h-4 w-4" /> Audience Logic
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="mt-0 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Campaign Hub</h3>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetCampaignForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Draft New Sequence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl glass-card border-primary/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Mail className="h-6 w-6" /> {editingCampaign ? "Edit Campaign Sequence" : "Initialize New Sequence"}
                  </DialogTitle>
                  <DialogDescription>Define the broadcast parameters.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCampaignSubmit} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label className="uppercase text-xs tracking-wider text-muted-foreground">Subject Line *</Label>
                    <Input 
                      required 
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                      className="bg-background/50 border-primary/20"
                      placeholder="Transmission core subject..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-xs tracking-wider text-muted-foreground">Target Segment</Label>
                    <Select value={campaignData.target_segment} onValueChange={(v) => setCampaignData({...campaignData, target_segment: v})}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Global (All Subscribers)</SelectItem>
                        <SelectItem value="active">Active Sector Only</SelectItem>
                        <SelectItem value="inactive">Dormant Sector (Re-engagement)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-xs tracking-wider text-muted-foreground">Payload Content * (Markdown supported)</Label>
                    <Textarea 
                      required 
                      rows={8}
                      value={campaignData.content}
                      onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                      className="bg-background/50 border-primary/20 font-mono text-sm resize-none"
                      placeholder="# Heading\n\nEnter transmission data here..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
                    <Button type="button" variant="outline" className="border-primary/30" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Save to Drafts</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {campaigns?.map(campaign => (
              <Card key={campaign.id} className="glass-card border-primary/20 hover:border-primary/50 transition-colors shadow-lg overflow-hidden relative group">
                <div className={`absolute top-0 left-0 w-1 h-full ${campaign.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{campaign.subject}</h3>
                        <Badge variant="outline" className={`uppercase text-[10px] ${campaign.status === 'sent' ? 'text-green-500 border-green-500/30' : 'text-yellow-500 border-yellow-500/30'}`}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="secondary" className="uppercase text-[10px] bg-primary/10 text-primary border-primary/20">
                          Target: {campaign.target_segment}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 pr-8">{campaign.content}</p>
                      <div className="text-xs font-mono text-muted-foreground flex gap-4">
                        <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                        {campaign.sent_at && <span className="text-green-400">Deployed: {new Date(campaign.sent_at).toLocaleString()}</span>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-primary/10 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                      {campaign.status === "sent" ? (
                        <div className="w-full space-y-2">
                          <Label className="text-[10px] uppercase text-primary tracking-wider flex items-center gap-1"><BarChart className="h-3 w-3"/> Telemetry</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center bg-background/50 rounded filter border border-primary/10 p-1">
                              <div className="text-[10px] text-muted-foreground">Open</div>
                              <div className="font-bold text-sm text-green-400">{campaign.open_rate}%</div>
                            </div>
                            <div className="text-center bg-background/50 rounded filter border border-primary/10 p-1">
                              <div className="text-[10px] text-muted-foreground">Click</div>
                              <div className="font-bold text-sm text-blue-400">{campaign.click_rate}%</div>
                            </div>
                            <div className="text-center bg-background/50 rounded filter border border-primary/10 p-1">
                              <div className="text-[10px] text-muted-foreground">Opt-Out</div>
                              <div className="font-bold text-sm text-red-400">{campaign.unsubscribe_rate}%</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 w-full">
                          <Button 
                            className="w-full bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                            onClick={() => sendCampaign.mutate(campaign.id)}
                          >
                            <Send className="h-4 w-4 mr-2" /> Execute Launch
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/10" onClick={() => {
                              setEditingCampaign(campaign);
                              setCampaignData({ subject: campaign.subject, content: campaign.content, target_segment: campaign.target_segment });
                              setIsDialogOpen(true);
                            }}>
                              <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setDeleteCampId(campaign.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <div className="text-center py-16 glass-card rounded-xl border border-primary/20">
                <Mail className="h-12 w-12 text-primary/20 mx-auto mb-3" />
                <p className="text-lg text-muted-foreground">No operations recorded yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* SUBSCRIBERS TAB */}
        <TabsContent value="subscribers" className="mt-0">
          <Card className="glass-card border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" /> Audience Directory
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-background/50 p-1.5 rounded-lg border border-primary/20">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/50" />
                    <Input
                      placeholder="Scan emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 bg-transparent border-none focus-visible:ring-0 shadow-none text-sm"
                    />
                  </div>
                  <div className="h-6 w-px bg-primary/20 hidden sm:block"></div>
                  <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                    <SelectTrigger className="w-full sm:w-[140px] h-9 border-none bg-transparent shadow-none text-sm focus:ring-0">
                      <Activity className="w-3 h-3 mr-2 opacity-50" />
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Global</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Dormant Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExport} variant="outline" size="sm" className="h-9 w-full sm:w-auto bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-background/40">
                  <TableRow className="border-primary/10 hover:bg-transparent">
                    <TableHead className="pl-6">Contact Vector</TableHead>
                    <TableHead>System Status</TableHead>
                    <TableHead>Acquisition Time</TableHead>
                    <TableHead className="text-right pr-6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions?.map((subscription) => (
                    <TableRow key={subscription.id} className="border-primary/10 hover:bg-primary/5 transition-colors group">
                      <TableCell className="pl-6 font-medium font-mono text-sm text-foreground/90">{subscription.email}</TableCell>
                      <TableCell>
                        {subscription.is_active ? (
                          <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/10 gap-1.5 uppercase text-[10px]">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10 gap-1.5 uppercase text-[10px]">
                            <XCircle className="h-3 w-3" /> Dormant
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(subscription.subscribed_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-lg ${subscription.is_active ? 'text-yellow-500 hover:bg-yellow-500/20' : 'text-green-500 hover:bg-green-500/20'}`}
                            onClick={() => toggleStatus.mutate({ id: subscription.id, isActive: !subscription.is_active })}
                            title={subscription.is_active ? "Mark Dormant" : "Re-activate"}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/20" onClick={() => setDeleteSubId(subscription.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!filteredSubscriptions || filteredSubscriptions.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        No contacts found in sector.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Subs Dialog */}
      <AlertDialog open={!!deleteSubId} onOpenChange={() => setDeleteSubId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2"><Trash2 className="h-5 w-5"/> Purge Contact?</AlertDialogTitle>
            <AlertDialogDescription>This removes the entity from the database completely.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteSubId) { deleteSubscription.mutate(deleteSubId); setDeleteSubId(null); } }} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Purge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Campaign Dialog */}
      <AlertDialog open={!!deleteCampId} onOpenChange={() => setDeleteCampId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2"><Trash2 className="h-5 w-5"/> Delete Sequence?</AlertDialogTitle>
            <AlertDialogDescription>Permanently erase this campaign data and telemetry.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteCampId) { deleteCampaign.mutate(deleteCampId); setDeleteCampId(null); } }} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
