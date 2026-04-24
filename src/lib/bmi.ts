export type BmiCategory = "underweight" | "normal" | "overweight";

export interface BmiInfo {
  bmi: number;
  category: BmiCategory;
  label: string;
  tone: "primary" | "accent" | "warning";
}

export function calcBmi(weightKg: number, heightCm: number): BmiInfo | null {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  const bmi = Math.round((weightKg / (m * m)) * 10) / 10;
  if (!Number.isFinite(bmi)) return null;
  if (bmi < 18.5)
    return { bmi, category: "underweight", label: "Underweight", tone: "warning" };
  if (bmi < 25)
    return { bmi, category: "normal", label: "Normal", tone: "accent" };
  return { bmi, category: "overweight", label: "Overweight", tone: "primary" };
}

export interface Exercise {
  name: string;
  emoji: string;
  duration: number; // seconds
  kcalPerMin: number;
}

export const EXERCISES_BY_CATEGORY: Record<BmiCategory, Exercise[]> = {
  underweight: [
    { name: "Sun Salutation Yoga", emoji: "🧘", duration: 60, kcalPerMin: 4 },
    { name: "Light Stretching", emoji: "🤸", duration: 45, kcalPerMin: 3 },
    { name: "Cobra Pose", emoji: "🐍", duration: 30, kcalPerMin: 3 },
    { name: "Bodyweight Squats", emoji: "🦵", duration: 45, kcalPerMin: 5 },
    { name: "Deep Breathing", emoji: "🌬️", duration: 30, kcalPerMin: 2 },
  ],
  normal: [
    { name: "Jumping Jacks", emoji: "🤾", duration: 45, kcalPerMin: 8 },
    { name: "Push-ups", emoji: "💪", duration: 45, kcalPerMin: 7 },
    { name: "Mountain Climbers", emoji: "⛰️", duration: 40, kcalPerMin: 9 },
    { name: "Plank Hold", emoji: "🪵", duration: 45, kcalPerMin: 5 },
    { name: "Lunges", emoji: "🦿", duration: 45, kcalPerMin: 7 },
    { name: "Burpees", emoji: "🔥", duration: 40, kcalPerMin: 10 },
  ],
  overweight: [
    { name: "Brisk Walking", emoji: "🚶", duration: 90, kcalPerMin: 5 },
    { name: "Chair Yoga", emoji: "🪑", duration: 60, kcalPerMin: 3 },
    { name: "Marching in Place", emoji: "🥁", duration: 60, kcalPerMin: 4 },
    { name: "Wall Push-ups", emoji: "🧱", duration: 45, kcalPerMin: 4 },
    { name: "Side Leg Raises", emoji: "🦵", duration: 45, kcalPerMin: 4 },
    { name: "Evening Walk", emoji: "🌆", duration: 90, kcalPerMin: 5 },
  ],
};

export const MOTIVATIONAL_MESSAGES = [
  "Great job! Keep going 💪",
  "You are improving every day! 🌟",
  "One more rep — you've got this! 🔥",
  "Breathe deep, stay strong 🌬️",
  "Your future self will thank you 🙌",
  "Stronger than yesterday 💯",
  "Small steps, big results 🚀",
  "Feel the burn, earn the glow ✨",
];
