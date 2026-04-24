import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { BmiCharacter } from "@/components/BmiCharacter";
import { Chatbot } from "@/components/Chatbot";
import { WorkoutSession } from "@/components/WorkoutSession";
import { useUser } from "@/hooks/useUser";
import { calcBmi, EXERCISES_BY_CATEGORY, type BmiCategory } from "@/lib/bmi";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Footprints,
  Flame,
  Droplets,
  Moon,
  Pill,
  Apple,
  TrendingUp,
  Dumbbell,
  Play,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aura Health Companion" },
      {
        name: "description",
        content:
          "Personal fitness companion: BMI-based workouts, smart diet plans, chatbot assistant and real-time tracking.",
      },
      { property: "og:title", content: "Aura — Personal Fitness Companion" },
      {
        property: "og:description",
        content: "Smart alarms, medicine care, diet planner and weekly health reports.",
      },
    ],
  }),
  component: DashboardPage,
});

const weekData = [
  { day: "Mon", steps: 8200, calories: 410 },
  { day: "Tue", steps: 10500, calories: 520 },
  { day: "Wed", steps: 7800, calories: 390 },
  { day: "Thu", steps: 12100, calories: 605 },
  { day: "Fri", steps: 9300, calories: 460 },
  { day: "Sat", steps: 11800, calories: 590 },
  { day: "Sun", steps: 8750, calories: 452 },
];

const macros = [
  { label: "Protein", value: "120", unit: "g", target: 150, tone: "primary" as const },
  { label: "Carbs", value: "250", unit: "g", target: 320, tone: "accent" as const },
  { label: "Vitamins", value: "800", unit: "mg", target: 1000, tone: "primary" as const },
  { label: "Fats", value: "58", unit: "g", target: 80, tone: "warning" as const },
];

const RECOMMENDATIONS: Record<BmiCategory, { title: string; desc: string }> = {
  underweight: {
    title: "Light workouts + Yoga",
    desc: "Focus on gentle strength building and flexibility to develop healthy mass.",
  },
  normal: {
    title: "Mixed Cardio + Strength",
    desc: "Keep your fitness sharp with a balanced cardio and resistance routine.",
  },
  overweight: {
    title: "Walking + Beginner Yoga",
    desc: "Low-impact movements that burn calories while protecting your joints.",
  },
};

