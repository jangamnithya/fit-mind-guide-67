import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Plus, Sun, Moon, Droplets, Dumbbell, Pill } from "lucide-react";

export const Route = createFileRoute("/alarms")({
  head: () => ({
    meta: [
      { title: "Smart Alarms — Aura Health" },
      { name: "description", content: "Smart reminders for workouts, sleep, water and medicine timings." },
      { property: "og:title", content: "Smart Alarms & Reminders" },
      { property: "og:description", content: "Stay on track with intelligent health reminders." },
    ],
  }),
  component: AlarmsPage,
});

const alarms = [
  { time: "06:30 AM", label: "Wake Up", desc: "Smart wake during light sleep", icon: Sun, days: "Mon–Fri", on: true, tone: "warning" },
  { time: "07:15 AM", label: "Morning Workout", desc: "Upper body strength · 45 min", icon: Dumbbell, days: "Mon, Wed, Fri", on: true, tone: "primary" },
  { time: "10:00 AM", label: "Vitamin D", desc: "1 tablet with water", icon: Pill, days: "Daily", on: true, tone: "accent" },
  { time: "11:00 AM", label: "Hydrate", desc: "Drink 500ml of water", icon: Droplets, days: "Daily", on: true, tone: "primary" },
  { time: "02:00 PM", label: "Hydrate", desc: "Drink 500ml of water", icon: Droplets, days: "Daily", on: true, tone: "primary" },
  { time: "06:00 PM", label: "Evening Cardio", desc: "30 min · moderate pace", icon: Dumbbell, days: "Tue, Thu", on: false, tone: "primary" },
  { time: "10:00 PM", label: "Wind Down", desc: "Sleep mode in 30 min", icon: Moon, days: "Daily", on: true, tone: "accent" },
] as const;

const toneClass = (tone: string) =>
  tone === "accent"
    ? "bg-accent/15 text-accent"
    : tone === "warning"
      ? "bg-warning/15 text-warning"
      : "bg-primary/15 text-primary";

function AlarmsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Smart Alarms"
        subtitle="Reminders for workouts, sleep, water and supplements."
        action={
          <button className="flex items-center gap-2 bg-gradient-hero text-primary-foreground rounded-full px-5 py-2.5 font-medium shadow-soft hover:shadow-elegant transition">
            <Plus className="size-4" /> New Alarm
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Alarms", value: "6", icon: Sun },
          { label: "Today's Reminders", value: "12", icon: Droplets },
          { label: "Sleep Window", value: "7.5h", icon: Moon },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <s.icon className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
        </div>
        <ul className="divide-y divide-border">
          {alarms.map((a, i) => (
            <li key={i} className="flex items-center gap-4 p-5 hover:bg-muted/40 transition">
              <div className={`size-12 rounded-2xl flex items-center justify-center ${toneClass(a.tone)}`}>
                <a.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold tabular-nums">{a.time}</span>
                  <span className="font-medium">{a.label}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.desc} · {a.days}</div>
              </div>
              <Switch defaultChecked={a.on} />
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
