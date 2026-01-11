import { useState } from "react";
import { useCareerPostings, useCreateCareerPosting, useUpdateCareerPosting, useDeleteCareerPosting, useJobApplications, useUpdateJobApplication } from "@/hooks/useCareerPostings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Briefcase, FileText, Mail, Phone } from "lucide-react";
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
    is_active: true,
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
      is_active: true,
    });
    setEditingPosting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPosting) {
      await updatePosting.mutateAsync({ id: editingPosting.id, ...formData });
    } else {
      await createPosting.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (posting: any) => {
    setEditingPosting(posting);
    setFormData({
      title: posting.title,
      department: posting.department || "",
      location: posting.location || "Remote",
      employment_type: posting.employment_type || "Full-time",
      description: posting.description,
      requirements: posting.requirements || "",
      salary_range: posting.salary_range || "",
      is_active: posting.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePosting.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleApplicationStatus = async (id: string, status: string) => {
    await updateApplication.mutateAsync({ id, status });
  };

  if (postingsLoading || applicationsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const pendingApplications = applications?.filter(a => a.status === "pending") || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="postings">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="postings" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Job Postings ({postings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              Applications ({applications?.length || 0})
              {pendingApplications.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingApplications.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Job Posting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPosting ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Senior Content Writer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Editorial"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Remote, Gurugram, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select value={formData.employment_type} onValueChange={(v) => setFormData({ ...formData, employment_type: v })}>
                      <SelectTrigger>
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
                    <Label>Salary Range</Label>
                    <Input
                      value={formData.salary_range}
                      onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                      placeholder="e.g., ₹5-8 LPA"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    placeholder="Job description..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                    placeholder="Requirements and qualifications..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active (visible on careers page)</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPosting ? "Update" : "Create"} Posting
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="postings">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postings?.map((posting) => (
                    <TableRow key={posting.id}>
                      <TableCell className="font-medium">{posting.title}</TableCell>
                      <TableCell>{posting.department || "-"}</TableCell>
                      <TableCell>{posting.location}</TableCell>
                      <TableCell>{posting.employment_type}</TableCell>
                      <TableCell>
                        <Badge variant={posting.is_active ? "default" : "secondary"}>
                          {posting.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(posting)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(posting.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!postings || postings.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No job postings yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications?.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.applicant_name}</TableCell>
                      <TableCell>{app.career_posting?.title || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {app.applicant_email}
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {app.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}</TableCell>
                      <TableCell>
                        <Select value={app.status} onValueChange={(v) => handleApplicationStatus(app.id, v)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="interviewed">Interviewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setSelectedApplication(app)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!applications || applications.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No applications received yet
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will also delete all applications for this position.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Applicant</Label>
                <p className="font-medium">{selectedApplication.applicant_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p>{selectedApplication.applicant_email}</p>
              </div>
              {selectedApplication.phone && (
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{selectedApplication.phone}</p>
                </div>
              )}
              {selectedApplication.cover_letter && (
                <div>
                  <Label className="text-muted-foreground">Cover Letter</Label>
                  <p className="whitespace-pre-wrap text-sm">{selectedApplication.cover_letter}</p>
                </div>
              )}
              {selectedApplication.resume_url && (
                <div>
                  <Label className="text-muted-foreground">Resume</Label>
                  <a href={selectedApplication.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View Resume
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
