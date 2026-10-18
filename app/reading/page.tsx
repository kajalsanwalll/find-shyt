"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gloock, Instrument_Sans } from "next/font/google";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/*
  Palette (shared with the home page): ink #17152b, bone #f2e8cf, cobalt #2b4bb0,
  ochre #eaae2c, vermilion #d2442e, sage #7fae93
*/

const INK = "#17152b";
const sk = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const categories: { id: string; label: string; sub: string; field: string; art: ReactNode }[] = [
  {
    id: "love",
    label: "Love",
    sub: "relationships, crushes, situationships",
    field: "#d2442e",
    art: <path d="M32 54C10 38 8 22 20 15c6-3 12 0 12 7 0-7 6-10 12-7 12 7 10 23-12 39z" fill="#f2e8cf" {...sk} />,
  },
  {
    id: "career",
    label: "Career",
    sub: "work, studies, what's next",
    field: "#eaae2c",
    art: (
      <>
        <circle cx="32" cy="32" r="22" fill="#f2e8cf" {...sk} />
        <path d="M32 14l6 18-6 18-6-18z M14 32l18-6 18 6-18 6z" fill="#2b4bb0" {...sk} />
      </>
    ),
  },
  {
    id: "friendship",
    label: "Friendship",
    sub: "friends, people, connections",
    field: "#7fae93",
    art: (
      <>
        <circle cx="23" cy="32" r="16" fill="#eaae2c" {...sk} />
        <circle cx="41" cy="32" r="16" fill="#d2442e" fillOpacity="0.9" {...sk} />
      </>
    ),
  },
  {
    id: "life",
    label: "Life",
    sub: "growth, choices, your current era",
    field: "#eaae2c",
    art: (
      <>
        <path d="M32 58V30" {...sk} fill="none" />
        <path d="M32 36C16 36 12 24 14 14c12 0 18 8 18 22z" fill="#7fae93" {...sk} />
        <path d="M32 30c0-12 6-18 18-18 2 10-2 22-18 18z" fill="#f2e8cf" {...sk} />
      </>
    ),
  },
  {
    id: "specific",
    label: "Something specific",
    sub: "you know exactly what we're asking",
    field: "#2b4bb0",
    art: (
      <>
        <path d="M4 32c8-14 18-20 28-20s20 6 28 20c-8 14-18 20-28 20S12 46 4 32z" fill="#f2e8cf" {...sk} />
        <circle cx="32" cy="32" r="10" fill="#d2442e" {...sk} />
        <circle cx="32" cy="32" r="3" fill={INK} />
      </>
    ),
  },
  {
    id: "random",
    label: "Just pull for me",
    sub: "no question, just vibes",
    field: "#f2e8cf",
    art: <path d="M32 6l7 20 20 6-20 6-7 20-7-20-20-6 20-6z" fill="#eaae2c" {...sk} />,
  },
];

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
      className={`${display.variable} ${body.variable} min-h-screen bg-[#2b4bb0] font-[family-name:var(--font-body)] text-[#f2e8cf]`}
      style={{
        backgroundImage: "radial-gradient(rgba(242,232,207,0.16) 1.5px, transparent 1.5px)",
        backgroundSize: "34px 34px",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <Link
          href="/"
          className="w-fit rounded-full border-2 border-[#17152b] bg-[#f2e8cf] px-4 py-1.5 text-sm font-medium text-[#17152b] shadow-[3px_3px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#eaae2c]"
        >
          Back
        </Link>

        <div className="my-auto py-10">
          <header>
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.02] sm:text-7xl">
              What are we dealing with?
            </h1>
            <p className="mt-5 max-w-md text-lg text-[#f2e8cf]/85">
              Pick whatever feels right. There are no wrong answers.
            </p>
          </header>

          {/* Topic picker: real radios, so arrow keys and screen readers work */}
          <fieldset className="mt-10">
            <legend className="sr-only">Choose a topic</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categories.map((c) => {
                const isSelected = selected === c.id;
                const isLast = c.id === "random";
                return (
                  <label key={c.id} className={`cursor-pointer ${isLast ? "sm:col-span-2" : ""}`}>
                    <input
                      type="radio"
                      name="category"
                      value={c.id}
                      checked={isSelected}
                      onChange={() => setSelected(c.id)}
                      className="peer sr-only"
                    />
                    <div
                      className={`flex items-center gap-4 rounded-2xl border-[3px] border-[#17152b] bg-[#f2e8cf] p-3 text-[#17152b] transition peer-focus-visible:ring-4 peer-focus-visible:ring-[#eaae2c] ${
                        isLast ? "border-dashed" : ""
                      } ${
                        isSelected
                          ? "-translate-x-1 -translate-y-1 shadow-[8px_8px_0_#17152b]"
                          : "shadow-[4px_4px_0_#17152b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17152b]"
                      }`}
                    >
                      <span
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-[3px] border-[#17152b]"
                        style={{ background: c.field }}
                      >
                        <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
                          {c.art}
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-[family-name:var(--font-display)] text-xl leading-tight">
                          {c.label}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-[#17152b]/70">
                          {c.sub}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[3px] border-[#17152b] ${
                          isSelected ? "bg-[#d2442e]" : "bg-transparent"
                        }`}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 12 12" className="h-3 w-3">
                            <path d="M2 6.5l2.5 2.5L10 3" fill="none" stroke="#f2e8cf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
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
                className="mt-10"
              >
                {isRandom ? (
                  <div className="rounded-2xl border-[3px] border-[#17152b] bg-[#eaae2c] p-6 text-[#17152b] shadow-[6px_6px_0_#17152b]">
                    <p className="font-[family-name:var(--font-display)] text-2xl">
                      No question? No problem.
                    </p>
                    <p className="mt-1 text-base">
                      We&apos;ll let the cards decide what you need to hear.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="question" className="mb-3 block text-lg font-medium">
                      What&apos;s on your mind?{" "}
                      <span className="font-normal text-[#f2e8cf]/70">(optional)</span>
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
                      className="w-full resize-none rounded-2xl border-[3px] border-[#17152b] bg-[#f2e8cf] px-5 py-4 text-base text-[#17152b] shadow-[6px_6px_0_#17152b] outline-none transition placeholder:text-[#17152b]/45 focus:ring-4 focus:ring-[#eaae2c]"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={start}
                  className="mt-8 rounded-full border-[3px] border-[#17152b] bg-[#eaae2c] px-8 py-4 text-base font-semibold text-[#17152b] shadow-[5px_5px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f2e8cf] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Let&apos;s pull some cards
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-sm text-[#f2e8cf]/70">Take what resonates, leave what doesn&apos;t.</p>
      </div>
    </main>
  );
}