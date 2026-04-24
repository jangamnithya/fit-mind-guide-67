import { useEffect, useRef, useState } from "react";
import { Play, Pause, X, SkipForward, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  EXERCISES_BY_CATEGORY,
  MOTIVATIONAL_MESSAGES,
  type BmiCategory,
  type Exercise,
} from "@/lib/bmi";

interface Props {
  category: BmiCategory;
  open: boolean;
  onClose: () => void;
  onComplete?: (kcal: number, seconds: number) => void;
  onTick?: (kcalDelta: number) => void;
}

export function WorkoutSession({ category, open, onClose, onComplete, onTick }: Props) {
  const exercises = EXERCISES_BY_CATEGORY[category];
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(exercises[0]?.duration ?? 30);
  const [paused, setPaused] = useState(false);
  const [totalKcal, setTotalKcal] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [popup, setPopup] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current: Exercise | undefined = exercises[idx];

  // reset when opening or category changes
  useEffect(() => {
    if (open) {
      setIdx(0);
      setRemaining(exercises[0]?.duration ?? 30);
      setTotalKcal(0);
      setTotalSec(0);
      setPaused(false);
    }
  }, [open, category, exercises]);

  // Timer
  useEffect(() => {
    if (!open || paused || !current) return;
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // advance
          if (idx + 1 < exercises.length) {
            setIdx((i) => i + 1);
            return exercises[idx + 1].duration;
          } else {
            // done
            return 0;
          }
        }
        return r - 1;
      });
      setTotalSec((s) => s + 1);
      const delta = current.kcalPerMin / 60;
      setTotalKcal((k) => Math.round((k + delta) * 100) / 100);
      onTick?.(delta);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, paused, current, idx, exercises, onTick]);

  // Motivational popups every 8s
  useEffect(() => {
    if (!open || paused) return;
    popupRef.current = setInterval(() => {
      const msg =
        MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setPopup(msg);
      setTimeout(() => setPopup(null), 2500);
    }, 8000);
    return () => {
      if (popupRef.current) clearInterval(popupRef.current);
    };
  }, [open, paused]);

  // detect completion
  useEffect(() => {
    if (open && idx === exercises.length - 1 && remaining === 0) {
      onComplete?.(totalKcal, totalSec);
      toast.success(`Workout complete! ${Math.round(totalKcal)} kcal burned 🎉`);
      onClose();
    }
  }, [remaining, idx, exercises.length, open, onComplete, totalKcal, totalSec, onClose]);

  if (!open || !current) return null;

  const totalExercises = exercises.length;
  const progress = ((idx + (1 - remaining / current.duration)) / totalExercises) * 100;

  const handleSkip = () => {
    if (idx + 1 < exercises.length) {
      setIdx(idx + 1);
      setRemaining(exercises[idx + 1].duration);
    } else {
      onComplete?.(totalKcal, totalSec);
      onClose();
    }
  };

  const handleStop = () => {
    onComplete?.(totalKcal, totalSec);
    toast(`Workout ended — ${Math.round(totalKcal)} kcal burned`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-elegant p-6 relative">
        <button
          onClick={handleStop}
          aria-label="Close workout"
          className="absolute top-4 right-4 size-9 rounded-full bg-muted hover:bg-secondary flex items-center justify-center transition"
        >
          <X className="size-4" />
        </button>

        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Exercise {idx + 1} / {totalExercises}
        </div>
        <h2 className="text-2xl font-bold mt-1">{current.name}</h2>

        <div className="mt-6 flex flex-col items-center">
          <div
            className={cn(
              "size-40 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-7xl shadow-elegant",
              !paused && "animate-pulse",
            )}
          >
            <span className="drop-shadow-sm">{current.emoji}</span>
          </div>
          <div className="mt-5 text-5xl font-bold tabular-nums">
            {String(Math.floor(remaining / 60)).padStart(2, "0")}:
            {String(remaining % 60).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(totalKcal)} kcal · {Math.floor(totalSec / 60)}m {totalSec % 60}s
          </div>
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-hero transition-all duration-1000"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex-1 h-11 rounded-xl bg-gradient-hero text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-elegant transition"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleSkip}
            className="h-11 px-4 rounded-xl bg-muted hover:bg-secondary font-medium flex items-center gap-2 transition"
          >
            <SkipForward className="size-4" /> Next
          </button>
        </div>

        {popup && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-elegant flex items-center gap-2 animate-fade-in">
            <Sparkles className="size-4" /> {popup}
          </div>
        )}
      </div>
    </div>
  );
}
