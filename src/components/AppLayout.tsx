import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import {
  LayoutDashboard,
  AlarmClock,
  Pill,
  Utensils,
  LineChart,
  Activity,
  Bell,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mobileNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/alarms", label: "Alarms", icon: AlarmClock },
  { to: "/medicine", label: "Meds", icon: Pill },
  { to: "/diet", label: "Diet", icon: Utensils },
  { to: "/reports", label: "Report", icon: LineChart },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border px-4 lg:px-8 py-4 flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search workouts, meals, meds..."
              className="pl-9 bg-muted border-0 rounded-full"
            />
          </div>
          <button className="size-10 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition relative">
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-accent" />
          </button>
          <Link
            to="/register"
            className="size-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold shadow-soft"
          >
            A
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-2 py-2 flex justify-around shadow-elegant">
          {mobileNav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
