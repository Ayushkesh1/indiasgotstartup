import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArticleBySlug, incrementArticleViews } from "@/hooks/useArticleBySlug";
import { useRelatedArticles } from "@/hooks/useRelatedArticles";
import Navbar from "@/components/Navbar";
import ReadingProgress from "@/components/article/ReadingProgress";
import TableOfContents from "@/components/article/TableOfContents";
import AuthorSidebar from "@/components/article/AuthorSidebar";
import SocialShare from "@/components/article/SocialShare";
import RelatedArticles from "@/components/article/RelatedArticles";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Eye } from "lucide-react";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useArticleBySlug(slug);
  const { data: relatedArticles } = useRelatedArticles(
    article?.category || "Tech",
    article?.id || ""
  );

  useEffect(() => {
    if (article?.id) {
      incrementArticleViews(article.id);
    }
  }, [article?.id]);

  // Add IDs to headings for table of contents
  useEffect(() => {
    if (article?.content) {
      const contentDiv = document.getElementById("article-content");
      if (contentDiv) {
        const headings = contentDiv.querySelectorAll("h2, h3");
        headings.forEach((heading, index) => {
          heading.id = `heading-${index}`;
        });
      }
    }
  }, [article?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  const contentHtml = typeof article.content === 'string' 
    ? article.content 
    : JSON.stringify(article.content);

  const shareUrl = `${window.location.origin}/article/${article.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Article Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between py-6 border-y border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(
                    article.published_at || article.created_at
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.reading_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views_count} views
                </span>
              </div>
              <SocialShare title={article.title} url={shareUrl} />
            </div>
          </div>

          {/* Main Content with Sidebars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Table of Contents */}
            <aside className="hidden lg:block lg:col-span-3">
              <TableOfContents content={contentHtml} />
            </aside>

            {/* Article Content */}
            <div className="lg:col-span-6">
              <div
                id="article-content"
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>

            {/* Right Sidebar - Author Bio */}
            <aside className="lg:col-span-3">
              <AuthorSidebar author={article.profiles} />
            </aside>
          </div>

          {/* Related Articles */}
          <div className="max-w-6xl mx-auto">
            <RelatedArticles articles={relatedArticles || []} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
