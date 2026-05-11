import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEcosystemList, useUpdateEntity, useDeleteEntity, type EcosystemEntity } from "@/hooks/useEcosystem";
import { Check, X, Star, BadgeCheck, Trash2, ExternalLink, Plus, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useNavigate } from "react-router-dom";

const SUBMIT_ROUTES: Record<EcosystemEntity, string> = {
  startups: '/startups/submit',
  incubators: '/incubators/submit',
  investors: '/investors/submit',
  grants: '/grants/create',
  events: '/events/create',
};

function EntityTable({ entity }: { entity: EcosystemEntity }) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const { data, isLoading, refetch } = useEcosystemList(entity, { status });
  const update = useUpdateEntity(entity);
  const remove = useDeleteEntity(entity);
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(["pending","approved","rejected","all"] as const).map((s) => (
            <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)} className="capitalize">{s}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => exportToCSV(data || [], `${entity}_export.csv`)} disabled={!data || data.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => navigate(SUBMIT_ROUTES[entity])}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No entries.</p>
      ) : (
        <div className="space-y-2">
          {data.map((item: any) => (
            <Card key={item.id} className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                {item.logo_url || item.banner_url || item.image_url ? (
                  <img src={item.logo_url || item.banner_url || item.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center">No Img</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{item.name || item.title || "Unnamed"}</p>
                  {item.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  <Badge variant={item.status === "approved" ? "default" : item.status === "pending" ? "secondary" : "destructive"} className="text-xs">{item.status}</Badge>
                  {item.is_featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.tagline || item.description || item.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" asChild title="View">
                  <a href={`/${entity}/${item.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                </Button>
                {item.status !== "approved" && (
                  <Button size="icon" variant="ghost" title="Approve" onClick={() => update.mutate({ id: item.id, status: "approved" })}><Check className="h-4 w-4 text-emerald-500" /></Button>
                )}
                {item.status !== "rejected" && (
                  <Button size="icon" variant="ghost" title="Reject" onClick={() => update.mutate({ id: item.id, status: "rejected" })}><X className="h-4 w-4 text-destructive" /></Button>
                )}
                {item.is_verified !== undefined && (
                  <Button size="icon" variant="ghost" title={item.is_verified ? "Unverify" : "Verify"} onClick={() => update.mutate({ id: item.id, is_verified: !item.is_verified })}><BadgeCheck className={`h-4 w-4 ${item.is_verified ? "text-primary" : ""}`} /></Button>
                )}
                {item.is_featured !== undefined && (
                  <Button size="icon" variant="ghost" title={item.is_featured ? "Unfeature" : "Feature"} onClick={() => update.mutate({ id: item.id, is_featured: !item.is_featured })}><Star className={`h-4 w-4 ${item.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} /></Button>
                )}
                <Button size="icon" variant="ghost" title="Delete" onClick={() => { if (confirm(`Delete ${item.name || item.title}?`)) remove.mutate(item.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function EcosystemManagement() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Ecosystem Management</h2>
        <p className="text-muted-foreground text-sm">Approve, verify, feature, or remove ecosystem listings including startups, incubators, investors, grants, and events.</p>
      </div>
      <Tabs defaultValue="startups">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="incubators">Incubators</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="startups" className="mt-4"><EntityTable entity="startups" /></TabsContent>
        <TabsContent value="incubators" className="mt-4"><EntityTable entity="incubators" /></TabsContent>
        <TabsContent value="investors" className="mt-4"><EntityTable entity="investors" /></TabsContent>
        <TabsContent value="grants" className="mt-4"><EntityTable entity="grants" /></TabsContent>
        <TabsContent value="events" className="mt-4"><EntityTable entity="events" /></TabsContent>
      </Tabs>
    </div>
  );
}
