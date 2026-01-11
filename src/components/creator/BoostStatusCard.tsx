import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BoostStatusCardProps {
  boostedArticlesCount: number;
  totalBoostPoints: number;
}

export function BoostStatusCard({ boostedArticlesCount, totalBoostPoints }: BoostStatusCardProps) {
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-500/10">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Boost System</CardTitle>
              <CardDescription>Earn bonus multipliers on quality content</CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>High-quality articles can be boosted by the editorial team. Boosted articles earn 1.5x-2x points on all engagement.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-card border">
            <div className="text-2xl font-bold text-amber-600">{boostedArticlesCount}</div>
            <div className="text-xs text-muted-foreground">Boosted Articles</div>
          </div>
          <div className="p-3 rounded-lg bg-card border">
            <div className="text-2xl font-bold text-amber-600">+{totalBoostPoints}</div>
            <div className="text-xs text-muted-foreground">Bonus Points Earned</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">How to Get Boosted</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Write original, well-researched content</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Engage meaningfully with your readers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Maintain consistent quality over time</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Articles with strong reader retention</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Boosts are reviewed weekly by our editorial team</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
