import { useState } from "react";
import { useCareerPostings, useCreateCareerPosting, useUpdateCareerPosting, useDeleteCareerPosting, useJobApplications, useUpdateJobApplication } from "@/hooks/useCareerPostings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Briefcase, FileText, Mail, Phone, CheckCircle, XCircle, Clock, Eye, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function CareersManagement() {
  const { data: postings, isLoading: postingsLoading } = useCareerPostings();
  const { data: applications, isLoading: applicationsLoading } = useJobApplications();
  const createPosting = useCreateCareerPosting();
  const updatePosting = useUpdateCareerPosting();
  const deletePosting = useDeleteCareerPosting();
  const updateApplication = useUpdateJobApplication();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosting, setEditingPosting] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Remote",
    employment_type: "Full-time",
    description: "",
    requirements: "",
    salary_range: "",
    status: "Open", // mapping status
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "Remote",
      employment_type: "Full-time",
      description: "",
      requirements: "",
      salary_range: "",
      status: "Open",
    });
    setEditingPosting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPosting) {
      await updatePosting.mutateAsync({ id: editingPosting.id, ...formData, is_active: formData.status === "Open" });
    } else {
      await createPosting.mutateAsync({ ...formData, is_active: formData.status === "Open" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (posting: any) => {
    setEditingPosting(posting);
    setFormData({
      title: posting.title || "",
      department: posting.department || "",
      location: posting.location || "Remote",
      employment_type: posting.employment_type || "Full-time",
      description: posting.description || "",
      requirements: posting.requirements || "",
      salary_range: posting.salary_range || "",
      status: posting.status || (posting.is_active ? "Open" : "Closed"),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePosting.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleApplicationAction = async (id: string, newStatus: string) => {
    await updateApplication.mutateAsync({ id, status: newStatus });
  };

  if (postingsLoading || applicationsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  const pendingApplications = applications?.filter(a => a.status === "pending" || a.status === "reviewing") || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          Careers & Talent
        </h2>
        <p className="text-muted-foreground mt-1">Manage job postings, review applicants, and source the best talent.</p>
      </div>

      <Tabs defaultValue="postings" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <TabsList className="bg-background/50 border border-primary/20 p-1 w-full sm:w-auto h-auto">
            <TabsTrigger value="postings" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5">
              <Briefcase className="h-4 w-4" />
              Job Postings ({postings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5">
              <FileText className="h-4 w-4" />
              Applications Queue
              {pendingApplications.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center animate-pulse">
                  {pendingApplications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Draft New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl glass-card border-primary/20 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">
                  {editingPosting ? "Edit Job Posting" : "Draft New Position"}
                </DialogTitle>
                <DialogDescription>Define the role requirements and visibility status.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Position Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-background/50 border-primary/20"
                      placeholder="e.g., Senior Go Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="bg-background/50 border-primary/20"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-background/50 border-primary/20"
                      placeholder="Remote, Bangalore, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select value={formData.employment_type} onValueChange={(v) => setFormData({ ...formData, employment_type: v })}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Compensation Package (Optional)</Label>
                    <Input
                      value={formData.salary_range}
                      onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                      className="bg-background/50 border-primary/20"
                      placeholder="e.g., ₹25-40 LPA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role Details & Expectations *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    className="bg-background/50 border-primary/20 resize-none"
                    placeholder="Describe the day-to-day responsibilities and impact..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Required Skills & Qualifications</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-primary/20 resize-none"
                    placeholder="List the essential skills and background needed..."
                  />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-background/30 border border-primary/10">
                  <Label className="font-semibold text-primary">Job Publication Status:</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="w-40 bg-background/50 border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">🟢 Open</SelectItem>
                      <SelectItem value="Closed">🔴 Closed</SelectItem>
                      <SelectItem value="Draft">⚪ Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
                  <Button type="button" variant="outline" className="rounded-xl border-primary/30" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                    {editingPosting ? "Save Changes" : "Create Posting"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="postings" className="mt-0">
          <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-background/40">
                  <TableRow className="border-primary/10 hover:bg-transparent">
                    <TableHead className="pl-6">Role</TableHead>
                    <TableHead>Location & Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead className="text-right pr-6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postings?.map((posting) => {
                    const statusVal = posting.status || (posting.is_active ? "Open" : "Closed");
                    const appsCount = applications?.filter(a => a.career_posting_id === posting.id).length || 0;
                    return (
                      <TableRow key={posting.id} className="border-primary/10 hover:bg-primary/5 transition-colors group">
                        <TableCell className="pl-6">
                          <div className="font-semibold text-foreground/90">{posting.title}</div>
                          <div className="text-sm text-muted-foreground">{posting.department || "No Department"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{posting.location}</span>
                            <span className="text-xs text-muted-foreground">{posting.employment_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${statusVal === "Open" ? "border-green-500/30 text-green-500 bg-green-500/10" : ""}
                              ${statusVal === "Closed" ? "border-red-500/30 text-red-500 bg-red-500/10" : ""}
                              ${statusVal === "Draft" ? "border-gray-500/30 text-gray-400 bg-gray-500/10" : ""}
                            `}
                          >
                            {statusVal}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold h-7 px-3 rounded-full border border-primary/20">
                            {appsCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/20 hover:text-primary rounded-lg" onClick={() => handleEdit(posting)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20 hover:text-destructive rounded-lg" onClick={() => setDeleteId(posting.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!postings || postings.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Briefcase className="h-12 w-12 text-primary/30" />
                          <p>No career opportunities posted yet.</p>
                          <Button variant="outline" className="mt-2" onClick={() => setIsDialogOpen(true)}>Draft One Now</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-0">
          <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-xl font-bold">Applicant Tracking Interface</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-background/40">
                  <TableRow className="border-primary/10 hover:bg-transparent">
                    <TableHead className="pl-6 w-[250px]">Candidate Details</TableHead>
                    <TableHead>Target Role</TableHead>
                    <TableHead>Status Segment</TableHead>
                    <TableHead className="text-right pr-6 min-w-[200px]">Decision Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications?.map((app) => (
                    <TableRow key={app.id} className="border-primary/10 hover:bg-primary/5 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="font-semibold text-foreground/90">{app.applicant_name}</div>
                        <div className="flex flex-col gap-1 mt-2">
                          <a href={`mailto:${app.applicant_email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {app.applicant_email}
                          </a>
                          {app.phone && (
                            <a href={`tel:${app.phone}`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {app.phone}
                            </a>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm text-foreground/80">{app.career_posting?.title || "Unknown Position"}</div>
                        {app.resume_url ? (
                          <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300">
                            <Eye className="h-3 w-3" /> View Resume
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground mt-2 block">No Portfolio/Resume Attachments</span>
                        )}
                        <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs" onClick={() => setSelectedApplication(app)}>Read Pitch/Cover Letter...</Button>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            px-3 py-1 text-xs uppercase tracking-wide
                            ${app.status === "pending" ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/10" : ""}
                            ${app.status === "reviewing" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : ""}
                            ${app.status === "interviewed" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" : ""}
                            ${app.status === "accepted" ? "border-green-500/30 text-green-500 bg-green-500/10" : ""}
                            ${app.status === "rejected" ? "border-red-500/30 text-red-500 bg-red-500/10" : ""}
                          `}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs">
                         <div className="flex flex-wrap items-center justify-end gap-2">
                           <Button 
                             size="sm" 
                             variant="outline" 
                             className="h-8 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 rounded-lg"
                             onClick={() => handleApplicationAction(app.id, "accepted")}
                           >
                             <CheckCircle className="h-3 w-3 mr-1" /> Shortlist
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline" 
                             className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                             onClick={() => handleApplicationAction(app.id, "rejected")}
                           >
                             <XCircle className="h-3 w-3 mr-1" /> Reject
                           </Button>
                           <Button asChild size="sm" variant="ghost" className="h-8 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg ml-2">
                             <a href={`mailto:${app.applicant_email}`}>
                               <Send className="h-3 w-3 mr-1" /> Contact
                             </a>
                           </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!applications || applications.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        <FileText className="h-10 w-10 text-primary/30 mx-auto mb-3" />
                        <p>No active applicant submissions at this time.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Retract Job Posting?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will forcefully remove the vacancy and wipe all candidate applications belonging to this role from the system dashboard. Note: Consider changing status to "Closed" instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 border-primary/20 hover:bg-background/80">Keep Active</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Retract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl glass-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" /> Candidate Submission Package
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6 mt-2">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-primary/10">
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Applicant</div>
                  <div className="font-semibold text-lg">{selectedApplication.applicant_name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Applied Force</div>
                  <div className="font-semibold">{selectedApplication.career_posting?.title || "N/A"}</div>
                </div>
              </div>
              
              <div className="bg-background/40 p-4 rounded-xl border border-primary/10 shadow-inner">
                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">Cover Letter / Pitch Text</div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedApplication.cover_letter ? selectedApplication.cover_letter : <span className="text-muted-foreground italic">No context pitch provided.</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
