"use client";

// app/reading/deck/page.tsx

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Gloock, Instrument_Sans } from "next/font/google";
import { tarotCards } from "@/lib/tarot";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/*
  Palette (shared with the other pages): ink #17152b, bone #f2e8cf, cobalt #2b4bb0,
  ochre #eaae2c, vermilion #d2442e
*/

const STACK = 7;

/* Card back in the same printed style as the home page deck. Fills its parent. */
function CardBack() {
  return (
    <div className="h-full w-full rounded-[14px] border-[3px] border-[#17152b] bg-[#f2e8cf] p-2 shadow-[4px_4px_0_#17152b]">
      <div className="h-full rounded-lg border-2 border-[#17152b] p-1.5">
        <svg
          viewBox="0 0 100 150"
          className="h-full w-full rounded"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <rect width="100" height="150" fill="#17152b" />
          {Array.from({ length: 5 }, (_, i) => (
            <circle
              key={i}
              cx="50"
              cy="75"
              r={10 + i * 13}
              fill="none"
              stroke={i % 2 ? "#eaae2c" : "#d2442e"}
              strokeWidth="2"
            />
          ))}
          <path d="M50 20l7 55-7 55-7-55z" fill="#f2e8cf" />
          <path d="M10 75l40-7 40 7-40 7z" fill="#2b4bb0" />
          <circle cx="50" cy="75" r="6" fill="#eaae2c" stroke="#17152b" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default function DeckPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [shuffling, setShuffling] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shuffle = () => {
    if (shuffling) return;
    setShuffling(true);

    // Fisher–Yates over the full 78-card deck
    const deck = [...tarotCards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    try {
      sessionStorage.setItem("shuffledDeck", JSON.stringify(deck));
    } catch {
      // Storage blocked: the pick page falls back to the unshuffled order.
    }

    timer.current = window.setTimeout(
      () => router.push("/reading/pick"),
      reduce ? 400 : 2300
    );
  };

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#2b4bb0] font-[family-name:var(--font-body)] text-[#f2e8cf]`}
      style={{
        backgroundImage: "radial-gradient(rgba(242,232,207,0.16) 1.5px, transparent 1.5px)",
        backgroundSize: "34px 34px",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div aria-live="polite">
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight sm:text-7xl">
            {shuffling ? "The universe is shuffling." : "Let's shuffle."}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-[#f2e8cf]/85">
            {shuffling
              ? "Trust the process. Your cards are finding their place."
              : "Take a breath. Think about your question. Then shuffle."}
          </p>
        </div>

        {/* Riffle: the stack splits into two piles, then drops back together, twice */}
        <div className="relative my-14 flex h-[300px] w-full items-center justify-center sm:h-[340px]">
          {Array.from({ length: STACK }).map((_, i) => {
            const offset = i - (STACK - 1) / 2;
            const side = i % 2 === 0 ? -1 : 1;
            const rest = { x: offset * 5, y: Math.abs(offset) * 2, rotate: offset * 1.5 };

            return (
              <motion.div
                key={i}
                className="absolute h-[210px] w-[126px] sm:h-[260px] sm:w-[156px]"
                style={{ zIndex: i }}
                animate={
                  shuffling && !reduce
                    ? {
                        x: [rest.x, side * 110, side * 110, rest.x],
                        y: [rest.y, -i * 3, -i * 3, rest.y],
                        rotate: [rest.rotate, side * 7, side * 7, rest.rotate],
                      }
                    : rest
                }
                transition={
                  shuffling && !reduce
                    ? {
                        duration: 0.9,
                        times: [0, 0.3, 0.6, 1],
                        ease: "easeInOut",
                        delay: i * 0.05,
                        repeat: 1,
                      }
                    : { duration: 0.4 }
                }
              >
                <CardBack />
              </motion.div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={shuffle}
          disabled={shuffling}
          className="rounded-full border-[3px] border-[#17152b] bg-[#eaae2c] px-8 py-4 text-base font-semibold text-[#17152b] shadow-[5px_5px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f2e8cf] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-default disabled:opacity-60 disabled:shadow-[5px_5px_0_#17152b]"
        >
          {shuffling ? "Shuffling…" : "Shuffle the deck"}
        </button>

        <p className="mt-12 text-sm text-[#f2e8cf]/70">There are no wrong cards.</p>
      </div>
    </main>
  );
}