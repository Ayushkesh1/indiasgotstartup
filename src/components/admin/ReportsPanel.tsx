import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useArticleReports, useUpdateReportStatus, ArticleReport } from "@/hooks/useArticleReports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { 
  Flag, Search, CheckCircle2, ShieldAlert, AlertTriangle, Eye, 
  ShieldBan, UserX, Trash2, Info, Activity, History, Shield
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function ReportsPanel() {
  const { data: rawReports, isLoading } = useArticleReports();
  const updateStatus = useUpdateReportStatus();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "under_review" | "resolved">("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleSimulatedAction = (actionName: string, successMessage: string, variant: "default" | "destructive" = "default") => {
    toast({ title: successMessage, description: `[Simulated] ${actionName} applied successfully.`, variant });
  };

  const getSeverityInfo = (reason: string) => {
    const r = (reason || "").toLowerCase();
    if (r.includes("abuse") || r.includes("harassment") || r.includes("hate")) {
      return { level: "High", colorClass: "text-red-500 bg-red-500/10 border-red-500/20", icon: <ShieldAlert className="w-3 h-3 mr-1" /> };
    } else if (r.includes("spam") || r.includes("fake") || r.includes("scam")) {
      return { level: "Medium", colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: <AlertTriangle className="w-3 h-3 mr-1" /> };
    } else {
      return { level: "Low", colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: <Info className="w-3 h-3 mr-1" /> };
    }
  };

  // Mocking an "Under Review" state since DB only has pending, resolved, dismissed
  const reports = useMemo(() => {
    return (rawReports || []).map((r: any) => {
       // Let's randomly map some pendings to "under_review" purely for UX demonstration of the pipeline
       const isUnderReviewMock = r.status === 'pending' && r.id.slice(-1) > "a";
       const displayStatus = isUnderReviewMock ? "under_review" : r.status;
       return { ...r, displayStatus, ...getSeverityInfo(r.reason) };
    });
  }, [rawReports]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-zinc-950 border-zinc-800">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-zinc-900 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             {[1,2,3,4].map(i => <div key={i} className="h-24 bg-zinc-900 rounded"></div>)}
          </div>
          <div className="h-64 bg-zinc-900 rounded"></div>
        </div>
      </Card>
    );
  }

  const counts = {
    total: reports.length,
    pending: reports.filter(r => r.displayStatus === "pending").length,
    reviewing: reports.filter(r => r.displayStatus === "under_review").length,
    resolved: reports.filter(r => r.displayStatus === "resolved" || r.displayStatus === "dismissed").length,
  };

  const filteredReports = reports.filter(r => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = r.articles?.title?.toLowerCase().includes(term) || 
                          r.reason.toLowerCase().includes(term) || 
                          r.profiles?.full_name?.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    if (activeTab === "pending") return r.displayStatus === "pending";
    if (activeTab === "under_review") return r.displayStatus === "under_review";
    if (activeTab === "resolved") return r.displayStatus === "resolved" || r.displayStatus === "dismissed";
    return true; // "all"
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-red-500">
            <Flag className="w-5 h-5"/> Incident Reports Control
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Review flagged violations and enforce community standards securely.</p>
        </div>
        <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by Reason, Article or User..." 
              className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:ring-red-900/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Metrics Dash */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground font-medium">Total Cases</div>
              <div className="text-3xl font-bold text-foreground mt-1">{counts.total}</div>
            </div>
            <Flag className="w-5 h-5 text-zinc-700" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-amber-500">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-amber-500/80 font-medium">Pending Processing</div>
              <div className="text-3xl font-bold text-amber-400 mt-1">{counts.pending}</div>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-900" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-blue-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-blue-500/80 font-medium">Under Investigation</div>
              <div className="text-3xl font-bold text-blue-400 mt-1">{counts.reviewing}</div>
            </div>
            <Activity className="w-5 h-5 text-blue-900" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-emerald-500">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-emerald-500/80 font-medium">Resolved / Closed</div>
              <div className="text-3xl font-bold text-emerald-400 mt-1">{counts.resolved}</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-900" />
          </div>
        </Card>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")} className={activeTab === "all" ? "bg-zinc-800 text-foreground dark:text-white" : "bg-transparent border-zinc-800 text-muted-foreground"}>
          All Reports
        </Button>
        <Button variant={activeTab === "pending" ? "default" : "outline"} onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "bg-amber-950/50 text-amber-400 border-amber-900" : "bg-transparent border-zinc-800 text-muted-foreground"}>
          Pending Triage
        </Button>
        <Button variant={activeTab === "under_review" ? "default" : "outline"} onClick={() => setActiveTab("under_review")} className={activeTab === "under_review" ? "bg-blue-950/50 text-blue-400 border-blue-900" : "bg-transparent border-zinc-800 text-muted-foreground"}>
          Under Review
        </Button>
        <Button variant={activeTab === "resolved" ? "default" : "outline"} onClick={() => setActiveTab("resolved")} className={activeTab === "resolved" ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-transparent border-zinc-800 text-muted-foreground"}>
          Resolved / Dismissed
        </Button>
      </div>

      {/* Datatable */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/70 dark:bg-zinc-900/50">
              <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium h-12">Violation Reason</TableHead>
                <TableHead className="text-muted-foreground font-medium">Severity</TableHead>
                <TableHead className="text-muted-foreground font-medium">Reported Content</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status Workflow</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium pr-6">Quick Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? filteredReports.map((report) => (
                <TableRow key={report.id} className="border-b border-zinc-800/50 hover:bg-white/70 dark:bg-zinc-900/80 transition-colors">
                  <TableCell>
                     <div className="flex flex-col">
                        <span className="font-medium text-zinc-200 capitalize">{report.reason}</span>
                        <span className="text-[10px] text-muted-foreground mt-1">Logged by: {report.profiles?.full_name || "Anonymous User"}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><History className="w-3 h-3" /> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className={`capitalize ${report.colorClass}`}>
                        {report.icon} Level: {report.level}
                     </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                     <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <Flag className="w-4 h-4 text-zinc-600" />
                         </div>
                         <div className="truncate text-sm text-foreground/80">
                             {report.articles?.title || "Unknown File"}
                         </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     {report.displayStatus === "pending" && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</Badge>}
                     {report.displayStatus === "under_review" && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"><Activity className="w-3 h-3 mr-1" /> Investigating</Badge>}
                     {(report.displayStatus === "resolved" || report.displayStatus === "dismissed") && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Closed</Badge>}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex gap-2">
                         <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-blue-400 bg-white/70 dark:bg-zinc-900/50" onClick={() => setSelectedReport(report)} title="View Case Details">
                           <Eye className="w-4 h-4" /> Details
                         </Button>
                      </div>
                      
                      <Select onValueChange={(action) => {
                         if (action === "dismiss") updateStatus.mutate({ reportId: report.id, status: "dismissed" });
                         else if (action === "resolve") updateStatus.mutate({ reportId: report.id, status: "resolved" });
                         else handleSimulatedAction(action, "Moderation action recorded");
                      }}>
                        <SelectTrigger className="w-[140px] h-6 text-[10px] bg-black border-zinc-800 text-muted-foreground focus:ring-0 mt-1">
                          <SelectValue placeholder="Take Action..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800 z-50">
                          <SelectItem value="resolve" className="text-xs text-emerald-400">Mark as Resolved</SelectItem>
                          <SelectItem value="dismiss" className="text-xs text-muted-foreground">Ignore / Dismiss</SelectItem>
                          <SelectItem value="Remove Content" className="text-xs text-orange-400 mt-2 border-t border-zinc-800/50 pt-2"><Trash2 className="w-3 h-3 mr-1 inline" /> Take Down Post</SelectItem>
                          <SelectItem value="Warn Creator" className="text-xs text-amber-500"><UserX className="w-3 h-3 mr-1 inline" /> Issue Final Warning</SelectItem>
                          <SelectItem value="Ban Creator" className="text-xs text-red-500"><ShieldBan className="w-3 h-3 mr-1 inline" /> Ban / Suspend Creator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No incident reports logged under this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Case Details Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-2xl">
           {selectedReport && (
              <>
                <DialogHeader className="border-b border-zinc-800 pb-4">
                  <DialogTitle className="text-foreground flex items-center gap-2 text-xl">
                    <Shield className="w-6 h-6 text-red-500" /> Moderation Case File
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground flex justify-between items-center mt-2">
                     <span className="font-mono text-[10px]">CASE UUID: {selectedReport.id.split('-')[0]}...</span>
                     <Badge variant="outline" className={selectedReport.colorClass}>S-LEVEL: {selectedReport.level}</Badge>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                   {/* Incident Details */}
                   <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-3">
                     <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notice of Violation</h4>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-mono">Infraction Category</p>
                          <p className="text-sm font-medium text-red-400 capitalize">{selectedReport.reason}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-mono">Reported By</p>
                          <p className="text-sm font-medium text-foreground/80">{selectedReport.profiles?.full_name || "Anonymous ID"}</p>
                        </div>
                     </div>
                     <div className="pt-2 border-t border-zinc-800/50">
                        <p className="text-[10px] text-muted-foreground font-mono">Complainant Evidence / Note</p>
                        <p className="text-sm text-foreground/80 mt-1 italic leading-relaxed">
                           "{selectedReport.description || "No supplemental text evidence was provided. Relies on platform heuristics."}"
                        </p>
                     </div>
                   </div>

                   {/* Content Context */}
                   <div className="relative p-4 rounded-lg bg-white/70 dark:bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                     <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subject Content Trace</h4>
                     <h3 className="font-semibold text-lg text-foreground">{selectedReport.articles?.title || "Undefined Title"}</h3>
                     <p className="text-sm text-muted-foreground mt-1">This context block shows a localized snapshot of the flagged element.</p>
                     <Button variant="outline" size="sm" className="mt-3 text-xs border-zinc-700 bg-transparent text-blue-400 hover:text-blue-300 hover:bg-zinc-800 w-full" onClick={() => window.open(`/article/${selectedReport.articles?.slug}`, '_blank')}>
                        Open Live Content in New Sandbox <Eye className="w-3 h-3 ml-2"/>
                     </Button>
                   </div>
                </div>

                <DialogFooter className="border-t border-zinc-800 pt-4 flex sm:justify-between items-center w-full">
                  <div className="flex gap-2 w-full sm:w-auto mb-2 sm:mb-0">
                    <Button variant="outline" onClick={() => { handleSimulatedAction("Warning Dispatched", "Creator Notified"); setSelectedReport(null); }} className="border-amber-900 bg-amber-950/20 text-amber-500 hover:bg-amber-900 text-xs h-8">
                       Warn Creator
                    </Button>
                    <Button variant="outline" onClick={() => { handleSimulatedAction("Ban Executed", "Account Purged", "destructive"); setSelectedReport(null); }} className="border-red-900 bg-red-950/20 text-red-500 hover:bg-red-900 text-xs h-8">
                       Ban User
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedReport(null)} className="h-8 text-xs border-zinc-800 text-foreground/80">Close</Button>
                    {selectedReport.status !== 'resolved' && (
                       <Button 
                          onClick={() => { updateStatus.mutate({ reportId: selectedReport.id, status: "resolved" }); setSelectedReport(null); }} 
                          className="h-8 text-xs bg-red-600 hover:bg-red-700 text-foreground dark:text-white"
                       >
                         Mark as Resolved
                       </Button>
                    )}
                  </div>
                </DialogFooter>
              </>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
