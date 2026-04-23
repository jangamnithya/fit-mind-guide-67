import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  AlarmClock,
  Pill,
  Utensils,
  LineChart,
  Activity,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/alarms", label: "Smart Alarms", icon: AlarmClock },
  { to: "/medicine", label: "Medicine Care", icon: Pill },
  { to: "/diet", label: "Diet Planner", icon: Utensils },
  { to: "/reports", label: "Weekly Report", icon: LineChart },
] as const;

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="size-10 rounded-2xl bg-gradient-hero shadow-glow flex items-center justify-center">
          <Heart className="size-5 text-primary-foreground" fill="currentColor" />
        </div>
        <div>
          <div className="font-bold text-lg leading-none text-sidebar-foreground">Aura</div>
          <div className="text-xs text-muted-foreground">Health Companion</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-hero p-4 text-primary-foreground shadow-elegant">
        <div className="text-xs font-medium opacity-90">Daily Streak</div>
        <div className="text-2xl font-bold mt-1">12 days 🔥</div>
        <div className="text-xs opacity-80 mt-1">Keep going strong!</div>
      </div>
    </aside>
  );
}
