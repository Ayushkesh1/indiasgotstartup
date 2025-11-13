import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserSeries, useCreateSeries } from "@/hooks/useSeries";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SeriesManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: series, isLoading } = useUserSeries(user?.id);
  const createSeries = useCreateSeries();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    createSeries.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        authorId: user.id,
      },
      {
        onSuccess: () => {
          toast.success("Series created successfully");
          setTitle("");
          setDescription("");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to create series");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Article Series</h1>
            <p className="text-muted-foreground">
              Group related articles into series for better organization
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Series
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Series</DialogTitle>
                <DialogDescription>
                  Create a collection to group related articles together
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Startup Founder Stories"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this series is about..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createSeries.isPending || !title.trim()}
                  className="w-full"
                >
                  {createSeries.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Series"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : series && series.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <Card
                key={s.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/series/${s.slug}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                      {s.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't created any series yet
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Your First Series
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
