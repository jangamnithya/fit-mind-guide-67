import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  role: "bot" | "user";
  text: string;
  ts: number;
}

const STORAGE_KEY = "aura_chat_history";

interface Intent {
  keywords: string[];
  replies: string[];
}

const INTENTS: Intent[] = [
  {
    keywords: ["hi", "hello", "hey", "hola", "yo "],
    replies: [
      "Hey there! 👋 I'm Aura. Ask me anything about diet, workouts, or wellness!",
      "Hi! 😊 Ready to crush today's goals? What can I help with?",
      "Hello! 💙 I'm here to guide your fitness journey.",
    ],
  },
  {
    keywords: ["what should i eat", "what to eat", "diet", "food", "meal", "nutrition", "breakfast", "lunch", "dinner"],
    replies: [
      "🥗 Try this combo today: oats + banana + nuts for breakfast, 2 rotis + dal + sabzi for lunch, grilled chicken/paneer + salad for dinner.",
      "🍳 Aim for protein at every meal — eggs, dal, paneer, chicken, or curd. Add seasonal fruits as snacks!",
      "🌾 Balanced plate: 1/2 veggies, 1/4 protein, 1/4 whole grains. Hydrate between meals!",
    ],
  },
  {
    keywords: ["workout tip", "workout", "exercise", "gym", "training", "routine"],
    replies: [
      "💪 Try this 20-min combo: 3 rounds of — 15 jumping jacks, 10 push-ups, 15 squats, 30s plank. Rest 60s between rounds.",
      "🔥 Mix cardio (jumping jacks, brisk walking) with strength (push-ups, squats). 30 min/day, 5x/week is gold.",
      "🏋️ Always warm up 5 min, then alternate upper/lower body days. End with stretching!",
    ],
  },
  {
    keywords: ["weight loss", "lose weight", "fat loss", "slim down", "burn fat"],
    replies: [
      "⚖️ Weight loss = small calorie deficit + protein + 8k+ steps daily. Avoid sugary drinks — biggest hidden calories!",
      "🔥 Try 20 min HIIT 3x/week + 7k steps daily. You'll see results in 3 weeks.",
      "🥬 Fill half your plate with vegetables. Drink water before meals — it cuts intake naturally.",
    ],
  },
  {
    keywords: ["weight gain", "gain weight", "bulk", "muscle"],
    replies: [
      "🏋️ Eat a 300–500 kcal surplus daily with strength training 4x/week. Bananas, peanut butter, paneer, eggs are your friends.",
      "💪 Lift heavy 3–4x/week and sleep 8h. Drink a banana + milk + peanut butter shake post-workout.",
    ],
  },
  {
    keywords: ["water", "hydration", "thirsty"],
    replies: [
      "💧 Aim for 2.5–3L/day. Pro tip: keep a 1L bottle visible — you'll drink 2x more.",
      "💦 Drink a glass right after waking — it kickstarts metabolism!",
    ],
  },
  {
    keywords: ["sleep", "rest", "tired", "insomnia"],
    replies: [
      "😴 7–9 hours is the sweet spot. No screens 30 min before bed, dim lights after 9 PM.",
      "🌙 Try 4-7-8 breathing in bed: inhale 4s, hold 7s, exhale 8s. Knocks you out fast!",
    ],
  },
  {
    keywords: ["yoga", "stretch", "flexibility", "asana"],
    replies: [
      "🧘 Sun Salutation 12 poses, 10 min daily — full-body energy boost.",
      "🌅 Try Cat-Cow + Downward Dog + Child's Pose — instant back relief!",
    ],
  },
  {
    keywords: ["bmi"],
    replies: [
      "📏 BMI = weight(kg) / height(m)². Under 18.5 = underweight, 18.5–24.9 = normal, 25+ = overweight. Check your dashboard!",
    ],
  },
  {
    keywords: ["protein", "amino"],
    replies: [
      "🥚 Aim for 0.8–1.2g per kg body weight. Best veg sources: paneer, soya, dal, curd. Non-veg: chicken, eggs, fish.",
      "💪 A 60kg person needs ~70g protein/day. Spread across 3 meals for best absorption.",
    ],
  },
  {
    keywords: ["stress", "anxiety", "calm", "panic", "overwhelm"],
    replies: [
      "🌿 Box breathing: 4s in, 4s hold, 4s out, 4s hold. Repeat 4 cycles — instant calm.",
      "🍃 Step outside for 10 min — sunlight + walking lowers cortisol fast.",
    ],
  },
  {
    keywords: ["headache", "head pain", "migraine"],
    replies: [
      "💧 Often dehydration! Drink 2 glasses of water + rest your eyes 10 min in a dark room.",
    ],
  },
  {
    keywords: ["sugar", "sweet", "craving"],
    replies: [
      "🍯 Cravings? Try 1 date + almonds, or fruit + curd. Real sugar drops energy crashes!",
    ],
  },
  {
    keywords: ["thanks", "thank you", "thx", "tysm"],
    replies: ["Anytime! 💙 Keep showing up — your future self is cheering!", "You're welcome! 🌟 Stay strong!"],
  },
  {
    keywords: ["bye", "goodbye", "see you", "cya"],
    replies: ["Bye! 👋 Crush the rest of the day!", "See you soon — stay hydrated! 💧"],
  },
];

