import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useFollowerCount, useFollowingCount } from "@/hooks/useFollows";
import Navbar from "@/components/Navbar";
import FollowButton from "@/components/FollowButton";
import NewsCard from "@/components/NewsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, FileText, Users, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile(id);
  const { data: articles, isLoading: articlesLoading } = useUserArticles(id);
  const { data: followerCount } = useFollowerCount(id);
  const { data: followingCount } = useFollowingCount(id);

  // Redirect to own profile if viewing your own author page
  useEffect(() => {
    if (user?.id === id) {
      navigate("/profile");
    }
  }, [user, id, navigate]);

  if (profileLoading || articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <h1 className="font-serif text-3xl font-bold mb-4">Author Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The author profile you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const publishedArticles = articles?.filter((a) => a.published) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Author Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.full_name?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="font-serif text-3xl font-bold mb-1">
                        {profile.full_name || "Anonymous Author"}
                      </h1>
                      <p className="text-muted-foreground">
                        {publishedArticles.length} {publishedArticles.length === 1 ? "article" : "articles"} published
                      </p>
                    </div>
                    <FollowButton authorId={id!} size="default" />
                  </div>

                  {profile.bio && (
                    <p className="text-foreground leading-relaxed">{profile.bio}</p>
                  )}

                  <div className="flex gap-4">
                    {profile.twitter_handle && (
                      <a
                        href={`https://twitter.com/${profile.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedArticles.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Published stories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followerCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  People following
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Following</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followingCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Authors followed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Articles Section */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Published Articles</h2>
            {publishedArticles.length > 0 ? (
              <div className="space-y-8">
                {publishedArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    articleId={article.id}
                    title={article.title}
                    description={article.excerpt || ""}
                    category={article.category}
                    date={new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    source="India Got Startup"
                    sourceUrl={`/article/${article.slug}`}
                    thumbnail={article.featured_image_url || undefined}
                    author={profile.full_name || "Anonymous"}
                    authorImage={profile.avatar_url || undefined}
                    readTime={`${article.reading_time} min read`}
                    authorId={id}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground">
                    This author hasn't published any articles yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
