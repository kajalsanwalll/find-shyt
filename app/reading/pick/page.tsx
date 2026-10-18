"use client";

// app/reading/pick/page.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Gloock, Instrument_Sans } from "next/font/google";
import { tarotCards, type TarotCard } from "@/lib/tarot";
import {
  spreads,
  DEFAULT_SPREAD,
  isSpreadId,
  type Spread,
  type SpreadId,
} from "@/lib/spreads";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/*
  Palette (shared with the other pages): ink #17152b, bone #f2e8cf, cobalt #2b4bb0,
  ochre #eaae2c, vermilion #d2442e
*/

const pageClass = `${display.variable} ${body.variable} min-h-screen bg-[#2b4bb0] font-[family-name:var(--font-body)] text-[#f2e8cf]`;
const dots = {
  backgroundImage: "radial-gradient(rgba(242,232,207,0.16) 1.5px, transparent 1.5px)",
  backgroundSize: "34px 34px",
};

/* Printed card back. Fills its parent; `compact` thins the borders for small sizes. */
function CardBack({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`h-full w-full bg-[#f2e8cf] border-[#17152b] ${
        compact ? "rounded-[7px] border-2 p-[3px]" : "rounded-[14px] border-[3px] p-2"
      }`}
    >
      <div
        className={`h-full border-[#17152b] ${
          compact ? "rounded-[3px] border" : "rounded-lg border-2 p-1.5"
        }`}
      >
        <svg
          viewBox="0 0 100 150"
          className="h-full w-full rounded-[2px]"
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

export default function PickPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState<TarotCard[]>(tarotCards);
  const [spread, setSpread] = useState<Spread>(spreads[DEFAULT_SPREAD]);
  const [ready, setReady] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);

  const { positions } = spread;
  const count = positions.length;

  // Load the shuffled deck and the chosen spread; if there's no deck, send them back to shuffle.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("shuffledDeck");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length === tarotCards.length) {
        const reading: { spread?: unknown } = JSON.parse(
  sessionStorage.getItem("reading") || "{}"
);

if (isSpreadId(reading.spread)) {
  setSpread(spreads[reading.spread]);
}
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
    if (picked.length === count) {
      picked.forEach((i) => {
        const img = new Image();
        img.src = deck[i].image;
      });
    }
  }, [picked, deck, count]);

  const toggle = (i: number) =>
    setPicked((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : cur.length >= count ? cur : [...cur, i]
    );

  const reveal = () => {
    try {
      const reading = JSON.parse(sessionStorage.getItem("reading") || "{}");
      sessionStorage.setItem(
        "reading",
        JSON.stringify({ ...reading, spread: spread.id, selectedCards: picked })
      );
    } catch {
      // ignore; the result page shows its empty state
    }
    router.push("/reading/result");
  };

  if (!ready) {
    return (
      <main className={pageClass} style={dots}>
        <div className="flex min-h-screen items-center justify-center text-base text-[#f2e8cf]/85">
          Preparing your cards…
        </div>
      </main>
    );
  }

  const full = picked.length === count;

  return (
    <main className={pageClass} style={dots}>
      <header className="mx-auto max-w-5xl px-6 pt-14 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight sm:text-7xl">
          {spread.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-[#f2e8cf]/85">{spread.hint}</p>
      </header>

      {/* Sticky tray: your slots + the action, always in view */}
      <div className="sticky top-0 z-20 mt-8 border-y-[3px] border-[#17152b] bg-[#f2e8cf] text-[#17152b]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex gap-3 sm:gap-4">
            {positions.map((p, slot) => {
              const idx = picked[slot];
              return (
                <div key={p} className="text-center">
                  <div className="relative h-[60px] w-9 rounded-lg border-2 border-dashed border-[#17152b]/50 sm:h-[83px] sm:w-[50px]">
                    {idx !== undefined && (
                      <motion.div
                        key={idx}
                        className="absolute inset-0"
                        initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                      >
                        <CardBack compact />
                      </motion.div>
                    )}
                  </div>
                  <span className="mt-1 block max-w-[52px] truncate text-xs font-medium sm:max-w-[64px]">
                    {p}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={reveal}
            disabled={!full}
            className="shrink-0 rounded-full border-[3px] border-[#17152b] bg-[#eaae2c] px-5 py-3 text-sm font-semibold text-[#17152b] shadow-[4px_4px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b4bb0] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-default disabled:bg-[#f2e8cf] disabled:text-[#17152b]/60 disabled:shadow-none sm:px-6"
          >
            {full ? "Reveal my reading" : `${picked.length} of ${count} picked`}
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
                className={`relative aspect-[3/5] w-full rounded-[10px] outline-none transition focus-visible:ring-4 focus-visible:ring-[#eaae2c] ${
                  locked ? "cursor-default opacity-40" : "shadow-[3px_3px_0_#17152b]"
                } ${isPicked ? "-translate-y-1.5 ring-4 ring-[#d2442e] shadow-[3px_3px_0_#17152b]" : ""}`}
              >
                <CardBack compact />
                {isPicked && (
                  <span className="absolute inset-x-1 top-1/2 -translate-y-1/2 truncate rounded-full border-2 border-[#17152b] bg-[#f2e8cf] px-1 py-0.5 text-[11px] font-semibold text-[#17152b]">
                    {positions[slot]}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="mt-14 text-center text-sm text-[#f2e8cf]/70">There are no wrong cards.</p>
      </div>
    </main>
  );
}