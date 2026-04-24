import type { BmiCategory } from "@/lib/bmi";
import { cn } from "@/lib/utils";

interface Props {
  category: BmiCategory;
  mood: "happy" | "encouraging" | "idle";
  size?: number;
}

const FACES: Record<Props["mood"], string> = {
  happy: "◠‿◠",
  encouraging: "^_^",
  idle: "•‿•",
};

const MESSAGES: Record<Props["mood"], string> = {
  happy: "Awesome workout!",
  encouraging: "Let's get moving!",
  idle: "I'm here to help.",
};

// Body shape varies with BMI category
function Body({ category }: { category: BmiCategory }) {
  if (category === "underweight") {
    return (
      <ellipse cx="60" cy="78" rx="14" ry="22" fill="currentColor" />
    );
  }
  if (category === "overweight") {
    return (
      <ellipse cx="60" cy="80" rx="30" ry="26" fill="currentColor" />
    );
  }
  return <ellipse cx="60" cy="80" rx="22" ry="24" fill="currentColor" />;
}

export function BmiCharacter({ category, mood, size = 140 }: Props) {
  const tone =
    category === "underweight"
      ? "text-warning"
      : category === "overweight"
        ? "text-primary"
        : "text-accent";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative",
          mood === "happy" && "animate-bounce",
          mood === "encouraging" && "animate-pulse",
        )}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 120 130" className={cn("w-full h-full", tone)}>
          {/* Body */}
          <Body category={category} />
          {/* Head */}
          <circle cx="60" cy="38" r="22" fill="currentColor" />
          {/* Eyes */}
          <circle cx="52" cy="36" r="2.5" fill="white" />
          <circle cx="68" cy="36" r="2.5" fill="white" />
          {/* Smile */}
          <path
            d={
              mood === "happy"
                ? "M50 44 Q60 54 70 44"
                : mood === "encouraging"
                  ? "M50 45 Q60 50 70 45"
                  : "M52 46 L68 46"
            }
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arms */}
          <line
            x1="40"
            y1="70"
            x2={mood === "happy" ? "20" : "30"}
            y2={mood === "happy" ? "50" : "90"}
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="70"
            x2={mood === "happy" ? "100" : "90"}
            y2={mood === "happy" ? "50" : "90"}
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute -top-2 -right-2 bg-card border border-border/60 rounded-full px-2 py-0.5 text-[10px] font-mono shadow-soft">
          {FACES[mood]}
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-medium">{MESSAGES[mood]}</p>
    </div>
  );
}
