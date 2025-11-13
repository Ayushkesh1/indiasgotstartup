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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, BarChart3 } from "lucide-react";

const AdsManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
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

  const handleCreate = (data: any) => {
    createAd.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
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
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    deleteAd.mutate(id);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">Ad Management</h1>
              <p className="text-muted-foreground">
                Create and manage your advertisement campaigns
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingAd(undefined)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAd ? "Edit Advertisement" : "Create New Advertisement"}
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">
                <BarChart3 className="h-4 w-4 mr-2" />
                All Ads ({ads?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {ads && ads.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {ads.map((ad) => (
                    <Card key={ad.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4 flex-1">
                            <img
                              src={ad.image_url}
                              alt={ad.title}
                              className="h-24 w-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{ad.title}</h3>
                                <Badge variant={ad.is_active ? "default" : "secondary"}>
                                  {ad.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {ad.description && (
                                <p className="text-sm text-muted-foreground">
                                  {ad.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>Bid: ₹{ad.bid_amount.toFixed(2)}</span>
                                <span>Impressions: {ad.impressions.toLocaleString()}</span>
                                <span>Clicks: {ad.clicks.toLocaleString()}</span>
                                <span>
                                  CTR:{" "}
                                  {ad.impressions > 0
                                    ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
                                    : "0.00"}
                                  %
                                </span>
                              </div>
                              {(ad.start_date || ad.end_date) && (
                                <div className="text-xs text-muted-foreground">
                                  {ad.start_date && (
                                    <span>
                                      Start: {new Date(ad.start_date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {ad.start_date && ad.end_date && " • "}
                                  {ad.end_date && (
                                    <span>
                                      End: {new Date(ad.end_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(ad)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(ad.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">
                    No advertisements yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first ad to start promoting your brand
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Ad
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {ads && ads.length > 0 ? (
                <AdAnalytics ads={ads} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Create ads to see analytics
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;
