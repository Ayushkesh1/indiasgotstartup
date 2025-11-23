import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useArticleReports, useUpdateReportStatus } from "@/hooks/useArticleReports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Flag, ExternalLink, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ReportsPanel() {
  const { data: reports, isLoading } = useArticleReports();
  const updateStatus = useUpdateReportStatus();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const pendingReports = reports?.filter((r) => r.status === "pending") || [];
  const resolvedReports = reports?.filter((r) => r.status !== "pending") || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Reports</div>
          <div className="text-2xl font-bold">{reports?.length || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingReports.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Resolved</div>
          <div className="text-2xl font-bold text-green-600">{resolvedReports.length}</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Reported Content
        </h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report: any) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {report.articles?.title || "Unknown Article"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.profiles?.full_name || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    {report.status === "pending" ? (
                      <Badge variant="secondary">Pending</Badge>
                    ) : report.status === "resolved" ? (
                      <Badge variant="default">Resolved</Badge>
                    ) : (
                      <Badge variant="destructive">Dismissed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/article/${report.articles?.slug}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateStatus.mutate({
                                reportId: report.id,
                                status: "resolved",
                              })
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateStatus.mutate({
                                reportId: report.id,
                                status: "dismissed",
                              })
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
