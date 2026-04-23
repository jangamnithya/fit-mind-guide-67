import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Pill, Plus, Check, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/medicine")({
  head: () => ({
    meta: [
      { title: "Medicine Care — Aura Health" },
      { name: "description", content: "Get notifications for tablets and supplements. Never miss a dose." },
      { property: "og:title", content: "Medicine Care & Reminders" },
      { property: "og:description", content: "Track your tablets, supplements and dosage adherence." },
    ],
  }),
  component: MedicinePage,
});

const medicines = [
  { name: "Vitamin D3", dose: "1000 IU · 1 tablet", time: "10:00 AM", status: "taken", color: "accent" },
  { name: "Omega-3", dose: "1000 mg · 1 capsule", time: "10:00 AM", status: "taken", color: "primary" },
  { name: "Multivitamin", dose: "1 tablet with food", time: "01:00 PM", status: "due", color: "primary" },
  { name: "Magnesium", dose: "400 mg · 1 tablet", time: "09:00 PM", status: "upcoming", color: "accent" },
  { name: "Probiotic", dose: "1 capsule", time: "10:00 PM", status: "upcoming", color: "primary" },
] as const;

const statusBadge = (status: string) => {
  if (status === "taken") return { icon: Check, text: "Taken", cls: "bg-accent/15 text-accent" };
  if (status === "due") return { icon: AlertCircle, text: "Due now", cls: "bg-warning/20 text-warning" };
  return { icon: Clock, text: "Upcoming", cls: "bg-muted text-muted-foreground" };
};

function MedicinePage() {
  const adherence = 87;
  return (
    <AppLayout>
      <PageHeader
        title="Medicine Care"
        subtitle="Notifications when it's time for your tablets and supplements."
        action={
          <button className="flex items-center gap-2 bg-gradient-hero text-primary-foreground rounded-full px-5 py-2.5 font-medium shadow-soft">
            <Plus className="size-4" /> Add Medicine
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gradient-hero rounded-3xl p-6 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-44 rounded-full bg-white/10 blur-3xl" />
          <Pill className="size-7 mb-3" />
          <h2 className="text-lg font-semibold">Weekly Adherence</h2>
          <p className="text-sm opacity-90">You took 13 of 15 scheduled doses</p>
          <div className="mt-6 flex items-end gap-3">
            <div className="text-6xl font-bold tabular-nums">{adherence}%</div>
            <div className="text-sm opacity-90 mb-2">on track</div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: `${adherence}%` }} />
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Today</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total doses</span><span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taken</span><span className="font-semibold text-accent">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due now</span><span className="font-semibold text-warning">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upcoming</span><span className="font-semibold">2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Doses</h2>
          <span className="text-xs text-muted-foreground">Auto-notifications enabled</span>
        </div>
        <ul className="divide-y divide-border">
          {medicines.map((m) => {
            const b = statusBadge(m.status);
            return (
              <li key={m.name} className="flex items-center gap-4 p-5 hover:bg-muted/40 transition">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${m.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                  <Pill className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.dose}</div>
                </div>
                <div className="hidden sm:block text-sm font-medium tabular-nums">{m.time}</div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${b.cls}`}>
                  <b.icon className="size-3.5" /> {b.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </AppLayout>
  );
}