const FALLBACKS = [
  "I can help with diet 🥗, workouts 💪, sleep 😴, hydration 💧, BMI 📏, stress 🌿 and protein 🥚. Try asking 'what should I eat' or 'workout tips'!",
  "Hmm, not sure about that one. Try asking about meals, exercises, water intake, or sleep!",
  "Try: 'workout tip', 'what should I eat', 'how much protein?', or 'help me sleep better'.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getReply(text: string): string {
  const lower = text.toLowerCase().trim();
  // Score each intent by keyword match
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keywords) {
      if (lower.includes(k)) score += k.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  if (best) return pick(best.intent.replies);
  return pick(FALLBACKS);
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! 👋 I'm Aura, your fitness assistant. Ask me anything!", ts: Date.now() },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Msg[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    const reply = getReply(text);
    setMessages((m) => [...m, { role: "user", text, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    const delay = 800 + Math.min(2000, text.length * 30);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply, ts: Date.now() }]);
      setTyping(false);
    }, delay);
  };

  const quickPrompts = ["What should I eat?", "Workout tips", "How much protein?", "Help me sleep"];

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
        <div className="fixed bottom-36 right-4 lg:bottom-24 lg:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm h-[30rem] bg-card border border-border/50 rounded-3xl shadow-elegant flex flex-col overflow-hidden animate-scale-in">
          <div className="bg-gradient-hero text-primary-foreground p-4 flex items-center gap-3">
            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold leading-none">Aura Assistant</div>
              <div className="text-xs opacity-80 mt-0.5 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" /> Online
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([{ role: "bot", text: "Fresh start! How can I help? 💙", ts: Date.now() }]);
              }}
              className="text-xs px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 transition"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2 animate-fade-in", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "size-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "bot" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
                  )}
                >
                  {m.role === "bot" ? <Bot className="size-3.5" /> : <UserIcon className="size-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                    m.role === "bot"
                      ? "bg-muted rounded-tl-sm"
                      : "bg-gradient-hero text-primary-foreground rounded-tr-sm",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 animate-fade-in">
                <div className="size-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Bot className="size-3.5" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 2 && !typing && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      const text = q;
                      const reply = getReply(text);
                      setMessages((m) => [...m, { role: "user", text, ts: Date.now() }]);
                      setInput("");
                      setTyping(true);
                      setTimeout(() => {
                        setMessages((m) => [...m, { role: "bot", text: reply, ts: Date.now() }]);
                        setTyping(false);
                      }, 1000);
                    }, 50);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-secondary transition flex items-center gap-1"
                >
                  <Sparkles className="size-2.5" /> {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-border/50 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about diet, workouts…"
              className="flex-1 h-10 px-3 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={typing}
            />
            <button
              onClick={send}
              aria-label="Send"
              disabled={typing || !input.trim()}
              className="size-10 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center shadow-soft hover:shadow-elegant transition disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
