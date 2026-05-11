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
import CreateGrant from "./CreateGrant";
import CreatorProgram from "./CreatorProgram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Eye, Users, Network, MessageCircle, Send, CheckCircle2, XCircle, PlusCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { EVENTS_DATA } from "@/data/events";

const downloadCSV = (filename: string, rows: any[]) => {
  if (!rows || !rows.length) {
    toast.error("No data to download");
    return;
  }
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);
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

  // If we're going to redirect, don't flash 'Profile not found'
  if (!user) return null;

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-destructive mb-2">Error loading profile</p>
        <p className="text-muted-foreground text-sm">{profileError.message}</p>
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Profile not found for this user account. Try logging out and back in.</p></div>;

  const role = profile.primary_role || 'normal';
  const isStartup = role === 'startup';
  const isIncubator = role === 'incubator';
  const isInvestor = role === 'investor' || role === 'investor_vc';
  const isExpert = role === 'expert';
  const isCreator = role === 'creator';
  const isNormal = role === 'normal';

  const totalViews = articles?.reduce((sum, article) => sum + article.views_count, 0) || 0;
  const publishedCount = articles?.filter((a) => a.published).length || 0;

  const pendingRequests = connections?.filter(c => c.receiver_id === user?.id && c.status === 'pending') || [];
  const acceptedConnections = connections?.filter(c => c.status === 'accepted') || [];

  const handleDownloadEventAttendees = (eventId: string) => {
    const event = EVENTS_DATA.find(e => e.id === eventId);
    if (!event || !event.participants || event.participants.length === 0) {
      toast.error("No attendees found for this event.");
      return;
    }
    
    const rows = event.participants.map(p => ({
      Name: p.name,
      Email: p.name.toLowerCase().replace(' ', '.') + "@example.com", // Mock email
      RoleType: p.role,
      Company: p.company || 'N/A',
      City: p.location,
      RSVP_Status: 'Going',
      RegistrationTime: new Date().toLocaleString()
    }));
    
    downloadCSV(`Attendees_${event.title.replace(/\s+/g, '_')}.csv`, rows);
    toast.success("Download started!");
  };

  const handleDownloadGrantApplicants = () => {
    toast("No applicants yet for this mock grant.");
  };

  // Filter events where user is the organizer (mocked by matching name for simplicity here)
  const myCreatedEvents = EVENTS_DATA.filter(e => e.organizerProfile?.name === profile.full_name || true).slice(0,1);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 max-w-6xl">
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted border border-border rounded-xl flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="network" className="rounded-lg">Network & Chat</TabsTrigger>
            <TabsTrigger value="articles" className="rounded-lg">My Articles</TabsTrigger>
            
            {/* Role-specific tabs */}
            {isStartup && (
              <>
                <TabsTrigger value="my_startup" className="rounded-lg">My Startup</TabsTrigger>
                <TabsTrigger value="startup_updates" className="rounded-lg">Updates</TabsTrigger>
                <TabsTrigger value="hiring" className="rounded-lg">Hiring Posts</TabsTrigger>
              </>
            )}

            {isIncubator && (
              <>
                <TabsTrigger value="my_incubator" className="rounded-lg">My Incubator</TabsTrigger>
                <TabsTrigger value="programs" className="rounded-lg">My Programs</TabsTrigger>
                <TabsTrigger value="grants" className="rounded-lg">My Grants</TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg">My Events</TabsTrigger>
              </>
            )}

            {isInvestor && (
              <>
                <TabsTrigger value="my_investor" className="rounded-lg">My Investor Profile</TabsTrigger>
                <TabsTrigger value="thesis" className="rounded-lg">Investment Thesis</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-lg">Portfolio</TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg">My Events</TabsTrigger>
              </>
            )}

            {isExpert && (
              <>
                <TabsTrigger value="my_expert" className="rounded-lg">My Expert Profile</TabsTrigger>
                <TabsTrigger value="services" className="rounded-lg">My Services</TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg">My Events</TabsTrigger>
              </>
            )}

            {isCreator && (
              <>
                <TabsTrigger value="creator_program" className="rounded-lg">Creator Program</TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg">My Events</TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
              </>
            )}

            {isNormal && (
              <>
                <TabsTrigger value="events" className="rounded-lg">Saved Events</TabsTrigger>
                <TabsTrigger value="applied_grants" className="rounded-lg">Applied Grants</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile <Badge variant="secondary" className="ml-2 uppercase text-xs">{role}</Badge></h1>
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
             {/* ... Network Content (Same as before) ... */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                             <img src={req.sender?.avatar_url || `https://ui-avatars.com/api/?name=${req.sender?.full_name}`} className="h-8 w-8 rounded-full" />
                             <div className="min-w-0">
                               <p className="text-sm font-semibold truncate">{req.sender?.full_name || 'Unknown User'}</p>
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
                       <p className="text-sm text-muted-foreground">No connections yet. Find people to connect with.</p>
                     ) : (
                       acceptedConnections.map(conn => {
                         const otherUser = conn.sender_id === user?.id ? conn.receiver : conn.sender;
                         if (!otherUser) return null;
                         return (
                           <div key={conn.id} 
                             onClick={() => setActiveChatUser(otherUser)}
                             className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeChatUser?.id === otherUser?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 border border-transparent hover:border-border/50'}`}
                           >
                             <img src={otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${otherUser?.full_name}`} className="h-10 w-10 rounded-full" />
                             <div>
                               <p className="text-sm font-semibold">{otherUser?.full_name || 'Unknown User'}</p>
                               <p className="text-xs text-muted-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Chat</p>
                             </div>
                           </div>
                         );
                       })
                     )}
                   </CardContent>
                 </Card>
               </div>
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

          <TabsContent value="events" className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{isNormal ? "Saved & Attending Events" : "My Events"}</h2>
                <p className="text-muted-foreground">Manage your event participation{isNormal ? "." : " and hosting."}</p>
              </div>
              {!isNormal && (
                <Button onClick={() => navigate('/events/create')} className="gap-2">
                  <PlusCircle className="w-4 h-4" /> Create Event
                </Button>
              )}
            </div>
            
            <Tabs defaultValue={isNormal ? "attending" : "created"} className="w-full">
              <TabsList className="mb-6 border-b border-border w-full justify-start rounded-none bg-transparent p-0">
                {!isNormal && <TabsTrigger value="created" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Created</TabsTrigger>}
                <TabsTrigger value="attending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Attending</TabsTrigger>
                <TabsTrigger value="saved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Saved</TabsTrigger>
              </TabsList>
              
              {!isNormal && (
                <TabsContent value="created" className="space-y-4">
                  {myCreatedEvents.map(event => (
                    <Card key={event.id} className="border-border">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                        <Button variant="outline" className="gap-2" onClick={() => handleDownloadEventAttendees(event.id)}>
                          <Download className="w-4 h-4" /> Download Attendee Excel
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {myCreatedEvents.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground">You haven't hosted any events yet.</p>
                    </div>
                  )}
                </TabsContent>
              )}
              <TabsContent value="attending" className="space-y-4">
                <div className="text-center py-10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">You are not attending any events yet.</p>
                  <Button variant="link" onClick={() => navigate('/events')}>Discover Events</Button>
                </div>
              </TabsContent>
              <TabsContent value="saved" className="space-y-4">
                <div className="text-center py-10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No saved events.</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="grants" className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">My Grants</h2>
                <p className="text-muted-foreground">Manage your funding opportunities.</p>
              </div>
              <Button onClick={() => navigate('/grants/create')} className="gap-2">
                <PlusCircle className="w-4 h-4" /> Create Grant
              </Button>
            </div>
            
            <Card className="border-border">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Seed Fund Program 2026</h3>
                  <p className="text-sm text-muted-foreground">Status: Active • Applicants: 12</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={handleDownloadGrantApplicants}>
                  <Download className="w-4 h-4" /> Download Applicants Excel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholders for new RBAC sections */}
          <TabsContent value="my_startup" className="py-10 text-center"><h3 className="text-xl">My Startup Management</h3><p className="text-muted-foreground">Update your startup details here.</p></TabsContent>
          <TabsContent value="startup_updates" className="py-10 text-center"><h3 className="text-xl">Startup Updates</h3><p className="text-muted-foreground">Publish news and updates to your followers.</p></TabsContent>
          <TabsContent value="hiring" className="py-10 text-center"><h3 className="text-xl">Hiring Posts</h3><p className="text-muted-foreground">Manage open roles at your startup.</p></TabsContent>
          <TabsContent value="my_incubator" className="py-10 text-center"><h3 className="text-xl">Incubator Profile</h3><p className="text-muted-foreground">Manage your organization details.</p></TabsContent>
          <TabsContent value="programs" className="py-10 text-center"><h3 className="text-xl">Incubator Programs</h3><p className="text-muted-foreground">Add and manage cohort applications.</p></TabsContent>
          <TabsContent value="my_investor" className="py-10 text-center"><h3 className="text-xl">Investor Profile</h3><p className="text-muted-foreground">Manage your VC/Angel profile.</p></TabsContent>
          <TabsContent value="thesis" className="py-10 text-center"><h3 className="text-xl">Investment Thesis</h3><p className="text-muted-foreground">Share what you are looking to fund.</p></TabsContent>
          <TabsContent value="portfolio" className="py-10 text-center"><h3 className="text-xl">Portfolio Updates</h3><p className="text-muted-foreground">Showcase your successful investments.</p></TabsContent>
          <TabsContent value="my_expert" className="py-10 text-center"><h3 className="text-xl">Expert Profile</h3><p className="text-muted-foreground">Highlight your domain expertise.</p></TabsContent>
          <TabsContent value="services" className="py-10 text-center"><h3 className="text-xl">My Services</h3><p className="text-muted-foreground">Offer mentoring or consulting services.</p></TabsContent>
          
          <TabsContent value="creator_program" className="space-y-8 animate-in fade-in duration-500">
            <CreatorProgram />
          </TabsContent>
          <TabsContent value="analytics" className="py-10 text-center"><h3 className="text-xl">Analytics Dashboard</h3><p className="text-muted-foreground">View your reach and engagement metrics.</p></TabsContent>
          <TabsContent value="applied_grants" className="py-10 text-center"><h3 className="text-xl">Applied Grants</h3><p className="text-muted-foreground">Track the status of your applications.</p></TabsContent>

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
