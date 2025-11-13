import { DollarSign, TrendingUp, Users, Zap, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Monetization() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen gradient-subtle">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start Earning Today</span>
          </div>
          <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Make Money Writing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn your passion for writing into a sustainable income stream
          </p>
        </div>

        {/* Monetization Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monetizationMethods.map((method, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-smooth cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} p-3 text-white mb-4 group-hover:scale-110 transition-smooth`}>
                  {method.icon}
                </div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Potential Earnings</p>
                  <p className="text-lg font-bold text-primary">{method.earnings}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-3xl">How It Works</CardTitle>
            <CardDescription>Follow these steps to start monetizing your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((item) => (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br gradient-primary flex items-center justify-center text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">$2.5M+</CardTitle>
              <CardDescription>Paid to Writers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-secondary">10K+</CardTitle>
              <CardDescription>Earning Writers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">$1,200</CardTitle>
              <CardDescription>Average Monthly Earnings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="gradient-primary text-white text-center p-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Earning?</h2>
            <p className="text-lg opacity-90">
              Join thousands of writers already making money on our platform
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/write")}
                className="font-semibold"
              >
                Start Writing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/rewards")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                View Rewards
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
