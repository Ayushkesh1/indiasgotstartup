import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown,
  Eye, 
  BookOpen, 
  MessageSquare, 
  Bookmark,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  FilePen
} from "lucide-react";
import { useArticlePerformance } from "@/hooks/useCreatorAnalytics";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 10;

interface ArticlePerformanceTableProps {
  showDrafts?: boolean;
}

export function ArticlePerformanceTable({ showDrafts = true }: ArticlePerformanceTableProps) {
  const { user } = useAuth();
  const { data: performanceArticles, isLoading: performanceLoading } = useArticlePerformance();
  const { data: allArticles, isLoading: allArticlesLoading } = useUserArticles(user?.id);
  
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [activeTab, setActiveTab] = useState("published");

  const isLoading = performanceLoading || allArticlesLoading;

  // Filter drafts and published articles
  const draftArticles = allArticles?.filter(a => !a.published) || [];
  const publishedArticles = performanceArticles || [];

  // Sort published by engagement points
  const sortedPublished = [...publishedArticles].sort((a, b) => 
    b.engagement.total_points - a.engagement.total_points
  );

  // Pagination for published
  const totalPublishedPages = Math.ceil(sortedPublished.length / ITEMS_PER_PAGE);
  const paginatedPublished = sortedPublished.slice(
    (publishedPage - 1) * ITEMS_PER_PAGE,
    publishedPage * ITEMS_PER_PAGE
  );

  // Pagination for drafts
  const totalDraftPages = Math.ceil(draftArticles.length / ITEMS_PER_PAGE);
  const paginatedDrafts = draftArticles.slice(
    (draftPage - 1) * ITEMS_PER_PAGE,
    draftPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article Performance</CardTitle>
          <CardDescription>See how your articles are performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPublishedArticles = () => {
    if (!paginatedPublished.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No published articles yet</p>
          <p className="text-sm">Start writing to see performance data here</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3">
          {paginatedPublished.map((article, index) => {
            const globalIndex = (publishedPage - 1) * ITEMS_PER_PAGE + index;
            return (
              <div 
                key={article.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {globalIndex + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/article/${article.slug}`}
                        className="font-medium text-sm truncate hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                      {article.is_boosted && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {article.boost_multiplier}x Boost
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {article.engagement.full_reads}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {article.engagement.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="h-3 w-3" />
                        {article.engagement.bookmarks}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="font-bold text-primary">{article.engagement.total_points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPublishedPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(publishedPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(publishedPage * ITEMS_PER_PAGE, sortedPublished.length)} of {sortedPublished.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPublishedPage(p => Math.max(1, p - 1))}
                disabled={publishedPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {publishedPage} of {totalPublishedPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPublishedPage(p => Math.min(totalPublishedPages, p + 1))}
                disabled={publishedPage === totalPublishedPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderDraftArticles = () => {
    if (!paginatedDrafts.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FilePen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No drafts found</p>
          <p className="text-sm">Your unpublished articles will appear here</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3">
          {paginatedDrafts.map((article) => (
            <div 
              key={article.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10">
                  <FilePen className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {article.title || "Untitled Draft"}
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      Draft
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.reading_time} min read</span>
                    <span>•</span>
                    <span>Created {new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Link to={`/write/${article.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalDraftPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(draftPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(draftPage * ITEMS_PER_PAGE, draftArticles.length)} of {draftArticles.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDraftPage(p => Math.max(1, p - 1))}
                disabled={draftPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {draftPage} of {totalDraftPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDraftPage(p => Math.min(totalDraftPages, p + 1))}
                disabled={draftPage === totalDraftPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Article Performance
          <Badge variant="secondary" className="font-normal">
            {sortedPublished.length + draftArticles.length} total
          </Badge>
        </CardTitle>
        <CardDescription>Manage and track all your content</CardDescription>
      </CardHeader>
      <CardContent>
        {showDrafts ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Published ({sortedPublished.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <FilePen className="h-4 w-4" />
                Drafts ({draftArticles.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="published">
              {renderPublishedArticles()}
            </TabsContent>
            <TabsContent value="drafts">
              {renderDraftArticles()}
            </TabsContent>
          </Tabs>
        ) : (
          renderPublishedArticles()
        )}
      </CardContent>
    </Card>
  );
}
