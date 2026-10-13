"use client";

// app/reading/pick/page.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { tarotCards, type TarotCard } from "@/lib/tarot";
import { Shell, CardBack } from "@/components/shell";

const positions = ["Past", "Present", "Future"];

export default function PickPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState<TarotCard[]>(tarotCards);
  const [ready, setReady] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);

  // Load the shuffled deck; if there isn't one, send them back to shuffle.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("shuffledDeck");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length === tarotCards.length) {
        setDeck(parsed);
        setReady(true);
        return;
      }
    } catch {
      // fall through
    }
    router.replace("/reading/deck");
  }, [router]);

  // Warm the image cache so the reveal flip on the next page is instant.
  useEffect(() => {
    if (picked.length === 3) {
      picked.forEach((i) => {
        const img = new Image();
        img.src = deck[i].image;
      });
    }
  }, [picked, deck]);

  const toggle = (i: number) =>
    setPicked((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : cur.length >= 3 ? cur : [...cur, i]
    );

  const reveal = () => {
    try {
      const reading = JSON.parse(sessionStorage.getItem("reading") || "{}");
      sessionStorage.setItem(
        "reading",
        JSON.stringify({ ...reading, selectedCards: picked })
      );
    } catch {
      // ignore; the result page shows its empty state
    }
    router.push("/reading/result");
  };

  if (!ready) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center text-sm text-[#f4ead9]/60">
          Preparing your cards…
        </div>
      </Shell>
    );
  }

  const full = picked.length === 3;

  return (
    <Shell>
      <header className="mx-auto max-w-5xl px-6 pt-14 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight tracking-tight sm:text-6xl">
          Pick three cards.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[#f4ead9]/60">
          Don&apos;t overthink it. Go with the ones you&apos;re drawn to. Tap a
          picked card to put it back.
        </p>
      </header>

      {/* Sticky tray: your three slots + the action, always in view */}
      <div className="sticky top-0 z-20 mt-8 border-y border-[#f4ead9]/10 bg-[#120d1c]/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex gap-4">
            {positions.map((p, slot) => {
              const idx = picked[slot];
              return (
                <div key={p} className="text-center">
                  <div className="relative h-[67px] w-10 rounded-lg border border-dashed border-[#f4ead9]/25 sm:h-[83px] sm:w-[50px]">
                    {idx !== undefined && (
                      <motion.div
                        key={idx}
                        className="absolute inset-0"
                        initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                      >
                        <CardBack />
                      </motion.div>
                    )}
                  </div>
                  <span className="mt-1 block text-[11px] text-[#f4ead9]/55">{p}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={reveal}
            disabled={!full}
            className="rounded-full bg-[#f4ead9] px-6 py-3 text-sm font-medium text-[#1a1329] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d1c] disabled:cursor-default disabled:bg-[#f4ead9]/10 disabled:text-[#f4ead9]/50"
          >
            {full ? "Reveal my reading" : `${picked.length} of 3 picked`}
          </button>
        </div>
      </div>

      {/* The spread: all 78 cards, face down */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(76px,1fr))]">
          {deck.map((card, index) => {
            const slot = picked.indexOf(index);
            const isPicked = slot !== -1;
            const locked = full && !isPicked;

            return (
              <motion.button
                key={card.id}
                type="button"
                onClick={() => toggle(index)}
                disabled={locked}
                aria-pressed={isPicked}
                aria-label={
                  isPicked
                    ? `Card ${index + 1}, picked as ${positions[slot]}. Tap to put it back.`
                    : `Card ${index + 1}`
                }
                whileHover={!isPicked && !locked && !reduce ? { y: -6 } : undefined}
                whileTap={!isPicked && !locked && !reduce ? { scale: 0.96 } : undefined}
                className={`relative aspect-[3/5] w-full rounded-xl outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[#e8a0b4] ${
                  locked ? "cursor-default opacity-40" : ""
                } ${isPicked ? "opacity-50 ring-2 ring-[#e8a0b4]/70" : ""}`}
              >
                <CardBack />
                {isPicked && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#120d1c]/50 text-[11px] font-medium text-[#f4ead9]">
                    {positions[slot]}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="mt-14 text-center text-xs text-[#f4ead9]/40">
          There are no wrong cards.
        </p>
      </div>
    </Shell>
  );
}