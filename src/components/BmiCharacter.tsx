import type { BmiCategory } from "@/lib/bmi";
import { cn } from "@/lib/utils";

interface Props {
  category: BmiCategory;
  mood: "happy" | "encouraging" | "idle";
  size?: number;
}

const MESSAGES: Record<Props["mood"], string> = {
  happy: "Awesome workout! 🎉",
  encouraging: "Let's get moving! 💪",
  idle: "I'm here to help.",
};

/**
 * Friendly fitness mascot — flat human-style illustration.
 * Body proportions adapt to BMI category.
 */
export function BmiCharacter({ category, mood, size = 140 }: Props) {
  // Body width by BMI
  const bodyWidth = category === "underweight" ? 22 : category === "overweight" ? 40 : 30;
  const bodyHeight = category === "overweight" ? 36 : 34;

  // Skin / clothing palette uses semantic tokens via CSS classes; SVG uses inline colors
  const skin = "#F5C8A2";
  const skinShade = "#E8AE85";
  const hair = "#3A2A1F";
  const shirt =
    category === "underweight"
      ? "hsl(40 90% 60%)" // warm
      : category === "overweight"
        ? "hsl(220 80% 60%)" // calming blue
        : "hsl(150 65% 45%)"; // healthy green
  const shirtShade =
    category === "underweight"
      ? "hsl(40 80% 50%)"
      : category === "overweight"
        ? "hsl(220 70% 48%)"
        : "hsl(150 60% 35%)";
  const pants = "#2D3748";

  // Mood-driven arms
  const armUp = mood === "happy";
  const wave = mood === "encouraging";

  // Mouth path
  const mouth =
    mood === "happy"
      ? "M52 60 Q60 70 68 60"
      : mood === "encouraging"
        ? "M53 61 Q60 66 67 61"
        : "M54 62 Q60 64 66 62";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative",
          mood === "happy" && "animate-bounce",
          wave && "animate-pulse",
        )}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="132" rx="28" ry="3" fill="black" opacity="0.15" />

          {/* Legs */}
          <rect x={60 - bodyWidth / 2 + 4} y="108" width="9" height="22" rx="3" fill={pants} />
          <rect x={60 + bodyWidth / 2 - 13} y="108" width="9" height="22" rx="3" fill={pants} />
          {/* Shoes */}
          <ellipse cx={60 - bodyWidth / 2 + 8.5} cy="131" rx="7" ry="3" fill="#1A202C" />
          <ellipse cx={60 + bodyWidth / 2 - 8.5} cy="131" rx="7" ry="3" fill="#1A202C" />

          {/* Body / shirt */}
          <path
            d={`M${60 - bodyWidth / 2} 76
                Q${60 - bodyWidth / 2 - 2} ${76 + bodyHeight / 2} ${60 - bodyWidth / 2 + 4} ${76 + bodyHeight}
                L${60 + bodyWidth / 2 - 4} ${76 + bodyHeight}
                Q${60 + bodyWidth / 2 + 2} ${76 + bodyHeight / 2} ${60 + bodyWidth / 2} 76
                Z`}
            fill={shirt}
          />
          {/* Shirt shade */}
          <path
            d={`M${60 - bodyWidth / 2 + 4} ${76 + bodyHeight - 4}
                L${60 + bodyWidth / 2 - 4} ${76 + bodyHeight - 4}
                L${60 + bodyWidth / 2 - 4} ${76 + bodyHeight}
                L${60 - bodyWidth / 2 + 4} ${76 + bodyHeight}
                Z`}
            fill={shirtShade}
          />
          {/* Neck */}
          <rect x="55" y="68" width="10" height="10" fill={skinShade} />

          {/* Arms */}
          {armUp ? (
            <>
              <path d={`M${60 - bodyWidth / 2} 80 Q${60 - bodyWidth / 2 - 14} 60 ${60 - bodyWidth / 2 - 8} 42`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d={`M${60 + bodyWidth / 2} 80 Q${60 + bodyWidth / 2 + 14} 60 ${60 + bodyWidth / 2 + 8} 42`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx={60 - bodyWidth / 2 - 8} cy="40" r="5" fill={skin} />
              <circle cx={60 + bodyWidth / 2 + 8} cy="40" r="5" fill={skin} />
            </>
          ) : wave ? (
            <>
              <path d={`M${60 - bodyWidth / 2} 80 Q${60 - bodyWidth / 2 - 8} 100 ${60 - bodyWidth / 2 - 6} 110`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d={`M${60 + bodyWidth / 2} 80 Q${60 + bodyWidth / 2 + 16} 60 ${60 + bodyWidth / 2 + 12} 44`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx={60 - bodyWidth / 2 - 6} cy="112" r="5" fill={skin} />
              <circle cx={60 + bodyWidth / 2 + 12} cy="42" r="5" fill={skin} />
            </>
          ) : (
            <>
              <path d={`M${60 - bodyWidth / 2} 80 Q${60 - bodyWidth / 2 - 6} 96 ${60 - bodyWidth / 2 - 4} 108`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d={`M${60 + bodyWidth / 2} 80 Q${60 + bodyWidth / 2 + 6} 96 ${60 + bodyWidth / 2 + 4} 108`} stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx={60 - bodyWidth / 2 - 4} cy="110" r="5" fill={skin} />
              <circle cx={60 + bodyWidth / 2 + 4} cy="110" r="5" fill={skin} />
            </>
          )}

          {/* Head */}
          <circle cx="60" cy="48" r="20" fill={skin} />
          {/* Hair */}
          <path d="M40 46 Q42 28 60 26 Q78 28 80 46 Q78 38 60 36 Q42 38 40 46 Z" fill={hair} />
          {/* Ears */}
          <circle cx="40" cy="50" r="3" fill={skinShade} />
          <circle cx="80" cy="50" r="3" fill={skinShade} />

          {/* Eyes */}
          <circle cx="52" cy="50" r="2.5" fill="#1a1a1a" />
          <circle cx="68" cy="50" r="2.5" fill="#1a1a1a" />
          <circle cx="52.7" cy="49.3" r="0.8" fill="white" />
          <circle cx="68.7" cy="49.3" r="0.8" fill="white" />

          {/* Eyebrows (mood) */}
          <path
            d={mood === "happy" ? "M48 44 Q52 42 56 44" : "M48 45 L56 44"}
            stroke="#3A2A1F"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={mood === "happy" ? "M64 44 Q68 42 72 44" : "M64 44 L72 45"}
            stroke="#3A2A1F"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <circle cx="48" cy="58" r="2.5" fill="#FFB3B3" opacity="0.6" />
          <circle cx="72" cy="58" r="2.5" fill="#FFB3B3" opacity="0.6" />

          {/* Mouth */}
          <path d={mouth} stroke="#3A2A1F" strokeWidth="2" fill={mood === "happy" ? "#FF6B6B" : "none"} strokeLinecap="round" />

          {/* Sweat drop when encouraging */}
          {mood === "encouraging" && (
            <path d="M82 38 Q80 42 82 44 Q84 42 82 38 Z" fill="#60A5FA" className="animate-pulse" />
          )}
          {/* Sparkles when happy */}
          {mood === "happy" && (
            <>
              <text x="22" y="30" fontSize="14" className="animate-pulse">✨</text>
              <text x="92" y="30" fontSize="14" className="animate-pulse">⭐</text>
            </>
          )}
        </svg>
      </div>
      <p className="text-xs text-muted-foreground font-medium">{MESSAGES[mood]}</p>
    </div>
  );
}
