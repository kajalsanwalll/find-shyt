"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fraunces, DM_Sans } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

const categories = [
  { id: "love", emoji: "💗", label: "Love", sub: "relationships, crushes, situationships" },
  { id: "career", emoji: "💼", label: "Career", sub: "work, studies, what's next" },
  { id: "friendship", emoji: "🫂", label: "Friendship", sub: "friends, people, connections" },
  { id: "life", emoji: "🌱", label: "Life", sub: "growth, choices, your current era" },
  { id: "specific", emoji: "👀", label: "Something specific", sub: "you know exactly what we're asking" },
  { id: "random", emoji: "🤷", label: "Just pull for me", sub: "no question, just vibes" },
];

const stars = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 53.3 + (i % 5) * 7) % 100,
  size: i % 7 === 0 ? 3 : 2,
  opacity: 0.18 + (i % 4) * 0.1,
}));

export default function ReadingPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  const selectedCategory = categories.find((c) => c.id === selected);
  const isRandom = selected === "random";

  function start() {
    if (!selected) return;
    try {
      sessionStorage.setItem(
        "reading",
        JSON.stringify({
          category: selected,
          question: isRandom ? "" : question.trim(),
        })
      );
    } catch {
      // Storage can be blocked (private mode); the deck page should handle a missing reading.
    }
    router.push("/reading/deck");
  }

  return (
    <main
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-[#120d1c] font-[family-name:var(--font-body)] text-[#f4ead9]`}
    >
      {/* star field + one glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#b9a6e8]/10 blur-[110px]" />
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#f4ead9]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <Link
          href="/"
          className="w-fit rounded text-sm text-[#f4ead9]/50 transition hover:text-[#f4ead9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4]"
        >
          Back
        </Link>

        <div className="my-auto py-10">
          <header>
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">
              What are we dealing with?
            </h1>
            <p className="mt-4 max-w-md text-[#f4ead9]/60">
              Pick whatever feels right. There are no wrong answers.
            </p>
          </header>

          {/* Topic picker: real radios, so arrow keys and screen readers work */}
          <fieldset className="mt-10">
            <legend className="sr-only">Choose a topic</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((c) => {
                const isSelected = selected === c.id;
                const isLast = c.id === "random";
                return (
                  <label
                    key={c.id}
                    className={`cursor-pointer ${isLast ? "sm:col-span-2" : ""}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.id}
                      checked={isSelected}
                      onChange={() => setSelected(c.id)}
                      className="peer sr-only"
                    />
                    <div
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#e8a0b4] ${
                        isLast ? "border-dashed" : ""
                      } ${
                        isSelected
                          ? "border-[#e8a0b4]/60 bg-[#e8a0b4]/[0.09]"
                          : "border-[#f4ead9]/15 bg-[#f4ead9]/[0.03] hover:border-[#f4ead9]/30 hover:bg-[#f4ead9]/[0.06]"
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f4ead9]/[0.06] text-2xl">
                        {c.emoji}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">{c.label}</span>
                        <span className="mt-0.5 block text-xs text-[#f4ead9]/50">
                          {c.sub}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                          isSelected ? "border-[#e8a0b4]" : "border-[#f4ead9]/25"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#e8a0b4]" />
                        )}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Question + continue, revealed after a choice */}
          <AnimatePresence initial={false}>
            {selected && (
              <motion.div
                key="next"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                className="mt-8"
              >
                {isRandom ? (
                  <div className="rounded-2xl border border-[#f4ead9]/15 bg-[#f4ead9]/[0.03] p-6">
                    <p className="font-[family-name:var(--font-display)] text-xl italic">
                      No question? No problem.
                    </p>
                    <p className="mt-1 text-sm text-[#f4ead9]/60">
                      We&apos;ll let the cards decide what you need to hear.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="question"
                      className="mb-3 block text-sm text-[#f4ead9]/75"
                    >
                      What&apos;s on your mind?{" "}
                      <span className="text-[#f4ead9]/40">(optional)</span>
                    </label>
                    <textarea
                      id="question"
                      rows={3}
                      maxLength={500}
                      autoFocus
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) start();
                      }}
                      placeholder={
                        selectedCategory
                          ? `e.g. "what should I know about my ${selectedCategory.label.toLowerCase()} situation?"`
                          : ""
                      }
                      className="w-full resize-none rounded-2xl border border-[#f4ead9]/15 bg-[#f4ead9]/[0.03] px-5 py-4 text-sm text-[#f4ead9] outline-none transition placeholder:text-[#f4ead9]/30 focus:border-[#e8a0b4]/60 focus:ring-2 focus:ring-[#e8a0b4]/30"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={start}
                  className="mt-6 rounded-full bg-[#f4ead9] px-8 py-4 text-sm font-medium text-[#1a1329] shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d1c] active:translate-y-0"
                >
                  Let&apos;s pull some cards
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-[#f4ead9]/40">
          Take what resonates, leave what doesn&apos;t. ♡
        </p>
      </div>
    </main>
  );
}