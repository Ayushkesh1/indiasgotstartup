import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { NewsletterManagement } from "@/components/admin/NewsletterManagement";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { ContentModerationPanel } from "@/components/admin/ContentModerationPanel";
import { ReportsPanel } from "@/components/admin/ReportsPanel";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminRevenuePanel } from "@/components/admin/AdminRevenuePanel";
import { PartnersManagement } from "@/components/admin/PartnersManagement";
import { CareersManagement } from "@/components/admin/CareersManagement";
import { ContactQueriesManagement } from "@/components/admin/ContactQueriesManagement";
import { TeamManagement } from "@/components/admin/TeamManagement";
import { AdminSessionGuard } from "@/components/admin/AdminSessionGuard";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Users, FileText, BarChart, IndianRupee, Handshake, Briefcase, MessageSquare, LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout, session } = useAdminSession();

  return (
    <AdminSessionGuard>
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Logged in as {session?.username}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-background/40 backdrop-blur-md border border-primary/20 p-2 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.1)]">
              <TabsTrigger value="revenue" className="gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all">
                <IndianRupee className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="partners" className="gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 data-[state=active]:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all">
                <Handshake className="h-4 w-4" />
                Partners
              </TabsTrigger>
              <TabsTrigger value="careers" className="gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:shadow-[0_0_10px_rgba(20,184,166,0.3)] transition-all">
                <Briefcase className="h-4 w-4" />
                Careers
              </TabsTrigger>
              <TabsTrigger value="queries" className="gap-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all">
                <MessageSquare className="h-4 w-4" />
                Queries
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="gap-2 data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 data-[state=active]:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all">
                <Mail className="h-4 w-4" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400 data-[state=active]:shadow-[0_0_10px_rgba(217,70,239,0.3)] transition-all">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all">
                <Shield className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="revenue"><AdminRevenuePanel /></TabsContent>
            <TabsContent value="partners"><PartnersManagement /></TabsContent>
            <TabsContent value="careers"><CareersManagement /></TabsContent>
            <TabsContent value="queries"><ContactQueriesManagement /></TabsContent>
            <TabsContent value="team"><TeamManagement /></TabsContent>
            <TabsContent value="newsletter"><NewsletterManagement /></TabsContent>
            <TabsContent value="users"><UserManagementTable /></TabsContent>
            <TabsContent value="content"><ContentModerationPanel /></TabsContent>
            <TabsContent value="reports"><ReportsPanel /></TabsContent>
            <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminSessionGuard>
  );
}
