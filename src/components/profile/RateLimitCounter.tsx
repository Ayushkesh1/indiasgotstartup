import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRateLimits } from "@/hooks/useRateLimits";
import { Bot, Languages, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RateLimitCounterProps {
  userId: string;
}

export function RateLimitCounter({ userId }: RateLimitCounterProps) {
  const { data: rateLimits, isLoading } = useRateLimits(userId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-2 bg-muted rounded"></div>
          <div className="h-2 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const getFunctionIcon = (name: string) => {
    if (name === "profile-assistant") return Bot;
    if (name === "translate-article") return Languages;
    return Bot;
  };

  const getFunctionLabel = (name: string) => {
    if (name === "profile-assistant") return "Profile Assistant";
    if (name === "translate-article") return "Article Translation";
    return name;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Request Limits</h3>
      </div>
      
      <div className="space-y-6">
        {rateLimits?.map((limit) => {
          const Icon = getFunctionIcon(limit.functionName);
          const progressColor = getProgressColor(limit.percentageUsed);
          
          return (
            <div key={limit.functionName} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getFunctionLabel(limit.functionName)}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {limit.remaining}/{limit.limit}
                </span>
              </div>
              
              <Progress 
                value={limit.percentageUsed} 
                className="h-2"
              />
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Resets {formatDistanceToNow(limit.resetTime, { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
