import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEcosystemList, useUpdateEntity, useDeleteEntity, type EcosystemEntity } from "@/hooks/useEcosystem";
import { Check, X, Star, BadgeCheck, Trash2, ExternalLink } from "lucide-react";

function EntityTable({ entity }: { entity: EcosystemEntity }) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const { data, isLoading } = useEcosystemList(entity, { status });
  const update = useUpdateEntity(entity);
  const remove = useDeleteEntity(entity);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["pending","approved","rejected","all"] as const).map((s) => (
          <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)} className="capitalize">{s}</Button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No entries.</p>
      ) : (
        <div className="space-y-2">
          {data.map((item: any) => (
            <Card key={item.id} className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-muted shrink-0 overflow-hidden">
                {item.logo_url && <img src={item.logo_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{item.name}</p>
                  {item.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  <Badge variant={item.status === "approved" ? "default" : item.status === "pending" ? "secondary" : "destructive"} className="text-xs">{item.status}</Badge>
                  {item.is_featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.tagline || item.slug}</p>
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
                <Button size="icon" variant="ghost" title={item.is_verified ? "Unverify" : "Verify"} onClick={() => update.mutate({ id: item.id, is_verified: !item.is_verified })}><BadgeCheck className={`h-4 w-4 ${item.is_verified ? "text-primary" : ""}`} /></Button>
                <Button size="icon" variant="ghost" title={item.is_featured ? "Unfeature" : "Feature"} onClick={() => update.mutate({ id: item.id, is_featured: !item.is_featured })}><Star className={`h-4 w-4 ${item.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} /></Button>
                <Button size="icon" variant="ghost" title="Delete" onClick={() => { if (confirm(`Delete ${item.name}?`)) remove.mutate(item.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        <p className="text-muted-foreground text-sm">Approve, verify, feature, or remove startup, incubator, and investor listings.</p>
      </div>
      <Tabs defaultValue="startups">
        <TabsList>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="incubators">Incubators</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
        </TabsList>
        <TabsContent value="startups" className="mt-4"><EntityTable entity="startups" /></TabsContent>
        <TabsContent value="incubators" className="mt-4"><EntityTable entity="incubators" /></TabsContent>
        <TabsContent value="investors" className="mt-4"><EntityTable entity="investors" /></TabsContent>
      </Tabs>
    </div>
  );
}
