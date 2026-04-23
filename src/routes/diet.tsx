import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Sparkles, Coffee, Soup, Apple, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diet")({
  head: () => ({
    meta: [
      { title: "Diet Planner — Aura Health" },
      { name: "description", content: "Personalized weekly meal plan with breakfast, lunch, snacks and dinner." },
      { property: "og:title", content: "Weekly Diet Planner" },
      { property: "og:description", content: "Healthy meal suggestions tailored to your fitness goals." },
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

const mealTypes = [
  { key: "breakfast", label: "Breakfast", icon: Coffee, time: "08:00", tone: "warning" },
  { key: "lunch", label: "Lunch", icon: UtensilsCrossed, time: "13:00", tone: "primary" },
  { key: "snack", label: "Snack", icon: Apple, time: "16:00", tone: "accent" },
  { key: "dinner", label: "Dinner", icon: Soup, time: "20:00", tone: "primary" },
] as const;

const plan: Record<string, { meal: string; kcal: number; protein: number }> = {
  breakfast: { meal: "Oatmeal with berries & almonds", kcal: 380, protein: 14 },
  lunch: { meal: "Grilled chicken bowl with quinoa", kcal: 540, protein: 42 },
  snack: { meal: "Greek yogurt with honey", kcal: 180, protein: 18 },
  dinner: { meal: "Salmon with roasted vegetables", kcal: 480, protein: 38 },
};

const toneCls = (tone: string) =>
  tone === "accent"
    ? "bg-accent/15 text-accent"
    : tone === "warning"
      ? "bg-warning/15 text-warning"
      : "bg-primary/15 text-primary";

function DietPage() {
  const [day, setDay] = useState("Mon");
  const [goal, setGoal] = useState<(typeof goals)[number]["id"]>("fit");

  return (
    <AppLayout>
      <PageHeader
        title="Weekly Diet Planner"
        subtitle="Personalized meals based on your health goals."
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
            <div key={m.key} className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft hover:shadow-elegant transition">
              <div className="flex items-start gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", toneCls(m.tone))}>
                  <m.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold">{m.label}</h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{m.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{data.meal}</p>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium">{data.kcal} kcal</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">{data.protein}g protein</span>
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
          <h3 className="font-semibold">Personalized recommendation</h3>
        </div>
        <p className="text-sm opacity-90 max-w-2xl">
          Based on your <strong className="font-semibold">{goals.find((g) => g.id === goal)?.label}</strong> goal, we
          recommend ~1,580 kcal across 4 meals with high protein (110g+), complex carbs and at least 5 servings of
          vegetables. Stay hydrated with 2.5L of water and prioritize lean proteins for muscle recovery.
        </p>
      </div>
    </AppLayout>
  );
}
