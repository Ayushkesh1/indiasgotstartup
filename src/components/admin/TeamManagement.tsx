import { useState } from "react";
import { useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, useAdminActivityLog, useLogAdminActivity } from "@/hooks/useTeamMembers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users, Linkedin, Twitter, Mail, Activity, ShieldCheck, UserPlus, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AVAILABLE_PERMISSIONS = [
  { id: "content_moderation", label: "Content Moderation", desc: "Manage articles and content" },
  { id: "careers", label: "Careers Management", desc: "Post jobs and view applicants" },
  { id: "revenue", label: "Revenue Dashboard", desc: "View financial statistics" },
  { id: "partners", label: "Partners Management", desc: "Manage platform partnerships" },
  { id: "contact_queries", label: "Contact Queries", desc: "Read and respond to support emails" },
  { id: "team_admin", label: "Team Administration", desc: "Manage other team members" },
];

export function TeamManagement() {
  const { data: members, isLoading } = useTeamMembers();
  const { data: activities, isLoading: activitiesLoading } = useAdminActivityLog();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const logActivity = useLogAdminActivity();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    bio: "",
    image_url: "",
    email: "",
    linkedin_url: "",
    twitter_handle: "",
    display_order: 0,
    is_active: true,
    permissions: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      department: "",
      bio: "",
      image_url: "",
      email: "",
      linkedin_url: "",
      twitter_handle: "",
      display_order: 0,
      is_active: true,
      permissions: [],
    });
    setEditingMember(null);
  };

  const handlePermissionChange = (permId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permId] 
        : prev.permissions.filter(p => p !== permId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      await updateMember.mutateAsync({ id: editingMember.id, ...formData });
      
      // Mock log for simulation purposes assuming current user is taking the action
      // In a real app we'd use the logged in admin user's UUID.
      if (members && members.length > 0) {
        logActivity.mutate({
          team_member_id: members[0].id,
          action_description: `Updated profile for "${formData.name}"`,
          affected_module: "Team Administration"
        });
      }
    } else {
      await createMember.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      twitter_handle: member.twitter_handle || "",
      display_order: member.display_order,
      is_active: member.is_active,
      permissions: member.permissions || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMember.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
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
          <Users className="h-8 w-8 text-primary" />
          HQ Team Management
        </h2>
        <p className="text-muted-foreground mt-1">Manage team roster, assign security permissions, and audit administrative actions.</p>
      </div>

      <Tabs defaultValue="roster" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <TabsList className="bg-background/50 border border-primary/20 p-1 w-full sm:w-auto h-auto">
            <TabsTrigger value="roster" className="gap-2 data-[state=active]:bg-primary/20 py-2.5">
              <ShieldCheck className="h-4 w-4" /> Team Roster
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-primary/20 py-2.5">
              <Activity className="h-4 w-4" /> Activity Audit Log
            </TabsTrigger>
          </TabsList>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 rounded-xl">
                <UserPlus className="h-4 w-4 mr-2" /> Assign New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl glass-card border-primary/20 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6" /> {editingMember ? "Modify Clearance Data" : "Onboard New Agent"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Define identity and administrative permissions.</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background/30 p-4 rounded-xl border border-primary/10">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Agent Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/70 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Official Role *</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                      placeholder="e.g., Lead Architect"
                      className="bg-background/70 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Division/Department</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="bg-background/70 border-primary/20"
                      placeholder="e.g., Neural Networks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Contact Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/70 border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2 bg-background/30 p-4 rounded-xl border border-primary/10">
                  <Label className="text-xs text-primary uppercase tracking-wider block mb-3 font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> System Access Clearances
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {AVAILABLE_PERMISSIONS.map(perm => (
                      <div key={perm.id} className="flex items-start space-x-3 p-3 rounded-lg border border-primary/10 hover:bg-primary/5 transition-colors">
                        <Checkbox 
                          id={`perm-${perm.id}`} 
                          checked={formData.permissions.includes(perm.id)}
                          onCheckedChange={(checked) => handlePermissionChange(perm.id, checked === true)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor={`perm-${perm.id}`} className="text-sm font-medium leading-none cursor-pointer">
                            {perm.label}
                          </label>
                          <p className="text-xs text-muted-foreground">{perm.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 bg-background/30 p-4 rounded-xl border border-primary/10">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Avatar/Image URL</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="bg-background/70 border-primary/20"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Bio Summary</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={2}
                      className="bg-background/70 border-primary/20 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="is-active-switch"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is-active-switch" className="font-semibold cursor-pointer">Agent Status: Active</Label>
                  </div>
                  <div className="h-6 w-px bg-primary/20"></div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium">Render Priority Order</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-24 bg-background/70 border-primary/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
                  <Button type="button" variant="outline" className="rounded-xl border-primary/30" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Abort
                  </Button>
                  <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                    {editingMember ? "Save Clearances" : "Authorize Agent"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="roster" className="mt-0">
          <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-background/40">
                  <TableRow className="border-primary/10 hover:bg-transparent">
                    <TableHead className="pl-6 w-20">Identity</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Directive Role</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member) => (
                    <TableRow key={member.id} className="border-primary/10 hover:bg-primary/5 transition-all group">
                      <TableCell className="pl-6 py-4">
                        <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-lg">
                          <AvatarImage src={member.image_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground/90">{member.name}</div>
                        {member.email && (
                          <div className="text-xs text-primary flex items-center gap-1 mt-1 font-mono">
                            <Mail className="h-3 w-3" /> {member.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 border-primary/30 font-medium text-xs mb-1">
                          {member.role}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{member.department || "No Department"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {member.permissions && member.permissions.length > 0 ? (
                            member.permissions.map(p => (
                              <Badge key={p} variant="secondary" className="text-[9px] uppercase leading-none px-1.5 py-0.5 bg-background shadow-sm border border-border/50">
                                {p.replace("_", " ")}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                              <Info className="h-3 w-3" /> No assigned zones
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${member.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'} animate-pulse`} />
                          <span className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                            {member.is_active ? "Online" : "Offline"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/20 rounded-lg" onClick={() => handleEdit(member)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20 rounded-lg" onClick={() => setDeleteId(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!members || members.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                        <ShieldCheck className="h-12 w-12 text-primary/20 mx-auto mb-3" />
                        <p className="text-lg">No active agents on the roster.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-0">
          <Card className="glass-card border-primary/20 shadow-lg">
            <CardHeader className="bg-background/40 border-b border-primary/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Immutable Operation Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activitiesLoading ? (
                <div className="p-8 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : activities && activities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 w-[200px]">Timestamp</TableHead>
                      <TableHead>Operative</TableHead>
                      <TableHead>Action Vector</TableHead>
                      <TableHead>Target Module</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((log) => (
                      <TableRow key={log.id} className="border-primary/5 hover:bg-primary/5">
                        <TableCell className="pl-6 text-xs text-muted-foreground font-mono">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={log.team_member?.image_url || undefined} />
                              <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                                {log.team_member?.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{log.team_member?.name || "Unknown Agent"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.action_description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase border-primary/30">
                            {log.affected_module}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-8 w-8 text-primary/20 mx-auto mb-2" />
                  <p>System audit logs are currently empty. Awaiting operations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Revoke Agent Access?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action will permanently remove the agent's clearance and erase their profile from the active HQ roster. Log entries may still reference their ID.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Revoke Agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
