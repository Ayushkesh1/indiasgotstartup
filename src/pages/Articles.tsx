import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useArticles } from "@/hooks/useArticles";
import NewsCard from "@/components/NewsCard";
import { FileText, Loader2 } from "lucide-react";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: articles, isLoading } = useArticles();

  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full">
      <Helmet>
        <title>Latest Articles & Stories | India's Got Startup</title>
      </Helmet>

      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold tracking-wider uppercase text-sm">
            <FileText className="h-5 w-5" /> All Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Latest Insights & News</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Read the latest happenings, deep-dives, and founder stories from across the Indian startup ecosystem.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
                articleId={article.id}
                title={article.title}
                description={article.excerpt || ""}
                category={article.category}
                date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                source="India's Got Startup"
                sourceUrl={`/article/${article.slug}`}
                thumbnail={article.featured_image_url || undefined}
                author={article.profiles?.full_name || "Editorial Team"}
                authorId={article.author_id}
                authorImage={article.profiles?.avatar_url || undefined}
                readTime={`${article.reading_time || 5} min read`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border/50 rounded-2xl bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        )}
      </main>

      
    </div>
  );
};

export default Articles;
