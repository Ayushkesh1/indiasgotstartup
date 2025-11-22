import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useFollowerCount, useFollowingCount } from "@/hooks/useFollows";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ArticlesList from "@/components/profile/ArticlesList";
import { RateLimitCounter } from "@/components/profile/RateLimitCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Eye, TrendingUp, Users } from "lucide-react";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: articles, isLoading: articlesLoading } = useUserArticles(user?.id);
  const { data: followerCount } = useFollowerCount(user?.id);
  const { data: followingCount } = useFollowingCount(user?.id);
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading || articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const totalViews = articles?.reduce((sum, article) => sum + article.views_count, 0) || 0;
  const publishedCount = articles?.filter((a) => a.published).length || 0;
  const draftCount = articles?.filter((a) => !a.published).length || 0;

  const handleUpdateProfile = (updates: any) => {
    if (user?.id) {
      updateProfile.mutate({ userId: user.id, updates });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information and view your articles
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {draftCount} drafts in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all articles
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
                  People following you
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
                  Per published article
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limit Counter */}
          {user && <RateLimitCounter userId={user.id} />}

          {/* Profile Information */}
          <ProfileHeader
            profile={profile}
            userId={user?.id || ""}
            onUpdate={handleUpdateProfile}
            isUpdating={updateProfile.isPending}
            isOwnProfile={true}
          />

          {/* Articles List */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Your Articles</h2>
            <ArticlesList articles={articles || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
