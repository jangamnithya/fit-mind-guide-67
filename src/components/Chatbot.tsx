import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  role: "bot" | "user";
  text: string;
}

const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["diet", "food", "eat", "meal", "nutrition"],
    reply:
      "🥗 For a balanced Indian diet, aim for 2 rotis + dal + sabzi at lunch, eggs or poha for breakfast, and grilled chicken or paneer with veggies at dinner. Add fruits as snacks!",
  },
  {
    keywords: ["workout", "exercise", "gym", "training"],
    reply:
      "💪 Mix cardio (jumping jacks, brisk walking) with strength (push-ups, squats). 30 minutes a day, 5 days a week is a great start. Always warm up first!",
  },
  {
    keywords: ["weight loss", "lose weight", "fat", "slim"],
    reply:
      "🔥 Weight loss = calorie deficit. Focus on high-protein meals, cut sugar, walk 8k+ steps daily, and add 20 min of HIIT 3x/week.",
  },
  {
    keywords: ["weight gain", "gain weight", "bulk", "muscle"],
    reply:
      "🏋️ For healthy gain: eat 300-500 kcal surplus, lift weights 4x/week, and sleep 8 hours. Add bananas, peanut butter, paneer and eggs.",
  },
  {
    keywords: ["water", "hydration", "drink"],
    reply: "💧 Drink 2.5–3L water daily. Start with a glass right after waking up!",
  },
  {
    keywords: ["sleep", "rest", "tired"],
    reply:
      "😴 Aim for 7–9 hours. No screens 30 min before bed. Sleep is when your muscles recover!",
  },
  {
    keywords: ["yoga", "stretch", "flexibility"],
    reply:
      "🧘 Try Sun Salutations every morning — 12 poses, 10 minutes, full body stretch and energy boost.",
  },
  {
    keywords: ["bmi"],
    reply:
      "📏 BMI = weight(kg) / height(m)². Under 18.5 = underweight, 18.5–24.9 = normal, 25+ = overweight.",
  },
  {
    keywords: ["protein"],
    reply:
      "🥚 Aim for 0.8–1.2g protein per kg body weight. Best Indian sources: eggs, dal, paneer, chicken, soya, curd.",
  },
  {
    keywords: ["stress", "anxiety", "calm"],
    reply:
      "🌿 Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Repeat 4 times. Works wonders!",
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: "Hey there! 👋 I'm your fitness buddy. Ask me about diet, workouts, sleep or BMI!",
  },
];

const FALLBACK =
  "I'm here to help with diet, workouts, sleep, hydration and BMI questions. Try asking 'best workout for weight loss' or 'how much protein do I need?'";

function getReply(text: string): string {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return FALLBACK;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! 👋 I'm Aura, your fitness assistant. How can I help today?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = getReply(text);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chatbot"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 size-14 rounded-full bg-gradient-hero text-primary-foreground shadow-elegant flex items-center justify-center hover:scale-105 transition"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 lg:bottom-24 lg:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-card border border-border/50 rounded-3xl shadow-elegant flex flex-col overflow-hidden animate-scale-in">
          <div className="bg-gradient-hero text-primary-foreground p-4 flex items-center gap-3">
            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="size-5" />
            </div>
            <div>
              <div className="font-bold leading-none">Aura Assistant</div>
              <div className="text-xs opacity-80 mt-0.5">Always here to help</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}
              >
                <div
                  className={cn(
                    "size-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "bot"
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/15 text-accent",
                  )}
                >
                  {m.role === "bot" ? <Bot className="size-3.5" /> : <UserIcon className="size-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                    m.role === "bot"
                      ? "bg-muted rounded-tl-sm"
                      : "bg-gradient-hero text-primary-foreground rounded-tr-sm",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-border/50 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about diet, workouts…"
              className="flex-1 h-10 px-3 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={send}
              aria-label="Send"
              className="size-10 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center shadow-soft hover:shadow-elegant transition"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
