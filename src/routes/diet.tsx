import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Coffee, Soup, Apple, UtensilsCrossed, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diet")({
  head: () => ({
    meta: [
      { title: "Diet Planner — Aura Health" },
      { name: "description", content: "Personalized weekly meal plan with affordable Indian foods." },
      { property: "og:title", content: "Weekly Diet Planner" },
      { property: "og:description", content: "Healthy Indian meal suggestions tailored to your fitness goals." },
    ],
  }),
  component: DietPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const goals = [
  { id: "loss", label: "Weight Loss" },
  { id: "gain", label: "Weight Gain" },
  { id: "fit", label: "Fitness" },
  { id: "maintain", label: "Maintain" },
] as const;

type GoalId = (typeof goals)[number]["id"];

interface Meal {
  emoji: string;
  meal: string;
  kcal: number;
  protein: number;
}

const mealTypes = [
  { key: "breakfast", label: "Breakfast", icon: Coffee, time: "08:00", tone: "warning" },
  { key: "lunch", label: "Lunch", icon: UtensilsCrossed, time: "13:00", tone: "primary" },
  { key: "snack", label: "Snack", icon: Apple, time: "16:00", tone: "accent" },
  { key: "dinner", label: "Dinner", icon: Soup, time: "20:00", tone: "primary" },
] as const;

type MealKey = (typeof mealTypes)[number]["key"];

// Affordable Indian meal pool
const MEAL_POOL: Record<MealKey, Meal[]> = {
  breakfast: [
    { emoji: "🥚", meal: "2 boiled eggs with 2 multigrain rotis", kcal: 360, protein: 22 },
    { emoji: "🥣", meal: "Poha with peanuts & a glass of milk", kcal: 340, protein: 14 },
    { emoji: "🫓", meal: "Besan chilla with mint chutney", kcal: 320, protein: 18 },
    { emoji: "🥛", meal: "Vegetable upma with curd", kcal: 350, protein: 12 },
    { emoji: "🍳", meal: "Masala omelette (3 eggs) with toast", kcal: 400, protein: 24 },
    { emoji: "🥜", meal: "Sprouts salad with banana & milk", kcal: 330, protein: 16 },
  ],
  lunch: [
    { emoji: "🍛", meal: "Dal, rice, mixed sabzi & 2 rotis", kcal: 540, protein: 22 },
    { emoji: "🍗", meal: "Grilled chicken curry with rice & salad", kcal: 580, protein: 42 },
    { emoji: "🥬", meal: "Palak paneer with 3 rotis", kcal: 520, protein: 28 },
    { emoji: "🍚", meal: "Rajma chawal with cucumber salad", kcal: 560, protein: 24 },
    { emoji: "🐟", meal: "Fish curry with rice & sautéed greens", kcal: 540, protein: 38 },
    { emoji: "🥘", meal: "Chole with 2 rotis & onion salad", kcal: 530, protein: 26 },
  ],
  snack: [
    { emoji: "🍎", meal: "Apple with handful of roasted chana", kcal: 200, protein: 10 },
    { emoji: "🥤", meal: "Fresh orange juice & 4 almonds", kcal: 180, protein: 5 },
    { emoji: "🍌", meal: "Banana with peanut butter", kcal: 240, protein: 8 },
    { emoji: "🥛", meal: "Buttermilk with bhel (light)", kcal: 190, protein: 6 },
    { emoji: "🍵", meal: "Green tea with 2 marie biscuits", kcal: 120, protein: 3 },
    { emoji: "🍇", meal: "Seasonal fruit bowl & curd", kcal: 220, protein: 9 },
  ],
  dinner: [
    { emoji: "🫓", meal: "2 rotis with mixed vegetable curry", kcal: 460, protein: 16 },
    { emoji: "🍗", meal: "Grilled chicken with sautéed spinach", kcal: 480, protein: 40 },
    { emoji: "🥬", meal: "Moong dal khichdi with curd", kcal: 440, protein: 20 },
    { emoji: "🥗", meal: "Paneer bhurji with 2 rotis & salad", kcal: 500, protein: 28 },
    { emoji: "🍲", meal: "Vegetable soup with grilled fish", kcal: 420, protein: 34 },
    { emoji: "🍛", meal: "Lauki chana dal with 2 rotis", kcal: 450, protein: 22 },
  ],
};

