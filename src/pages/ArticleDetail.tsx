import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useArticleBySlug } from "@/hooks/useArticleBySlug";
import { useRelatedArticles } from "@/hooks/useRelatedArticles";
import { useReadingProgress, useTrackReadingProgress } from "@/hooks/useReadingProgress";
import { useAuth } from "@/hooks/useAuth";
import { useTrackEngagement } from "@/hooks/useCreatorEarnings";
import Navbar from "@/components/Navbar";
import ReadingProgress from "@/components/article/ReadingProgress";
import TableOfContents from "@/components/article/TableOfContents";
import AuthorSidebar from "@/components/article/AuthorSidebar";
import SocialShare from "@/components/article/SocialShare";
import RelatedArticles from "@/components/article/RelatedArticles";
import CommentsList from "@/components/article/CommentsList";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";
import TranslateButton from "@/components/article/TranslateButton";
import { RealtimeViewCounter } from "@/components/article/RealtimeViewCounter";
import { ArticleRecommendations } from "@/components/article/ArticleRecommendations";
import { WhoToFollow } from "@/components/article/WhoToFollow";
import { ReportArticleDialog } from "@/components/article/ReportArticleDialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock } from "lucide-react";
import DOMPurify from "dompurify";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: article, isLoading, error } = useArticleBySlug(slug);
  const { data: relatedArticles } = useRelatedArticles(
    article?.category || "Tech",
    article?.id || ""
  );
  
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translatedLanguage, setTranslatedLanguage] = useState<string | null>(null);
  
  const { data: savedProgress } = useReadingProgress(article?.id || "", user?.id);
  const { mutate: trackEngagement } = useTrackEngagement();
  
  // Track reading time and full read
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedFullReadRef = useRef(false);
  const hasTrackedLongReadRef = useRef(false);
  
  // Track reading progress
  useTrackReadingProgress(article?.id || "", user?.id, !!article?.id && !!user?.id);

  // Record view
  useEffect(() => {
    const recordView = async () => {
      if (article?.id) {
        const { error } = await supabase
          .from("article_views" as any)
          .insert({ 
            article_id: article.id,
            viewer_id: user?.id || null
          });
        
        if (error && error.code !== '23505') { // Ignore duplicate errors
          console.error("Error recording view:", error);
        }
      }
    };
    
    recordView();
    startTimeRef.current = Date.now();
  }, [article?.id, user?.id]);

  // Track full read when user scrolls to bottom
  useEffect(() => {
    if (!article?.id || !user) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      // Track full read when user reaches 90% of the article
      if (scrollPercentage >= 90 && !hasTrackedFullReadRef.current) {
        hasTrackedFullReadRef.current = true;
        trackEngagement({ event_type: "full_read", article_id: article.id });
      }

      // Track long read bonus after 3+ minutes
      const readingTime = (Date.now() - startTimeRef.current) / 1000;
      if (readingTime > 180 && !hasTrackedLongReadRef.current) {
        hasTrackedLongReadRef.current = true;
        trackEngagement({ 
          event_type: "long_read_bonus", 
          article_id: article.id,
          reading_time: readingTime 
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article?.id, user, trackEngagement]);

  // Restore reading position
  useEffect(() => {
    if (savedProgress && savedProgress.scroll_position > 0) {
      // Small delay to ensure content is loaded
      setTimeout(() => {
        window.scrollTo({
          top: savedProgress.scroll_position,
          behavior: "smooth",
        });
      }, 500);
    }
  }, [savedProgress]);

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
  
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(contentHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
  });
  
  const sanitizedTranslatedContent = translatedContent 
    ? DOMPurify.sanitize(translatedContent, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
      })
    : null;


  const shareUrl = `${window.location.origin}/article/${article.slug}`;
  const ogImage = article.featured_image_url || `${window.location.origin}/placeholder.svg`;
  const description = article.excerpt || contentHtml.substring(0, 160).replace(/<[^>]*>/g, '');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.title} | India Got Startup</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="article:published_time" content={article.published_at || article.created_at} />
        <meta property="article:author" content={article.profiles.full_name || "Anonymous"} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional SEO */}
        <link rel="canonical" href={shareUrl} />
      </Helmet>

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
                <RealtimeViewCounter articleId={article.id} showTrendingBadge={true} />
              </div>
              <div className="flex items-center gap-2">
                <TranslateButton 
                  content={contentHtml}
                  onTranslate={(translated, lang) => {
                    setTranslatedContent(translated);
                    setTranslatedLanguage(lang);
                  }}
                />
                <BookmarkButton articleId={article.id} variant="outline" />
                <SocialShare title={article.title} url={shareUrl} />
                {user && <ReportArticleDialog articleId={article.id} />}
              </div>
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
              {translatedLanguage && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary">
                    Translated to {translatedLanguage}
                  </p>
                </div>
              )}
              <div
                id="article-content"
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedTranslatedContent || sanitizedContent }}
              />
            </div>

            {/* Right Sidebar - Author Bio, Recommendations & Who to Follow */}
            <aside className="lg:col-span-3 space-y-6">
              <AuthorSidebar author={article.profiles} authorId={article.author_id} />
              <WhoToFollow currentAuthorId={article.author_id} currentUserId={user?.id} />
              <ArticleRecommendations 
                currentArticleId={article.id}
                category={article.category}
                authorId={article.author_id}
              />
            </aside>
          </div>

          {/* Related Articles */}
          <div className="max-w-6xl mx-auto">
            <RelatedArticles articles={relatedArticles || []} />
          </div>

          {/* Comments Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <CommentsList articleId={article.id} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
