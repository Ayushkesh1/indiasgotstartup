import { DollarSign, TrendingUp, Users, Zap, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCountUp } from "@/hooks/useCountUp";

export default function Monetization() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const totalPaid = useCountUp({ end: 2500000, duration: 2500, prefix: "$", suffix: "M+" });
  const earningWriters = useCountUp({ end: 10000, duration: 2000, suffix: "K+" });
  const avgEarnings = useCountUp({ end: 5000, duration: 2000, prefix: "$", suffix: "K" });

  const monetizationMethods = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Ad Revenue",
      description: "Display ads on your articles and earn money based on views and clicks",
      earnings: "Up to $50/1000 views",
      color: "from-primary to-secondary",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Premium Content",
      description: "Create exclusive content for paying subscribers",
      earnings: "$5-50/subscriber/month",
      color: "from-secondary to-accent",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Sponsorships",
      description: "Partner with brands for sponsored articles and reviews",
      earnings: "$100-10,000/article",
      color: "from-accent to-primary",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Affiliate Links",
      description: "Earn commissions by recommending products in your articles",
      earnings: "5-30% commission",
      color: "from-primary to-accent",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Build Your Audience",
      description: "Write quality content consistently to grow your follower base",
    },
    {
      step: 2,
      title: "Enable Monetization",
      description: "Set up your payment details and choose your monetization methods",
    },
    {
      step: 3,
      title: "Create Premium Content",
      description: "Mix free and premium articles to maximize earnings",
    },
    {
      step: 4,
      title: "Track & Optimize",
      description: "Use analytics to understand what content performs best",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-white mb-6 shadow-lg">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Start Earning Today</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Make Money Writing
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Turn your passion for writing into income. Multiple ways to earn from your content with automated earnings tracking.
          </p>
        </div>

        {/* Monetization Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {monetizationMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-card backdrop-blur-sm group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <CardTitle className="text-2xl mb-3">{method.title}</CardTitle>
                <CardDescription className="text-base">{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Potential Earnings</p>
                  <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{method.earnings}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
                    {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center border-0 bg-gradient-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="py-10">
              <CardTitle className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                {totalPaid}
              </CardTitle>
              <CardDescription className="text-base font-medium">Paid to Writers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 bg-gradient-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="py-10">
              <CardTitle className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                {earningWriters}
              </CardTitle>
              <CardDescription className="text-base font-medium">Earning Writers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 bg-gradient-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="py-10">
              <CardTitle className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                {avgEarnings}
              </CardTitle>
              <CardDescription className="text-base font-medium">Avg. Monthly Earnings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center p-12 bg-gradient-primary border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-white mb-4">Ready to Start Earning?</CardTitle>
            <CardDescription className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already making money from their content with automated earnings tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" onClick={() => navigate("/writer-dashboard")} className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6">
              <TrendingUp className="h-5 w-5" />
              Start Writing
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/monetization")} className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-6">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
