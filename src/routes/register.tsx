import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Mail, Lock, User, Target, Activity, Scale, Ruler, Cake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Aura Health" },
      { name: "description", content: "Join Aura — your personal fitness companion. Track steps, meals, sleep and meds." },
      { property: "og:title", content: "Create your Aura account" },
      { property: "og:description", content: "Start your personalized health journey today." },
    ],
  }),
  component: RegisterPage,
});

const goals = [
  { id: "loss", label: "Weight Loss", emoji: "🔥" },
  { id: "gain", label: "Weight Gain", emoji: "💪" },
  { id: "fit", label: "Fitness", emoji: "🏃" },
  { id: "maintain", label: "Healthy Lifestyle", emoji: "🌱" },
] as const;

type FormState = {
  name: string;
  email: string;
  password: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    goal: "fit",
  });
  const [errors, setErrors] = useState<Errors>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length > 100) e.name = "Name is too long";

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRe.test(form.email.trim())) e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";

    const age = Number(form.age);
    if (!form.age) e.age = "Age is required";
    else if (!Number.isFinite(age) || age < 5 || age > 120) e.age = "Enter a valid age (5–120)";

    const weight = Number(form.weight);
    if (!form.weight) e.weight = "Weight is required";
    else if (!Number.isFinite(weight) || weight < 20 || weight > 400) e.weight = "Enter a valid weight in kg";

    const height = Number(form.height);
    if (!form.height) e.height = "Height is required";
    else if (!Number.isFinite(height) || height < 80 || height > 260) e.height = "Enter a valid height in cm";

    if (!form.goal) e.goal = "Pick a goal";
    return e;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const user = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      goal: form.goal,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("aura_user", JSON.stringify(user));
    } catch {
      toast.error("Could not save your data locally");
      return;
    }

    toast.success("Account Created Successfully");
    navigate({ to: "/welcome" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual panel */}
      <div className="hidden lg:flex bg-gradient-hero p-12 text-primary-foreground relative overflow-hidden flex-col">
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 size-96 rounded-full bg-accent/30 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative">
          <div className="size-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Heart className="size-5" fill="currentColor" />
          </div>
          <div>
            <div className="font-bold text-lg leading-none">Aura</div>
            <div className="text-xs opacity-80">Health Companion</div>
          </div>
        </Link>

        <div className="relative my-auto">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your personal fitness companion.
          </h1>
          <p className="mt-4 text-lg opacity-90 max-w-md">
            Smart alarms, medicine care, weekly diet plans and full health reports — all in one beautiful dashboard.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
            {[
              { v: "12k+", l: "Daily steps tracked" },
              { v: "98%", l: "Med adherence" },
              { v: "7-day", l: "Diet planner" },
              { v: "24/7", l: "Smart reminders" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 backdrop-blur p-4">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs opacity-80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-10 rounded-2xl bg-gradient-hero flex items-center justify-center">
              <Heart className="size-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">Aura</span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
          <p className="text-muted-foreground mt-2 text-sm">Start your personalized health journey today.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Alex Morgan"
                  className="pl-10 h-11 rounded-xl"
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="alex@example.com"
                  className="pl-10 h-11 rounded-xl"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="At least 8 characters"
                  className="pl-10 h-11 rounded-xl"
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative">
                  <Cake className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    placeholder="28"
                    className="pl-9 h-11 rounded-xl"
                    aria-invalid={!!errors.age}
                  />
                </div>
                {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="relative">
                  <Scale className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    placeholder="68"
                    className="pl-9 h-11 rounded-xl"
                    aria-invalid={!!errors.weight}
                  />
                </div>
                {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <div className="relative">
                  <Ruler className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="height"
                    type="number"
                    inputMode="numeric"
                    value={form.height}
                    onChange={(e) => update("height", e.target.value)}
                    placeholder="172"
                    className="pl-9 h-11 rounded-xl"
                    aria-invalid={!!errors.height}
                  />
                </div>
                {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Target className="size-3.5" /> Your goal</Label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => update("goal", g.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition text-left",
                      form.goal === g.id
                        ? "bg-gradient-hero text-primary-foreground border-transparent shadow-soft"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <span className="text-base">{g.emoji}</span>
                    {g.label}
                  </button>
                ))}
              </div>
              {errors.goal && <p className="text-xs text-destructive">{errors.goal}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-elegant transition flex items-center justify-center gap-2"
            >
              <Activity className="size-4" />
              Create account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/dashboard" className="text-primary font-medium hover:underline">
                Go to dashboard
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
