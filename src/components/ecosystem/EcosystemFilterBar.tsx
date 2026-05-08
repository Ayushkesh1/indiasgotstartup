import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ListFilters } from "@/hooks/useEcosystem";

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan",
  "Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

const SECTORS = [
  "Agritech","AI/ML","Biotech","Cleantech","D2C","Edtech","Fintech","Foodtech","Gaming","Healthtech",
  "HRtech","Insurtech","IoT","Legaltech","Logistics","Manufacturing","Marketplace","Mediatech","Mobility",
  "Proptech","Retail","SaaS","Spacetech","Sports","Travel","Web3",
];

const STAGES = ["idea","pre_seed","seed","series_a","series_b","series_c","growth","public"];

interface Props {
  variant: "startups" | "incubators" | "investors";
  filters: ListFilters;
  onChange: (next: ListFilters) => void;
  totalCount?: number;
  shownCount?: number;
}

const TABS: Record<Props["variant"], { id: string; label: string }[]> = {
  startups: [
    { id: "find", label: "Find Startups by" },
    { id: "background", label: "Startup Background" },
    { id: "traction", label: "Traction & Funding" },
    { id: "team", label: "Team & Hiring" },
  ],
  incubators: [
    { id: "find", label: "Find Incubators by" },
    { id: "background", label: "Incubator Background" },
    { id: "supported", label: "Startups Supported" },
    { id: "performance", label: "Incubator Performance" },
  ],
  investors: [
    { id: "find", label: "Find Investors by" },
    { id: "background", label: "Investor Background" },
    { id: "thesis", label: "Investment Thesis" },
    { id: "portfolio", label: "Portfolio" },
  ],
};

export function EcosystemFilterBar({ variant, filters, onChange, totalCount, shownCount }: Props) {
  const [tab, setTab] = useState<string>(TABS[variant][0].id);
  const tabs = TABS[variant];
  const set = (patch: Partial<ListFilters>) => onChange({ ...filters, ...patch });
  const reset = () => onChange({});
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "" && v !== false);

  const placeholder =
    variant === "incubators"
      ? "Eg. IITM, Hyderabad, Artificial Intelligence"
      : variant === "investors"
        ? "Eg. Sequoia, Bangalore, Fintech"
        : "Eg. Razorpay, Mumbai, SaaS";

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={filters.search || ""}
          onChange={(e) => set({ search: e.target.value })}
          className="pl-11 h-11 bg-muted/40 border-border/40"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border/50">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2 text-sm font-medium transition-colors relative ${
              tab === t.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Filter chips card */}
      <Card className="p-4 bg-card/40 border-border/40">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tab === "find" && (
            <>
              <FilterSelect
                label="State"
                value={filters.state}
                onChange={(v) => set({ state: v })}
                options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              />
              <FilterInput
                label="City"
                value={filters.city || ""}
                onChange={(v) => set({ city: v || undefined })}
              />
              {variant !== "investors" && (
                <FilterSelect
                  label="Sector"
                  value={filters.sector}
                  onChange={(v) => set({ sector: v })}
                  options={SECTORS.map((s) => ({ value: s, label: s }))}
                />
              )}
              {variant === "startups" && (
                <FilterSelect
                  label="Stage"
                  value={filters.stage}
                  onChange={(v) => set({ stage: v })}
                  options={STAGES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
                />
              )}
              {variant === "incubators" && (
                <FilterSelect
                  label="Host Organisation Type"
                  value={filters.type}
                  onChange={(v) => set({ type: v })}
                  options={["university","government","private","corporate","accelerator","csr"].map((t) => ({ value: t, label: t }))}
                />
              )}
              {variant === "investors" && (
                <FilterSelect
                  label="Investor Type"
                  value={filters.type}
                  onChange={(v) => set({ type: v })}
                  options={["angel","vc","micro_vc","corporate_vc","family_office","accelerator"].map((t) => ({ value: t, label: t.replace(/_/g, " ") }))}
                />
              )}
            </>
          )}

          {tab !== "find" && variant === "startups" && (
            <>
              {tab === "team" && (
                <div className="flex items-center gap-2 px-3 h-10 rounded-md border border-border/40 bg-background col-span-2">
                  <Switch id="hiring" checked={!!filters.isHiring} onCheckedChange={(v) => set({ isHiring: v })} />
                  <Label htmlFor="hiring" className="text-sm cursor-pointer">Currently hiring</Label>
                </div>
              )}
              {tab !== "team" && (
                <p className="text-xs text-muted-foreground col-span-full">More filters coming soon for this group.</p>
              )}
            </>
          )}

          {tab !== "find" && variant !== "startups" && (
            <p className="text-xs text-muted-foreground col-span-full">More filters coming soon for this group.</p>
          )}
        </div>
      </Card>

      {/* Result count + reset */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          {typeof shownCount === "number" && typeof totalCount === "number"
            ? <>Showing <span className="font-semibold text-foreground">{shownCount}</span> out of <span className="font-semibold text-foreground">{totalCount}</span> {variant}</>
            : ""}
        </p>
        <div className="flex gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-9">
              <X className="h-4 w-4 mr-1" />Clear
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onChange({ ...filters })} className="h-9 gap-1.5">
            <RotateCw className="h-3.5 w-3.5" />Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? undefined : v)}>
      <SelectTrigger className="h-10 bg-background border-border/40 text-sm">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="capitalize">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 bg-background border-border/40 text-sm"
    />
  );
}
