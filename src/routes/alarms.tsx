import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Sun, Moon, Droplets, Dumbbell, Pill, Trash2, Bell, BellRing, X } from "lucide-react";

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

type Tone = "primary" | "accent" | "warning";
type IconKey = "Sun" | "Moon" | "Droplets" | "Dumbbell" | "Pill";

interface Alarm {
  id: string;
  time: string; // HH:MM 24h
  label: string;
  desc: string;
  iconKey: IconKey;
  days: string;
  on: boolean;
  tone: Tone;
  lastFiredAt?: string; // YYYY-MM-DD HH:MM marker to avoid duplicate fires
}

const ICONS: Record<IconKey, typeof Sun> = {
  Sun,
  Moon,
  Droplets,
  Dumbbell,
  Pill,
};

const STORAGE_KEY = "aura_alarms";

const DEFAULT_ALARMS: Alarm[] = [
  { id: "a1", time: "06:30", label: "Wake Up", desc: "Smart wake during light sleep", iconKey: "Sun", days: "Mon–Fri", on: true, tone: "warning" },
  { id: "a2", time: "07:15", label: "Morning Workout", desc: "Upper body strength · 45 min", iconKey: "Dumbbell", days: "Mon, Wed, Fri", on: true, tone: "primary" },
  { id: "a3", time: "10:00", label: "Vitamin D", desc: "1 tablet with water", iconKey: "Pill", days: "Daily", on: true, tone: "accent" },
  { id: "a4", time: "11:00", label: "Hydrate", desc: "Drink 500ml of water", iconKey: "Droplets", days: "Daily", on: true, tone: "primary" },
  { id: "a5", time: "22:00", label: "Wind Down", desc: "Sleep mode in 30 min", iconKey: "Moon", days: "Daily", on: true, tone: "accent" },
];

const toneClass = (tone: Tone) =>
  tone === "accent"
    ? "bg-accent/15 text-accent"
    : tone === "warning"
      ? "bg-warning/15 text-warning"
      : "bg-primary/15 text-primary";

function format12h(t: string) {
  const [hStr, m] = t.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12.toString().padStart(2, "0")}:${m} ${period}`;
}

// Generate a beep tone using Web Audio API (no asset required)
function playAlarmSound(audioCtxRef: { current: AudioContext | null }, stopFlag: { current: boolean }) {
  try {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    const ctx = audioCtxRef.current;
    const playBeep = (offset: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.45);
    };
    // ring sequence
    for (let i = 0; i < 6; i++) playBeep(i * 0.5);
    // Repeat every 3.5s while popup is open
    const id = setInterval(() => {
      if (stopFlag.current) {
        clearInterval(id);
        return;
      }
      for (let i = 0; i < 6; i++) playBeep(i * 0.5);
    }, 3500);
    return id;
  } catch {
    return null;
  }
}

function AlarmsPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [time, setTime] = useState("08:00");
  const [label, setLabel] = useState("Take Medicine");
  const [desc, setDesc] = useState("1 tablet after meals");
  const [iconKey, setIconKey] = useState<IconKey>("Pill");
  const [ringing, setRinging] = useState<Alarm | null>(null);
  const initialized = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRingFlag = useRef(false);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAlarms(JSON.parse(saved));
      } catch {
        setAlarms(DEFAULT_ALARMS);
      }
    } else {
      setAlarms(DEFAULT_ALARMS);
    }
    initialized.current = true;

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Persist
  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  // Trigger an alarm: popup + sound + notification
  const triggerAlarm = (a: Alarm) => {
    setRinging(a);
    stopRingFlag.current = false;
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    ringIntervalRef.current = playAlarmSound(audioCtxRef, stopRingFlag);
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(`⏰ ${a.label}`, { body: a.desc });
      } catch {
        /* ignore */
      }
    }
    toast(`⏰ ${a.label}`, { description: a.desc });
  };

  const dismissRinging = () => {
    stopRingFlag.current = true;
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    setRinging(null);
  };

  // Tick every 1s and check alarms
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const current = `${hh}:${mm}`;
      const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${current}`;

      setAlarms((prev) => {
        let changed = false;
        let toFire: Alarm | null = null;
        const next = prev.map((a) => {
          if (a.on && a.time === current && a.lastFiredAt !== dayKey) {
            changed = true;
            if (!toFire) toFire = a;
            return { ...a, lastFiredAt: dayKey };
          }
          return a;
        });
        if (toFire) triggerAlarm(toFire);
        return changed ? next : prev;
      });
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  // Cleanup audio
  useEffect(() => {
    return () => {
      stopRingFlag.current = true;
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    };
  }, []);

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !label.trim()) {
      toast.error("Please set a time and label");
      return;
    }
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      time,
      label: label.trim(),
      desc: desc.trim() || "Reminder",
      iconKey,
      days: "Daily",
      on: true,
      tone: iconKey === "Pill" ? "accent" : iconKey === "Sun" ? "warning" : "primary",
    };
    setAlarms((prev) => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    toast.success(`Alarm set for ${format12h(time)}`);
    setLabel("Take Medicine");
    setDesc("1 tablet after meals");
  };

  const testAlarm = () => {
    triggerAlarm({
      id: "test",
      time: "now",
      label: "Time to take your medicine 💊",
      desc: "This is a test alert. Tap dismiss to stop the sound.",
      iconKey: "Pill",
      days: "Test",
      on: true,
      tone: "accent",
    });
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, on: !a.on } : a)));
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    toast("Alarm removed");
  };

  const activeCount = alarms.filter((a) => a.on).length;

  return (
    <AppLayout>
      <PageHeader
        title="Smart Alarms"
        subtitle="Reminders for workouts, sleep, water and supplements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Alarms", value: activeCount.toString(), icon: Sun },
          { label: "Today's Reminders", value: alarms.length.toString(), icon: Droplets },
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

      <form
        onSubmit={handleAddAlarm}
        className="bg-card rounded-3xl border border-border/50 shadow-soft p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Set New Reminder</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Vitamin C)"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Notes"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={iconKey}
            onChange={(e) => setIconKey(e.target.value as IconKey)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="Pill">💊 Medicine</option>
            <option value="Droplets">💧 Water</option>
            <option value="Dumbbell">🏋️ Workout</option>
            <option value="Sun">☀️ Wake</option>
            <option value="Moon">🌙 Sleep</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-gradient-hero text-primary-foreground rounded-full px-5 py-2.5 font-medium shadow-soft hover:shadow-elegant transition"
        >
          <Plus className="size-4" /> Add Alarm
        </button>
      </form>

      <div className="bg-card rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Saved Alarms</h2>
        </div>
        {alarms.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No alarms yet. Add one above to get started.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {alarms.map((a) => {
              const Icon = ICONS[a.iconKey];
              return (
                <li key={a.id} className="flex items-center gap-4 p-5 hover:bg-muted/40 transition">
                  <div className={`size-12 rounded-2xl flex items-center justify-center ${toneClass(a.tone)}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-xl font-bold tabular-nums">{format12h(a.time)}</span>
                      <span className="font-medium">{a.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {a.desc} · {a.days}
                    </div>
                  </div>
                  <Switch checked={a.on} onCheckedChange={() => toggleAlarm(a.id)} />
                  <button
                    onClick={() => deleteAlarm(a.id)}
                    className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                    aria-label="Delete alarm"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
