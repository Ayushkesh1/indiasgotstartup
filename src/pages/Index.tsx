import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import TagFilter from "@/components/TagFilter";
import TrendingHero from "@/components/TrendingHero";
import NewsCard from "@/components/NewsCard";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import { FeaturedSection } from "@/components/FeaturedSection";
import { MediaSidebar } from "@/components/MediaSidebar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { useArticles, ArticleCategory } from "@/hooks/useArticles";
import { useArticlesByTag } from "@/hooks/useTags";
import { useFollowedAuthors } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Loader2, Heart } from "lucide-react";

const PREDEFINED_CATEGORIES: ArticleCategory[] = [
  "Fintech",
  "Tech",
  "Blockchain",
  "eCommerce",
  "Government",
  "Edtech",
  "Funding",
  "Mobility",
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | ArticleCategory>("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: articles, isLoading } = useArticles(selectedCategory);
  const { data: tagFilteredArticles, isLoading: isLoadingTagArticles } = useArticlesByTag(selectedTag || "");
  const { data: followedAuthorIds } = useFollowedAuthors(user?.id);

  const displayArticles = selectedTag ? tagFilteredArticles : articles;
  const isLoadingArticles = selectedTag ? isLoadingTagArticles : isLoading;

  const filteredArticles = useMemo(() => {
    if (!displayArticles) return [];
    
    return displayArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [displayArticles, searchQuery]);

  const followedArticles = useMemo(() => {
    if (!followedAuthorIds || followedAuthorIds.length === 0) return [];
    
    return filteredArticles.filter((article) => 
      followedAuthorIds.includes(article.author_id)
    );
  }, [filteredArticles, followedAuthorIds]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <TrendingHero />
      
      <div className="border-b border-border bg-card">
        <CategoryFilter
          categories={PREDEFINED_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setSelectedTag(null);
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
      </div>

      <AdvertisementBanner />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <FeaturedSection />
            
            {user && followedAuthorIds && followedAuthorIds.length > 0 ? (
              <Tabs defaultValue="all">
                <TabsList className="mb-6 bg-muted">
                  <TabsTrigger value="all" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    All Stories
                  </TabsTrigger>
                  <TabsTrigger value="following" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Following ({followedArticles.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {isLoadingArticles ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredArticles && filteredArticles.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          articleId={article.id}
                          title={article.title}
                          description={article.excerpt || ""}
                          category={article.category}
                          date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          source="India Got Startup"
                          sourceUrl={`/article/${article.slug}`}
                          thumbnail={article.featured_image_url || undefined}
                          author={article.profiles?.full_name || "Anonymous"}
                          authorImage={article.profiles?.avatar_url || undefined}
                          readTime={`${article.reading_time} min read`}
                          authorId={article.author_id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-2">No stories yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Be the first to share your startup story! Sign in and start writing.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following">
                  {followedArticles.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {followedArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          articleId={article.id}
                          title={article.title}
                          description={article.excerpt || ""}
                          category={article.category}
                          date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          source="India Got Startup"
                          sourceUrl={`/article/${article.slug}`}
                          thumbnail={article.featured_image_url || undefined}
                          author={article.profiles?.full_name || "Anonymous"}
                          authorImage={article.profiles?.avatar_url || undefined}
                          readTime={`${article.reading_time} min read`}
                          authorId={article.author_id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-2">No articles yet</h3>
                      <p className="text-muted-foreground">
                        Follow authors to see their stories here. Articles from authors you follow will appear in this personalized feed.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <>
                {isLoadingArticles ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredArticles && filteredArticles.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredArticles.map((article) => (
                      <NewsCard
                        key={article.id}
                        articleId={article.id}
                        title={article.title}
                        description={article.excerpt || ""}
                        category={article.category}
                        date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        source="India Got Startup"
                        sourceUrl={`/article/${article.slug}`}
                        thumbnail={article.featured_image_url || undefined}
                        author={article.profiles?.full_name || "Anonymous"}
                        authorImage={article.profiles?.avatar_url || undefined}
                        readTime={`${article.reading_time} min read`}
                        authorId={article.author_id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                    <h3 className="text-xl font-bold mb-2">No stories yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to share your startup story! Sign in and start writing.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <MediaSidebar />
            </div>
          </div>
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default Index;
