import { useState } from "react";
import { useContactQueries, useUpdateContactQuery, useDeleteContactQuery } from "@/hooks/useContactQueries";
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
import { MessageSquare, Mail, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ContactQueriesManagement() {
  const { data: queries, isLoading } = useContactQueries();
  const updateQuery = useUpdateContactQuery();
  const deleteQuery = useDeleteContactQuery();

  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  const handleStatusChange = async (id: string, status: string) => {
    await updateQuery.mutateAsync({ 
      id, 
      status,
      responded_at: status === "responded" ? new Date().toISOString() : null 
    });
  };

  const handleSaveNotes = async () => {
    if (selectedQuery) {
      await updateQuery.mutateAsync({ 
        id: selectedQuery.id, 
        response_notes: responseNotes,
        status: "responded",
        responded_at: new Date().toISOString()
      });
      setSelectedQuery(null);
      setResponseNotes("");
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
    // Mark as read if unread
    if (query.status === "unread") {
      updateQuery.mutate({ id: query.id, status: "read" });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const unreadCount = queries?.filter(q => q.status === "unread").length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge variant="destructive">Unread</Badge>;
      case "read":
        return <Badge variant="secondary">Read</Badge>;
      case "responded":
        return <Badge variant="default">Responded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Contact Queries</h2>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount} Unread</Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{queries?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total Queries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{unreadCount}</div>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {queries?.filter(q => q.status === "responded").length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Responded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries?.map((query) => (
                <TableRow key={query.id} className={query.status === "unread" ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{query.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${query.email}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Mail className="h-3 w-3" />
                      {query.email}
                    </a>
                  </TableCell>
                  <TableCell>{query.subject || "-"}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}</TableCell>
                  <TableCell>{getStatusBadge(query.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewQuery(query)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select value={query.status} onValueChange={(v) => handleStatusChange(query.id, v)}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="responded">Responded</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(query.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!queries || queries.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No contact queries yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedQuery.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <a href={`mailto:${selectedQuery.email}`} className="text-primary hover:underline">
                    {selectedQuery.email}
                  </a>
                </div>
              </div>
              {selectedQuery.subject && (
                <div>
                  <Label className="text-muted-foreground">Subject</Label>
                  <p>{selectedQuery.subject}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md">{selectedQuery.message}</p>
              </div>
              <div className="space-y-2">
                <Label>Response Notes (internal)</Label>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Add notes about your response..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                  Close
                </Button>
                <Button onClick={handleSaveNotes}>
                  Save & Mark Responded
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
