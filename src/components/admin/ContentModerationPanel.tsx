import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminArticles } from "@/hooks/useAdminArticles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { 
  Eye, EyeOff, Search, FileEdit, Trash2, ShieldAlert, Pin, 
  ThumbsUp, BarChart, TrendingUp, CheckCircle2, MessageSquareWarning, 
  Activity, Star, Clock 
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContentModerationPanel() {
  const { data: articles, isLoading } = useAdminArticles();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts" | "flagged">("all");
  
  // Modals
  const [editArticle, setEditArticle] = useState<any>(null);
  const [rejectArticle, setRejectArticle] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("articles")
        .update({ published, published_at: published ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin_articles"] });
      toast({
        title: variables.published ? "Article Published" : "Article Unpublished",
        description: "The content matrix has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Operation Failed", description: error.message, variant: "destructive" });
    },
  });

  // Simulated actions for UX/UI demonstration
  const handleSimulatedAction = (actionName: string, successMessage: string, variant: "default" | "destructive" = "default") => {
    toast({ title: successMessage, description: `[Simulated] ${actionName} applied successfully.`, variant });
  };

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

  // --- Mock Features for UI Demonstration ---
  // In a real application, these would come from the database
  const getMockMetrics = (id: string) => {
     // deterministic mock values based on ID
     const num = parseInt(id.replace(/\D/g,'').slice(0, 4) || '1234', 10);
     return {
       likes: (num % 500) + 12,
       bounceRate: 30 + (num % 40) + "%",
       isFlagged: num % 15 === 0,
       isPinned: num % 25 === 0
     };
  };

  const processedArticles = articles?.map(a => ({ ...a, ...getMockMetrics(a.id) })) || [];

  const counts = {
    total: processedArticles.length,
    published: processedArticles.filter(a => a.published && !a.isFlagged).length,
    drafts: processedArticles.filter(a => !a.published && !a.isFlagged).length,
    flagged: processedArticles.filter(a => a.isFlagged).length,
  };

  const filteredArticles = processedArticles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.category?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "published") return a.published && !a.isFlagged;
    if (activeTab === "drafts") return !a.published && !a.isFlagged;
    if (activeTab === "flagged") return a.isFlagged;
    return true; // "all"
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-blue-500"/> Content Moderation Matrix
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Review drafts, manage publications, and enforce quality standards.</p>
        </div>
        <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input 
              placeholder="Search title, category..." 
              className="pl-9 bg-zinc-950 border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Premium Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-zinc-500 font-medium">Total Articles</div>
              <div className="text-3xl font-bold text-zinc-100 mt-1">{counts.total}</div>
            </div>
            <FileEdit className="w-5 h-5 text-zinc-700" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-emerald-500">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-emerald-500/80 font-medium">Published Active</div>
              <div className="text-3xl font-bold text-emerald-400 mt-1">{counts.published}</div>
            </div>
            <Eye className="w-5 h-5 text-emerald-900" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-amber-500">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-amber-500/80 font-medium">Drafts Pending</div>
              <div className="text-3xl font-bold text-amber-400 mt-1">{counts.drafts}</div>
            </div>
            <Clock className="w-5 h-5 text-amber-900" />
          </div>
        </Card>
        <Card className="p-4 bg-zinc-950 border-zinc-800 relative overflow-hidden group border-b-2 border-b-red-500">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-red-500/80 font-medium">Flagged Items</div>
              <div className="text-3xl font-bold text-red-400 mt-1">{counts.flagged}</div>
            </div>
            <ShieldAlert className="w-5 h-5 text-red-900" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")} className={activeTab === "all" ? "bg-zinc-800 text-white" : "bg-transparent border-zinc-800 text-zinc-400"}>
          All Records
        </Button>
        <Button variant={activeTab === "published" ? "default" : "outline"} onClick={() => setActiveTab("published")} className={activeTab === "published" ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-transparent border-zinc-800 text-zinc-400"}>
          Published
        </Button>
        <Button variant={activeTab === "drafts" ? "default" : "outline"} onClick={() => setActiveTab("drafts")} className={activeTab === "drafts" ? "bg-amber-950/50 text-amber-400 border-amber-900" : "bg-transparent border-zinc-800 text-zinc-400"}>
          Drafts (Review)
        </Button>
        <Button variant={activeTab === "flagged" ? "default" : "outline"} onClick={() => setActiveTab("flagged")} className={activeTab === "flagged" ? "bg-red-950/50 text-red-400 border-red-900" : "bg-transparent border-zinc-800 text-zinc-400"}>
          Flagged / Sensitive
        </Button>
      </div>

      {/* Main Data Table */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium h-12 w-[35%]">Content Identity</TableHead>
                <TableHead className="text-zinc-400 font-medium">Status & Flags</TableHead>
                <TableHead className="text-zinc-400 font-medium">Insights</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                <TableRow key={article.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {/* Thumbnail Placeholder */}
                      <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center overflow-hidden">
                        {article.featured_image_url ? (
                          <img src={article.featured_image_url} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <FileEdit className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200 line-clamp-1 max-w-[300px]">
                          {article.isPinned && <Pin className="w-3 h-3 inline mr-1 text-cyan-500 fill-cyan-500/20" />}
                          {article.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[9px] bg-zinc-900 border-zinc-700 text-zinc-400 font-mono px-1.5 py-0">
                            {article.category}
                          </Badge>
                          <span className="text-[10px] text-zinc-500">by {article.profiles?.full_name || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2 items-start">
                      {article.isFlagged ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Flagged
                        </Badge>
                      ) : article.published ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
                          <Activity className="w-3 h-3 mr-1" /> Pending Review
                        </Badge>
                      )}
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {article.published_at ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) : 'Not Published'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                       <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span title="Total Views" className="flex items-center gap-1"><Eye className="w-3 h-3"/> {article.views_count.toLocaleString()}</span>
                          <span title="Likes/Engagement" className="flex items-center gap-1 text-pink-400/80"><ThumbsUp className="w-3 h-3"/> {article.likes}</span>
                       </div>
                       <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span title="Bounce Rate" className="flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {article.bounceRate}</span>
                          <span title="Read Time" className="flex items-center gap-1"><BarChart className="w-3 h-3"/> {article.reading_time}m read</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex gap-2">
                        {/* Draft Workflow Buttons */}
                        {!article.published && !article.isFlagged && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-emerald-950/30 border-emerald-900/50 text-emerald-500 hover:bg-emerald-900" onClick={() => togglePublish.mutate({ id: article.id, published: true })}>
                               Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-amber-950/30 border-amber-900/50 text-amber-500 hover:bg-amber-900" onClick={() => setRejectArticle(article)}>
                               Reject
                            </Button>
                          </>
                        )}
                        {/* Status Toggle & Edit */}
                        {article.published && (
                           <Button size="sm" variant="ghost" className="h-7 px-2 text-zinc-400 hover:text-white" onClick={() => togglePublish.mutate({ id: article.id, published: false })} title="Unpublish">
                             <EyeOff className="w-4 h-4" />
                           </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-zinc-400 hover:text-blue-400" onClick={() => setEditArticle(article)} title="Edit Configuration">
                          <FileEdit className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Moderation / Promotion Dropdown */}
                      <Select onValueChange={(action) => handleSimulatedAction(action, "Platform Override Executed")}>
                        <SelectTrigger className="w-[130px] h-6 text-[10px] bg-black border-zinc-800 text-zinc-400">
                          <SelectValue placeholder="Quick Actions..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800 z-50">
                          <SelectItem value="Feature on Homepage" className="text-xs text-blue-400"><Star className="w-3 h-3 inline mr-1" /> Feature on Home</SelectItem>
                          <SelectItem value="Pin Article" className="text-xs text-cyan-400"><Pin className="w-3 h-3 inline mr-1" /> Toggle Pin Status</SelectItem>
                          <SelectItem value="Mark as Trending" className="text-xs text-purple-400"><TrendingUp className="w-3 h-3 inline mr-1" /> Force Trending</SelectItem>
                          <SelectItem value="Mark as Sensitive" className="text-xs text-amber-500 mt-2 border-t border-zinc-800/50 pt-2"><MessageSquareWarning className="w-3 h-3 inline mr-1" /> Mark Sensitive</SelectItem>
                          <SelectItem value="Purge Content" className="text-xs text-red-500"><Trash2 className="w-3 h-3 inline mr-1" /> Purge Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                    No content entries found for the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Editing Control Modal */}
      <Dialog open={!!editArticle} onOpenChange={() => setEditArticle(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-2"><FileEdit className="w-5 h-5 text-blue-500" /> Architect Edit Mode</DialogTitle>
            <DialogDescription className="text-zinc-500">Admin override. Modifying content bypasses creator approval.</DialogDescription>
          </DialogHeader>
          {editArticle && (
             <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title Override</label>
                  <Input defaultValue={editArticle.title} className="bg-black border-zinc-800 text-zinc-300 focus-visible:ring-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Taxonomy / Category</label>
                  <Select defaultValue={editArticle.category}>
                    <SelectTrigger className="w-full bg-black border-zinc-800 text-zinc-300 focus-visible:ring-blue-500/50">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                       <SelectItem value="Fintech">Fintech</SelectItem>
                       <SelectItem value="Tech">Tech</SelectItem>
                       <SelectItem value="Blockchain">Blockchain</SelectItem>
                       <SelectItem value="Mobility">Mobility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Content Stub / Excerpt</label>
                  <Textarea defaultValue={editArticle.excerpt || ""} className="bg-black border-zinc-800 text-zinc-300 focus-visible:ring-blue-500/50 min-h-[100px]" />
                </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditArticle(null)} className="border-zinc-800 text-zinc-300">Cancel</Button>
            <Button 
               onClick={() => {
                 handleSimulatedAction("Content Modification", "Article Synced successfully");
                 setEditArticle(null);
               }} 
               className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Overrides
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Rejection Modal */}
      <Dialog open={!!rejectArticle} onOpenChange={() => { setRejectArticle(null); setFeedbackText(""); }}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-2"><MessageSquareWarning className="w-5 h-5 text-amber-500" /> Return Draft to Creator</DialogTitle>
            <DialogDescription className="text-zinc-500">Provide feedback on why this draft does not meet publishing standards.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <Textarea 
               placeholder="Enter mandatory feedback (e.g., Fact-check paragraph 2, Needs higher res cover image)..." 
               value={feedbackText}
               onChange={(e) => setFeedbackText(e.target.value)}
               className="bg-black border-zinc-800 text-zinc-300 min-h-[150px] focus-visible:ring-amber-500/50" 
             />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectArticle(null); setFeedbackText(""); }} className="border-zinc-800 text-zinc-300">Cancel</Button>
            <Button 
               disabled={feedbackText.trim().length === 0}
               onClick={() => {
                 // Conceptually, you would: update status to 'rejected' or similar, and insert a feedback log
                 handleSimulatedAction("Draft Rejected", "Feedback routed back to creator", "default");
                 setRejectArticle(null);
                 setFeedbackText("");
               }} 
               className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Dispatch Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
