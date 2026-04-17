import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, UserCog, Trash2, Search, Link as LinkIcon, Activity, 
  Ban, ShieldAlert, KeyRound, MailCheck, AlertTriangle, FileText, IndianRupee, Eye, TrendingUp, CheckCircle2, Clock
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function UserManagementTable() {
  const { data: users, isLoading, assignRole, removeRole } = useUserManagement();
  const { toast } = useToast();
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showMergeModal, setShowMergeModal] = useState(false);

  // Simulated Action Handlers
  const handleSimulatedAction = (actionName: string, successMessage: string, variant: "default" | "destructive" = "default") => {
    toast({ title: successMessage, description: `The ${actionName} command was dispatched to the system.`, variant });
    if (actionName === 'Ban/Suspend' || actionName === 'Delete') {
      setSelectedUser(null);
    }
  };

  const handleAssignRole = (userId: string, role: string) => {
    assignRole.mutate({ userId, role: role as any });
  };

  const handleRemoveRole = (userId: string, role: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRole.mutate({ userId, role: role as any });
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-zinc-950 border-zinc-800">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-zinc-900 rounded w-1/4"></div>
          <div className="h-64 bg-zinc-900 rounded"></div>
        </div>
      </Card>
    );
  }

  // Filter Users
  const filteredUsers = users?.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2"><UserCog className="w-5 h-5 text-purple-500"/> User Access Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage platform members, track activities, and govern roles securely.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <Input 
               placeholder="Search user ID or name..." 
               className="pl-9 bg-zinc-950 border-zinc-800"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <Button variant="outline" onClick={() => setShowMergeModal(true)} className="border-cyan-900 text-cyan-500 hover:bg-cyan-950">
            <LinkIcon className="w-4 h-4 mr-2" /> Merge Duplicates
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/70 dark:bg-zinc-900/50">
              <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium h-12">User Identity</TableHead>
                <TableHead className="text-muted-foreground font-medium">Access Permissions</TableHead>
                <TableHead className="text-muted-foreground font-medium">System Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium pr-6">Append Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                // Mock activity indicator
                const isOnline = user.id.slice(-1) > "5";
                
                return (
                 <TableRow 
                   key={user.id} 
                   className="border-b border-zinc-800/50 hover:bg-white/70 dark:bg-zinc-900/80 cursor-pointer transition-colors"
                   onClick={() => setSelectedUser(user)}
                 >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-zinc-800">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="bg-zinc-900 text-muted-foreground font-medium">
                            {user.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200">
                          {user.full_name || "Anonymous Member"}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">ID: {user.id.slice(0, 12)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((role) => {
                        let badgeColor = "bg-zinc-800 text-foreground/80 border-zinc-700";
                        let icon = null;
                        
                        if (role === 'admin' || role === 'super_admin') { badgeColor = "bg-red-500/10 text-red-400 border-red-500/20"; icon = <ShieldAlert className="w-3 h-3"/>; }
                        else if (role === 'editor') { badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"; icon = <FileText className="w-3 h-3"/>; }
                        else if (role === 'moderator') { badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20"; icon = <Shield className="w-3 h-3"/>; }
                        else if (role === 'creator') { badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20"; icon = <Activity className="w-3 h-3"/>; }

                        return (
                          <Badge key={role} variant="outline" className={`gap-1.5 text-xs ${badgeColor}`}>
                            {icon} {role.replace('_', ' ').toUpperCase()}
                            <button
                              className="ml-1 opacity-50 hover:opacity-100 hover:text-foreground dark:text-white focus:outline-none"
                              onClick={(e) => handleRemoveRole(user.id, role, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                      {user.roles.length === 0 && (
                        <Badge variant="outline" className="bg-white/70 dark:bg-zinc-900/50 text-muted-foreground border-zinc-800">BASE USER</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                    <Select onValueChange={(role) => handleAssignRole(user.id, role)}>
                      <SelectTrigger className="w-[140px] ml-auto h-8 bg-black border-zinc-800 text-xs">
                        <SelectValue placeholder="Add Role..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="super_admin" className="text-red-400 text-xs">Super Admin</SelectItem>
                        <SelectItem value="admin" className="text-red-400 text-xs">Admin</SelectItem>
                        <SelectItem value="editor" className="text-blue-400 text-xs">Editor</SelectItem>
                        <SelectItem value="moderator" className="text-amber-400 text-xs">Moderator</SelectItem>
                        <SelectItem value="creator" className="text-purple-400 text-xs">Creator</SelectItem>
                        <SelectItem value="user" className="text-foreground/80 text-xs">Base User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )}) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No users found matching your search matrix.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* User Profile Expanded Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader className="flex flex-row items-center gap-4 pb-4 border-b border-zinc-800">
                <Avatar className="h-16 w-16 border-2 border-zinc-800">
                  <AvatarImage src={selectedUser.avatar_url || ""} />
                  <AvatarFallback className="bg-zinc-900 text-muted-foreground text-xl font-bold">
                    {selectedUser.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
                    {selectedUser.full_name || "Anonymous User"}
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs mt-1 text-muted-foreground">
                    UUID: {selectedUser.id}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                {/* Simulated Stats */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground mb-2"/>
                      <div className="text-2xl font-bold text-foreground">14</div>
                      <div className="text-xs text-muted-foreground">Articles</div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                      <Eye className="w-4 h-4 text-emerald-500 mb-2"/>
                      <div className="text-2xl font-bold text-emerald-400">22.4k</div>
                      <div className="text-xs text-muted-foreground">Total Views</div>
                    </div>
                    <div className="px-3 py-4 rounded-lg bg-emerald-900/10 border border-emerald-900/30 col-span-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <IndianRupee className="w-5 h-5" />
                        <span className="font-semibold">Lifetime Earnings</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-400">₹42,850</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Activity Log */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activity Tracking</h4>
                  <div className="bg-black border border-zinc-800 rounded-lg p-4 h-[180px] overflow-y-auto space-y-3">
                    <div className="flex gap-3 items-start relative">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                      <div className="absolute top-3 left-1 w-px h-full bg-zinc-800"></div>
                      <div>
                        <p className="text-xs text-foreground/80">Published <span className="text-blue-400">"The Future of FinTech in India"</span></p>
                        <p className="text-[10px] font-mono text-zinc-600 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start relative">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-zinc-500 shrink-0"></div>
                      <div className="absolute top-3 left-1 w-px h-full bg-zinc-800"></div>
                      <div>
                        <p className="text-xs text-foreground/80">Logged in from <span className="font-mono bg-zinc-900 px-1 rounded text-muted-foreground">IPv4 Address</span></p>
                        <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Today at 09:41 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                      <div>
                        <p className="text-xs text-foreground/80">Completed Payout Processing</p>
                        <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Actions */}
              <div className="border-t border-zinc-800 pt-5 mt-2">
                 <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Security & Interventions</h4>
                 <div className="flex flex-wrap gap-2">
                   <Button variant="outline" onClick={() => handleSimulatedAction("Manual Verification", "User Verified Manually")} className="border-blue-900 bg-blue-950/30 text-blue-400 hover:bg-blue-900 hover:text-foreground dark:text-white h-8 text-xs">
                     <MailCheck className="w-3 h-3 mr-2" /> Verify Account
                   </Button>
                   <Button variant="outline" onClick={() => handleSimulatedAction("Password Reset", "Reset Link Dispatched")} className="border-zinc-800 bg-black text-foreground/80 hover:bg-zinc-800 hover:text-foreground dark:text-white h-8 text-xs">
                     <KeyRound className="w-3 h-3 mr-2" /> Force Reset Password
                   </Button>
                   <Button variant="outline" onClick={() => handleSimulatedAction("Ban/Suspend", "User Systematically Banned", "destructive")} className="border-amber-900 bg-amber-950/30 text-amber-500 hover:bg-amber-900 hover:text-foreground dark:text-white h-8 text-xs ml-auto">
                     <Ban className="w-3 h-3 mr-2" /> Ban/Suspend
                   </Button>
                   <Button variant="outline" onClick={() => handleSimulatedAction("Delete", "User Account Permanently Purged", "destructive")} className="border-red-900 bg-red-950/30 text-red-500 hover:bg-red-900 hover:text-foreground dark:text-white h-8 text-xs">
                     <Trash2 className="w-3 h-3 mr-2" /> Purge Account
                   </Button>
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Merge Accounts Dialog */}
      <Dialog open={showMergeModal} onOpenChange={setShowMergeModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground flex items-center gap-2">
              <LinkIcon className="col-5 h-5 text-cyan-500" /> Resolution Matrix 
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select two User IDs to merge. The Primary ID will absorb all assets, metrics, and relationships from the Secondary ID.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Account (Survivor)</label>
              <Input placeholder="Enter Primary UUID..." className="bg-black border-zinc-800 text-foreground/80 font-mono text-sm" />
            </div>
            <div className="flex justify-center -my-2 relative z-10">
               <div className="bg-zinc-900 border border-zinc-800 rounded-full p-2">
                 <LinkIcon className="w-4 h-4 text-muted-foreground rotate-90" />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary Account (Absorbed)</label>
              <Input placeholder="Enter Secondary UUID..." className="border-red-900/50 bg-red-950/10 text-red-400 font-mono text-sm" />
            </div>
            <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 flex items-start gap-3 mt-4">
               <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-xs text-amber-400/90 leading-relaxed">
                 Warning: Merging accounts is a destructive cryptographic process. The secondary account identity will be permanently eradicated.
               </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMergeModal(false)} className="border-zinc-800 text-foreground/80">Cancel</Button>
            <Button 
               onClick={() => {
                 toast({ title: "Merge Executed", description: "The records are being securely combined." });
                 setShowMergeModal(false);
               }} 
               className="bg-cyan-600 hover:bg-cyan-700 text-foreground dark:text-white"
            >
              Merge & Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
