import { useState } from "react";
import Navbar from "@/components/Navbar";
import { EarningsDashboard } from "@/components/EarningsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Eye, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Earnings() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-white mb-6 shadow-lg">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm font-semibold">Earnings Dashboard</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Your Earnings
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Track your automated earnings from article views. Earnings are calculated automatically at $0.05 per view.
          </p>
        </div>

        {/* How It Works */}
        <Card className="mb-12 border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              How Automated Earnings Work
            </CardTitle>
            <CardDescription className="text-base">
              Your earnings are calculated automatically based on article performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Article Views</h3>
                  <p className="text-sm text-muted-foreground">
                    Every time someone reads your article, it counts as a view
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Automatic Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Earnings are calculated daily at $0.05 per view automatically
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pending Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Earnings are pending for 7 days before being available for payout
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Dashboard */}
        <EarningsDashboard />
      </main>
    </div>
  );
}
