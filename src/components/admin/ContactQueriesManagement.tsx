import { useState } from "react";
import { useContactQueries, useUpdateContactQuery, useDeleteContactQuery } from "@/hooks/useContactQueries";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Trash2, Eye, Reply, Star, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ContactQueriesManagement() {
  const { data: queries, isLoading } = useContactQueries();
  const { data: teamMembers } = useTeamMembers();
  const updateQuery = useUpdateContactQuery();
  const deleteQuery = useDeleteContactQuery();

  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleStatusChange = async (id: string, status: string) => {
    await updateQuery.mutateAsync({ 
      id, 
      status,
      responded_at: status === "resolved" ? new Date().toISOString() : null 
    });
  };

  const handlePriorityChange = async (id: string, priority: string) => {
    await updateQuery.mutateAsync({ id, priority });
  };

  const handleAssigneeChange = async (id: string, assigned_to: string) => {
    await updateQuery.mutateAsync({ id, assigned_to: assigned_to === "unassigned" ? null : assigned_to });
  };

  const handleSaveNotes = async () => {
    if (selectedQuery) {
      await updateQuery.mutateAsync({ 
        id: selectedQuery.id, 
        response_notes: responseNotes,
        status: "resolved",
        responded_at: new Date().toISOString()
      });
      setSelectedQuery(null);
      setResponseNotes("");
      setIsReplying(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteQuery.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleViewQuery = (query: any) => {
    setSelectedQuery(query);
    setResponseNotes(query.response_notes || "");
    if (query.status === "unread") {
      updateQuery.mutate({ id: query.id, status: "in_progress" });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  const unreadCount = queries?.filter(q => q.status === "unread").length || 0;
  const urgentCount = queries?.filter(q => q.priority === "urgent" && q.status !== "resolved").length || 0;
  const resolvedCount = queries?.filter(q => q.status === "resolved").length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/10"><AlertCircle className="w-3 h-3 mr-1"/> Unread</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10"><Clock className="w-3 h-3 mr-1"/> In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/10"><CheckCircle2 className="w-3 h-3 mr-1"/> Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="outline" className="border-red-500/50 text-red-500 bg-red-500/20 font-bold uppercase text-[10px]">Urgent</Badge>;
      case "normal":
        return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 uppercase text-[10px]">Normal</Badge>;
      case "low":
        return <Badge variant="outline" className="border-gray-500/30 text-gray-400 bg-gray-500/10 uppercase text-[10px]">Low</Badge>;
      default:
        return <Badge variant="outline" className="uppercase text-[10px]">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            Query Command Center
          </h2>
          <p className="text-muted-foreground mt-1">Manage incoming requests, assign team members, and track resolutions.</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)] px-4 py-1.5 text-sm">
            {unreadCount} Unread Message{unreadCount !== 1 && 's'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground/90">{queries?.length || 0}</div>
              <p className="text-sm text-primary font-medium tracking-wide uppercase">Total Queries</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>
        <Card className="glass-card border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-500">{unreadCount}</div>
              <p className="text-sm text-red-400 font-medium tracking-wide uppercase">Unread</p>
            </div>
            <Mail className="h-8 w-8 text-red-500/40" />
          </CardContent>
        </Card>
        <Card className="glass-card border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-500">{urgentCount}</div>
              <p className="text-sm text-orange-400 font-medium tracking-wide uppercase">Needs Action</p>
            </div>
            <Star className="h-8 w-8 text-orange-500/40" />
          </CardContent>
        </Card>
        <Card className="glass-card border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-500">{resolvedCount}</div>
              <p className="text-sm text-green-400 font-medium tracking-wide uppercase">Resolved</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500/40" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl font-bold">Incoming Transmissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-background/40">
              <TableRow className="border-primary/10 hover:bg-transparent">
                <TableHead className="pl-6 w-[250px]">Sender Details</TableHead>
                <TableHead>Priority & Status</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right pr-6">Commands</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries?.map((query) => (
                <TableRow key={query.id} className={`border-primary/10 hover:bg-primary/5 transition-colors group ${query.status === "unread" ? "bg-primary/5" : ""}`}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-foreground/90">{query.name}</div>
                    <a href={`mailto:${query.email}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {query.email}
                    </a>
                    {query.subject && (
                      <div className="text-xs text-muted-foreground mt-2 font-medium truncate max-w-[200px]" title={query.subject}>
                        Sub: {query.subject}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2 items-start">
                      <Select value={query.priority || 'normal'} onValueChange={(v) => handlePriorityChange(query.id, v)}>
                        <SelectTrigger className="h-7 w-[110px] text-xs bg-background/50 border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent"><span className="text-red-500 font-bold">Urgent</span></SelectItem>
                          <SelectItem value="normal"><span className="text-blue-400">Normal</span></SelectItem>
                          <SelectItem value="low"><span className="text-gray-400">Low</span></SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={query.status} onValueChange={(v) => handleStatusChange(query.id, v)}>
                        <SelectTrigger className="h-7 w-[130px] text-xs bg-background/50 border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={query.assigned_to || "unassigned"} onValueChange={(v) => handleAssigneeChange(query.id, v)}>
                      <SelectTrigger className="h-9 w-[160px] text-xs bg-background/50 border-primary/20">
                        <SelectValue placeholder="Assign To..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned" className="italic text-muted-foreground">Unassigned</SelectItem>
                        {teamMembers?.filter(tm => tm.is_active).map(tm => (
                          <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/20 hover:text-primary rounded-lg" onClick={() => handleViewQuery(query)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/20 hover:text-green-500 rounded-lg" asChild>
                        <a href={`mailto:${query.email}`} title="Reply via Email">
                          <Reply className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20 hover:text-destructive rounded-lg" onClick={() => setDeleteId(query.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!queries || queries.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                    <MessageSquare className="h-12 w-12 text-primary/20 mx-auto mb-3" />
                    <p className="text-lg">No incoming transmissions</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuery} onOpenChange={(open) => {
        if (!open) {
          setSelectedQuery(null);
          setIsReplying(false);
        }
      }}>
        <DialogContent className="max-w-2xl glass-card border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.1)]">
          <DialogHeader className="border-b border-primary/10 pb-4">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> Query Dossier
              </DialogTitle>
              {selectedQuery && (
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedQuery.priority || 'normal')}
                  {getStatusBadge(selectedQuery.status)}
                </div>
              )}
            </div>
          </DialogHeader>
          
          {selectedQuery && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6 bg-background/30 p-4 rounded-xl border border-primary/10">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Sender Identity</Label>
                  <p className="font-semibold text-lg text-foreground/90">{selectedQuery.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Return Channel (Email)</Label>
                  <a href={`mailto:${selectedQuery.email}`} className="text-primary hover:underline font-medium">
                    {selectedQuery.email}
                  </a>
                </div>
              </div>

              {selectedQuery.subject && (
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Transmission Subject</Label>
                  <p className="font-medium text-lg border-l-2 border-primary/50 pl-3">{selectedQuery.subject}</p>
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Message Payload</Label>
                <div className="bg-background/50 border border-primary/20 p-5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-inner font-mono text-foreground/90">
                  {selectedQuery.message}
                </div>
              </div>

              <div className="pt-4 border-t border-primary/10">
                {!isReplying ? (
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start bg-primary/5 p-4 rounded-xl border border-primary/20 gap-4">
                    <div className="text-sm">
                      <span className="font-semibold text-primary">Resolution Notes: </span>
                      <span className="text-muted-foreground">
                        {responseNotes ? "Notes attached." : "No explicit notes added."}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-primary/30" onClick={() => setIsReplying(true)}>
                        Resolve & Add Notes
                      </Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.4)]" asChild>
                        <a href={`mailto:${selectedQuery.email}`}>
                          <Reply className="h-4 w-4 mr-2" /> Direct Reply
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5 animate-in slide-in-from-bottom-2">
                    <Label className="text-green-500 font-semibold text-sm">Resolution Log / Internal Notes</Label>
                    <p className="text-xs text-muted-foreground mb-2">These notes are strictly internal and meant for the team to track query handled status.</p>
                    <Textarea
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      placeholder="Note how you resolved this query..."
                      rows={4}
                      className="bg-background/50 border-green-500/20 focus-visible:ring-green-500"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel Notes</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-foreground dark:text-white" onClick={handleSaveNotes}>
                        Save & Mark as Resolved
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Delete Query?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action encrypts and destroys the transmission permanently from the master database. Cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20 hover:bg-background/80">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
