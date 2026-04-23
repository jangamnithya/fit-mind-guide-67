import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Heart, ArrowRight, Bell, Pill, Utensils, LineChart } from "lucide-react";
import heroImage from "@/assets/landing-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Fitness Companion — Track Your Health, Transform Your Life" },
      {
        name: "description",
        content:
          "Your all-in-one personal fitness companion: smart alarms, medicine reminders, step & calorie tracking, weekly diet planner and detailed health reports.",
      },
      { property: "og:title", content: "Personal Fitness Companion" },
      {
        property: "og:description",
        content: "Track Your Health, Transform Your Life — smart alarms, diet planner, weekly reports.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: Bell, label: "Smart Alarms" },
  { icon: Pill, label: "Medicine Care" },
  { icon: Utensils, label: "Diet Planner" },
  { icon: LineChart, label: "Weekly Reports" },
] as const;

function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background image */}
      <img
        src={heroImage}
        alt="People exercising at sunrise — yoga, running and strength training"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gradient overlay for legibility & on-brand color wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/60 to-accent/75" />
      <div className="absolute inset-0 bg-black/25" />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-5">
        <Link to="/" className="flex items-center gap-2 text-white">
          <div className="size-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
            <Heart className="size-5" fill="currentColor" />
          </div>
          <div>
            <div className="font-bold text-base leading-none">Aura</div>
            <div className="text-[11px] opacity-80">Fitness Companion</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/register"
            className="text-white/90 hover:text-white text-sm font-medium px-3 py-2"
          >
            Sign up
          </Link>
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex text-white/90 hover:text-white text-sm font-medium px-3 py-2"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-5 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium ring-1 ring-white/25">
          <Activity className="size-3.5" />
          Your everyday health, beautifully tracked
        </span>

        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          Personal Fitness
          <br />
          <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
            Companion
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base sm:text-lg lg:text-xl text-white/90 font-medium">
          Track Your Health, Transform Your Life.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-primary font-bold px-8 py-4 text-base shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all"
          >
            Get Started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/30 text-white font-semibold px-8 py-4 text-base hover:bg-white/20 transition"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 px-3 py-4"
            >
              <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
