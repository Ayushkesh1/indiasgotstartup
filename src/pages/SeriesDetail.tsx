import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSeriesById } from "@/hooks/useSeries";
import { BookOpen, ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: series, isLoading } = useSeriesById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Series not found</h1>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const publishedArticles = series.articles
    ?.filter((a: any) => a.articles?.published)
    .sort((a: any, b: any) => a.position - b.position) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Series Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">Article Series</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{series.title}</h1>
          {series.description && (
            <p className="text-xl text-muted-foreground">{series.description}</p>
          )}
          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>{publishedArticles.length} articles</span>
            <span>•</span>
            <span>
              {publishedArticles.reduce((total: number, a: any) => 
                total + (a.articles?.reading_time || 0), 0
              )} min total reading time
            </span>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {publishedArticles.length > 0 ? (
            publishedArticles.map((item: any, index: number) => {
              const article = item.articles;
              return (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/article/${article.slug}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.reading_time} min read
                          </span>
                          <Badge variant="outline">Part {index + 1}</Badge>
                        </div>
                      </div>
                      {article.featured_image_url && (
                        <div className="hidden md:block flex-shrink-0">
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles in this series yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Enjoying this series?</h2>
            <p className="mb-6">
              Follow the author to get notified when new articles are added to this series
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Discover More Series
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
