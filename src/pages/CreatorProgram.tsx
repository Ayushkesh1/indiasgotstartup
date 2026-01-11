import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  Users, 
  IndianRupee,
  Zap,
  Crown,
  Rocket,
  BookOpen,
  MessageSquare,
  Bookmark,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useCreatorEarnings";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  expires_at: string;
}

const plans = [
  {
    id: "basic",
    name: "Basic Creator",
    price: 0,
    period: "forever",
    description: "Start your creator journey for free",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    features: [
      "Publish unlimited articles",
      "Basic analytics dashboard",
      "Community access",
      "Standard support",
    ],
    limitations: [
      "No earnings from engagement",
      "No payout access",
      "No boosted articles",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "creator",
    name: "Creator Pro",
    price: 100,
    period: "month",
    description: "Monetize your content and grow faster",
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    features: [
      "Everything in Basic",
      "Earn from reader engagement",
      "Access to creator pool earnings",
      "Priority in recommendations",
      "Boost articles for visibility",
      "Detailed analytics & insights",
      "Payout access (₹300 min)",
      "+50% bonus from follower engagement",
    ],
    limitations: [],
    cta: "Join Creator Program",
    popular: true,
  },
  {
    id: "premium",
    name: "Creator Elite",
    price: 500,
    period: "month",
    description: "Maximum visibility and earnings potential",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    features: [
      "Everything in Creator Pro",
      "2x earnings multiplier",
      "Featured placement on homepage",
      "Unlimited article boosts",
      "Priority support",
      "Early access to new features",
      "Custom creator badge",
      "Monthly strategy call",
    ],
    limitations: [],
    cta: "Go Elite",
    popular: false,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Subscribe",
    description: "Choose a plan that fits your goals and subscribe to the Creator Program.",
    icon: Zap,
  },
  {
    step: 2,
    title: "Create Content",
    description: "Write and publish engaging articles that resonate with readers.",
    icon: BookOpen,
  },
  {
    step: 3,
    title: "Earn Points",
    description: "Earn engagement points when readers interact with your content.",
    icon: TrendingUp,
  },
  {
    step: 4,
    title: "Get Paid",
    description: "Cash out your earnings when you reach the minimum threshold.",
    icon: IndianRupee,
  },
];

const engagementPoints = [
  { action: "Full Read", points: 1, icon: BookOpen, color: "text-blue-500" },
  { action: "Comment", points: 3, icon: MessageSquare, color: "text-green-500" },
  { action: "Bookmark", points: 2, icon: Bookmark, color: "text-amber-500" },
  { action: "Follower Bonus", points: "+50%", icon: Users, color: "text-purple-500" },
];

export default function CreatorProgram() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: subscription } = useSubscription();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate("/auth?redirect=/creator-program");
      return;
    }

    if (planId === "basic") {
      navigate("/creator-dashboard");
      return;
    }

    // For paid plans, navigate to checkout (to be implemented with payment integration)
    // For now, show a placeholder
    navigate(`/creator-program/checkout?plan=${planId}`);
  };

  const isSubscribed = (subscription as unknown as Subscription | null)?.status === "active";

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Creator Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Turn Your{" "}
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Writing
            </span>{" "}
            Into Income
          </h1>
          <p className="text-xl text-muted-foreground">
            Join our creator program and earn money based on reader engagement. 
            The more your content resonates, the more you earn from our shared revenue pool.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step) => (
              <div 
                key={step.step}
                className="relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <step.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Points Explainer */}
        <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-amber-500/5 border">
          <h2 className="text-2xl font-bold text-center mb-8">Earn Points for Every Interaction</h2>
          <div className="grid gap-4 md:grid-cols-4 max-w-3xl mx-auto">
            {engagementPoints.map((item) => (
              <div 
                key={item.action}
                className="text-center p-4 rounded-xl bg-background border"
              >
                <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                <div className="font-medium">{item.action}</div>
                <div className="text-2xl font-bold text-primary">
                  {typeof item.points === "number" ? `${item.points} pt` : item.points}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6 max-w-xl mx-auto">
            Your share of the monthly revenue pool is based on your percentage of total platform engagement points.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-2">Choose Your Plan</h2>
          <p className="text-center text-muted-foreground mb-8">
            Start free or unlock full earning potential with a subscription
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:shadow-xl ${
                  plan.popular 
                    ? "border-2 border-primary shadow-lg scale-105 z-10" 
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${plan.bgColor} flex items-center justify-center mb-3`}>
                    <plan.icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-4 h-4 shrink-0 text-center">—</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full group"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isSubscribed && plan.id !== "basic"}
                  >
                    {isSubscribed && plan.id === "creator" ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue Pool Explainer */}
        <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-card border">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Fair & Transparent Revenue Sharing</h2>
          <p className="text-muted-foreground mb-6">
            All subscription revenue goes into a monthly pool. 70% of this pool is distributed 
            to creators based on their share of total engagement points. The more readers 
            interact with your content, the bigger your slice of the pie.
          </p>
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">70%</div>
              <div className="text-sm text-muted-foreground">To Creators</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-muted-foreground">30%</div>
              <div className="text-sm text-muted-foreground">Platform Operations</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-green-600">₹300</div>
              <div className="text-sm text-muted-foreground">Min. Payout</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => {
              if (!user) {
                navigate("/auth?redirect=/creator-program");
              } else {
                navigate("/creator-dashboard");
              }
            }}
          >
            {isSubscribed ? "Go to Dashboard" : "Start Creating Today"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
