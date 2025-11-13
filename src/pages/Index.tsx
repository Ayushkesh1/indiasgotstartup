import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import { mockNews } from "@/data/mockNews";
import { TrendingUp } from "lucide-react";

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
        {filteredNews.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-12">
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
                author={news.author}
                authorImage={news.authorImage}
                readTime={news.readTime}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <h3 className="font-serif text-2xl font-bold mb-2">No stories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse all categories
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
