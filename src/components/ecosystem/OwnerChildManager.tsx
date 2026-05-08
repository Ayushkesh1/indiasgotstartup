import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useAddChildRow, useDeleteChildRow, type ChildTable } from "@/hooks/useEcosystem";

interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url";
  required?: boolean;
  placeholder?: string;
}

interface Props {
  title: string;
  table: ChildTable;
  parentKey: string;
  parentId: string;
  rows: any[];
  fields: FieldDef[];
  renderRow: (row: any) => React.ReactNode;
}

export function OwnerChildManager({ title, table, parentKey, parentId, rows, fields, renderRow }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const add = useAddChildRow(table, parentKey, parentId);
  const remove = useDeleteChildRow(table, parentId);

  const reset = () => { setForm({}); setOpen(false); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {};
    fields.forEach((f) => { if (form[f.name]) payload[f.name] = form[f.name]; });
    if (!payload.name) return;
    await add.mutateAsync(payload);
    reset();
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)} className="gap-1.5">
          <Plus className="h-4 w-4" />{open ? "Cancel" : `Add ${title.replace(/s$/, "")}`}
        </Button>
      </div>

      {open && (
        <Card className="p-4 mb-4">
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.name} rows={3} value={form[f.name] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder} />
                ) : (
                  <Input id={f.name} type={f.type === "url" ? "url" : "text"} required={f.required} value={form[f.name] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder} />
                )}
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" size="sm" disabled={add.isPending}>{add.isPending ? "Saving..." : "Save"}</Button>
              <Button type="button" size="sm" variant="ghost" onClick={reset}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">None added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row) => (
            <div key={row.id} className="relative group">
              {renderRow(row)}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-7 w-7"
                onClick={() => { if (confirm(`Remove ${row.name}?`)) remove.mutate(row.id); }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
