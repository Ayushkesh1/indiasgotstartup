import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useUserAdvertisements,
  useCreateAdvertisement,
  useUpdateAdvertisement,
  useDeleteAdvertisement,
  Advertisement,
} from "@/hooks/useAdvertisements";
import Navbar from "@/components/Navbar";
import AdForm from "@/components/ads/AdForm";
import AdAnalytics from "@/components/ads/AdAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Megaphone,
  Eye,
  MousePointer,
  IndianRupee,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  MoreHorizontal,
  Pause,
  Play,
  ExternalLink,
  PieChart,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const AdsManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: ads, isLoading: adsLoading } = useUserAdvertisements(user?.id);
  const createAd = useCreateAdvertisement();
  const updateAd = useUpdateAdvertisement();
  const deleteAd = useDeleteAdvertisement();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | undefined>();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Calculate metrics
  const totalImpressions = ads?.reduce((sum, ad) => sum + ad.impressions, 0) || 0;
  const totalClicks = ads?.reduce((sum, ad) => sum + ad.clicks, 0) || 0;
  const totalSpend = ads?.reduce((sum, ad) => sum + ad.bid_amount, 0) || 0;
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const activeAds = ads?.filter(ad => ad.is_active).length || 0;

  const handleCreate = (data: any) => {
    createAd.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
        toast({
          title: "Campaign created",
          description: "Your ad campaign is now live",
        });
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingAd) return;
    updateAd.mutate(
      { id: editingAd.id, updates: data },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingAd(undefined);
          toast({
            title: "Campaign updated",
            description: "Your changes have been saved",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteAd.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Campaign deleted",
          description: "The ad campaign has been removed",
        });
      },
    });
  };

  const handleToggleStatus = (ad: Advertisement) => {
    updateAd.mutate(
      { id: ad.id, updates: { is_active: !ad.is_active } },
      {
        onSuccess: () => {
          toast({
            title: ad.is_active ? "Campaign paused" : "Campaign activated",
            description: ad.is_active 
              ? "Your ad is now paused" 
              : "Your ad is now running",
          });
        },
      }
    );
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingAd(undefined);
  };

  if (authLoading || adsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Megaphone className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Ad Campaigns</h1>
                <p className="text-muted-foreground">
                  Manage your advertising campaigns and track performance
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingAd(undefined)} className="gap-2 shadow-md">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    {editingAd ? "Edit Campaign" : "Create New Campaign"}
                  </DialogTitle>
                </DialogHeader>
                <AdForm
                  userId={user?.id || ""}
                  ad={editingAd}
                  onSubmit={editingAd ? handleUpdate : handleCreate}
                  isSubmitting={createAd.isPending || updateAd.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <Badge variant="secondary" className="text-xs">Impressions</Badge>
                </div>
                <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total views</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <MousePointer className="h-5 w-5 text-green-500" />
                  <Badge variant="secondary" className="text-xs">Clicks</Badge>
                </div>
                <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total clicks</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <Badge variant="secondary" className="text-xs">CTR</Badge>
                </div>
                <p className="text-3xl font-bold">{avgCtr}%</p>
                <p className="text-sm text-muted-foreground">Click-through rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <IndianRupee className="h-5 w-5 text-orange-500" />
                  <Badge variant="secondary" className="text-xs">Spend</Badge>
                </div>
                <p className="text-3xl font-bold">₹{totalSpend.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total budget</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="bg-muted/50 p-1 mb-6">
              <TabsTrigger value="campaigns" className="gap-2 data-[state=active]:bg-background">
                <Target className="h-4 w-4" />
                Campaigns ({ads?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-background">
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns">
              {ads && ads.length > 0 ? (
                <div className="space-y-4">
                  {ads.map((ad) => {
                    const adCtr = ad.impressions > 0 
                      ? ((ad.clicks / ad.impressions) * 100).toFixed(2) 
                      : "0.00";
                    const maxImpressions = Math.max(...ads.map(a => a.impressions), 1);
                    const performancePercent = (ad.impressions / maxImpressions) * 100;

                    return (
                      <Card 
                        key={ad.id} 
                        className={`overflow-hidden transition-all hover:shadow-md ${
                          ad.is_active ? 'border-l-4 border-l-success' : 'border-l-4 border-l-muted opacity-75'
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Ad Preview */}
                            <div className="flex-shrink-0">
                              <div className="relative group">
                                <img
                                  src={ad.image_url}
                                  alt={ad.title}
                                  className="h-28 w-40 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => window.open(ad.link_url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Ad Info */}
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg truncate">
                                      {ad.title}
                                    </h3>
                                    <Badge 
                                      variant={ad.is_active ? "default" : "secondary"}
                                      className={ad.is_active ? "bg-success/10 text-success border-success/20" : ""}
                                    >
                                      {ad.is_active ? (
                                        <><Activity className="h-3 w-3 mr-1" /> Active</>
                                      ) : (
                                        <><Pause className="h-3 w-3 mr-1" /> Paused</>
                                      )}
                                    </Badge>
                                  </div>
                                  {ad.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {ad.description}
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleEdit(ad)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Campaign
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(ad)}>
                                      {ad.is_active ? (
                                        <><Pause className="h-4 w-4 mr-2" /> Pause Campaign</>
                                      ) : (
                                        <><Play className="h-4 w-4 mr-2" /> Activate Campaign</>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          onSelect={(e) => e.preventDefault()}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Campaign
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your 
                                            ad campaign and all its analytics data.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDelete(ad.id)}
                                            className="bg-destructive hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Impressions</p>
                                  <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                                  <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">CTR</p>
                                  <p className="font-semibold">{adCtr}%</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground mb-1">Budget</p>
                                  <p className="font-semibold">₹{ad.bid_amount.toFixed(0)}</p>
                                </div>
                              </div>

                              {/* Performance Bar */}
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Performance</span>
                                  <span>{performancePercent.toFixed(0)}% of top performer</span>
                                </div>
                                <Progress value={performancePercent} className="h-2" />
                              </div>

                              {/* Date Range */}
                              {(ad.start_date || ad.end_date) && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {ad.start_date && (
                                    <span>
                                      Start: {new Date(ad.start_date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {ad.start_date && ad.end_date && <span>•</span>}
                                  {ad.end_date && (
                                    <span>
                                      End: {new Date(ad.end_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/30 rounded-2xl">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6">
                    <Megaphone className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your first advertising campaign to start reaching your target audience
                  </p>
                  <Button onClick={() => setDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              {ads && ads.length > 0 ? (
                <AdAnalytics ads={ads} />
              ) : (
                <div className="text-center py-20 bg-muted/30 rounded-2xl">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No analytics data</h3>
                  <p className="text-muted-foreground">
                    Create campaigns to start tracking performance
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Tips */}
          {(!ads || ads.length === 0) && (
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
                <CardContent className="p-5">
                  <Target className="h-8 w-8 text-blue-500 mb-3" />
                  <h4 className="font-semibold mb-2">Define Your Audience</h4>
                  <p className="text-sm text-muted-foreground">
                    Set clear targeting to reach the right readers for your brand
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
                <CardContent className="p-5">
                  <BarChart3 className="h-8 w-8 text-green-500 mb-3" />
                  <h4 className="font-semibold mb-2">Track Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor impressions, clicks, and CTR to optimize your campaigns
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
                <CardContent className="p-5">
                  <Zap className="h-8 w-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold mb-2">Optimize Budget</h4>
                  <p className="text-sm text-muted-foreground">
                    Set competitive bids and adjust based on performance data
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;