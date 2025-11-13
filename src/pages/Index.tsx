import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import { useArticles, ArticleCategory } from "@/hooks/useArticles";
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
  const { user } = useAuth();
  
  const { data: articles, isLoading } = useArticles(selectedCategory);
  const { data: followedAuthorIds } = useFollowedAuthors(user?.id);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [articles, searchQuery]);

  const followedArticles = useMemo(() => {
    if (!followedAuthorIds || followedAuthorIds.length === 0) return [];
    
    return filteredArticles.filter((article) => 
      followedAuthorIds.includes(article.author_id)
    );
  }, [filteredArticles, followedAuthorIds]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={PREDEFINED_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <AdvertisementBanner />

      {/* Featured Banner */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">TRENDING ON INDIA GOT STARTUP</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 max-w-4xl leading-tight">
            Stories of Indian entrepreneurship, innovation, and the people building tomorrow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover the untold stories of founders, insights from industry leaders, and deep dives into India's most exciting startups.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user && followedAuthorIds && followedAuthorIds.length > 0 ? (
          <Tabs defaultValue="all" className="max-w-4xl mx-auto">
            <TabsList className="mb-8">
              <TabsTrigger value="all">
                <TrendingUp className="h-4 w-4 mr-2" />
                All Stories
              </TabsTrigger>
              <TabsTrigger value="following">
                <Heart className="h-4 w-4 mr-2" />
                Following ({followedArticles.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredArticles && filteredArticles.length > 0 ? (
                <div className="space-y-12">
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
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                  <h3 className="font-serif text-2xl font-bold mb-2">No stories yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to share your startup story! Sign in and start writing.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="following">
              {followedArticles.length > 0 ? (
                <div className="space-y-12">
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
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground">
                    Follow authors to see their stories here. Articles from authors you follow will appear in this personalized feed.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredArticles && filteredArticles.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-12">
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
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-bold mb-2">No stories yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your startup story! Sign in and start writing.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border bg-background mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">India Got Startup</h3>
              <p className="text-sm text-muted-foreground">
                Telling the stories that matter in Indian entrepreneurship.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Discover</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Featured stories</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Top writers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Topics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 India Got Startup. Celebrating Indian entrepreneurship.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
