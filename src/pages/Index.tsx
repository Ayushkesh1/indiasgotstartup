import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import { useArticles } from "@/hooks/useArticles";
import { TrendingUp, Loader2 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: articles, isLoading } = useArticles(selectedCategory);

  const categories = useMemo(() => {
    if (!articles) return [];
    return Array.from(new Set(articles.map((article) => article.category)));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [articles, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

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
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
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
