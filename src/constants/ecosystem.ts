export const ECOSYSTEM_STAGES = [
  { label: "Ideation", value: "idea" },
  { label: "Prototype / MVP", value: "pre_seed" },
  { label: "Early Traction", value: "seed" },
  { label: "Revenue / Series A", value: "series_a" },
  { label: "Growth / Series B", value: "series_b" },
  { label: "Expansion / Series C+", value: "series_c" },
  { label: "Late Stage / Growth", value: "growth" },
  { label: "Public / IPO", value: "public" },
] as const;

export const GET_STAGE_LABEL = (value: string) => {
  return ECOSYSTEM_STAGES.find(s => s.value === value)?.label || value;
};
