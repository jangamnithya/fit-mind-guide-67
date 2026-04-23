import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ArrowRight, Sparkles, Target, Scale, Ruler, Cake } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Aura Health" },
      { name: "description", content: "Welcome to your personal fitness companion." },
      { property: "og:title", content: "Welcome to Aura" },
      { property: "og:description", content: "Your personalized fitness journey starts here." },
    ],
  }),
  component: WelcomePage,
});

type StoredUser = {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  createdAt: string;
};

const goalLabel: Record<string, string> = {
  loss: "Weight Loss",
  gain: "Weight Gain",
  fit: "Fitness",
  maintain: "Healthy Lifestyle",
};

function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aura_user");
      if (raw) setUser(JSON.parse(raw) as StoredUser);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && !user) {
      const t = setTimeout(() => navigate({ to: "/register" }), 1500);
      return () => clearTimeout(t);
    }
  }, [loaded, user, navigate]);

  if (!loaded) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">No account found</h1>
          <p className="text-muted-foreground mt-2">Redirecting you to registration…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-8 lg:p-12 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="size-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Heart className="size-5" fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-lg leading-none">Aura</div>
                <div className="text-xs opacity-80">Health Companion</div>
              </div>
            </div>

            <div className="mt-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
              <Sparkles className="size-3.5" /> Account created successfully
            </div>
            <h1 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
              Welcome, {user.name}!
            </h1>
            <p className="mt-3 text-lg opacity-90 max-w-md">
              Your personalized health journey starts now. Let's hit your goals together.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <InfoCard icon={<Target className="size-4" />} label="Goal" value={goalLabel[user.goal] ?? user.goal} />
          <InfoCard icon={<Cake className="size-4" />} label="Age" value={`${user.age} yrs`} />
          <InfoCard icon={<Scale className="size-4" />} label="Weight" value={`${user.weight} kg`} />
          <InfoCard icon={<Ruler className="size-4" />} label="Height" value={`${user.height} cm`} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/dashboard"
            className="flex-1 h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-elegant transition flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/"
            className="h-12 px-6 rounded-xl border border-border bg-card font-medium hover:bg-muted transition flex items-center justify-center"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-primary">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
