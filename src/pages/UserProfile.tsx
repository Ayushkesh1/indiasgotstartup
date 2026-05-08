import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useEcosystemList } from "@/hooks/useEcosystem";
import { useConnections, useSendConnection } from "@/hooks/useNetwork";
import Navbar from "@/components/Navbar";
import ArticlesList from "@/components/profile/ArticlesList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserPlus, MessageCircle, Check, Clock } from "lucide-react";
import { toast } from "sonner";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useProfile(id);
  const { data: articles, isLoading: articlesLoading } = useUserArticles(id);
  const { data: startups } = useEcosystemList("startups");
  const { data: incubators } = useEcosystemList("incubators");
  const { data: investors } = useEcosystemList("investors");
  const { data: connections } = useConnections(currentUser?.id);

  const sendConnection = useSendConnection();

  if (profileLoading || articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">User not found</p></div>;

  if (currentUser?.id === id) {
    navigate("/profile");
    return null;
  }

  const publishedCount = articles?.filter((a) => a.published).length || 0;

  let badges = [];
  if (startups?.some(s => s.owner_id === id)) badges.push("Startup Founder");
  if (incubators?.some(i => i.owner_id === id)) badges.push("Incubator");
  if (investors?.some(i => i.owner_id === id)) badges.push("Investor");
  if (publishedCount > 0) badges.push("Writer");
  if (profile.primary_role === 'expert') badges.push("Expert");

  const connection = connections?.find(c => (c.sender_id === id && c.receiver_id === currentUser?.id) || (c.sender_id === currentUser?.id && c.receiver_id === id));
  
  const handleConnect = () => {
    if (!currentUser) return navigate("/auth");
    sendConnection.mutate({ senderId: currentUser.id, receiverId: id! }, {
      onSuccess: () => toast.success("Connection request sent")
    });
  };

  const handleMessage = () => {
    if (!currentUser) return navigate("/auth");
    navigate("/profile"); // The user can message from their profile inbox
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 max-w-4xl">
        <Card className="border-border/50 overflow-hidden mb-8 shadow-md">
          <div className="h-32 bg-primary/10 w-full" />
          <CardContent className="px-6 sm:px-10 pb-8 relative -mt-12">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end mb-6">
              <img 
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&size=200`} 
                alt={profile.full_name || "User"}
                className="w-24 h-24 rounded-full border-4 border-background bg-card object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              <div className="flex gap-3">
                {connection?.status === 'accepted' ? (
                  <>
                    <Button variant="outline" className="gap-2 pointer-events-none"><Check className="h-4 w-4" /> Connected</Button>
                    <Button onClick={handleMessage} className="gap-2"><MessageCircle className="h-4 w-4" /> Message</Button>
                  </>
                ) : connection?.status === 'pending' ? (
                  <Button variant="outline" className="gap-2 pointer-events-none" disabled><Clock className="h-4 w-4" /> Pending</Button>
                ) : (
                  <Button onClick={handleConnect} className="gap-2"><UserPlus className="h-4 w-4" /> Connect</Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map(b => (
                <Badge key={b} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                  {b}
                </Badge>
              ))}
            </div>

            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}
            
            {profile.website_url && (
              <div>
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  {profile.website_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {publishedCount > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Articles by {profile.full_name}</h2>
            <ArticlesList articles={articles?.filter(a => a.published) || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