const toneCls = (tone: string) =>
  tone === "accent"
    ? "bg-accent/15 text-accent"
    : tone === "warning"
      ? "bg-warning/15 text-warning"
      : "bg-primary/15 text-primary";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlan(): Record<MealKey, Meal> {
  return {
    breakfast: pickRandom(MEAL_POOL.breakfast),
    lunch: pickRandom(MEAL_POOL.lunch),
    snack: pickRandom(MEAL_POOL.snack),
    dinner: pickRandom(MEAL_POOL.dinner),
  };
}

function DietPage() {
  const [day, setDay] = useState("Mon");
  const [goal, setGoal] = useState<GoalId>("fit");
  const [plan, setPlan] = useState<Record<MealKey, Meal>>(() => ({
    breakfast: MEAL_POOL.breakfast[0],
    lunch: MEAL_POOL.lunch[0],
    snack: MEAL_POOL.snack[0],
    dinner: MEAL_POOL.dinner[0],
  }));

  // Load saved plan
  useEffect(() => {
    const saved = localStorage.getItem("aura_diet_plan");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.plan) setPlan(obj.plan);
        if (obj.goal) setGoal(obj.goal);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("aura_diet_plan", JSON.stringify({ plan, goal }));
  }, [plan, goal]);

  const handleChangePlan = () => {
    setPlan(generatePlan());
    toast.success("New diet plan generated 🍽️");
  };

  const totalKcal = Object.values(plan).reduce((sum, m) => sum + m.kcal, 0);
  const totalProtein = Object.values(plan).reduce((sum, m) => sum + m.protein, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Weekly Diet Planner"
        subtitle="Affordable Indian meals tailored to your goals."
        action={
          <button
            onClick={handleChangePlan}
            className="flex items-center gap-2 bg-gradient-hero text-primary-foreground rounded-full px-5 py-2.5 font-medium shadow-soft hover:shadow-elegant transition"
          >
            <RefreshCw className="size-4" /> Change Diet Plan
          </button>
        }
      />

      <div className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-accent" />
          <span className="text-sm font-medium">Your goal</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition",
                goal === g.id
                  ? "bg-gradient-hero text-primary-foreground shadow-soft"
                  : "bg-muted text-foreground hover:bg-secondary",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={cn(
              "flex flex-col items-center min-w-16 px-4 py-3 rounded-2xl text-sm font-medium transition",
              day === d
                ? "bg-gradient-hero text-primary-foreground shadow-soft"
                : "bg-card border border-border/50 hover:bg-muted",
            )}
          >
            <span className="text-xs opacity-80">Day</span>
            <span className="font-bold">{d}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {mealTypes.map((m) => {
          const data = plan[m.key];
          return (
            <div
              key={m.key}
              className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft hover:shadow-elegant transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "size-14 rounded-2xl flex items-center justify-center text-2xl",
                    toneCls(m.tone),
                  )}
                  aria-hidden="true"
                >
                  <span>{data.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <m.icon className="size-4 text-muted-foreground" />
                      {m.label}
                    </h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{m.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{data.meal}</p>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium">
                      {data.kcal} kcal
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">
                      {data.protein}g protein
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-hero rounded-3xl p-6 text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-5" />
          <h3 className="font-semibold">Today's totals</h3>
        </div>
        <p className="text-sm opacity-90 max-w-2xl">
          For your <strong className="font-semibold">{goals.find((g) => g.id === goal)?.label}</strong> goal,
          today's plan delivers <strong className="font-semibold">{totalKcal} kcal</strong> and{" "}
          <strong className="font-semibold">{totalProtein}g protein</strong> across 4 meals built from
          affordable staples — eggs, dal, rice, roti, chicken, leafy greens and seasonal fruits. Stay
          hydrated with 2.5L of water through the day.
        </p>
      </div>
    </AppLayout>
  );
}
