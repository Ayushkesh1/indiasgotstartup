import { ExternalLink, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  sourceUrl: string;
  thumbnail?: string;
}

const NewsCard = ({ title, description, category, date, source, sourceUrl, thumbnail }: NewsCardProps) => {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Funding: "bg-success text-success-foreground",
      "Product Launch": "bg-primary text-primary-foreground",
      "Tech News": "bg-accent text-accent-foreground",
      Acquisition: "bg-warning text-warning-foreground",
      Partnership: "bg-secondary text-secondary-foreground",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="group overflow-hidden transition-smooth hover:shadow-xl hover:-translate-y-1 gradient-card border-border/50">
      {thumbnail && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Badge className={getCategoryColor(category)}>
            <Tag className="mr-1 h-3 w-3" />
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-xl leading-tight group-hover:text-primary transition-smooth">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{source}</span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => window.open(sourceUrl, "_blank")}
          >
            Read More
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
