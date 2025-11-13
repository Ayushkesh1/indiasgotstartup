import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import { mockNews } from "@/data/mockNews";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return Array.from(new Set(mockNews.map((news) => news.category)));
  }, []);

  const filteredNews = useMemo(() => {
    return mockNews.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen gradient-subtle">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Latest Updates</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Startup News Aggregator
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated startup news, funding rounds, product launches, and tech announcements
          </p>
        </div>
      </header>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                description={news.description}
                category={news.category}
                date={news.date}
                source={news.source}
                sourceUrl={news.sourceUrl}
                thumbnail={news.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No news found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>© 2024 StartupPulse. Curating the best startup news from around the web.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