function DashboardPage() {
  const { user } = useUser();
  const bmi = user ? calcBmi(user.weight, user.height) : null;
  const category: BmiCategory = bmi?.category ?? "normal";
  const rec = RECOMMENDATIONS[category];

  // Workout
  const [sessionOpen, setSessionOpen] = useState(false);
  const [characterMood, setCharacterMood] = useState<"happy" | "encouraging" | "idle">(
    "idle",
  );
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live stats
  const [steps, setSteps] = useState(8750);
  const [calories, setCalories] = useState(452);
  const [water, setWater] = useState(1.8);

  useEffect(() => {
    const saved = localStorage.getItem("aura_dashboard_stats");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (typeof s.steps === "number") setSteps(s.steps);
        if (typeof s.calories === "number") setCalories(s.calories);
        if (typeof s.water === "number") setWater(s.water);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "aura_dashboard_stats",
      JSON.stringify({ steps, calories, water }),
    );
  }, [steps, calories, water]);

  // Encourage when idle
  useEffect(() => {
    if (sessionOpen) return;
    idleTimerRef.current = setTimeout(() => setCharacterMood("encouraging"), 6000);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [sessionOpen, characterMood]);

  const handleStartWorkout = () => {
    setSessionOpen(true);
    setCharacterMood("encouraging");
    toast.success(`Starting ${rec.title} 💪`);
  };

  const handleWorkoutComplete = (kcal: number, sec: number) => {
    setCalories((c) => Math.round((c + kcal) * 100) / 100);
    setSteps((s) => s + Math.round(sec * 1.5));
    setCharacterMood("happy");
    setTimeout(() => setCharacterMood("idle"), 6000);
  };

  const handleAddWater = () => {
    setWater((w) => Math.round((w + 0.25) * 100) / 100);
    toast.success("+250ml water logged");
  };

  return (
    <AppLayout>
      <PageHeader
        title={user ? `Good day, ${user.name.split(" ")[0]} 👋` : "Welcome 👋"}
        subtitle="Here's how your body is doing today."
      />

      {/* BMI + Character + Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-soft border border-border/50 flex items-center gap-6">
          <BmiCharacter category={category} mood={characterMood} size={130} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Your BMI
              </span>
              {bmi && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    bmi.tone === "warning"
                      ? "bg-warning/15 text-warning"
                      : bmi.tone === "accent"
                        ? "bg-accent/15 text-accent"
                        : "bg-primary/15 text-primary"
                  }`}
                >
                  {bmi.label}
                </span>
              )}
            </div>
            <div className="text-4xl font-bold mt-1 tabular-nums">
              {bmi ? bmi.bmi : "—"}
            </div>
            <h3 className="font-semibold mt-3 flex items-center gap-2">
              <ActivityIcon className="size-4 text-primary" />
              Recommended: {rec.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{rec.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {EXERCISES_BY_CATEGORY[category].slice(0, 4).map((ex) => (
                <span
                  key={ex.name}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium"
                >
                  {ex.emoji} {ex.name}
                </span>
              ))}
            </div>
            <button
              onClick={handleStartWorkout}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground rounded-full px-5 py-2.5 font-semibold shadow-soft hover:shadow-elegant transition"
            >
              <Play className="size-4" /> Start Workout
            </button>
          </div>
        </div>

        <div className="bg-gradient-hero rounded-3xl p-6 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <Dumbbell className="size-8 mb-4" />
          <h3 className="text-xl font-bold">Today's Plan</h3>
          <p className="text-sm opacity-90 mt-1">{rec.title}</p>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Exercises</span>
              <span className="font-semibold">
                {EXERCISES_BY_CATEGORY[category].length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Est. duration</span>
              <span className="font-semibold">
                {Math.round(
                  EXERCISES_BY_CATEGORY[category].reduce((a, b) => a + b.duration, 0) /
                    60,
                )}{" "}
                min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Burn target</span>
              <span className="font-semibold">~250 kcal</span>
            </div>
          </div>
          <button
            onClick={handleStartWorkout}
            className="mt-6 w-full bg-white text-primary font-semibold rounded-full py-2.5 hover:bg-white/90 transition flex items-center justify-center gap-2"
          >
            <Play className="size-4" /> Start Workout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Footprints}
          label="Steps"
          value={steps.toLocaleString()}
          unit="/ 12k"
          progress={Math.min(100, Math.round((steps / 12000) * 100))}
          tone="accent"
        />
        <StatCard
          icon={Flame}
          label="Calories"
          value={Math.round(calories).toString()}
          unit="kcal"
          progress={Math.min(100, Math.round((calories / 700) * 100))}
          tone="warning"
        />
        <StatCard
          icon={Droplets}
          label="Water"
          value={water.toFixed(2)}
          unit="L"
          progress={Math.min(100, Math.round((water / 3) * 100))}
          tone="primary"
        />
        <StatCard icon={Moon} label="Sleep" value="7.2" unit="hrs" progress={90} tone="primary" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleAddWater}
          className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-muted transition"
        >
          + 250ml water
        </button>
        <button
          onClick={() => {
            setSteps((s) => s + 500);
            toast.success("+500 steps logged");
          }}
          className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-muted transition"
        >
          + 500 steps
        </button>
        <button
          onClick={() => {
            setSteps(0);
            setCalories(0);
            setWater(0);
            toast("Daily stats reset");
          }}
          className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-muted transition"
        >
          Reset day
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-soft border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Weekly Activity</h2>
              <p className="text-sm text-muted-foreground">Steps & calories burned</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" /> Steps
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-accent" /> Calories
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.18 250)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.58 0.18 250)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.18 150)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.18 150)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 240)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.92 0.012 240)",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px -8px oklch(0.58 0.18 250 / 0.2)",
                  }}
                />
                <Area type="monotone" dataKey="steps" stroke="oklch(0.58 0.18 250)" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="calories" stroke="oklch(0.7 0.18 150)" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Next Up</h2>
            <TrendingUp className="size-5 text-primary" />
          </div>
          <ul className="space-y-3">
            {[
              { time: "10:00", title: "Vitamin D", icon: Pill, tone: "primary" },
              { time: "12:30", title: "Lunch — Salad bowl", icon: Apple, tone: "accent" },
              { time: "14:00", title: "Drink 500ml water", icon: Droplets, tone: "primary" },
              { time: "18:00", title: "Cardio session", icon: Dumbbell, tone: "accent" },
            ].map((item) => (
              <li key={item.time} className="flex items-center gap-3 p-3 rounded-2xl bg-muted">
                <div className={`size-9 rounded-xl flex items-center justify-center ${item.tone === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                  <item.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">Nutrition Today</h2>
            <p className="text-sm text-muted-foreground">Macro & micro tracking</p>
          </div>
          <Apple className="size-5 text-accent" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {macros.map((m) => {
            const pct = Math.round((parseInt(m.value) / m.target) * 100);
            const barColor =
              m.tone === "accent"
                ? "bg-gradient-accent"
                : m.tone === "warning"
                  ? "bg-warning"
                  : "bg-gradient-primary";
            return (
              <div key={m.label} className="rounded-2xl bg-muted p-4">
                <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums">{m.value}</span>
                  <span className="text-xs text-muted-foreground">{m.unit}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5">
                  {pct}% of {m.target}
                  {m.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WorkoutSession
        category={category}
        open={sessionOpen}
        onClose={() => setSessionOpen(false)}
        onComplete={handleWorkoutComplete}
      />
      <Chatbot />
    </AppLayout>
  );
}
