import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Weekly Health Report — Aura Health" },
      { name: "description", content: "Weekly progress in steps, calories, exercise, food intake and medicine completion." },
      { property: "og:title", content: "Weekly Health Report" },
      { property: "og:description", content: "Track your protein, vitamin and overall wellness progress." },
    ],
  }),
  component: ReportsPage,
});

const week = [
  { day: "Mon", steps: 8200, kcal: 410, protein: 110 },
  { day: "Tue", steps: 10500, kcal: 520, protein: 130 },
  { day: "Wed", steps: 7800, kcal: 390, protein: 95 },
  { day: "Thu", steps: 12100, kcal: 605, protein: 145 },
  { day: "Fri", steps: 9300, kcal: 460, protein: 125 },
  { day: "Sat", steps: 11800, kcal: 590, protein: 140 },
  { day: "Sun", steps: 8750, kcal: 452, protein: 120 },
];

const radial = [
  { name: "Steps", value: 81, fill: "oklch(0.58 0.18 250)" },
  { name: "Workouts", value: 92, fill: "oklch(0.7 0.18 150)" },
  { name: "Nutrition", value: 76, fill: "oklch(0.72 0.16 240)" },
  { name: "Medicine", value: 87, fill: "oklch(0.82 0.16 80)" },
];

function ReportsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Weekly Health Report"
        subtitle="Your full health overview for this week."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Steps", value: "68,450", chg: "+12%" },
          { label: "Calories Burned", value: "3,427", chg: "+8%" },
          { label: "Avg Protein", value: "124g", chg: "+5%" },
          { label: "Med Completion", value: "87%", chg: "+3%" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-3xl p-5 shadow-soft">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="text-2xl lg:text-3xl font-bold mt-1">{s.value}</div>
            <div className="text-xs text-accent font-semibold mt-2">{s.chg} vs last week</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-soft border border-border/50">
          <h2 className="text-lg font-semibold mb-1">Steps & Calories</h2>
          <p className="text-sm text-muted-foreground mb-5">7-day trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={week}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 240)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.92 0.012 240)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="steps" stroke="oklch(0.58 0.18 250)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.58 0.18 250)" }} />
                <Line type="monotone" dataKey="kcal" stroke="oklch(0.7 0.18 150)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.7 0.18 150)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50">
          <h2 className="text-lg font-semibold mb-1">Goal Completion</h2>
          <p className="text-sm text-muted-foreground mb-5">All categories</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="25%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {radial.map((r) => (
              <li key={r.name} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: r.fill }} />
                  {r.name}
                </span>
                <span className="font-semibold tabular-nums">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/50">
        <h2 className="text-lg font-semibold mb-1">Protein Intake</h2>
        <p className="text-sm text-muted-foreground mb-5">Daily grams (target 130g)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week}>
              <defs>
                <linearGradient id="pbar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 150)" />
                  <stop offset="100%" stopColor="oklch(0.58 0.18 250)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 240)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.52 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.92 0.012 240)", borderRadius: 12 }} />
              <Bar dataKey="protein" fill="url(#pbar)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
