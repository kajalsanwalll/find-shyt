"use client";

// app/reading/deck/page.tsx

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { tarotCards } from "@/lib/tarot";
import { Shell, CardBack } from "@/components/shell";

const STACK = 7;

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
    <Shell>
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div aria-live="polite">
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight tracking-tight sm:text-6xl">
            {shuffling ? "The universe is shuffling." : "Let's shuffle."}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[#f4ead9]/60">
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
          className="rounded-full bg-[#f4ead9] px-8 py-4 text-sm font-medium text-[#1a1329] shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d1c] disabled:translate-y-0 disabled:cursor-default disabled:opacity-50"
        >
          {shuffling ? "Shuffling…" : "Shuffle the deck"}
        </button>

        <p className="mt-12 text-xs text-[#f4ead9]/40">There are no wrong cards.</p>
      </div>
    </Shell>
  );
}