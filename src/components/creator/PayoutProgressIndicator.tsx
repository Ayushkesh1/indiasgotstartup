import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PayoutProgressIndicatorProps {
  currentBalance: number;
  threshold: number;
  canRequestPayout: boolean;
}

export function PayoutProgressIndicator({ 
  currentBalance, 
  threshold, 
  canRequestPayout 
}: PayoutProgressIndicatorProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const actualProgress = Math.min((currentBalance / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentBalance, 0);

  // Animate progress on mount and when balance changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(actualProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [actualProgress]);

  // Determine milestone messages
  const getMilestoneMessage = () => {
    if (canRequestPayout) {
      return { text: "Ready to withdraw!", color: "text-green-600 dark:text-green-400" };
    }
    if (actualProgress >= 75) {
      return { text: "Almost there!", color: "text-amber-600 dark:text-amber-400" };
    }
    if (actualProgress >= 50) {
      return { text: "Halfway there!", color: "text-blue-600 dark:text-blue-400" };
    }
    if (actualProgress >= 25) {
      return { text: "Great progress!", color: "text-purple-600 dark:text-purple-400" };
    }
    return { text: "Keep creating!", color: "text-muted-foreground" };
  };

  const milestone = getMilestoneMessage();

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      canRequestPayout && "border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Payout Progress</CardTitle>
          </div>
          {canRequestPayout ? (
            <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Ready!
            </Badge>
          ) : (
            <Badge variant="secondary" className="font-normal">
              Min. ₹{threshold}
            </Badge>
          )}
        </div>
        <CardDescription className={milestone.color}>
          {milestone.text}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background Track */}
          <div className="h-4 rounded-full bg-secondary overflow-hidden">
            {/* Animated Progress Fill */}
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out relative",
                canRequestPayout 
                  ? "bg-gradient-to-r from-green-500 to-emerald-400" 
                  : "bg-gradient-to-r from-primary to-primary/80"
              )}
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" 
                   style={{ 
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 2s infinite linear'
                   }} 
              />
            </div>
          </div>

          {/* Milestone Markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
            {[25, 50, 75].map((mark) => (
              <div 
                key={mark} 
                className={cn(
                  "w-0.5 h-2 rounded-full transition-colors",
                  animatedProgress >= mark ? "bg-background/60" : "bg-muted-foreground/30"
                )}
                style={{ marginLeft: `${mark - 1}%` }}
              />
            ))}
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">₹{currentBalance.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm">/ ₹{threshold}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {Math.round(animatedProgress)}%
            </div>
            {!canRequestPayout && (
              <div className="text-xs text-muted-foreground">
                ₹{remaining.toFixed(2)} to go
              </div>
            )}
          </div>
        </div>

        {/* Encouraging Message */}
        {!canRequestPayout && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
            <p className="text-muted-foreground">
              {actualProgress < 50 
                ? "Every reader interaction brings you closer to your first payout!"
                : "You're doing great! Keep engaging with your audience."
              }
            </p>
          </div>
        )}

        {/* Ready for Payout State */}
        {canRequestPayout && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-green-700 dark:text-green-300 font-medium">
              Congratulations! You can now request a payout.
            </p>
          </div>
        )}
      </CardContent>

      {/* Add shimmer keyframe animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Card>
  );
}
