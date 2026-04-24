import { useEffect, useRef, useState } from "react";
import { Play, Pause, X, SkipForward, SkipBack, Sparkles } from "lucide-react";
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

  useEffect(() => {
    if (open) {
      setIdx(0);
      setRemaining(exercises[0]?.duration ?? 30);
      setTotalKcal(0);
      setTotalSec(0);
      setPaused(false);
    }
  }, [open, category, exercises]);

  useEffect(() => {
    if (!open || paused || !current) return;
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (idx + 1 < exercises.length) {
            setIdx((i) => i + 1);
            return exercises[idx + 1].duration;
          } else {
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

  useEffect(() => {
    if (!open || paused) return;
    popupRef.current = setInterval(() => {
      const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setPopup(msg);
      setTimeout(() => setPopup(null), 2500);
    }, 8000);
    return () => {
      if (popupRef.current) clearInterval(popupRef.current);
    };
  }, [open, paused]);

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

  const goNext = () => {
    if (idx + 1 < exercises.length) {
      setIdx(idx + 1);
      setRemaining(exercises[idx + 1].duration);
    } else {
      onComplete?.(totalKcal, totalSec);
      onClose();
    }
  };

  const goPrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setRemaining(exercises[idx - 1].duration);
    }
  };

  const handleStop = () => {
    onComplete?.(totalKcal, totalSec);
    toast(`Workout ended — ${Math.round(totalKcal)} kcal burned`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border/50 rounded-3xl shadow-elegant p-6 relative my-auto">
        <button
          onClick={handleStop}
          aria-label="Close workout"
          className="absolute top-4 right-4 size-9 rounded-full bg-muted hover:bg-secondary flex items-center justify-center transition z-10"
        >
          <X className="size-4" />
        </button>

        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Exercise {idx + 1} / {totalExercises}
        </div>
        <h2 className="text-2xl font-bold mt-1 flex items-center gap-2">
          <span className="text-3xl">{current.emoji}</span> {current.name}
        </h2>
        {current.tip && (
          <p className="text-sm text-muted-foreground mt-1">💡 {current.tip}</p>
        )}

        {/* Video demo */}
        {current.videoId ? (
          <div className="mt-4 aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-elegant">
            <iframe
              key={current.videoId + idx}
              src={`https://www.youtube.com/embed/${current.videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
              title={current.name}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-4 aspect-video w-full rounded-2xl bg-gradient-hero flex items-center justify-center text-9xl">
            {current.emoji}
          </div>
        )}

        {/* Timer */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-5xl font-bold tabular-nums">
              {String(Math.floor(remaining / 60)).padStart(2, "0")}:
              {String(remaining % 60).padStart(2, "0")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(totalKcal)} kcal · {Math.floor(totalSec / 60)}m {totalSec % 60}s
            </div>
          </div>
          <div
            className={cn(
              "size-20 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-4xl shadow-elegant shrink-0",
              !paused && "animate-pulse",
            )}
          >
            <span className="drop-shadow-sm">{current.emoji}</span>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-hero transition-all duration-1000"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={goPrev}
            disabled={idx === 0}
            className="h-11 px-4 rounded-xl bg-muted hover:bg-secondary font-medium flex items-center gap-2 transition disabled:opacity-40"
          >
            <SkipBack className="size-4" /> Prev
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex-1 h-11 rounded-xl bg-gradient-hero text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-elegant transition"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={goNext}
            className="h-11 px-4 rounded-xl bg-muted hover:bg-secondary font-medium flex items-center gap-2 transition"
          >
            Next <SkipForward className="size-4" />
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
