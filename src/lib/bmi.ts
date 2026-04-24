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
  /** YouTube video ID (embed) for visual demo */
  videoId?: string;
  /** Fallback image URL */
  image?: string;
  /** Short instruction */
  tip?: string;
}

export const EXERCISES_BY_CATEGORY: Record<BmiCategory, Exercise[]> = {
  underweight: [
    { name: "Sun Salutation Yoga", emoji: "🧘", duration: 60, kcalPerMin: 4, videoId: "73sjOu0g58M", tip: "Flow through 12 poses slowly with deep breathing." },
    { name: "Light Stretching", emoji: "🤸", duration: 45, kcalPerMin: 3, videoId: "L_xrDAtykMI", tip: "Hold each stretch 15-20s. Don't bounce." },
    { name: "Cobra Pose", emoji: "🐍", duration: 30, kcalPerMin: 3, videoId: "JDcdhTuycOI", tip: "Press chest up, shoulders back, breathe deeply." },
    { name: "Bodyweight Squats", emoji: "🦵", duration: 45, kcalPerMin: 5, videoId: "aclHkVaku9U", tip: "Knees track over toes, chest tall." },
    { name: "Deep Breathing", emoji: "🌬️", duration: 30, kcalPerMin: 2, videoId: "tybOi4hjZFQ", tip: "Inhale 4s, hold 4s, exhale 6s." },
  ],
  normal: [
    { name: "Jumping Jacks", emoji: "🤾", duration: 45, kcalPerMin: 8, videoId: "iSSAk4XCsRA", tip: "Land soft, arms fully overhead." },
    { name: "Push-ups", emoji: "💪", duration: 45, kcalPerMin: 7, videoId: "IODxDxX7oi4", tip: "Body in straight line, lower until elbows are 90°." },
    { name: "Mountain Climbers", emoji: "⛰️", duration: 40, kcalPerMin: 9, videoId: "nmwgirgXLYM", tip: "Drive knees fast, keep hips low." },
    { name: "Plank Hold", emoji: "🪵", duration: 45, kcalPerMin: 5, videoId: "ASdvN_XEl_c", tip: "Squeeze glutes & core. Don't drop hips." },
    { name: "Lunges", emoji: "🦿", duration: 45, kcalPerMin: 7, videoId: "QOVaHwm-Q6U", tip: "Step long, back knee just above floor." },
    { name: "Burpees", emoji: "🔥", duration: 40, kcalPerMin: 10, videoId: "TU8QYVW0gDU", tip: "Full speed: squat, plank, jump up!" },
  ],
  overweight: [
    { name: "Brisk Walking", emoji: "🚶", duration: 90, kcalPerMin: 5, videoId: "njeZ29umqVE", tip: "Pace where you can talk but not sing." },
    { name: "Chair Yoga", emoji: "🪑", duration: 60, kcalPerMin: 3, videoId: "1DYH5ud3zHo", tip: "Gentle seated stretches — easy on joints." },
    { name: "Marching in Place", emoji: "🥁", duration: 60, kcalPerMin: 4, videoId: "Wxc6lsGmCsk", tip: "Lift knees high, swing arms naturally." },
    { name: "Wall Push-ups", emoji: "🧱", duration: 45, kcalPerMin: 4, videoId: "5IbVnRmaXdE", tip: "Stand arm's length, lean to wall, push back." },
    { name: "Side Leg Raises", emoji: "🦵", duration: 45, kcalPerMin: 4, videoId: "jgh6sGwtTwk", tip: "Slow & controlled — don't swing." },
    { name: "Evening Walk", emoji: "🌆", duration: 90, kcalPerMin: 5, videoId: "njeZ29umqVE", tip: "20 min after dinner aids digestion!" },
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
