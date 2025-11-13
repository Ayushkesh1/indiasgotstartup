import { Article } from "@/hooks/useArticles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit, Trash2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ArticlesListProps {
  articles: Article[];
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const publishedArticles = articles.filter((a) => a.published);
  const draftArticles = articles.filter((a) => !a.published);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Article deleted",
        description: "Your article has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["user-articles"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ArticleCard = ({ article }: { article: Article }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold line-clamp-1">
                {article.title}
              </h3>
              <Badge variant={article.published ? "default" : "secondary"}>
                {article.published ? "Published" : "Draft"}
              </Badge>
            </div>
            {article.excerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(article.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.views_count} views
              </span>
              <Badge variant="outline">{article.category}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/write/${article.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(article.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published">
            Published ({publishedArticles.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftArticles.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="published" className="space-y-4 mt-6">
          {publishedArticles.length > 0 ? (
            publishedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No published articles yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/write")}
              >
                Write your first article
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="drafts" className="space-y-4 mt-6">
          {draftArticles.length > 0 ? (
            draftArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No drafts</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticlesList;
