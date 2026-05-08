import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, useAllProfiles } from "@/hooks/useProfile";
import { useUserArticles } from "@/hooks/useUserArticles";
import { useFollowerCount, useFollowingCount } from "@/hooks/useFollows";
import { useEcosystemList } from "@/hooks/useEcosystem";
import { useConnections, useUpdateConnection, useMessages, useSendMessage } from "@/hooks/useNetwork";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ArticlesList from "@/components/profile/ArticlesList";
import { RateLimitCounter } from "@/components/profile/RateLimitCounter";
import { SeriesManagement } from "@/components/series/SeriesManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Eye, Users, Network, MessageCircle, Send, CheckCircle2, XCircle } from "lucide-react";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: articles, isLoading: articlesLoading } = useUserArticles(user?.id);
  const { data: followerCount } = useFollowerCount(user?.id);
  const { data: followingCount } = useFollowingCount(user?.id);
  
  const { data: startups } = useEcosystemList("startups");
  const { data: incubators } = useEcosystemList("incubators");
  const { data: investors } = useEcosystemList("investors");

  const { data: allProfiles } = useAllProfiles();

  const { data: connections } = useConnections(user?.id);
  const updateConnection = useUpdateConnection();

  const updateProfile = useUpdateProfile();
  
  const [activeChatUser, setActiveChatUser] = useState<any>(null);

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

  if (!profile) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Profile not found</p></div>;

  const totalViews = articles?.reduce((sum, article) => sum + article.views_count, 0) || 0;
  const publishedCount = articles?.filter((a) => a.published).length || 0;

  let badges = [];
  if (startups?.some(s => s.owner_id === user?.id)) badges.push("Startup Founder");
  if (incubators?.some(i => i.owner_id === user?.id)) badges.push("Incubator");
  if (investors?.some(i => i.owner_id === user?.id)) badges.push("Investor");
  if (publishedCount > 0) badges.push("Writer");
  if (profile.primary_role === 'expert') badges.push("Expert");

  const pendingRequests = connections?.filter(c => c.receiver_id === user?.id && c.status === 'pending') || [];
  const acceptedConnections = connections?.filter(c => c.status === 'accepted') || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 max-w-6xl">
        
        {/* Profile Badges Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {badges.map(b => (
            <Badge key={b} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              {b}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted border border-border rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="network" className="rounded-lg">Network & Chat</TabsTrigger>
            <TabsTrigger value="articles" className="rounded-lg">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-muted-foreground">Manage your identity across the ecosystem.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Articles" value={publishedCount} icon={FileText} />
              <StatCard title="Total Views" value={totalViews} icon={Eye} />
              <StatCard title="Followers" value={followerCount || 0} icon={Users} />
              <StatCard title="Connections" value={acceptedConnections.length} icon={Network} />
            </div>

            {user && <RateLimitCounter userId={user.id} />}

            <ProfileHeader
              profile={profile}
              userId={user?.id || ""}
              onUpdate={(updates) => updateProfile.mutate({ userId: user!.id, updates })}
              isUpdating={updateProfile.isPending}
              isOwnProfile={true}
            />
          </TabsContent>

          <TabsContent value="network" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Connections List */}
              <div className="md:col-span-1 space-y-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Connection Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No pending requests.</p>
                    ) : (
                      pendingRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                          <div className="flex items-center gap-3">
                            <img src={req.sender.avatar_url || `https://ui-avatars.com/api/?name=${req.sender.full_name}`} className="h-8 w-8 rounded-full" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{req.sender.full_name}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500" onClick={() => updateConnection.mutate({ id: req.id, status: 'accepted' })}><CheckCircle2 className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateConnection.mutate({ id: req.id, status: 'rejected' })}><XCircle className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Connections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {acceptedConnections.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No connections yet. Find people in the ecosystem to connect with.</p>
                    ) : (
                      acceptedConnections.map(conn => {
                        const otherUser = conn.sender_id === user?.id ? conn.receiver : conn.sender;
                        return (
                          <div key={conn.id} 
                            onClick={() => setActiveChatUser(otherUser)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeChatUser?.id === otherUser.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 border border-transparent hover:border-border/50'}`}
                          >
                            <img src={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${otherUser.full_name}`} className="h-10 w-10 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold">{otherUser.full_name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Chat</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Discover People</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {allProfiles?.filter(p => p.id !== user?.id).slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                          <img src={p.avatar_url || `https://ui-avatars.com/api/?name=${p.full_name}`} className="h-8 w-8 rounded-full" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate cursor-pointer hover:text-primary transition-colors" onClick={() => window.open(`/user/${p.id}`, "_blank")}>{p.full_name}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => window.open(`/user/${p.id}`, "_blank")}>View Profile</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Window */}
              <div className="md:col-span-2">
                <Card className="h-[600px] flex flex-col border-border/50">
                  {activeChatUser ? (
                    <ChatWindow currentUser={user} otherUser={activeChatUser} />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                      <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                      <p>Select a connection to start messaging.</p>
                    </div>
                  )}
                </Card>
              </div>

            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-8 animate-in fade-in duration-500">
            <SeriesManagement />
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Articles</h2>
              <ArticlesList articles={articles || []} />
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: any }) => (
  <Card className="border-border/50 shadow-sm">
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ChatWindow = ({ currentUser, otherUser }: { currentUser: any, otherUser: any }) => {
  const { data: messages } = useMessages(currentUser.id, otherUser.id);
  const sendMessage = useSendMessage();
  const [content, setContent] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessage.mutate({ senderId: currentUser.id, receiverId: otherUser.id, content });
    setContent("");
  };

  return (
    <>
      <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-3">
        <img src={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${otherUser.full_name}`} className="h-10 w-10 rounded-full" />
        <div>
          <h3 className="font-semibold">{otherUser.full_name}</h3>
          <p className="text-xs text-primary cursor-pointer hover:underline" onClick={() => window.open(`/user/${otherUser.id}`, "_blank")}>View Profile</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map(msg => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-border/50 bg-background flex gap-2">
        <Input value={content} onChange={e => setContent(e.target.value)} placeholder="Type a message..." className="flex-1" />
        <Button type="submit" size="icon" disabled={!content.trim() || sendMessage.isPending}><Send className="h-4 w-4" /></Button>
      </form>
    </>
  );
};

export default Profile;
