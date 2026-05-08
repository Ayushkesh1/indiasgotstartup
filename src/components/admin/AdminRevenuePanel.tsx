import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  IndianRupee, Users, TrendingUp, PieChart, RefreshCw, CheckCircle, 
  Clock, AlertCircle, Database, Calculator, Lock, History, ShieldAlert, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAdminRevenueStats, 
  useCalculateMonthlyPool, 
  useCalculateEngagementPoints, 
  useFinalizeMonth,
  useProcessPayout
} from "@/hooks/useAdminRevenue";
import { format } from "date-fns";

export function AdminRevenuePanel() {
  const { toast } = useToast();
  const { data: stats, isLoading, refetch } = useAdminRevenueStats();
  const { mutate: calculatePool, isPending: calculatingPool } = useCalculateMonthlyPool();
  const { mutate: calculatePoints, isPending: calculatingPoints } = useCalculateEngagementPoints();
  const { mutate: finalizeMonth, isPending: finalizing } = useFinalizeMonth();
  const { mutate: processPayout, isPending: processingPayout } = useProcessPayout();

  // Finalize Protocol State
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizeConfirmText, setFinalizeConfirmText] = useState("");

  // Simulated Mock Data
  const mockRevenueSources = [
    { name: "Subscriptions", amount: 145000, percentage: 48, color: "bg-blue-600" },
    { name: "Ad Network", amount: 85000, percentage: 28, color: "bg-emerald-600" },
    { name: "Sponsorships", amount: 45000, percentage: 15, color: "bg-amber-600" },
    { name: "Partner Campaigns", amount: 25000, percentage: 9, color: "bg-purple-600" },
  ];

  const mockTransactions = [
    { id: "TRX-101", date: "2026-04-05", source: "Stripe Subscription", amount: "₹450.00", status: "Success", type: "inbound" },
    { id: "TRX-102", date: "2026-04-05", source: "Google AdSense", amount: "₹12,400.00", status: "Success", type: "inbound" },
    { id: "TRX-103", date: "2026-04-04", source: "Creator Payout (A. Gupta)", amount: "₹4,120.00", status: "Processing", type: "outbound" },
    { id: "TRX-104", date: "2026-04-04", source: "Sponsor (TechCorp)", amount: "₹45,000.00", status: "Success", type: "inbound" },
  ];

  const handleCalculatePool = () => {
    calculatePool(undefined, {
      onSuccess: () => {
        toast({ title: "Pool calculated successfully" });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleCalculatePoints = () => {
    calculatePoints(undefined, {
      onSuccess: () => {
        toast({ title: "Engagement points calculated" });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleExecuteFinalize = () => {
    if (finalizeConfirmText !== "CONFIRM") {
      toast({ title: "Invalid Confirmation", description: "You must type exactly 'CONFIRM'.", variant: "destructive" });
      return;
    }
    
    finalizeMonth(undefined, {
      onSuccess: () => {
        toast({ title: "Month finalized successfully", description: "The ledger has been securely locked." });
        setShowFinalizeModal(false);
        setFinalizeConfirmText("");
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error Finalizing", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleProcessPayout = (payoutId: string, status: "processing" | "completed" | "failed") => {
    processPayout({ payoutId, status }, {
      onSuccess: () => {
        toast({ title: `Payout marked as ${status}` });
        refetch();
      },
      onError: (error) => {
        toast({ title: "Error Processing", description: error.message, variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const pool = stats?.pool;
  const isLocked = pool?.is_finalized;

  return (
    <div className="space-y-8 pb-12">

      {/* Strict Finalize Modal Overlay */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-red-500 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
               <ShieldAlert className="w-8 h-8" />
               <h3 className="text-xl font-bold">Lock Ledger Sub-Routine</h3>
            </div>
            <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
              You are about to irreversibly lock the financial ledger for {stats?.current_month}. 
              Once finalized, <strong className="text-foreground dark:text-white">no edits can be made</strong> and creator earnings become permanently bonded to their accounts.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mb-6">
              <label className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-2 block">Audit Requirement</label>
              <Input 
                value={finalizeConfirmText} 
                onChange={(e) => setFinalizeConfirmText(e.target.value)} 
                placeholder="Type CONFIRM to authorize..." 
                className="bg-black border-zinc-700" 
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFinalizeModal(false)} className="border-zinc-700 text-foreground/80">Cancel</Button>
              <Button onClick={handleExecuteFinalize} disabled={finalizing || finalizeConfirmText !== "CONFIRM"} className="bg-red-600 hover:bg-red-700 text-foreground dark:text-white font-bold">
                {finalizing ? "Initiating Lock..." : "Authorize & Finalize Month"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Ecosystem Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2"><Database className="w-5 h-5 text-blue-500"/> Revenue Operations</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage global capital inflows, structural pool distributions, and creator liquidations.</p>
        </div>
        <div className="flex flex-col items-end">
           {isLocked ? (
             <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-3 py-1"><Lock className="w-3 h-3 mr-2" /> Ledger Locked & Audited</Badge>
           ) : (
             <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-3 py-1"><Activity className="w-3 h-3 mr-2 rotate-180" /> Ledger Open (Drafting)</Badge>
           )}
           <span className="text-xs text-muted-foreground mt-2 font-mono">Cycle ID: {stats?.current_month}</span>
        </div>
      </div>

      {/* 2. Top Line Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-medium text-muted-foreground uppercase tracking-widest text-xs">
              <IndianRupee className="h-4 w-4 text-emerald-500" /> Gross Inflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">₹{(pool?.total_revenue || 300000).toLocaleString()}</div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden flex">
              {mockRevenueSources.map((src, i) => (
                <div key={i} className={`h-full ${src.color}`} style={{ width: `${src.percentage}%` }} title={src.name} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-medium text-muted-foreground uppercase tracking-widest text-xs">
              <PieChart className="h-4 w-4 text-blue-500" /> Creator Pool (60%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-regular text-foreground">₹{(pool?.creator_pool || 180000).toLocaleString()}</div>
            <p className="text-xs font-mono text-muted-foreground mt-2">Awaiting mapped distribution</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-medium text-muted-foreground uppercase tracking-widest text-xs">
              <TrendingUp className="h-4 w-4 text-purple-500" /> Platform Retained (40%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-regular text-foreground">₹{(pool?.platform_revenue || 120000).toLocaleString()}</div>
            <p className="text-xs font-mono text-muted-foreground mt-2">Operational liquidity</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Operational Logic & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Sources Detail */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">Capital Sourcing</CardTitle>
            <CardDescription>Breakdown of recognized gross inbound revenue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {mockRevenueSources.map((source, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-sm ${source.color}`} />
                   <span className="text-sm font-medium text-foreground/80">{source.name}</span>
                 </div>
                 <div className="flex items-center gap-6">
                   <span className="text-sm font-mono text-muted-foreground">{source.percentage}%</span>
                   <span className="text-sm font-bold text-foreground w-20 text-right">₹{source.amount.toLocaleString()}</span>
                 </div>
               </div>
             ))}
             <div className="pt-4 mt-6 border-t border-zinc-800 flex justify-between items-center text-xs text-muted-foreground">
               <span>*Sponsor data imported via manual Ledger entries.</span>
               <a href="#" className="text-blue-500 hover:text-blue-400 font-medium">Export CSV</a>
             </div>
          </CardContent>
        </Card>

        {/* Creator Ecosystem Matrix (Algorithm) */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2"><Calculator className="w-5 h-5 text-amber-500"/> Earnings Algorithm Matrix</CardTitle>
            <CardDescription>Current multi-variable weighting parameters governing distribution.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-foreground/80 border border-zinc-700">Multiplier</div>
                 <span className="text-sm font-medium text-muted-foreground">Total Engagement Score Formula:</span>
               </div>
               <div className="text-sm font-mono text-emerald-400 mt-3 p-3 bg-black/50 rounded flex items-center justify-between border border-emerald-900/30">
                 <span>(Reads × 1.0) + (Comments × 2.0) + (Bookmarks × 3.0)</span>
                 <span className="text-zinc-600">= SCORE</span>
               </div>
             </div>
             
             <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
               <Button variant="outline" onClick={handleCalculatePool} disabled={calculatingPool || isLocked} className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-foreground/80 text-xs h-9 flex-1 sm:flex-none">
                 <RefreshCw className={`w-3 h-3 mr-2 ${calculatingPool ? 'animate-spin' : ''}`} /> 1. Re-calculate Capital Pool
               </Button>
               <Button variant="outline" onClick={handleCalculatePoints} disabled={calculatingPoints || isLocked} className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-foreground/80 text-xs h-9 flex-1 sm:flex-none">
                 <RefreshCw className={`w-3 h-3 mr-2 ${calculatingPoints ? 'animate-spin' : ''}`} /> 2. Process Member Arrays
               </Button>
               <Button 
                 onClick={() => setShowFinalizeModal(true)} 
                 disabled={isLocked}
                 className={`text-xs h-9 font-bold flex-1 sm:flex-none sm:ml-auto ${isLocked ? 'bg-zinc-800 text-muted-foreground' : 'bg-red-600/90 hover:bg-red-600 text-foreground dark:text-white shadow-sm'}`}
               >
                 <Lock className="w-3 h-3 mr-2" /> 3. Secure Protocol (Finalize)
               </Button>
             </div>
          </CardContent>
        </Card>

      </div>

      {/* 4. The Unified Creator Ledger */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">Creator Earnings Allocation</CardTitle>
          <CardDescription>Verified algorithmic distribution mapping for mapped authors.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {stats?.creator_earnings && stats.creator_earnings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Author ID</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium whitespace-nowrap">Eng. Score</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Reads</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Comments</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Hooks</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Gross Payable</TableHead>
                  <TableHead className="text-muted-foreground font-medium pl-6">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.creator_earnings.map((earning: any, index: number) => (
                  <TableRow key={earning.id} className="border-b border-zinc-800/50 hover:bg-white/70 dark:bg-zinc-900/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-zinc-900 text-muted-foreground border-zinc-800 font-mono text-[10px]">#{index + 1}</Badge>
                        <span className="font-medium text-zinc-200">
                          {earning.profiles?.full_name || "Unknown Identity"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground/80">
                      {earning.total_engagement_points?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{earning.full_reads}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{earning.comments}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{earning.bookmarks}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-500">
                      ₹{(earning.final_earnings || earning.estimated_earnings)?.toFixed(2)}
                    </TableCell>
                    <TableCell className="pl-6">
                      <Badge variant="outline" className={`border-0 font-medium text-xs px-2 py-0.5 rounded-full ${
                        earning.is_paid 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : isLocked ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-muted-foreground'
                      }`}>
                        {earning.is_paid ? "Liquidated" : isLocked ? "Pending Liquidation" : "Mapping..."}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-zinc-600 border border-zinc-800 border-dashed rounded-lg">
              No processing matrices found
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Combined Administration: History & Payouts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         
         {/* Transaction Ledger */}
         <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
           <CardHeader>
             <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2"><History className="w-4 h-4 text-purple-400"/> System Ledger</CardTitle>
             <CardDescription>Immutable record of cross-platform transactions.</CardDescription>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                   <TableHead className="text-muted-foreground text-xs">TRX ID</TableHead>
                   <TableHead className="text-muted-foreground text-xs">Origin</TableHead>
                   <TableHead className="text-right text-muted-foreground text-xs">Asset</TableHead>
                   <TableHead className="text-right text-muted-foreground text-xs pr-4">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                  {mockTransactions.map(trx => (
                    <TableRow key={trx.id} className="border-b border-zinc-800/50 hover:bg-white/70 dark:bg-zinc-900/50">
                       <TableCell className="font-mono text-xs text-muted-foreground">{trx.id}</TableCell>
                       <TableCell className="text-sm text-foreground/80 font-medium flex items-center gap-2">
                         {trx.type === 'inbound' ? <TrendingUp className="w-3 h-3 text-emerald-500"/> : <TrendingUp className="w-3 h-3 text-blue-500 rotate-180"/>}
                         {trx.source}
                       </TableCell>
                       <TableCell className={`text-right font-medium text-sm ${trx.type === 'inbound' ? 'text-emerald-400' : 'text-blue-400'}`}>
                         {trx.amount}
                       </TableCell>
                       <TableCell className="text-right pr-4">
                         <Badge variant="outline" className={`text-[10px] border-0 rounded-sm ${trx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                           {trx.status}
                         </Badge>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>

         {/* Payout Processing Center */}
         <Card className="bg-zinc-950 border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2"><IndianRupee className="w-4 h-4 text-emerald-400"/> Payout Terminal</CardTitle>
            <CardDescription>Intervene on creator liquidation requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.pending_payouts && stats.pending_payouts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-muted-foreground text-xs">Target</TableHead>
                    <TableHead className="text-right text-muted-foreground text-xs">Request</TableHead>
                    <TableHead className="text-muted-foreground text-xs pl-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.pending_payouts.map((payout: any) => (
                    <TableRow key={payout.id} className="border-b border-zinc-800/50 hover:bg-white/70 dark:bg-zinc-900/50 block sm:table-row">
                      <TableCell className="block sm:table-cell">
                        <div className="flex flex-col">
                           <span className="font-mono text-muted-foreground text-xs">{payout.creator_id.slice(0, 8)}...</span>
                           <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Method: {payout.payment_method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="block sm:table-cell sm:text-right font-medium text-emerald-400 text-sm">
                        ₹{payout.amount}
                      </TableCell>
                      <TableCell className="block sm:table-cell pl-0 sm:pl-6 pt-2 sm:pt-4">
                        <div className="flex gap-2">
                          <Button 
                            className="h-7 text-[10px] uppercase tracking-wider font-bold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-foreground dark:text-white border-0"
                            onClick={() => handleProcessPayout(payout.id, "processing")}
                            disabled={processingPayout}
                          >Proce</Button>
                          <Button 
                            className="h-7 text-[10px] uppercase tracking-wider font-bold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-foreground dark:text-white border-0"
                            onClick={() => handleProcessPayout(payout.id, "completed")}
                            disabled={processingPayout}
                          >Done</Button>
                          <Button 
                            className="h-7 text-[10px] uppercase tracking-wider font-bold bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-foreground dark:text-white border-0 px-2"
                            onClick={() => handleProcessPayout(payout.id, "failed")}
                            disabled={processingPayout}
                          >X</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border border-zinc-800 border-dashed rounded-lg bg-white/70 dark:bg-zinc-900/30">
                <CheckCircle className="h-8 w-8 text-zinc-700 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Zero Pending Operations</p>
                <p className="text-xs text-zinc-600 mt-1">All creator liquidations successfully cleared.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
