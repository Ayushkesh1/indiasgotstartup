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
import { MoreFromAuthor } from "@/components/article/MoreFromAuthor";
import { TrendingTopics } from "@/components/article/TrendingTopics";
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
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden text-zinc-100">
      {/* Deep Ambient Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[40%] right-[20%] w-[30%] h-[300px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0" />
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
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Article Header */}
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <Badge className="mb-6 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 px-5 py-2 text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">{article.category}</Badge>
            <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 drop-shadow-sm">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-[2.5rem] mb-12 border border-white/5 shadow-2xl bg-zinc-900/50 ring-1 ring-white/10 p-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-[2rem] pointer-events-none" />
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
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
            <div className="lg:col-span-6 bg-zinc-900/20 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-10 border border-white/5 shadow-2xl">
              {translatedLanguage && (
                <div className="mb-8 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-purple-400">
                    Translated to {translatedLanguage}
                  </p>
                </div>
              )}
              <div
                id="article-content"
                className="prose prose-lg md:prose-xl max-w-none prose-invert 
                  prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-white 
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:font-medium
                  prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
                  prose-strong:text-white prose-strong:font-bold
                  prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-zinc-300
                  prose-img:rounded-3xl prose-img:shadow-2xl 
                  prose-ul:text-zinc-300 prose-li:marker:text-purple-500
                  selection:bg-purple-500/30"
                dangerouslySetInnerHTML={{ __html: sanitizedTranslatedContent || sanitizedContent }}
              />
            </div>

            {/* Right Sidebar - Sticky container with all sections */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4 scrollbar-hide">
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <AuthorSidebar author={article.profiles} authorId={article.author_id} />
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <MoreFromAuthor 
                    authorId={article.author_id} 
                    authorName={article.profiles.full_name}
                    currentArticleId={article.id} 
                  />
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <WhoToFollow currentAuthorId={article.author_id} currentUserId={user?.id} />
                </div>
                <TrendingTopics />
                <ArticleRecommendations 
                  currentArticleId={article.id}
                  category={article.category}
                  authorId={article.author_id}
                />
              </div>
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
