import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { useAdvancedSearch, SearchFilters } from "@/hooks/useAdvancedSearch";
import { useTags } from "@/hooks/useTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { ArticleCategory } from "@/hooks/useArticles";

const CATEGORIES: ArticleCategory[] = [
  "Fintech",
  "Tech",
  "Blockchain",
  "eCommerce",
  "Government",
  "Edtech",
  "Funding",
  "Mobility",
];

export default function AdvancedSearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    sortBy: "newest",
  });

  const { data: tags } = useTags();
  const { data: results, isLoading } = useAdvancedSearch(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Search className="h-8 w-8" />
            Advanced Search
          </h1>
          <p className="text-muted-foreground">
            Find articles with advanced filters and sorting options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-query">Search Query</Label>
                <Input
                  id="search-query"
                  placeholder="Enter keywords..."
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category || "All"}
                  onValueChange={(value) =>
                    updateFilter("category", value === "All" ? undefined : value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tags && tags.length > 0 && (
                <div>
                  <Label htmlFor="tag">Tag</Label>
                  <Select
                    value={filters.tagSlug || "all"}
                    onValueChange={(value) =>
                      updateFilter("tagSlug", value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger id="tag">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.slug}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => updateFilter("startDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => updateFilter("endDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => updateFilter("sortBy", value)}
                >
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most_viewed">Most Viewed</SelectItem>
                    <SelectItem value="most_popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    query: "",
                    sortBy: "newest",
                  })
                }
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-8">
                <p className="text-muted-foreground">
                  Found {results.length} article{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    description={article.excerpt || ""}
                    category={article.category}
                    date={new Date(article.published_at || article.created_at).toLocaleDateString()}
                    source={article.profiles.full_name || "Anonymous"}
                    sourceUrl={`/article/${article.slug}`}
                    thumbnail={article.featured_image_url || undefined}
                    author={article.profiles.full_name || "Anonymous"}
                    authorImage={article.profiles.avatar_url || undefined}
                    readTime={`${article.reading_time} min read`}
                    articleId={article.id}
                    authorId={article.author_id}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found matching your filters</p>
                  <Button variant="link" onClick={() => navigate("/")}>
                    Browse all articles
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
