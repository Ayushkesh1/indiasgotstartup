import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  X, 
  PenLine, 
  Users, 
  MessageSquare, 
  Clock,
  Sparkles,
  TrendingUp,
  BookOpen
} from "lucide-react";

interface NewCreatorTipsProps {
  articleCount: number;
  onDismiss?: () => void;
}

export function NewCreatorTips({ articleCount, onDismiss }: NewCreatorTipsProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if user has 5+ articles or dismissed
  if (articleCount >= 5 || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const tips = [
    {
      icon: PenLine,
      title: "Write for your readers",
      description: "Focus on helpful, original content that provides real value. Quality matters more than quantity.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Clock,
      title: "Keep readers engaged",
      description: "The longer readers stay on your article, the more you earn. Write compelling content that holds attention.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: MessageSquare,
      title: "Start conversations",
      description: "Comments earn you 3x more points than reads. Ask questions and encourage discussion.",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Build your audience",
      description: "Consistent posting helps readers find and follow you. More followers mean more engagement.",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent animate-fade-in mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Tips for New Creators
                <Sparkles className="h-4 w-4 text-amber-500" />
              </CardTitle>
              <CardDescription>
                {articleCount === 0 
                  ? "Get started with your creator journey" 
                  : `${5 - articleCount} more articles to go — here's how to maximize your earnings`
                }
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0" 
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip, index) => (
            <div 
              key={tip.title}
              className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-full ${tip.bgColor} shrink-0 h-fit`}>
                <tip.icon className={`h-4 w-4 ${tip.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-sm">{tip.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Explanation */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">How You Earn</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-blue-500" />
              Full read = 1 pt
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-green-500" />
              Comment = 3 pts
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              Bookmark = 2 pts
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-purple-500" />
              Long read = +1 pt
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
