import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { NewsletterManagement } from "@/components/admin/NewsletterManagement";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { ContentModerationPanel } from "@/components/admin/ContentModerationPanel";
import { Card } from "@/components/ui/card";
import { Shield, Mail, Users, FileText, BarChart } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="newsletter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="content">
            <ContentModerationPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Analytics features coming soon. This will include platform engagement metrics,
                user growth trends, and content performance statistics.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
