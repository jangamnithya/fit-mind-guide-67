import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  progress: number; // 0-100
  tone?: "primary" | "accent" | "warning";
}

const toneMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", bar: "bg-gradient-primary" },
  accent: { bg: "bg-accent/10", text: "text-accent", bar: "bg-gradient-accent" },
  warning: { bg: "bg-warning/15", text: "text-warning", bar: "bg-warning" },
};

export function StatCard({ icon: Icon, label, value, unit, progress, tone = "primary" }: Props) {
  const t = toneMap[tone];
  return (
    <div className="bg-card rounded-3xl p-5 shadow-soft border border-border/50 hover:shadow-elegant transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("size-11 rounded-2xl flex items-center justify-center", t.bg)}>
          <Icon className={cn("size-5", t.text)} />
        </div>
        <span className={cn("text-xs font-semibold", t.text)}>{progress}%</span>
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", t.bar)}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
