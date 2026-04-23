import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Footprints, Flame, MapPin, Timer, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Aura Health" },
      { name: "description", content: "Daily steps, distance, calories burned and active minutes." },
      { property: "og:title", content: "Activity Tracking — Aura" },
      { property: "og:description", content: "Monitor your steps, calories and exercise routines." },
    ],
  }),
  component: ActivityPage,
});

const hourly = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}h`,
  steps: Math.round(200 + Math.random() * 1400),
}));

function ActivityPage() {
  return (
    <AppLayout>
      <PageHeader title="Activity Monitor" subtitle="Step count, calories and exercise routines." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Footprints, label: "Steps", value: "8,750", sub: "Goal 12,000" },
          { icon: MapPin, label: "Distance", value: "6.4", sub: "km today" },
          { icon: Flame, label: "Calories", value: "452", sub: "kcal burned" },
          { icon: Timer, label: "Active", value: "78", sub: "minutes" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft">
            <div className="size-11 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4 shadow-glow">
              <s.icon className="size-5 text-primary-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="text-3xl font-bold mt-1">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Hourly Steps</h2>
            <p className="text-sm text-muted-foreground">Today's distribution</p>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-accent font-medium">
            <TrendingUp className="size-4" /> +12% vs yesterday
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly}>
              <defs>
                <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.58 0.18 250)" />
                  <stop offset="100%" stopColor="oklch(0.7 0.18 150)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 240)" vertical={false} />
              <XAxis dataKey="hour" stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0.012 240)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="steps" fill="url(#bar)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50">
          <h2 className="text-lg font-semibold mb-4">Recent Workouts</h2>
          <ul className="divide-y divide-border">
            {[
              { name: "Morning Run", dur: "32 min", kcal: 280, icon: "🏃" },
              { name: "Yoga Flow", dur: "45 min", kcal: 180, icon: "🧘" },
              { name: "Strength Training", dur: "55 min", kcal: 410, icon: "🏋️" },
              { name: "Cycling", dur: "40 min", kcal: 350, icon: "🚴" },
            ].map((w) => (
              <li key={w.name} className="py-3 flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-muted flex items-center justify-center text-xl">{w.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.dur} · {w.kcal} kcal</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-hero rounded-3xl p-6 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 size-48 rounded-full bg-white/10 blur-3xl" />
          <h2 className="text-lg font-semibold mb-2">Weekly Goal</h2>
          <p className="text-sm opacity-90 mb-6">You're on a great streak — keep going!</p>
          <div className="text-5xl font-bold tabular-nums">68,400</div>
          <div className="text-sm opacity-90 mt-1">of 84,000 weekly steps</div>
          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: "81%" }} />
          </div>
          <div className="text-sm font-medium mt-2 opacity-90">81% complete</div>
        </div>
      </div>
    </AppLayout>
  );
}
