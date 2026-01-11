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

          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="revenue" className="gap-2">
                <IndianRupee className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="partners" className="gap-2">
                <Handshake className="h-4 w-4" />
                Partners
              </TabsTrigger>
              <TabsTrigger value="careers" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Careers
              </TabsTrigger>
              <TabsTrigger value="queries" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Queries
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="gap-2">
                <Mail className="h-4 w-4" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <Shield className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
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
            <TabsContent value="content"><ContentModerationPanel /></TabsContent>
            <TabsContent value="reports"><ReportsPanel /></TabsContent>
            <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminSessionGuard>
  );
}
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="revenue" className="gap-2">
              <IndianRupee className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="gap-2">
              <Mail className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Shield className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <AdminRevenuePanel />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="content">
            <ContentModerationPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
